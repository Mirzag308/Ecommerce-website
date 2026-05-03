from django.contrib import admin
from .models import Product, Category, ProductImage

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'category', 'in_stock', 'badge']
    search_fields = ['name']
    list_filter = ['category', 'in_stock', 'badge']
    autocomplete_fields = ['category']
    inlines = [ProductImageInline]  # ✅ Allows multiple images in admin

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    search_fields = ['name']

admin.site.register(ProductImage)
