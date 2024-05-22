from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from .models import Customer
import datetime

def home(request):
    if request.method == 'POST':
        if 'delete' in request.POST:
            customer_id = request.POST.get('customer_id')
            try:
                customer = Customer.objects.get(id=customer_id)
                customer.delete()
                return JsonResponse({'status': 'success'})
            except Customer.DoesNotExist:
                return JsonResponse({'status': 'error', 'message': 'Customer not found'}, status=404)
        else:
            new_customer = Customer()
            new_customer.name = request.POST.get('name')
            new_customer.cpf = request.POST.get('cpf')
            new_customer.birthDate = datetime.datetime.strptime(request.POST.get('birthDate'), '%Y-%m-%d').date()
            new_customer.email = request.POST.get('email')
            new_customer.phone = request.POST.get('phone')
            new_customer.documents = request.POST.get('documents')
            new_customer.status = request.POST.get('status')

            new_customer.save()


    customers = Customer.objects.all()
    context = {
        'customers': customers
    }

    return render(request, 'dashboard/home.html', context)



def customer_details(request, customer_id):
    customer = get_object_or_404(Customer, id=customer_id)
    data = {
        'name': customer.name,
        'cpf': customer.cpf,
        'birthDate': customer.birthDate.strftime('%Y-%m-%d'),
        'email': customer.email,
        'phone': customer.phone,
        'documents': customer.documents,
        'status': customer.status,
    }
    return JsonResponse(data)