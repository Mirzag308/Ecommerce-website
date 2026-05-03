import stripe
from rest_framework.response import Response
from rest_framework import viewsets, generics, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from django.conf import settings
from .models import Product, Category, Review, Order, OrderItem, ShippingAddress
from .serializers import (
    ProductSerializer, CategorySerializer, ReviewSerializer, OrderSerializer
)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        category_slug = self.request.query_params.get('category')
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        return queryset


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class AddReviewView(generics.CreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    def perform_create(self, serializer):
        product_id = self.kwargs.get('product_id')
        serializer.save(product_id=product_id)


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')

    def create(self, request, *args, **kwargs):
        try:
            user = request.user
            data = request.data

            total_price = data.get("total_price")
            payment_method = data.get("payment_method", "Stripe")
            is_paid = data.get("is_paid", False)
            items = data.get("items", [])
            shipping_data = data.get("shipping_address")

            if not total_price or not items:
                return Response(
                    {"error": "Total price and items are required"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            order = Order.objects.create(
                user=user,
                total_price=total_price,
                payment_method=payment_method,
                is_paid=is_paid
            )

            if shipping_data:
                shipping_address = ShippingAddress.objects.create(
                    user=user, **shipping_data
                )
                order.shipping_address = shipping_address
                order.save()

            for item in items:
                if not Product.objects.filter(id=item["product"]).exists():
                    return Response(
                        {"error": f"Product {item['product']} does not exist"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                OrderItem.objects.create(
                    order=order,
                    product_id=item["product"],
                    quantity=item["quantity"],
                    price=item["price"]
                )

            return Response(
                {"id": order.id, "message": "Order created successfully"},
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(
        detail=True, methods=['patch'],
        url_path='update-status',
        permission_classes=[IsAuthenticated]
    )
    def update_status(self, request, pk=None):
        order = self.get_object()
        if not request.user.is_staff:
            return Response(
                {"error": "Permission denied"},
                status=status.HTTP_403_FORBIDDEN
            )
        status_value = request.data.get("status")
        if status_value not in ["Pending", "Shipped", "Delivered"]:
            return Response(
                {"error": "Invalid status"},
                status=status.HTTP_400_BAD_REQUEST
            )
        order.status = status_value
        order.save()
        return Response(
            {"message": "Status updated successfully"},
            status=status.HTTP_200_OK
        )


# ✅ FIXED Stripe Payment Intent
class CreateStripePaymentIntent(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Step 1: Check API key loaded hai ya nahi
        api_key = settings.STRIPE_SECRET_KEY
        if not api_key:
            print("❌ STRIPE_SECRET_KEY not found in settings!")
            return Response(
                {"error": "Stripe is not configured. Check .env file."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        print(f"✅ Stripe Key found: {api_key[:10]}...{api_key[-4:]}")

        try:
            amount = request.data.get("amount")
            if not amount:
                return Response(
                    {"error": "Amount is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                amount_in_cents = int(float(amount) * 100)
            except (ValueError, TypeError):
                return Response(
                    {"error": "Invalid amount format"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if amount_in_cents < 50:
                return Response(
                    {"error": "Minimum amount is $0.50"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            print(f"✅ Creating Payment Intent for {amount_in_cents} cents...")

            # Set key right before calling
            stripe.api_key = api_key

            intent = stripe.PaymentIntent.create(
                amount=amount_in_cents,
                currency="usd",
                automatic_payment_methods={"enabled": True},
            )

            print(f"✅ Payment Intent created: {intent.id}")

            return Response(
                {"clientSecret": intent.client_secret},
                status=status.HTTP_200_OK
            )

        except stripe.error.AuthenticationError as e:
            print(f"❌ Stripe Auth Error: {e}")
            return Response(
                {"error": "Invalid Stripe API key. Check your .env file."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except stripe.error.StripeError as e:
            print(f"❌ Stripe Error: {e}")
            return Response(
                {"error": str(e)},
                status=status.HTTP_502_BAD_GATEWAY
            )
        except Exception as e:
            print(f"❌ Server Error: {e}")
            return Response(
                {"error": f"Server error: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )