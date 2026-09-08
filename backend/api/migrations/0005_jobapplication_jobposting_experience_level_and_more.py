import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_rename_job_jobposting_savedjob'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='jobposting',
            name='salary',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='jobposting',
            name='experience_level',
            field=models.CharField(
                blank=True,
                choices=[
                    ('Entry-level', 'Entry-level'),
                    ('Mid-level', 'Mid-level'),
                    ('Senior', 'Senior'),
                ],
                max_length=50,
                null=True,
            ),
        ),
        migrations.AlterField(
            model_name='jobposting',
            name='job_type',
            field=models.CharField(
                blank=True,
                choices=[
                    ('Full-time', 'Full-time'),
                    ('Part-time', 'Part-time'),
                    ('Contract', 'Contract'),
                    ('Internship', 'Internship'),
                    ('Remote', 'Remote'),
                ],
                max_length=50,
                null=True,
            ),
        ),
        migrations.CreateModel(
            name='JobApplication',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('applied_at', models.DateTimeField(auto_now_add=True)),
                ('status', models.CharField(
                    choices=[
                        ('Applied', 'Applied'),
                        ('Under Review', 'Under Review'),
                        ('Interview Scheduled', 'Interview Scheduled'),
                        ('Not Selected', 'Not Selected'),
                        ('Accepted', 'Accepted'),
                    ],
                    default='Applied',
                    max_length=50,
                )),
                ('job_posting', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.jobposting')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('user', 'job_posting')},
            },
        ),
    ]
