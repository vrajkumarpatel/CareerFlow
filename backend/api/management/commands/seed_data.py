from django.core.management.base import BaseCommand
from api.models import Company, JobPosting
import random

class Command(BaseCommand):
    help = 'Seeds the database with companies and job postings.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Seeding database...'))

        # Clear old data
        JobPosting.objects.all().delete()
        Company.objects.all().delete()

        companies = [
            {'name': 'TechCorp', 'description': 'Innovators in technology.'},
            {'name': 'DataDriven', 'description': 'The future of data.'},
            {'name': 'CloudScape', 'description': 'Scaling new heights.'},
            {'name': 'AutoInnovate', 'description': 'Driving the future.'},
            {'name': 'HealthWell', 'description': 'Caring for the future.'},
            {'name': 'GreenEnergy', 'description': 'Powering a cleaner tomorrow.'},
            {'name': 'CyberSecure', 'description': 'Your digital fortress.'},
            {'name': 'QuantumLeap', 'description': 'Beyond the next generation.'},
            {'name': 'BioGen', 'description': 'Engineering life.'},
            {'name': 'RoboWorks', 'description': 'The future of automation.'},
            {'name': 'FoodForward', 'description': 'Nourishing the world.'},
            {'name': 'EduTech', 'description': 'Learn, grow, succeed.'},
            {'name': 'FinSolutions', 'description': 'Secure your financial future.'},
            {'name': 'RetailNext', 'description': 'The future of shopping.'},
            {'name': 'SpaceQuest', 'description': 'Exploring new frontiers.'},
            {'name': 'MediCare', 'description': 'Your health, our priority.'},
            {'name': 'LogiChain', 'description': 'Connecting the world.'},
            {'name': 'BuildRight', 'description': 'Constructing the future.'},
            {'name': 'TravelEasy', 'description': 'Your journey starts here.'},
            {'name': 'ArtisanCreations', 'description': 'Handcrafted with love.'},
        ]

        job_templates = {
            'Software Engineer': {
                'description': 'Develop and maintain web applications. Write clean, efficient code. Collaborate with a team of developers.',
                'requirements': 'Bachelor\'s degree in Computer Science. 3+ years of experience with Python or JavaScript. Strong problem-solving skills.',
            },
            'Product Manager': {
                'description': 'Define product vision and strategy. Work with cross-functional teams to design, build and roll-out products that deliver the company’s vision and strategy.',
                'requirements': 'Proven experience as a Product Manager. Excellent communication skills. Strong understanding of user experience.',
            },
            'Data Scientist': {
                'description': 'Analyze large, complex data sets. Build predictive models. Communicate findings to stakeholders.',
                'requirements': 'Master\'s or Ph.D. in a quantitative field. Experience with machine learning and statistical modeling. Proficiency in Python or R.',
            },
            'UX Designer': {
                'description': 'Design user-centered interfaces. Create wireframes, prototypes, and high-fidelity mockups. Conduct user research and testing.',
                'requirements': 'Portfolio of design projects. Proficiency in design software like Figma or Sketch. Experience with user research methodologies.',
            },
            'Marketing Manager': {
                'description': 'Develop and execute marketing campaigns. Manage social media presence. Analyze campaign performance.',
                'requirements': 'Bachelor\'s degree in Marketing or related field. 5+ years of marketing experience. Strong analytical and project management skills.',
            },
             'Backend Engineer': {
                'description': 'Design and implement server-side logic. Build and maintain APIs. Optimize application for speed and scalability.',
                'requirements': 'Bachelor\'s degree in Computer Science. Experience with Node.js, Python, or Go. Knowledge of database systems.',
            },
        }

        locations = ['San Francisco, CA', 'New York, NY', 'Remote', 'Austin, TX', 'Seattle, WA', 'Boston, MA', 'Chicago, IL']
        job_types = ['Full-time', 'Part-time', 'Contract', 'Internship']

        for company_data in companies:
            company = Company.objects.create(**company_data)
            for _ in range(3):
                title, template = random.choice(list(job_templates.items()))
                location = random.choice(locations)
                job_type = random.choice(job_types)
                JobPosting.objects.create(
                    company=company, 
                    title=title, 
                    description=template['description'],
                    requirements=template['requirements'],
                    location=location,
                    job_type=job_type
                )

        self.stdout.write(self.style.SUCCESS('Database seeded successfully!'))
