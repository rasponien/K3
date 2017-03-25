__author__ = 'carlcustav'
from django.conf.urls import url
from . import views
urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^searchByName/', views.searchByName, name='searchByName')
]

