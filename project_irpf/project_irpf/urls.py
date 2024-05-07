from django.urls import path
from app_irpf import views

urlpatterns = [
    path('', views.home, name='home'),
]
