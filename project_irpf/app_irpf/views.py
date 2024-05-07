from django.shortcuts import render
from .models import Customer

def home(request):
    return render(request, 'dashboard/home.html')

def customers(request):
    new_customer = Customer()
    new_customer.name = request.POST.get('name')
    new_customer.age = request.POST.get('age')
    new_customer.save()

    customers = {
        'customers': Customer.objects.all()
    }

    return render(request, 'dashboard/customers.html', customers)