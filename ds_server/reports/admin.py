from django.contrib import admin

# Register your models here.
from .models import Report

@admin.register(Report)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('user', 'year', 'month',)
    list_filter = ('user', 'year','month',)
    search_fields = ('user',)