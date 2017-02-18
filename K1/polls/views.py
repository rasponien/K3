from django.http import HttpResponseRedirect, HttpResponse
from django.urls import reverse
from django.shortcuts import get_object_or_404, render
import logging
from django.views import generic
from .models import Choice, Question, Quiz


class IndexView(generic.ListView):
    template_name = 'index.html'
    context_object_name = 'quiz_list'
    def get_queryset(self):
        return Quiz.objects.order_by('name')[:5]


def results(request, quiz_id):

    #logger = logging.getLogger(__name__)
    points = 0
    quiz = get_object_or_404(Quiz, pk=quiz_id)
    questions = Question.objects.filter(quiz_id = quiz.id)
    max_points = questions.count
    for question in questions:
        selected_choice = question.choice_set.get(pk=request.POST[str(question.id)])
        if selected_choice == question.choice_set.get(is_correct=1):
            points += 1
    return render(request, 'results.html', {'points_gathered': points, 'max_points' : max_points})


def take_test(request, quiz_id):
    quiz = get_object_or_404(Quiz, pk=quiz_id)
    questions = Question.objects.filter(quiz_id = quiz.id)
    logger = logging.getLogger(__name__)
    logger.error('Something went wrong!')
    return render(request, 'test.html', {'questions': questions, 'quiz': quiz})
