from django.urls import path
from app_irpf import views

urlpatterns = [
    path('', views.home, name='home'),
     path('customer/<int:customer_id>/details/', views.customer_details, name='customer_details'),
]
