from django.urls import path
from . import views
from django.conf import settings

urlpatterns = [
    path('', views.apiOverview, name="apiOverview"),
    path('item-list/', views.listItem, name="listItem"),
    path('item-detail/<str:pk>/', views.detailItem, name="detailItem"),
    path('item-create/', views.createItem, name="createItem"),
    path('item-update/<str:pk>/', views.updateItem, name="updateItem"),
    path('item-delete/<str:pk>/', views.deleteItem, name="updateItem"),
]