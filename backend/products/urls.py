from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet, CategoryViewSet, AddReviewView,
    OrderViewSet, CreateStripePaymentIntent
)

router = DefaultRouter()
router.register('products', ProductViewSet)
router.register('categories', CategoryViewSet)
router.register('orders', OrderViewSet, basename='orders')

urlpatterns = [
    # ✅ Specific paths PEHLE, router PHIR
    path('create-payment-intent/', CreateStripePaymentIntent.as_view(), name='create-payment-intent'),
    path('<int:product_id>/add-review/', AddReviewView.as_view(), name='add-review'),
    path('', include(router.urls)),
]