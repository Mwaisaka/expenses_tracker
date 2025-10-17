from django.db import models

# Create your models here.
from django.contrib.auth.models import User

class Expense(models.Model):
    CATEGORY_CHOICES =[
        ("Food", "Food"),
        ("Transport", "Transport"),
        ("Entertainment", "Entertainment"),
        ("Shopping", "Shopping"),
        ("Bills", "Bills"),
        ("Others", "Others"),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="expenses")
    description = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    date = models.DateField()
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ["-date", "-created_at"]
    
    def __str__(self):
        return f"{self.description} - {self.amount}"