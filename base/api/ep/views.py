from django.shortcuts import render
from rest_framework.permissions import AllowAny , IsAuthenticated
from rest_framework.views import APIView
from .serializers import *
from api.models import *
from rest_framework import status , generics , mixins

from django.core.mail import EmailMessage
from django.conf import settings
from django.template.loader import render_to_string


from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer # type: ignore
from rest_framework_simplejwt.views import TokenObtainPairView # type: ignore

from django.core.exceptions import ObjectDoesNotExist

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import BookingSerializer
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.conf import settings

from razorpay import Client, errors
from django.shortcuts import get_object_or_404


class MyTokenPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls,user):
        token = super().get_token(user)
        token['email'] = user.email
        return token

class MyTokenPairView(TokenObtainPairView):
    serializer_class = MyTokenPairSerializer

def getRoutes(request):
    routes = [
        'api/endpoints'
    ]

    return JsonResponse(routes , safe = False)

# Resistration view

class UserRegistrationView(APIView):
    permission_classes = [AllowAny]

    def post(self,request):
        cleaned_data = request.data
        serializer = UserRegistrationSerializer(data=cleaned_data)

        if serializer.is_valid(raise_exception=True):
            user_obj = serializer.create(cleaned_data)

            profile = Profile(user = user_obj , email = user_obj.email , img = 'uploads/proflogo.png' )

            profile_image = ProfileImage(profile = profile , images = 'uploads/proflogo.png')

            if user_obj:
                profile.save()
                profile_image.save()

                template = render_to_string('api/temp.html' , {'email' : user_obj.email})

                email = EmailMessage(
                    'Welcome to our website',
                    template,
                    settings.EMAIL_HOST_USER,
                    [user_obj.email],
                )
                email.fail_silently = False
                email.send()

                return Response(status = status.HTTP_201_CREATED)
        
        return Response(status= status.HTTP_400_BAD_REQUEST)
    

