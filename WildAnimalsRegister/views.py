from __future__ import division
from django.shortcuts import render
from django.http import JsonResponse
from django.views.generic.base import View
from .models import AnimalObservation, Animal
from django.views.decorators.csrf import csrf_exempt
import json

def index(request):
    return render(request, 'index.html')

class SpeciesView(View):
    def get(self, request, species):
        return JsonResponse(getAnimalJSON("species", species), safe=False)

class LocationsView(View):
    def get(self, request, location):
        result = []
        animals = Animal.objects

        query = "SELECT id, last_seen_location, animal_id_id, " \
                "MAX(last_seen_time) FROM WildAnimalsRegister_animalObservation " \
                "WHERE last_seen_location = %s GROUP BY animal_id_id"
        animalObservations = AnimalObservation.objects.raw(query, [location])

        for animalObservation in animalObservations:
            observedAnimal = animals.filter(id = animalObservation.animal_id_id)[0]
            result.append({
                'id' : observedAnimal.id,
                'name' : observedAnimal.name,
                'species' : observedAnimal.species,
                'observationInfo' : [{
                    'id' : animalObservation.id,
                    'location' : animalObservation.last_seen_location,
                    'datetime' : animalObservation.last_seen_time
                }]
            })
        return JsonResponse(result, safe=False)

class AnimalView(View):

    @csrf_exempt
    def delete(self, request, name):
        Animal.objects.filter(name = name).delete()
        return JsonResponse([], safe=False)

    @csrf_exempt
    def put(self, request, name):
        body = json.loads(request.body.decode('utf-8'))

        animal = Animal.objects.filter(id = body['id'])
        observationRecords = AnimalObservation.objects

        animal.update(name=name, species=body['species'])
        for observationRecord in body['observationInfo']:
            observationRecords.filter(id = observationRecord['id']).update(
                last_seen_location=observationRecord['location'],
                last_seen_time=observationRecord['datetime'])
        return JsonResponse([], safe=False)

    def get(self, request, name):
        return JsonResponse(getAnimalJSON("name", name), safe=False)


class AnimalAddView(View):

    @csrf_exempt
    def post(self, request):
        body = json.loads(request.body.decode('utf-8'))

        Animal(name=body['animalName'],species=body['animalSpecies']).save()
        return JsonResponse([], safe=False)

class AnimalObservationAddView(View):

    def post(self, request):
        body = json.loads(request.body.decode('utf-8'))

        observedAnimal = Animal.objects.filter(name=body['animalName'])
        if(len(observedAnimal) != 0):
            AnimalObservation(animal_id=observedAnimal[0],
                              last_seen_location=body['animalLocation'],
                              last_seen_time=body['animalSeenTime']).save()
        return JsonResponse([], safe=False)



def getObservationInfoJSON(id):
    observationData = []
    for record in AnimalObservation.objects.filter(animal_id = id):
        observationData.append({
            'id' : record.id,
            'location' : record.last_seen_location,
            'datetime' : record.last_seen_time
        })
    return observationData

def getAnimalJSON(searchParameter, parameterValue):
    if (searchParameter == 'name'): animals = Animal.objects.filter(name = parameterValue)
    elif (searchParameter == 'species'): animals = Animal.objects.filter(species = parameterValue)

    result = []
    for animal in animals:
        result.append({
            'id' : animal.id,
            'name' : animal.name,
            'species' : animal.species,
            'observationInfo' : getObservationInfoJSON(animal.id)
        })
    return result
