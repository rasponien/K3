from django.db import models
import datetime
from django.utils import timezone


class Difficulty(models.Model):
    name = models.CharField(max_length=200)
    def __str__(self):
        return self.name

class Boolean(models.Model):
    name = models.CharField(max_length=200)
    def __str__(self):
        return self.name

class Quiz(models.Model):
    name = models.CharField(max_length=255)
    difficulty_id = models.ForeignKey(Difficulty)
    def __str__(self):
        return self.name

# Create your models here.
class Question(models.Model):
    question_text = models.CharField(max_length=200)
    pub_date = models.DateTimeField('date published')
    quiz_id = models.ForeignKey(Quiz)
    def __str__(self):
        return self.question_text
    def was_published_recently(self):
        return self.pub_date >= timezone.now() - datetime.timedelta(days=1)

class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choice_text = models.CharField(max_length=200)
    votes = models.IntegerField(default=0)
    is_correct = models.ForeignKey(Boolean, default = 2)
    def __str__(self):
        return self.choice_text
