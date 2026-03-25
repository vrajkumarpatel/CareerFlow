# CareerFlow API Endpoints (Week 3 Draft)

Base URL: /api

## Health
- GET /health/
  - Response: { "status": "healthy", "message": "..." }

## Companies
- GET /companies/
  - List all companies (used to populate filters)
- GET /companies/{id}/
  - Get one company detail
- POST /companies/
  - Create company (admin/internal)
- PUT /companies/{id}/
  - Update company (admin/internal)
- DELETE /companies/{id}/
  - Delete company (admin/internal)

## Jobs
- GET /jobs/
  - List jobs
  - Filters (query params): ?company=, ?location=, ?q=
- GET /jobs/{id}/
  - Job detail
- POST /jobs/
  - Create job (admin/internal)
- PUT /jobs/{id}/
  - Update job (admin/internal)
- DELETE /jobs/{id}/
  - Delete job (admin/internal)

## Future
## Auth
- POST /token/
- POST /token/refresh/

## Applications (later)
- GET /applications/
- POST /applications/
- PATCH /applications/{id}/