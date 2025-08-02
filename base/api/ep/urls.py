from django.urls import path 
from . import views
from .views import *
from rest_framework_simplejwt.views import ( # type: ignore
    TokenObtainPairView,
    TokenRefreshView,
)
urlpatterns = [
    path('token/', MyTokenPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.UserRegistrationView.as_view(), name = 'register'),
    path('homes/', HomeView.as_view(), name = 'homes'),
    path('homes/<str:pk>', RetrieveHomeView.as_view(), name = 'homedetail'),
    path('updhomes/<str:pk>', UpdateHomeView.as_view(), name = 'homeupdate'),
    # path('bookings/', BookingsView.as_view(), name = 'bookings'),
    path('gethomebookings/<str:pk>', RetrieveBookingsHomeView.as_view(), name = 'retrievebookings'),
    path('userbookings/<str:pk>', RetrieveBookingsUserView.as_view(), name = 'retrievebookingsuser'),
    path('homeimages/<str:pk>', RetrieveHomeImageView.as_view(), name = 'retrieveimages'),
    path('createhomeimages/<str:pk>', HomeImageView.as_view(), name = 'createimages'),
    path('review/<str:pk>', RetrieveReviewView.as_view(), name = 'retrievereviews'),
    path('review/delorupd/<str:pk>', ReviewupdOrDel.as_view(), name = 'reviewupdordelviews'),
    path('review/post/<str:pk>', ReviewHome.as_view(), name = 'homereviews'),
    path('profile/<int:pk>', ProfileView.as_view(), name = 'profiles'),
    path('profileimages/<int:pk>', ProfileImageView.as_view(), name = 'profiles'),
    path('hostedhouse/<int:pk>', HostedHomeView.as_view(), name = 'host'),
    path('favhouse/<int:pk>', FavoriteView.as_view(), name = 'liked'),
    path('favhousedelete/<int:pk>/<int:hk>', FavoriteDeleteView.as_view(), name = 'unlike'),
    path('homebookings/<str:pk>', BookingCreateView.as_view(), name='create-booking'),
    path('payment-verify/', RazorpayVerifyPaymentView.as_view(), name='verify-payment'),

    path('change-password/', PasswordChangeView.as_view(), name='change-password'),
    
]