from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    HealthCheckView,
    CustomTokenObtainPairView,
    CompanyListCreateView,
    CompanyRetrieveUpdateDestroyView,
    JobPostingListCreateView,
    JobPostingRetrieveUpdateDestroyView,
    SavedJobListCreateView,
    SavedJobRetrieveUpdateDestroyView,
    JobApplicationListCreateView,
    JobApplicationRetrieveDestroyView,
    UserCreateView,
    UserMeView,
    UserListView,
    UserRetrieveDestroyView,
    UserDocumentView,
    AIAnalysisView,
    AdminStatsView,
)

urlpatterns = [
    # Health Check
    path("health/", HealthCheckView.as_view(), name="health-check"),

    # Authentication
    path("auth/register/", UserCreateView.as_view(), name="register"),
    path("auth/login/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
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

    # Job Applications
    path("applications/", JobApplicationListCreateView.as_view(), name="application-list-create"),
    path("applications/<int:pk>/", JobApplicationRetrieveDestroyView.as_view(), name="application-retrieve-destroy"),

    # Users
    path("users/me/", UserMeView.as_view(), name="user-me"),
    path("users/", UserListView.as_view(), name="user-list"),
    path("users/<int:pk>/", UserRetrieveDestroyView.as_view(), name="user-retrieve-destroy"),

    # Documents
    path("documents/", UserDocumentView.as_view(), name="document-list"),
    path("documents/<str:doc_type>/", UserDocumentView.as_view(), name="document-detail"),

    # AI
    path("ai/analyze/", AIAnalysisView.as_view(), name="ai-analyze"),

    # Admin stats
    path("admin-stats/", AdminStatsView.as_view(), name="admin-stats"),
]