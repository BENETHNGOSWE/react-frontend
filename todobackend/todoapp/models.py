from django.db import models

# Create your models here.
class Item(models.Model):
    name = models.CharField(max_length=50)
    completed = models.BooleanField(default=False, blank=True, null=True)