from django.urls import path
from .views import ExpenseListCreateView, profile_view

urlpatterns = [
    path("expenses_list/", ExpenseListCreateView.as_view(), name="expenses_list"),
    path("profile/", profile_view, name="profile"),
]

