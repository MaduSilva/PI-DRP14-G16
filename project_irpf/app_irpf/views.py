from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from .models import Customer, Document
import datetime
import base64
import os

from django.views.decorators.clickjacking import xframe_options_exempt

@xframe_options_exempt
def home(request):
    if request.method == 'POST':
        if 'delete' in request.POST:
            customer_id = request.POST.get('customer_id')
            try:
                customer = Customer.objects.get(id=customer_id)
                customer.delete()
                return JsonResponse({'status': 'success'})
            except Customer.DoesNotExist:
                return JsonResponse({'status': 'error', 'message': 'Customer not found'})
        
        name = request.POST.get('name')
        cpf = request.POST.get('cpf')
        birthDate = request.POST.get('birthDate')
        if birthDate:
            birthDate = datetime.datetime.strptime(birthDate, '%Y-%m-%d').date()
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        status = request.POST.get('status')
        
        customer = Customer(name=name, cpf=cpf, birthDate=birthDate, email=email, phone=phone, status=status)
        customer.save()

        for i in range(len(request.FILES.getlist('documents[]'))):
            document_name = request.POST.getlist('document_name[]')[i]
            document_file = request.FILES.getlist('documents[]')[i]

            document_type = document_file.name.split('.')[-1].lower() if '.' in document_file.name else ''
            
            Document.objects.create(customer=customer, name=document_name, document_type=document_type, file=document_file)

        return JsonResponse({'status': 'success', 'id': customer.id})
    
    customers = Customer.objects.all()
    return render(request, 'dashboard/home.html', {'customers': customers})

@xframe_options_exempt
def customer_details(request, customer_id):
    customer = get_object_or_404(Customer, id=customer_id)
    documents = customer.documents.all()
    data = {
        'name': customer.name,
        'cpf': customer.cpf,
        'birthDate': customer.birthDate.strftime('%Y-%m-%d'),
        'email': customer.email,
        'phone': customer.phone,
        'status': customer.status,
        'documents': [{'id': doc.id, 'name': doc.name, 'data': base64.b64encode(doc.file.read()).decode('utf-8'), 'document_type': doc.document_type} for doc in documents],
    }
    return JsonResponse(data)
