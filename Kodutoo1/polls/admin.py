from django.contrib import admin
from .models import Choice, Question, Quiz, Difficulty,Boolean

admin.site.register(Question)
admin.site.register(Choice)
admin.site.register(Quiz)
admin.site.register(Difficulty)
admin.site.register(Boolean)