from django.conf.urls import url
from . import views

app_name = 'polls'
urlpatterns = [
    url(r'^$', views.IndexView.as_view(), name='index'),
    url(r'^(?P<quiz_id>[0-9]+)/test/$', views.take_test, name='test'),
    url(r'^(?P<quiz_id>[0-9]+)/results/$', views.results, name='results')
]