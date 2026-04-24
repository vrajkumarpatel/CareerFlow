from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Company, JobPosting, SavedJob, JobApplication, UserDocument

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'

class JobPostingSerializer(serializers.ModelSerializer):
    company = CompanySerializer(read_only=True)
    company_id = serializers.PrimaryKeyRelatedField(
        queryset=Company.objects.all(), source='company', write_only=True
    )

    class Meta:
        model = JobPosting
        fields = '__all__'

class SavedJobSerializer(serializers.ModelSerializer):
    job_posting = JobPostingSerializer(read_only=True)
    job_posting_id = serializers.PrimaryKeyRelatedField(
        queryset=JobPosting.objects.all(), source='job_posting', write_only=True
    )
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = SavedJob
        fields = '__all__'

class JobApplicationSerializer(serializers.ModelSerializer):
    job_posting = JobPostingSerializer(read_only=True)
    job_posting_id = serializers.PrimaryKeyRelatedField(
        queryset=JobPosting.objects.all(), source='job_posting', write_only=True
    )
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = JobApplication
        fields = '__all__'

class UserDocumentSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = UserDocument
        fields = ('id', 'doc_type', 'original_name', 'uploaded_at', 'file_url')

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'password', 'is_staff')
        extra_kwargs = {
            'password': {'write_only': True},
            'is_staff': {'read_only': True},
            'email': {'required': False},
            'first_name': {'required': False},
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
        )
        return user