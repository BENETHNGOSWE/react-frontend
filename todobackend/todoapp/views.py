from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Item
from .serializer import ItemSerializer

# Create your views here.
@api_view(["GET"])
def apiOverview(request):
    api_urls = {
        'list': '/item-list/',
        'Detail': '/item-detail/<str:pk>/',
        'Create': '/item-create/',
        'Update': '/item-update/<str:pk>/',
        'Delete': '/item-delete/<str:pk>/',
    }

    return Response(api_urls)


@api_view(["GET"])
def listItem(request):
    item = Item.objects.all().order_by('-id')
    serializer = ItemSerializer(item, many=True)
    return Response(serializer.data)

@api_view(["GET"])
def detailItem(request, pk):
    item = Item.objects.get(id=pk)
    serializer = ItemSerializer(item, many=True)
    return Response(serializer.data)


@api_view(["POST"])
def createItem(request):
    serializer = ItemSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)    



@api_view(["POST"])
def updateItem(request, pk):
    item = Item.objects.get(id=pk)
    serializer = ItemSerializer(instance=item, data=request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)   

@api_view(["DELETE"])
def deleteItem(request, pk):
    item = Item.objects.get(id=pk)
    item.delete()

    return Response('Item deleted')