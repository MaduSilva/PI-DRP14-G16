from django.db import models

class Customer(models.Model):
    id_customer = models.AutoField(primary_key=True)
    name = models.TextField(max_length=255)
    age = models.IntegerField()

    def save(self, *args, **kwargs):
        if Customer.objects.filter(name=self.name, age=self.age).exists():
            pass
        else:
            super(Customer, self).save(*args, **kwargs)