from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    category = models.CharField(max_length=100)
    size = models.CharField(max_length=20, blank=True, null=True)
    color = models.CharField(max_length=20, blank=True, null=True)
    image = models.ImageField(upload_to='product_images/', blank=True, null=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)
    reviews = models.IntegerField(null=True, blank=True)
    in_stock = models.BooleanField(default=True)
    badge = models.CharField(max_length=10, choices=[
        ('Sale', 'Sale'), ('New', 'New'), ('Hot', 'Hot')
    ], blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Category(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='category_images/', blank=True, null=True)  # optional
    slug = models.SlugField(unique=True)  # optional, for SEO-friendly URL

    def __str__(self):
        return self.name
      def __str__(self):
        return self.name