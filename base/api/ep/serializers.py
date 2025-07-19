from django.contrib.auth import get_user_model
from rest_framework.serializers import ModelSerializer , Serializer
from rest_framework import serializers 
from rest_framework_gis.serializers import GeoFeatureModelSerializer

from api.models import *

# Create Razorpay order
from razorpay import Client
from django.conf import settings



from rest_framework import serializers

from django.utils.timezone import now




UserModel = get_user_model()

class UserRegistrationSerializer(ModelSerializer):
    class Meta:
        model = UserModel
        fields = ['email', 'password']

    def create(self, validated_data):
        user_obj = UserModel.objects.create_user(email=validated_data['email'] , password = validated_data['password'])
        user_obj.save()
        return user_obj

class ProfileSerializer(ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'
        read_only_fields = ['user'] 

class ProfileImageSerializer(ModelSerializer):
    class Meta:
        model = ProfileImage
        fields = "__all__"
        


class HomeSerializer(GeoFeatureModelSerializer):

    # images = serializers.SerializerMethodField()
    class Meta:
        model = home
        fields = "__all__"
        geo_field = 'location'

    owner = serializers.ReadOnlyField(source='owner.id')

    def create(self, validated_data):
        # Attach the owner to the home instance
        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)
    
    def to_representation(self, instance):
        # Use the parent method to get the default GeoJSON-style dict
        representation = super().to_representation(instance)

        # Extract and regroup the boolean fields under "entities"
        properties = representation.get("properties", {})
        entity_fields = [
            "airconditioner", "heating", "wifi", "fireext",
            "roomservices", "freeparking", "smokealarm",
            "exteriorcam", "fridge", "microwave"
        ]
        
        entities = {field: properties.pop(field, False) for field in entity_fields}
        properties["entities"] = entities
        representation["properties"] = properties
        return representation
    
    def get_images(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.images.url) if obj.images else None



# class BookingSerializer(ModelSerializer):
#     class Meta:
#         model = bookings
#         fields = "__all__"
    


class BookingSerializer(serializers.ModelSerializer):
    guest_email = serializers.EmailField(source='guest.profile.email', read_only=True)
    home_name = serializers.CharField(source='home.name', read_only=True)
    class Meta:
        model = bookings
        fields = '__all__'
        read_only_fields = [
            'amount',
            'razorpay_order_id',
            'razorpay_payment_id',
            'razorpay_signature',
            'is_paid',
            
        ]

    def validate(self, data):
        start = data['start_date']
        end = data['end_date']
        home = data['home']

        if start > end:
            raise serializers.ValidationError("Start date must be before end date.")

        if start < now().date():
            raise serializers.ValidationError("Start date cannot be in the past.")

        overlapping = bookings.objects.filter(
            home=home,
            end_date__gte=start,
            start_date__lte=end
        )

        if self.instance:
            overlapping = overlapping.exclude(pk=self.instance.pk)

        if overlapping.exists():
            raise serializers.ValidationError("Home is already booked for these dates.")

        return data

    def create(self, validated_data):
        booking = bookings(**validated_data)
        booking.amount = booking.total_amount()

        # Razorpay integration
        client = Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        order = client.order.create({
            'amount': int(booking.amount * 100),
            'currency': 'INR',
            'payment_capture': 1
        })

        booking.razorpay_order_id = order['id']
        booking.save()
        return booking


class HomeImageSerializer(ModelSerializer):
    class Meta:
        model = homeImage
        fields = "__all__"


class ReviewSerializer(ModelSerializer):

    user_email = serializers.ReadOnlyField(source='guest.profile.email')
    imgg = serializers.ReadOnlyField(source='guest.profile.img.url')
    timenow = serializers.ReadOnlyField(source='created_at')

    class Meta:
        model = reviews
        fields = ['id', 'home' , 'review' , 'rating' , 'user_email', 'guest' , 'imgg' , 'timenow'] 







class FavoriteSerializer(ModelSerializer):
    class Meta:
        model = Favorite
        fields = "__all__"
    