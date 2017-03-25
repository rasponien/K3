from django.shortcuts import render
from django.http import JsonResponse
from .models import AnimalObservation, Animal
from django.views.decorators.csrf import csrf_exempt

def index(request):

    # if 'animalName' in request.POST:
    #     searchByName(request)

    return render(request, 'index.html')

@csrf_exempt
def searchByName(request):
    animals = Animal.objects.get_queryset()
    searchKeyWord = request.POST['animalName']
    result = []

    for animal in animals:
        if animal.name == searchKeyWord:
            result.append({
                'name' : animal.name,
                'species' : animal.species,
                'observationInfo' : findObservationInfo(animal.id)
            })
    return JsonResponse(result, safe=False)

<<<<<<< HEAD
=======

>>>>>>> c067a0d717779ebd6f92b63ce6a8e6c03146fe58
def findObservationInfo(id):
    observationData = []
    for record in AnimalObservation.objects.filter(animal_id = id):
        observationData.append({
            'location' : record.last_seen_location,
            'datetime' : str(record.last_seen_time)
        })
<<<<<<< HEAD
    return observationData
=======
    return observationData
>>>>>>> c067a0d717779ebd6f92b63ce6a8e6c03146fe58
