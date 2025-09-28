from celery import shared_task
from django.db.models import Sum
from datetime import datetime
from expenses.models import Expense
from .models import Report
from django.contrib.auth.models import User

@shared_task
def generate_monthly_reports():
    """Generate monthly reports for all users at the end of each month."""
    now = datetime.now()
    year, month = now.year, now.month    
    
    users = User.objects.all()
    
    for user in users:
        expenses = Expense.objects.filter(user=user, date__year = year, date__month = month)
        
        #Aggregate
        categories = ["Food", "Transport", "Entertainment", "Shopping", "Bills", "Others"]
        totals = {cat: 0 for cat in categories}
        
        grouped = expenses.values("category").annotate(total=Sum("amount"))
        for g in grouped:
            totals[g["category"]] = g["total"]
        
        total_expenses = sum(totals.values())
        
        Report.objects.update_or_create(
            user=user,
            period_type="Monthly",
            year=year,
            month=month,
            defaults={
                "total_expenses": total_expenses,
                "food_expenses": totals["Food"],
                "transport_expenses": totals["Transport"],
                "entertainment_expenses": totals["Entertainment"],
                "shopping_expenses": totals["Shopping"],
                "bills_expenses": totals["Bills"],
                "others_expenses": totals["Others"],
            },
        )
