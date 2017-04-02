from __future__ import division
from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import Max
from .models import AnimalObservation, Animal
from django.views.decorators.csrf import csrf_exempt
import json

def index(request):
    return render(request, 'index.html')

def searchByName(request, searchParameter):
    print("searchParameter  ", searchParameter)
    print(request.get_raw_uri())
    animals = Animal.objects.get_queryset()
    searchKeyWord = request.GET['searchParameter']

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

def searchBySpecies(request):
    animals = Animal.objects.get_queryset()
    searchKeyWord = request.GET['searchParameter']
    result = []
    for animal in animals:
        if animal.species == searchKeyWord:
            result.append({
                'id' : animal.id,
                'name' : animal.name,
                'species' : animal.species,
                'observationInfo' : findObservationInfo(animal.id)
            })
    return JsonResponse(result, safe=False)

def searchByLocation(request):
    result = []
    animals = Animal.objects
    searchLocation = request.GET['searchParameter']
    animalObservations = AnimalObservation.objects.\
        filter(last_seen_location=searchLocation).\
        values('animal_id').\
        annotate(latest_date=Max('last_seen_time'))
    for animalObservation in animalObservations:
        observedAnimal = animals.filter(id = animalObservation['animal_id'])[0]
        result.append({
            'id' : observedAnimal.id,
            'name' : observedAnimal.name,
            'species' : observedAnimal.species,
            'observationInfo' : [{
                'id' : AnimalObservation.objects.filter(last_seen_time=animalObservation['latest_date'])[0].id,
                'location' : searchLocation,
                'datetime' : animalObservation['latest_date']
            }]
        })
    return JsonResponse(result, safe=False)

@csrf_exempt
def addAnimal(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)

    Animal(name=body['animalName'],species=body['animalSpecies']).save()
    return JsonResponse([], safe=False)

@csrf_exempt
def addObservation(request):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)

    observedAnimal = Animal.objects.filter(name=body['animalName'])
    if(len(observedAnimal) != 0):
        AnimalObservation(animal_id=observedAnimal[0],
                          last_seen_location=body['animalLocation'],
                          last_seen_time=body['animalSeenTime']).save()
    return JsonResponse([], safe=False)

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
