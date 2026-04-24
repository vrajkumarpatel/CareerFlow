from django.db import models
from django.contrib.auth.models import User

class Company(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.name

class JobPosting(models.Model):
    title = models.CharField(max_length=255, blank=True, null=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    requirements = models.TextField(blank=True, null=True)
    salary = models.CharField(max_length=100, blank=True, null=True)
    job_type = models.CharField(max_length=50, choices=[
        ('Full-time', 'Full-time'),
        ('Part-time', 'Part-time'),
        ('Contract', 'Contract'),
        ('Internship', 'Internship'),
        ('Remote', 'Remote'),
    ], blank=True, null=True)
    experience_level = models.CharField(max_length=50, choices=[
        ('Entry-level', 'Entry-level'),
        ('Mid-level', 'Mid-level'),
        ('Senior', 'Senior'),
    ], blank=True, null=True)
    posted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class SavedJob(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    job_posting = models.ForeignKey(JobPosting, on_delete=models.CASCADE)
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'job_posting')

    def __str__(self):
        return f"{self.user.username} - {self.job_posting.title}"

class UserDocument(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    doc_type = models.CharField(max_length=20, choices=[
        ('resume', 'Resume'),
        ('cover-letter', 'Cover Letter'),
    ])
    file = models.FileField(upload_to='documents/%Y/%m/')
    original_name = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    extracted_text = models.TextField(blank=True)

    class Meta:
        unique_together = ('user', 'doc_type')

    def __str__(self):
        return f"{self.user.username} - {self.doc_type}"

class JobApplication(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    job_posting = models.ForeignKey(JobPosting, on_delete=models.CASCADE)
    applied_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, choices=[
        ('Applied', 'Applied'),
        ('Under Review', 'Under Review'),
        ('Interview Scheduled', 'Interview Scheduled'),
        ('Not Selected', 'Not Selected'),
        ('Accepted', 'Accepted'),
    ], default='Applied')

    class Meta:
        unique_together = ('user', 'job_posting')

    def __str__(self):
        return f"{self.user.username} - {self.job_posting.title}"
