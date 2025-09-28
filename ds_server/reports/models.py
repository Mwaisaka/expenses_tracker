from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Report(models.Model):
    PERIOD_CHOICES = [
        ("Daily","Daily"),
        ("Monthly", "Monthly"),
        ("Yearly", "Yearly"),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reports")
    period_type = models.CharField(max_length=20, choices=PERIOD_CHOICES)
    year = models.IntegerField()
    month = models.IntegerField(null=True, blank=True) #optional for yearly
    day = models.IntegerField(null=True, blank=True) #optional for yearly
    total_expenses = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    food_expenses = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    transport_expenses = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    entertainment_expenses = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    shopping_expenses = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    bills_expenses = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    others_expenses = models.DecimalField(max_digits=10, decimal_places=2, default=0)
   
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ["-created_at"]
    
    def __str__(self):
        return f"{self.period_type} Report ({self.year}-{self.month}) - {self.user.username}"
