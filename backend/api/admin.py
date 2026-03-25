from django.contrib import admin
from .models import Company, JobPosting, SavedJob

class JobPostingAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'location', 'job_type', 'posted_at')
    search_fields = ('title', 'company__name', 'location')
    list_filter = ('job_type', 'company')

admin.site.register(Company)
admin.site.register(JobPosting, JobPostingAdmin)
admin.site.register(SavedJob)