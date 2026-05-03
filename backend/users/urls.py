# users urls.py
from django.urls import path
from .views import RegisterView, UserProfileView, CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # Registration
    path('register/', RegisterView.as_view(), name='register'),
    
    # Login (Aapka custom view use ho raha hai)
    path('login/', CustomTokenObtainPairView.as_view(), name='login_token'),
    
    # Profile
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    
    # Token Refresh (Zaroori hai token expire hone ke baad)
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]