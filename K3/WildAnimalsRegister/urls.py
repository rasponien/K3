<<<<<<< HEAD
__author__ = 'carlcustav'
from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^searchByName/', views.searchByName, name='searchByName')
=======
__author__ = 'carlcustav'
from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^searchByName/', views.searchByName, name='searchByName')
>>>>>>> c067a0d717779ebd6f92b63ce6a8e6c03146fe58
]