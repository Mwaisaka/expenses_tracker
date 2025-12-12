from django.shortcuts import render
from rest_framework import generics, permissions, status
from .models import Report
from .serializers import ReportSerializer, ExpenseSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from datetime import datetime
from expenses.models import Expense
from django.db.models import Sum
# from .tasks import generate_monthly_reports
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
# from celery.result import AsyncResult
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt

import io
from django.http import HttpResponse
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from openpyxl import Workbook
from django.db.models.functions import TruncDay, TruncWeek, TruncMonth

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
            
        return queryset.order_by('-year', '-month', '-created_at', '-id')
    
class ReportDetailView(generics.RetrieveAPIView):
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Report.objects.filter(user=self.request.user)
        
@csrf_exempt
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

# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def generate_reports_now(request):
#     """Trigger Celery task manually"""
#     task = generate_monthly_reports.delay()
#     return Response({"message": "Report generation started","task_id": task.id}, status=status.HTTP_202_ACCEPTED)

@api_view(["GET"])
def check_task_status(request, task_id):
    result = AsyncResult(task_id)
    return Response({
        "task_id": task_id,
        "status": result.status,
        "result": result.result if result.ready() else None
    })

class ExpenseStatementView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")
        
        if not start_date or not end_date:
            return Response({"error": "Please provide both start_date and end_date in format YYYY-MM-DD"}, 
                            status=status.HTTP_400_BAD_REQUEST,)
        
        expenses = Expense.objects.filter(user=request.user, date__range=[start_date, end_date])
        
        serializer = ExpenseSerializer(expenses, many=True)
        
        total_amount = expenses.aggregate(total=Sum("amount"))["total"] or 0
        
        data = {
            "user" : request.user.username,
            "start_date": start_date,
            "end_date": end_date,
            "total_amount": total_amount,
            "expenses": serializer.data,
        }
        
        return Response(data, status = status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def generate_statement(request):
    """
    Generate expense statement for a given date range.
    Supports JSON (default), PDF, and Excel output.
    """    
    user=request.user
    start_date = request.data.get("start_date")
    end_date = request.data.get("end_date")
    output_format = request.data.get("format","json") # json|pdf|excel
    
    if not start_date or not end_date:
        return Response(
            {"error": "Please provide start_date and end_date (YYYY-MM-DD)."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    
    try:
        start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
        end_date = datetime.strptime(end_date, "%Y-%m-%d").date()
    except ValueError:
        return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=400)
    
    expenses = Expense.objects.filter(
        user=user, date__gte=start_date, date__lte=end_date
    ).order_by("date")
    
    total_amount = sum(e.amount for e in expenses)
    
    # 1. JSON response
    if output_format == "json":
        serializer = ExpenseSerializer(expenses, many = True)
        
        return Response(
            {
                "user": user.username,
                "start_date": start_date,
                "end_date": end_date,
                "total_amount": total_amount,
                "expenses": serializer.data,
            }
        )
    
     # 2. PDF response
    if output_format == "pdf":
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4)
        styles = getSampleStyleSheet()
        elements = []

        elements.append(Paragraph(f"Expense Statement for {user.username}", styles["Title"]))
        elements.append(Paragraph(f"Period: {start_date} to {end_date}", styles["Normal"]))
        elements.append(Spacer(1, 12))
        
        #Table data
        data = [["Date", "Description", "Category", "Amount", "Entry Date"]]
        for exp in expenses:
            data.append([
                str(exp.date),
                exp.description,
                exp.category,
                f"{exp.amount:.2f}",
                exp.created_at.strftime("%Y-%m-%d %H:%M"),
            ])
        data.append(["", "", "Total", f"{total_amount:.2f}", ""])
        
        table = Table(data, hAlign="LEFT")
        table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.grey),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("GRID", (0, 0), (-1, -1), 1, colors.black),
            ("BACKGROUND", (0, 1), (-1, -1), colors.beige),
        ]))
        elements.append(table)

        doc.build(elements)
        buffer.seek(0)

        response = HttpResponse(buffer, content_type="application/pdf")
        response["Content-Disposition"] = f'attachment; filename="statement_{start_date}_{end_date}.pdf"'
        return response
     # 3. Excel response
    if output_format == "excel":
        wb = Workbook()
        ws = wb.active
        ws.title = "Statement"

        ws.append(["Date", "Description", "Category", "Amount", "Entry Date"])
        for exp in expenses:
            ws.append([
                exp.date,
                exp.description,
                exp.category,
                float(exp.amount),
                exp.created_at.strftime("%Y-%m-%d %H:%M"),
            ])
        ws.append(["", "", "Total", float(total_amount), ""])

        response = HttpResponse(content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        response["Content-Disposition"] = f'attachment; filename="statement_{start_date}_{end_date}.xlsx"'
        wb.save(response)
        return response

    return Response({"error": "Invalid format. Use json, pdf, or excel."}, status=400)

@api_view(["GET"])
@permission_classes([IsAuthenticated])    
def expense_trends(request):
    user = request.user
    period = request.GET.get("period","daily") # daily| weekly | monthly
    
    expenses = Expense.objects.filter(user=user)
    
    data = []
    
    if period == "daily":
        qs = (
            expenses.annotate(day=TruncDay("date"))
            .values("day")
            .annotate(total=Sum("amount"))
            .order_by("day")
        )
        data = [{"label": x["day"].strftime("%Y-%m-%d"), "total": x["total"]} for x in qs]
    elif period == "weekly":
        qs = (
            expenses.annotate(week=TruncWeek("date"))
            .values("week")
            .annotate(total=Sum("amount"))
            .order_by("week")
        )
        data = [{"label" : x["week"].strftime("%Y-%m-%d"), "total": x["total"]} for x in qs]
    elif period == "monthly":
        qs = (
            expenses.annotate(month=TruncMonth("date"))
            .values("month")
            .annotate(total=Sum("amount"))
            .order_by("month")
        )
        data = [{"label" : x["month"].strftime("%Y-%m-%d"), "total": x["total"]} for x in qs]
    else:
        return Response({"error": "Invalid period"}, status=400)
    return Response(data, status=200)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def analytics_dashboard(request):
    user = request.user
    
    expenses = Expense.objects.filter(user=user)
    
    #Total Expenses
    total_expenses = expenses.aggregate(total=Sum("amount"))["total"] or 0
    
    #Category Breakdown
    category_breakdown = (
        expenses.values("category")
        .annotate(total=Sum("amount"))
        .order_by("-total")
    )
    biggest_category = category_breakdown[0]["category"] if category_breakdown else None
    
    #Daily Spending (Sparkline)
    daily = (
        expenses.annotate(day=TruncDay('date'))
        .values("day")
        .annotate(total=Sum("amount"))
        .order_by("day")
    )
    daily_trend = [
        {"label": x["day"].strftime("%Y-%m-%d"), "total": x["total"]} for x in daily
    ]
    
    #Top Spending Days
    top_days = sorted(daily_trend, key=lambda x: x["total"], reverse=True)[:5]
    
    #Monthly Summary 
    monthly = (
        expenses.annotate(month=TruncMonth("date"))
        .values("month")
        .annotate(total=Sum("amount"))
        .order_by("month")
    )
    monthly_summary = [
        {"label": x["month"].strftime("%Y-%m"), "total": x["total"]} for x in monthly
    ]
    
    return Response({
        "total_expenses": total_expenses,
        "category_breakdown": category_breakdown,
        "daily_trend": daily_trend,
        "top_spending_days": top_days,
        "biggest_category": biggest_category,
        "monthly_summary": monthly_summary,
    })
    
   