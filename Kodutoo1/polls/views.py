from django.http import HttpResponseRedirect, HttpResponse
from django.urls import reverse
from django.shortcuts import get_object_or_404, render


import logging

from django.views import generic

from .models import Choice, Question, Quiz


class IndexView(generic.ListView):
    template_name = 'polls/index.html'
    context_object_name = 'quiz_list'
    def get_queryset(self):
        return Quiz.objects.order_by('name')[:5]


class DetailView(generic.DetailView):
    model = Question
    template_name = 'polls/detail.html'


class ResultsView(generic.DetailView):
    model = Question
    template_name = 'polls/result.html'

def vote(request, question_id):
   question = get_object_or_404(Question, pk=question_id)
   try:
       selected_choice = question.choice_set.get(pk=request.POST['choice'])
   except (KeyError, Choice.DoesNotExist):
       return render(request, 'polls/detail.html', {'question': question, 'error_message': "You didn't select a choice.",})
   else:
       selected_choice.votes += 1
       selected_choice.save()
       # Always return an HttpResponseRedirect after successfully dealing
       #  with POST data. This prevents data from being posted twice if a
       #  user hits the Back button.
       return HttpResponseRedirect(reverse('polls:results', args=(question.id,)))


def results(request, quiz_id):

    points = 0
    max_points = 0

    logger = logging.getLogger(__name__)
    quiz = get_object_or_404(Quiz, pk=quiz_id)
    questions = Question.objects.filter(quiz_id = quiz.id)
    max_points = questions.count
    for question in questions:
        selected_choice = question.choice_set.get(pk=request.POST[str(question.id)])
        if selected_choice == question.choice_set.get(is_correct=1):
            points += 1

    return render(request, 'polls/results.html', {'points_gathered': points,
                                                  'max_points' : max_points})


def take_test(request, quiz_id):
    quiz = get_object_or_404(Quiz, pk=quiz_id)
    questions = Question.objects.filter(quiz_id = quiz.id)
    logger = logging.getLogger(__name__)
    logger.error('Something went wrong!')
    return render(request, 'polls/test.html', {'questions': questions, 'quiz': quiz})


# <editor-fold desc="Description">
def index(request):
    quiz_list = Quiz.objects
    latest_question_list = Question.objects.order_by('pub_date')[:5]
    context = {'latest_question_list': latest_question_list,
               'quiz_list': quiz_list}
    return render(request, 'polls/index.html', context)
# </editor-fold>
