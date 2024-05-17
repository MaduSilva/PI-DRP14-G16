from django.db import models

class Customer(models.Model):
    #id_customer = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, null=True)
    cpf = models.CharField(max_length=14, null=True)
    birthDate = models.DateField(null=True)
    email = models.EmailField(null=True)
    phone = models.CharField(max_length=15, null=True)
    documents = models.TextField(null=True)
    status = models.CharField(max_length=110, null=True)

    def save(self, *args, **kwargs):
        if Customer.objects.filter(cpf=self.cpf).exists():
            pass
        else:
            super(Customer, self).save(*args, **kwargs)