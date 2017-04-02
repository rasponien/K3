from __future__ import division
from django.shortcuts import render
from django.http import JsonResponse
from .models import AnimalObservation, Animal
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
import time
from django.core.serializers.json import DjangoJSONEncoder
import json
from datetime import datetime
from django.http import HttpResponse

def index(request):
    return render(request, 'index.html')

@csrf_exempt
def searchByName(request):
    animals = Animal.objects.get_queryset()
    searchKeyWord = request.POST['searchParameter']
    result = []
    for animal in animals:
        if animal.name == searchKeyWord:
            result.append({
                'id' : animal.id,
                'name' : animal.name,
                'species' : animal.species,
                'observationInfo' : findObservationInfo(animal.id)
            })
    return JsonResponse(result, safe=False)

@csrf_exempt
def searchBySpecies(request):
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

@csrf_exempt
def addAnimal(request):
    print("ADD ANIMAL :" , request.POST)
    animalName = request.POST.get('animalName')
    print("ANIMAL NAME :" , animalName )
    animalSpecies = request.POST.get('animalSpecies')
    print("ANIMAL SPECIES :", animalSpecies)

    newObject = Animal(name=animalName,species=animalSpecies)
    newObject.save()
    result = []
    return JsonResponse(result, safe=False)

@csrf_exempt
def addObservation(request):
    nameExists = False
    print("ADD ANIMAL :" , request.POST)
    new_animal_id = request.POST.get('animalName')
    if(len(Animal.objects.filter(name=new_animal_id)) != 0):
        animal = Animal.objects.filter(name=new_animal_id)
        if(animal.name == new_animal_id):
            new_last_seen_location = request.POST.get('animalLocation')
            new_last_seen_time = request.POST.get('animalSeenTime')
            new_date = datetime.now()
            newObject = AnimalObservation(animal_id=animal, last_seen_location=new_last_seen_location,last_seen_time=new_date)
            newObject.save()

    result = []
    return JsonResponse(result, safe=False)


def makeObservationInfo(location, dateTime):
    observationData = []
    observationData.append({
        'location': location,
        'datetime': dateTime
    })
    return observationData

@csrf_exempt
def removeAnimal(request):
    animalName = request.body.decode('utf-8')
    Animal.objects.filter(name = animalName).delete()
    return JsonResponse([], safe=False)

@csrf_exempt
def changeAnimalData(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)

    animal = Animal.objects.filter(id = body['id'])
    observationRecords = AnimalObservation.objects


    animal.update(name=body['name'], species=body['species'])
    for observationRecord in body['observationInfo']:
        observationRecords.filter(id = observationRecord['id']).update(last_seen_location=observationRecord['location'], last_seen_time=observationRecord['datetime'])
    return JsonResponse([], safe=False)


def findObservationInfo(id):
    observationData = []
    for record in AnimalObservation.objects.filter(animal_id = id):
        observationData.append({
            'id' : record.id,
            'location' : record.last_seen_location,
            'datetime' : record.last_seen_time
        })
    return observationData
