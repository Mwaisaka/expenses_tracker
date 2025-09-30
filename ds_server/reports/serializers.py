from rest_framework import serializers
from .models import Report
from expenses.models import Expense

class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model=Report
        fields = "__all__"
        read_only_fields = ["user", "created_at"]

class ExpenseSerializer(serializers.ModelSerializer):
    
    date = serializers.DateField(format="%Y-%m-%d", input_formats=["%Y-%m-%d"])
    class Meta:
        model = Expense
        fields = [
            "id",
            "description",
            "amount",
            "category",
            "date",        # Expense date
            # "created_at",  # Entry date
        ]