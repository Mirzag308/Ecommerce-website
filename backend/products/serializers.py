# serializers.py
from rest_framework import serializers
from .models import Product, Category, ProductImage , Review
from rest_framework import serializers
from .models import Order, OrderItem, ShippingAddress

class CategorySerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    productCount = serializers.SerializerMethodField()
    class Meta:
        model = Category
        fields = ['id', 'name', 'image', 'slug', 'productCount']

    def get_image(self, obj):
        try:
            if obj.image and hasattr(obj.image, 'url'):
                request = self.context.get('request')
                if request:
                    return request.build_absolute_uri(obj.image.url)
                return obj.image.url
        except:
            return None
        return None

    def get_productCount(self, obj):
        return obj.products.count()

class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)

    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'color']

   
class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'user_name', 'rating', 'comment', 'created_at']

class ProductSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    category_name = serializers.CharField(source='category.name', read_only=True)
    color_images = serializers.SerializerMethodField()
    images = ProductImageSerializer(many=True, required=False)
    reviews_list = ReviewSerializer(many=True, read_only=True)  
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'

    def get_average_rating(self, obj):
        reviews = obj.reviews_list.all()
        if reviews:
            return round(sum([r.rating for r in reviews]) / len(reviews), 2)
        return None
    
    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image:
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None

    def get_color_images(self, obj):
        color_images = {}
        for img in obj.images.all():
            url = self.context['request'].build_absolute_uri(img.image.url)
            if img.color not in color_images:
                color_images[img.color] = []
            color_images[img.color].append(url)
        return color_images

    def create(self, validated_data):
        images_data = self.context['request'].FILES.getlist('images')  # ✅ Multi-file upload
        colors = self.context['request'].data.getlist('colors')
        product = Product.objects.create(**validated_data)
        for i, image in enumerate(images_data):
            ProductImage.objects.create(product=product, image=image, color=colors[i])
        return product

    def update(self, instance, validated_data):
        images_data = self.context['request'].FILES.getlist('images')
        colors = self.context['request'].data.getlist('colors')
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if images_data:
            instance.images.all().delete()
            for i, image in enumerate(images_data):
                ProductImage.objects.create(product=instance, image=image, color=colors[i])
        return instance


class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    shipping_address = ShippingAddressSerializer()

    class Meta:
        model = Order
        fields = [
            "id", "user", "payment_method", "shipping_address",
            "total_price", "status", "is_paid", "created_at", "items"
        ]
        read_only_fields = ['user']