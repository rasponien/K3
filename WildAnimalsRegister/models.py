from django.db import models

class Animal(models.Model):
    name = models.CharField(max_length=255)
    species = models.CharField(max_length=255)
    def __str__(self):
        return self.name

class AnimalObservation(models.Model):
    animal_id = models.ForeignKey(Animal,on_delete=models.CASCADE)
    last_seen_location = models.CharField(max_length=255)
    last_seen_time = models.DateTimeField()

