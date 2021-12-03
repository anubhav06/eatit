from rest_framework.serializers import ModelSerializer
from eatit.models import Note


# Creates JSON objects out of the Python objects
class NoteSerializer(ModelSerializer):
    class Meta:
        model = Note
        fields = '__all__'
