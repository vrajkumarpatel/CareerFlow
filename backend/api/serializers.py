from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Company, JobPosting, SavedJob

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

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'], password=validated_data['password'])
        return user