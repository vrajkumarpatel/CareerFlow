import os
import io
import json
import re
from datetime import datetime, timedelta

from google import genai
from pypdf import PdfReader
from docx import Document as DocxDocument

from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from django.db.models import Q, Count
from django.db.models.functions import TruncMonth
from .models import Company, JobPosting, SavedJob, JobApplication, UserDocument
from .serializers import (
    CompanySerializer, JobPostingSerializer, SavedJobSerializer,
    JobApplicationSerializer, UserDocumentSerializer, UserSerializer,
)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['is_staff'] = user.is_staff
        token['username'] = user.username
        return token


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class HealthCheckView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({"status": "ok"})

class CompanyListCreateView(generics.ListCreateAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAdminUser]

class CompanyRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAdminUser]

class JobPostingListCreateView(generics.ListCreateAPIView):
    serializer_class = JobPostingSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAdminUser()]

    def get_queryset(self):
        queryset = JobPosting.objects.all()
        search = self.request.query_params.get('search', '')
        location = self.request.query_params.get('location', '')
        job_type = self.request.query_params.get('job_type', '')
        experience = self.request.query_params.get('experience', '')

        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | Q(company__name__icontains=search)
            )
        if location:
            queryset = queryset.filter(location__icontains=location)
        if job_type:
            queryset = queryset.filter(job_type=job_type)
        if experience:
            queryset = queryset.filter(experience_level=experience)

        return queryset

class JobPostingRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = JobPosting.objects.all()
    serializer_class = JobPostingSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAdminUser()]

class SavedJobListCreateView(generics.ListCreateAPIView):
    serializer_class = SavedJobSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SavedJob.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class SavedJobRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SavedJobSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SavedJob.objects.filter(user=self.request.user)

class JobApplicationListCreateView(generics.ListCreateAPIView):
    serializer_class = JobApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return JobApplication.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class JobApplicationRetrieveDestroyView(generics.RetrieveDestroyAPIView):
    serializer_class = JobApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return JobApplication.objects.filter(user=self.request.user)

class UserCreateView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class UserMeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class UserListView(generics.ListAPIView):
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

class UserRetrieveDestroyView(generics.RetrieveDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]


def _extract_text(file):
    name = file.name.lower()
    try:
        if name.endswith('.pdf'):
            reader = PdfReader(io.BytesIO(file.read()))
            text = '\n'.join(page.extract_text() or '' for page in reader.pages)
            file.seek(0)
            return text
        elif name.endswith('.docx'):
            doc = DocxDocument(io.BytesIO(file.read()))
            text = '\n'.join(p.text for p in doc.paragraphs)
            file.seek(0)
            return text
    except Exception:
        pass
    return ''


class UserDocumentView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get(self, request, doc_type=None):
        if doc_type:
            try:
                doc = UserDocument.objects.get(user=request.user, doc_type=doc_type)
                return Response(UserDocumentSerializer(doc, context={'request': request}).data)
            except UserDocument.DoesNotExist:
                return Response(status=404)
        docs = UserDocument.objects.filter(user=request.user)
        return Response(UserDocumentSerializer(docs, many=True, context={'request': request}).data)

    def post(self, request, doc_type=None):
        doc_type = doc_type or request.data.get('doc_type')
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file provided'}, status=400)
        extracted_text = _extract_text(file)
        UserDocument.objects.filter(user=request.user, doc_type=doc_type).delete()
        doc = UserDocument.objects.create(
            user=request.user,
            doc_type=doc_type,
            file=file,
            original_name=file.name,
            extracted_text=extracted_text,
        )
        return Response(UserDocumentSerializer(doc, context={'request': request}).data, status=201)

    def delete(self, request, doc_type=None):
        try:
            doc = UserDocument.objects.get(user=request.user, doc_type=doc_type)
            doc.file.delete(save=False)
            doc.delete()
            return Response(status=204)
        except UserDocument.DoesNotExist:
            return Response(status=404)


class AIAnalysisView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        action = request.data.get('action', 'analyze')
        doc_type = request.data.get('doc_type', 'resume')
        display_name = 'resume' if doc_type == 'resume' else 'cover letter'

        api_key = request.headers.get('X-Gemini-Api-Key') or os.environ.get('GEMINI_API_KEY', '')
        if not api_key:
            return Response({'error': 'No Gemini API key found. Enter your key in the AI settings.'}, status=503)

        client = genai.Client(api_key=api_key)

        try:
            if action == 'analyze':
                try:
                    doc = UserDocument.objects.get(user=request.user, doc_type=doc_type)
                except UserDocument.DoesNotExist:
                    return Response({'error': 'Upload your document first.'}, status=404)
                text = doc.extracted_text.strip()
                if not text:
                    return Response({'error': 'Could not extract text from your document.'}, status=400)

                prompt = f"""You are an expert career counselor. Analyze this {display_name} and provide structured feedback.

{text[:4000]}

Respond with valid JSON only (no markdown, no code blocks) using this exact structure:
{{
  "score": <integer 0-100>,
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"],
  "suggestions": ["<tip 1>", "<tip 2>", "<tip 3>"]
}}"""

                response = client.models.generate_content(model='gemini-flash-latest', contents=prompt)
                raw = response.text.strip()
                match = re.search(r'\{.*\}', raw, re.DOTALL)
                if match:
                    return Response(json.loads(match.group()))
                return Response({'error': 'Unexpected AI response format.'}, status=500)

            else:  # generate
                job_title = request.data.get('job_title', 'Professional')
                industry = request.data.get('industry', 'Technology')
                experience = request.data.get('experience', 'Mid Level')
                company = request.data.get('company', '')
                company_line = f'\n- Target Company: {company}' if company else ''

                prompt = f"""You are an expert resume writer. Create a complete, professional {display_name} for:
- Job Title: {job_title}
- Industry: {industry}
- Experience Level: {experience}{company_line}

Write a full ATS-optimized {display_name} with proper sections. Be specific, achievement-focused, and use strong action verbs."""

                response = client.models.generate_content(model='gemini-flash-latest', contents=prompt)
                return Response({'content': response.text})

        except Exception as e:
            return Response({'error': str(e)}, status=500)


class AdminStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        since = datetime.now() - timedelta(days=180)

        def monthly(qs, field):
            return list(
                qs.filter(**{f'{field}__gte': since})
                  .annotate(month=TruncMonth(field))
                  .values('month')
                  .annotate(count=Count('id'))
                  .order_by('month')
            )

        jobs = monthly(JobPosting.objects, 'posted_at')
        users = monthly(User.objects, 'date_joined')
        apps = monthly(JobApplication.objects, 'applied_at')

        fmt = lambda rows: [{'month': r['month'].strftime('%b'), 'count': r['count']} for r in rows]
        return Response({'jobs': fmt(jobs), 'users': fmt(users), 'applications': fmt(apps)})