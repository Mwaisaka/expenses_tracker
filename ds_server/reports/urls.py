from django.urls import path
from .views import ReportListView, ReportDetailView, generate_reports_now, check_task_status, ExpenseStatementView, generate_statement, GenerateReportView, expense_trends

urlpatterns = [
    path('report_list/', ReportListView.as_view(), name="report_list"),
    path("report_detail/<int:pk>/", ReportDetailView.as_view(), name="report_detail"),
    path('generate/', generate_reports_now, name="report-generate"),
    path("task/<str:task_id>/", check_task_status, name="report-task-status"),
    # path('generate/', GenerateReportView.as_view(), name="report-generate"),
    #  path("statement/", ExpenseStatementView.as_view(), name="expense-statement"),
    path("statement/", generate_statement, name="generate-statement"),
    path("trends/", expense_trends, name="expense_trends"),
]
