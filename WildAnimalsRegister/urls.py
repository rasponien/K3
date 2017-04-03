__author__ = 'carlcustav'
from django.conf.urls import url
from . import views
from WildAnimalsRegister.views import SpeciesView, AnimalView, LocationsView, AnimalAddView, AnimalObservationAddView

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^animals/species/(?P<species>.*)/search/$', SpeciesView.as_view(), name='searchBySpecies'),
    url(r'^animals/locations/(?P<location>.*)/search/$', LocationsView.as_view(), name='searchByLocation'),
    url(r'^animals/(?P<name>.*)/$', AnimalView.as_view(), name='searchByName'),
    url(r'^animals/$', AnimalAddView.as_view(), name='addAnimal'),
    url(r'^observations/$', AnimalObservationAddView.as_view(), name='addObservation')
]

