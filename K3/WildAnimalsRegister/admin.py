from django.contrib import admin
from .models import Animal, AnimalObservation

# Register your models here.
admin.site.register(Animal)
admin.site.register(AnimalObservation)