from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from app_irpf import views

urlpatterns = [
    path('', views.home, name='home'),
     path('customer/<int:customer_id>/details/', views.customer_details, name='customer_details'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)