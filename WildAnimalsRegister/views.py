from __future__ import division
from django.shortcuts import render
from django.http import JsonResponse
from .models import AnimalObservation, Animal
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
import time

def index(request):
    return render(request, 'index.html')

@csrf_exempt
def searchByName(request):
    animals = Animal.objects.get_queryset()
    searchKeyWord = request.POST['searchParameter']
    animalObservations = AnimalObservation.objects.get_queryset()
    for observation in animalObservations:
        print("type of: " , observation.last_seen_time , " is " ,type(observation.last_seen_time) )
    result = []

    for animal in animals:
        if animal.name == searchKeyWord:
            result.append({
                'name' : animal.name,
                'species' : animal.species,
                'observationInfo' : findObservationInfo(animal.id)
            })
    return JsonResponse(result, safe=False)

@csrf_exempt
def searchBySpecies(request):
    print("TERE")
    animals = Animal.objects.get_queryset()
    searchKeyWord = request.POST['searchParameter']
    result = []

    for animal in animals:
        if animal.species == searchKeyWord:
            result.append({
                'name' : animal.name,
                'species' : animal.species,
                'observationInfo' : findObservationInfo(animal.id)
            })
    return JsonResponse(result, safe=False)

@csrf_exempt
def searchByLocation(request):
    animalObservations = AnimalObservation.objects.get_queryset()
    animals = Animal.objects.get_queryset()
    searchLocation = request.POST['searchParameter']
    result = []
    animalsAdded = []
    bestTime = 0
    correctPosition = -10

    for observation in animalObservations:
        if observation.last_seen_location == searchLocation and (not(observation.animal_id in animalsAdded)):
            for i in range (len(animalObservations)):
                if(animalObservations[i].animal_id == observation.animal_id ):
                    if(bestTime < time.mktime(animalObservations[i].last_seen_time.timetuple()) * 1000):
                        bestTime = time.mktime(animalObservations[i].last_seen_time.timetuple()) * 1000
                        correctPosition = i
            # to get animal species
            for animal in animals:
                if (animal.name == observation.animal_id.name):
                    species = animal.species
                    break
            result.append({
                'name' : observation.animal_id.name,
                'species' : species,
                'observationInfo' : makeObservationInfo(animalObservations[correctPosition].last_seen_location, animalObservations[correctPosition].last_seen_time)
            })
            animalsAdded.append(observation.animal_id)
            bestTime = 0
            correctPosition = -10
    return JsonResponse(result, safe=False)

def makeObservationInfo(location, dateTime):
    observationData = []
    observationData.append({
        'location': location,
        'datetime': dateTime
    })
    return observationData

def findObservationInfo(id):
    observationData = []
    for record in AnimalObservation.objects.filter(animal_id = id):
        observationData.append({
            'location' : record.last_seen_location,
            'datetime' : str(record.last_seen_time)
        })
    return observationData

