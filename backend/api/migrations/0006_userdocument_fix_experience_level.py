import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


def populate_experience_level(apps, schema_editor):
    JobPosting = apps.get_model('api', 'JobPosting')
    for i, job in enumerate(JobPosting.objects.filter(experience_level__isnull=True)):
        if 'senior' in (job.title or '').lower() or 'lead' in (job.title or '').lower() or 'principal' in (job.title or '').lower():
            job.experience_level = 'Senior'
        elif 'junior' in (job.title or '').lower() or 'entry' in (job.title or '').lower() or 'associate' in (job.title or '').lower():
            job.experience_level = 'Entry-level'
        else:
            # Cycle through levels for variety
            job.experience_level = ['Entry-level', 'Mid-level', 'Senior'][i % 3]
        job.save()


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_jobapplication_jobposting_experience_level_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='UserDocument',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('doc_type', models.CharField(choices=[('resume', 'Resume'), ('cover-letter', 'Cover Letter')], max_length=20)),
                ('file', models.FileField(upload_to='documents/%Y/%m/')),
                ('original_name', models.CharField(max_length=255)),
                ('uploaded_at', models.DateTimeField(auto_now_add=True)),
                ('extracted_text', models.TextField(blank=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('user', 'doc_type')},
            },
        ),
        migrations.RunPython(populate_experience_level, migrations.RunPython.noop),
    ]
