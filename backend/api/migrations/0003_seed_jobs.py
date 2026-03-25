from django.db import migrations

def seed_jobs(apps, schema_editor):
    Company = apps.get_model('api', 'Company')
    Job = apps.get_model('api', 'Job')

    company1 = Company.objects.create(name='TechCorp Inc.', description='A leading tech company.', website='https://techcorp.com')
    company2 = Company.objects.create(name='DesignHub', description='A creative design agency.', website='https://designhub.com')

    Job.objects.create(
        title='Senior Frontend Developer',
        company=company1,
        location='San Francisco, CA',
        description='We\'re looking for an experienced frontend developer to join our growing team.',
        requirements='React, TypeScript, and modern tools.',
        job_type='Full-time',
    )
    Job.objects.create(
        title='Product Designer',
        company=company2,
        location='New York, NY',
        description='Join our design team to create beautiful and intuitive user experiences.',
        requirements='Figma and design systems required.',
        job_type='Full-time',
    )

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_company_rename_created_at_job_posted_at_and_more'),
    ]

    operations = [
        migrations.RunPython(seed_jobs),
    ]