class HomeView(mixins.ListModelMixin , mixins.CreateModelMixin , generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    queryset = home.objects.all()
    serializer_class = HomeSerializer

    def get(self , request , *args , **kwargs):
        return self.list(request,*args,**kwargs)
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        homeinst = serializer.save()  # Calls the `create` method in the serializer

        if 'images' in request.FILES:
            for img in request.FILES.getlist('images'):
                homeImage.objects.create(home=homeinst, images=img)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

   
class BookingsView(mixins.ListModelMixin , mixins.CreateModelMixin , generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    queryset = bookings.objects.all()
    serializer_class = BookingSerializer
    

    def get(self , request , *args , **kwargs):
        return self.list(request,*args,**kwargs)
    
    def post(self,request,*args,**kwargs):
        return self.create(request,*args,**kwargs)


class RetrieveBookingsHomeView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = bookings.objects.all()
    serializer_class = BookingSerializer

    def get_queryset(self):
        queryset =  super().get_queryset()
        try:
            homes = home.objects.get(id = self.kwargs['pk'])
        except ObjectDoesNotExist:
            return None
        
        else:
            return queryset.filter(home = homes)
        
    def list(self,*args,**kwargs):
        queryset = self.get_queryset()
        if queryset is None:
            return Response("home not found" , status= status.HTTP_404_NOT_FOUND)
        serializer = BookingSerializer(queryset , many = True)
        return Response(serializer.data)
    

class RetrieveBookingsUserView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = bookings.objects.all()
    serializer_class = BookingSerializer

    def get_queryset(self):
        queryset =  super().get_queryset()
        try:
            user = User.objects.get(id = self.kwargs['pk'])
        except ObjectDoesNotExist:
            return None
        
        else:
            return queryset.filter(guest = user).order_by('-created_at')
        
    def list(self,*args,**kwargs):
        queryset = self.get_queryset()
        if queryset is None:
            return Response("user not found" , status= status.HTTP_404_NOT_FOUND)
        serializer = BookingSerializer(queryset , many = True)
        return Response(serializer.data)
    
    

class HomeImageView(mixins.ListModelMixin , mixins.CreateModelMixin , generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    queryset = homeImage.objects.all()
    serializer_class = HomeImageSerializer
    
    def get_queryset(self):
        home_id = self.kwargs.get('pk')  # from URL
        return homeImage.objects.filter(home_id=home_id)
    

    def get(self , request , *args , **kwargs):
        return self.list(request,*args,**kwargs)
    
    def post(self,request,*args,**kwargs):

        data = request.data.copy()
        data['home'] = self.kwargs.get('pk') 
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
                
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
    


class ReviewHome(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = reviews.objects.all()
    serializer_class = ReviewSerializer

    def perform_create(self, serializer):
        serializer.save(guest=self.request.user)

class ReviewupdOrDel(generics.RetrieveUpdateDestroyAPIView):
    # queryset = reviews.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # User can only access their own reviews
        return reviews.objects.filter(guest=self.request.user)

    def perform_update(self, serializer):
        serializer.save(guest=self.request.user)

    def perform_destroy(self, instance):
        instance.delete()
    

class RetrieveHomeImageView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = homeImage.objects.all()
    serializer_class = HomeImageSerializer

    def get_queryset(self):
        queryset =  super().get_queryset()
        try:
            homes = home.objects.get(id = self.kwargs['pk'])
        except ObjectDoesNotExist:
            return None
        
        else:
            return queryset.filter(home = homes)
        
    def list(self,*args,**kwargs):
        queryset = self.get_queryset()
        if queryset is None:
            return Response("home not found" , status= status.HTTP_404_NOT_FOUND)
        serializer = HomeImageSerializer(queryset , many = True)
        return Response(serializer.data)


class RetrieveReviewView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = reviews.objects.all()
    serializer_class = ReviewSerializer

    def get_queryset(self):
        queryset =  super().get_queryset()
        try:
            homes = home.objects.get(id = self.kwargs['pk'])
        except ObjectDoesNotExist:
            raise NotFound(detail="Home not found")
        
        else:
            return queryset.filter(home = homes)
        
    def list(self,*args,**kwargs):
        queryset = self.get_queryset()
        if queryset is None:
            return Response({"error": "Home not found"} , status= status.HTTP_404_NOT_FOUND)
        serializer = ReviewSerializer(queryset , many = True)
        return Response(serializer.data)



class RetrieveHomeView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = home.objects.all()
    serializer_class = HomeSerializer

    def get_queryset(self):
        queryset =  super().get_queryset()
        try:
            homes = home.objects.get(id = self.kwargs['pk'])
        except ObjectDoesNotExist:
            return None
        
        else:
            return homes
        
    def list(self,*args,**kwargs):
        queryset = self.get_queryset()
        if queryset is None:
            return Response("home not found" , status= status.HTTP_404_NOT_FOUND)
        serializer = HomeSerializer(queryset , context = {'request' : self.request})
        return Response(serializer.data)
    
    
    
class UpdateHomeView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    queryset = home.objects.all()
    serializer_class = HomeSerializer

    def get_queryset(self):
        queryset =  super().get_queryset()
        try:
            homes = home.objects.get(id = self.kwargs['pk'])
        except ObjectDoesNotExist:
            return None
        
        else:
            return homes    

    def patch(self,request,pk):
        queryset = self.get_queryset()
        if queryset is None:
            return Response("home not found" , status = status.HTTP_404_NOT_FOUND)
        if queryset.owner!= self.request.user:
            return Response("you are not allowed to update this home")
        serializer = HomeSerializer(queryset,data = request.data , partial = True)
        if serializer.is_valid():
            homeser = serializer.save()
            
            if 'images' in request.FILES:
                old_images = homeImage.objects.filter(home=homeser)
                for img in old_images:
                    img.images.delete(save=False)  # Deletes the actual file
                old_images.delete()  # Deletes DB entries

                # Add new images
                for img in request.FILES.getlist('images'):
                    homeImage.objects.create(home=homeser, images=img)
        
            return Response(serializer.data)
        return Response(serializer.errors)
    



class ProfileView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        try:
            user = User.objects.get(id = self.kwargs['pk'])
        except ObjectDoesNotExist:
            return None

        else:
            return queryset.get(user=user)
    
    def get(self,request,pk):
        queryset = self.get_queryset()
        if queryset is None:
            return Response("user not found" , status = status.HTTP_404_NOT_FOUND)
        serializer = ProfileSerializer(queryset)
        return Response(serializer.data)
    
    def put(self,request,pk):
        queryset = self.get_queryset()
        if queryset is None:
            return Response("user not found" , status = status.HTTP_404_NOT_FOUND)
        if queryset.user!= self.request.user:
            return Response("you are not allowed to update this profile")
        serializer = ProfileSerializer(queryset,data = request.data , partial = True)
        if serializer.is_valid():
            profser = serializer.save()
            
            if 'images' in request.FILES:
                old_images = ProfileImage.objects.filter(profile=profser)
                for img in old_images:
                    img.images.delete(save=False)  # Deletes the actual file
                old_images.delete()  # Deletes DB entries

                # Add new images
                for img in request.FILES.getlist('images'):
                    ProfileImage.objects.create(profile=profser, images=img)
        
            return Response(serializer.data)
        return Response(serializer.errors)
    
class ProfileImageView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    queryset = ProfileImage.objects.all()
    serializer_class = ProfileImageSerializer
    

    def get_queryset(self):
        queryset =  super().get_queryset()
        try:
            user = User.objects.get(id = self.kwargs['pk'])
            prof = Profile.objects.get(user = user)
        except ObjectDoesNotExist:
            return None
        
        else:
            return queryset.get(profile = prof)
        
    def get(self,request,pk):
        queryset = self.get_queryset()
        if queryset is None:
            return Response("profile not found" , status= status.HTTP_404_NOT_FOUND)
        serializer = ProfileImageSerializer(queryset )
        return Response(serializer.data)



class HostedHomeView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    queryset = home.objects.all()
    serializer_class = HomeSerializer

    def get_queryset(self):
        queryset =  super().get_queryset()
        try:
            homes = home.objects.filter(owner = self.kwargs['pk'])
        except ObjectDoesNotExist:
            return None
        
        else:
            return homes
        
    def list(self,*args,**kwargs):
        queryset = self.get_queryset()
        if queryset is None:
            return Response("home not found" , status= status.HTTP_404_NOT_FOUND)
        serializer = HomeSerializer(queryset , many = True , context={'request': self.request})
        return Response(serializer.data)
    
class FavoriteView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Favorite.objects.all()
    serializer_class = FavoriteSerializer 

    def get_queryset(self):
        queryset =  super().get_queryset()
        try:
            fav = Favorite.objects.filter(guest = self.kwargs['pk'])
        except ObjectDoesNotExist:
            return None
        
        else:
            return fav
        
    def list(self,*args,**kwargs):
        queryset = self.get_queryset()
        if queryset is None:
            return Response("home not found" , status= status.HTTP_404_NOT_FOUND)
        serializer = FavoriteSerializer(queryset , many = True , context={'request': self.request})
        return Response(serializer.data)
    
    def create(self, request, *args, **kwargs):
        serializer = FavoriteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, *args, **kwargs):
        try:
            fav = Favorite.objects.filter(guest = self.kwargs['pk'])
            favorite = fav.get(home = request.h)
            favorite.delete()
            return Response({"detail": "Favorite deleted."}, status=status.HTTP_204_NO_CONTENT)
        except Favorite.DoesNotExist:
            return Response({"detail": "Favorite not found."}, status=status.HTTP_404_NOT_FOUND)
        


class FavoriteDeleteView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Favorite.objects.all()
    serializer_class = FavoriteSerializer 

    def delete(self, request, *args, **kwargs):

        if request.user.id != int(self.kwargs['pk']):
            return Response({"detail": "Not authorized to delete this favorite."}, status=status.HTTP_403_FORBIDDEN)
        try:
            fav = Favorite.objects.filter(guest = self.kwargs['pk'])
            favorite = fav.get(home = self.kwargs['hk'])
            favorite.delete()
            return Response({"detail": "Favorite deleted."}, status=status.HTTP_204_NO_CONTENT)
        except Favorite.DoesNotExist:
            return Response({"detail": "Favorite not found."}, status=status.HTTP_404_NOT_FOUND)
        

#payment view 

class BookingCreateView(generics.CreateAPIView):
    queryset = bookings.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        home_id = self.kwargs['pk']
        home_instance = home.objects.get(id=home_id)  # Get the home object
        serializer.save(guest=self.request.user, home=home_instance)
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("❌ Validation Errors:", serializer.errors)  # <-- THIS
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class RazorpayVerifyPaymentView(APIView):
    permission_classes = [IsAuthenticated] 

    def post(self, request, *args, **kwargs):
        data = request.data
        order_id = data.get('razorpay_order_id')
        payment_id = data.get('razorpay_payment_id')
        signature = data.get('razorpay_signature')

        client = Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

        params_dict = {
            'razorpay_order_id': order_id,
            'razorpay_payment_id': payment_id,
            'razorpay_signature': signature
        }

        try:
            client.utility.verify_payment_signature(params_dict)

            booking = get_object_or_404(bookings, razorpay_order_id=order_id)

            if booking.is_paid:
                return Response({'message': 'Payment already verified'}, status=200)

            booking.razorpay_payment_id = payment_id
            booking.razorpay_signature = signature
            booking.is_paid = True
            booking.save()

            return Response({'message': 'Payment verified successfully'}, status=200)

        except errors.SignatureVerificationError:
            return Response({'error': 'Invalid payment signature'}, status=400)
        except Exception as e:
            return Response({'error': str(e)}, status=500)