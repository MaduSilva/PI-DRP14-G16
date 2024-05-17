from django.shortcuts import render
from .models import Customer

def home(request):
    new_customer = Customer()
    new_customer.name = request.POST.get('name')
    new_customer.cpf = request.POST.get('cpf')
    new_customer.birthDate = request.POST.get('birthDate')
    new_customer.email = request.POST.get('email')
    new_customer.phone = request.POST.get('phone')
    new_customer.documents = request.POST.get('documents')
    new_customer.status = request.POST.get('status')

    new_customer.save()

    customers = {
        'customers': Customer.objects.all()
    }

    return render(request, 'dashboard/home.html', customers)