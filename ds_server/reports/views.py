from django.shortcuts import render
from rest_framework import generics, permissions, status
from .models import Report
from .serializers import ReportSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from datetime import datetime
from expenses.models import Expense
from django.db.models import Sum
from .tasks import generate_monthly_reports
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from celery.result import AsyncResult
from django.conf import settings

class ReportListView(generics.ListAPIView):
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = Report.objects.filter(user=self.request.user)
        
        #Optional filters
        year = self.request.query_params.get("year")
        month = self.request.query_params.get("month")
        day = self.request.query_params.get("day")
        period_type = self.request.query_params.get("period_type")
        
        if year:
            queryset=queryset.filter(year=year)
        if month:
            queryset = queryset.filter(month=month)
        if day:
            queryset = queryset.filter(day=day)
        if period_type:
            queryset = queryset.filter(period_type=period_type)
            
        return queryset
    
class ReportDetailView(generics.RetrieveAPIView):
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Report.objects.filter(user=self.request.user)

class GenerateReportView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        user = request.user
        period_type = request.data.get("period_type", "Monthly")
        year = int(request.data.get("year", datetime.now().year))
        month = None
        if period_type == "Monthly":
            month_value = request.data.get("month")
            if month_value:
                month = int(month_value)
            else:
                month = datetime.now().month
        
        #Base query
        expenses = Expense.objects.filter(user=user, date__year=year)
        if month:
            expenses = expenses.filter(date__month = month)
        
        #Aggregate totals by category
        categories = [ 
            "Food", "Transport", "Entertainment",
            "Shopping", "Bills", "Others"
            ]
        
        #initialize totals
        totals = {cat: 0 for cat in categories}
        
        #use aggregation
        grouped = expenses.values("category").annotate(total=Sum("amount"))
        for g in grouped:
            totals[g["category"]] = g["total"]
        
        total_expenses = sum(totals.values())
        
        #save or update report
        report, created = Report.objects.update_or_create(
            user = user,
            period_type = period_type,
            year = year, 
            month = month,
            defaults = {
                "total_expenses": total_expenses,
                "food_expenses": totals["Food"],
                "transport_expenses": totals["Transport"],
                "entertainment_expenses": totals["Entertainment"],
                "shopping_expenses": totals["Shopping"],
                "bills_expenses": totals["Bills"],
                "others_expenses": totals["Others"],
            }
        )
        
        serializer = ReportSerializer(report)
        return Response(serializer.data, status = status.HTTP_201_CREATED if created else status.HTTP_200_OK)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def generate_reports_now(request):
    """Trigger Celery task manually"""
    task = generate_monthly_reports.delay()
    return Response({"message": "Report generation started","task_id": task.id})

@api_view(["GET"])
def check_task_status(request, task_id):
    result = AsyncResult(task_id)
    return Response({
        "task_id": task_id,
        "status": result.status,
        "result": result.result if result.ready() else None
    })