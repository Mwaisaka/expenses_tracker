from django.urls import path
from .views import ExpenseListCreateView, profile_view, ExpenseDetailView

urlpatterns = [
    path("expenses_list/", ExpenseListCreateView.as_view(), name="expenses_list"),
    path("profile/", profile_view, name="profile"),
    path("expense_detail/", ExpenseDetailView.as_view(), name="expense_detail"),
]

