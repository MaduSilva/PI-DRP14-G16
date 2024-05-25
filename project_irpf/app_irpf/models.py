from django.db import models

class Customer(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, null=True)
    cpf = models.CharField(max_length=14, null=True, unique=True)
    birthDate = models.DateField(null=True)
    email = models.EmailField(null=True)
    phone = models.CharField(max_length=15, null=True)
    status = models.CharField(max_length=110, null=True)

    def save(self, *args, **kwargs):
        if self.id is None and Customer.objects.filter(cpf=self.cpf).exists():
            pass
        else:
            super(Customer, self).save(*args, **kwargs)

class Document(models.Model):
    DOCUMENT_TYPES = (
        ('pdf', 'PDF'),
        ('docx', 'DOCX'),
        ('jpg', 'JPG'),
        ('png', 'PNG'),
    )

    customer = models.ForeignKey(Customer, related_name='documents', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    document_type = models.CharField(max_length=4, choices=DOCUMENT_TYPES)
    file = models.FileField(upload_to='documents/')
    uploaded_at = models.DateTimeField(auto_now_add=True)