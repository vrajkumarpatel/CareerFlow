from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    HealthCheckView,
    CompanyListCreateView,
    CompanyRetrieveUpdateDestroyView,
    JobPostingListCreateView,
    JobPostingRetrieveUpdateDestroyView,
    SavedJobListCreateView,
    SavedJobRetrieveUpdateDestroyView,
    UserCreateView,
)

urlpatterns = [
    # Health Check
    path("health/", HealthCheckView.as_view(), name="health-check"),

    # Authentication
    path("auth/register/", UserCreateView.as_view(), name="register"),
    path("auth/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # Companies
    path("companies/", CompanyListCreateView.as_view(), name="company-list-create"),
    path("companies/<int:pk>/", CompanyRetrieveUpdateDestroyView.as_view(), name="company-retrieve-update-destroy"),

    # Job Postings
    path("jobs/", JobPostingListCreateView.as_view(), name="job-posting-list-create"),
    path("jobs/<int:pk>/", JobPostingRetrieveUpdateDestroyView.as_view(), name="job-posting-retrieve-update-destroy"),

    # Saved Jobs
    path("saved-jobs/", SavedJobListCreateView.as_view(), name="saved-job-list-create"),
    path("saved-jobs/<int:pk>/", SavedJobRetrieveUpdateDestroyView.as_view(), name="saved-job-retrieve-update-destroy"),
]