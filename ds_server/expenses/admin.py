from django.contrib import admin

# Register your models here.
from .models import Expense

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('description', 'category', 'amount', 'created_at')
    list_filter = ('description', 'category',)
    search_fields = ('description',)