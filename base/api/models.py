from django.utils import timezone
from django.db import models
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.base_user import AbstractBaseUser
from .manager import CustomUserManager
from phonenumber_field.modelfields import PhoneNumberField

from django.core.validators import MaxValueValidator, MinValueValidator
from django.core.exceptions import ValidationError

from django.contrib.gis.db import models as mod

from django.utils.timezone import now

# Create your models here.
class User(AbstractBaseUser , PermissionsMixin): # from step 2
    email = models.EmailField(unique=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)
    USERNAME_FIELD = "email"

    objects = CustomUserManager()
    
    def __str__(self):
        return self.email
    

class Profile(models.Model):
    user = models.OneToOneField(User , on_delete= models.CASCADE , related_name='profile')
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=256)
    img = models.ImageField(upload_to = 'uploads/' , null = True );
    phone_number = PhoneNumberField(blank=True)
    # documents = models.FileField(upload_to='uploads/' , null = True)
    # address = models.CharField(max_length=256, null= True)
    city = models.CharField(max_length=256, null= True)
    country = models.CharField(max_length=256, null= True)

    description = models.TextField(null = True , default = 'owner')

    def __str__(self):
        return self.email




class home(mod.Model):
    owner = mod.ForeignKey(User , on_delete= mod.CASCADE , related_name='owner')
    choices = [
        ('cabins', 'Cabins'),
        ('icons', 'Icons'),
        ('amazing views' , 'Amazing views'),
        ('beachfront','Beachfront'),
        ('skiing','Skiing'),
        ('container','Containers'),
        ('treehouses', 'Treehouses'),
        ('mansions','Mansions'),
        ('tiny homes', 'Tiny Homes'),
        ('amazing pools' , 'Amazing pools'),
        ('play', 'Play'),
        ('countryside','CountrySide'),
        ('farms' , 'Farms'),
        ('camping', 'Camping'),
        ('rooms','Rooms')

    ] 


    types_of_property = mod.CharField(max_length= 200 , choices = choices , default = 'random')
    total_number_of_guest = mod.IntegerField(validators=[MinValueValidator(1),MaxValueValidator(2000)], default = 2)
    base_price = mod.FloatField(default = 2000)
    name = mod.CharField(max_length=100)
    location = mod.PointField()
    address = mod.CharField(max_length=100)
    country = mod.CharField(max_length=100)
    city = mod.CharField(max_length=50)
    images = mod.ImageField(upload_to='uploads/', null = True)
    description = mod.TextField(max_length=256)

    airconditioner = mod.BooleanField(default = False , null=True)
    heating = mod.BooleanField(default = False , null=True)
    wifi = mod.BooleanField(default = False , null=True)
    fireext = mod.BooleanField(default = False , null=True)
    roomservices = mod.BooleanField(default = False , null=True)
    freeparking = mod.BooleanField(default = False , null=True)
    smokealarm = mod.BooleanField(default = False , null=True)
    exteriorcam = mod.BooleanField(default = False , null=True)
    fridge = mod.BooleanField(default = False , null=True)
    microwave = mod.BooleanField(default = False , null=True)

    def __str__(self):
        return self.name
    
class homeImage(models.Model):
    home = models.ForeignKey(home, null = True, on_delete= models.CASCADE , related_name='home')
    images = models.ImageField(upload_to='uploads/', null = True)

    def __str__(self):
        return self.home.name
    
class ProfileImage(models.Model):
    profile = models.ForeignKey(Profile, null = True, on_delete= models.CASCADE , related_name='profile')
    images = models.ImageField(upload_to='uploads/', null = True)

    def __str__(self):
        return self.profile.email
    

    
class bookings(models.Model):
    guest = models.ForeignKey(User, on_delete=models.CASCADE , related_name='customer')
    home = models.ForeignKey(home, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10,decimal_places=2 , null=True)

    start_date = models.DateField()
    end_date = models.DateField()

    number_of_guests = models.IntegerField(validators=[MinValueValidator(1)] , default=1)

    # Razorpay fields
    razorpay_order_id = models.CharField(max_length=100, blank=True, null=True)
    razorpay_payment_id = models.CharField(max_length=100, blank=True, null=True)
    razorpay_signature = models.CharField(max_length=255, blank=True, null=True)


    is_paid = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True , null =True)


    class Meta:
        unique_together = ('home', 'start_date' , 'end_date')

    def clean(self):

        if self.number_of_guests > self.home.total_number_of_guest:
            raise ValidationError(
                f"Number of guests cannot exceed the allowed limit of {self.home.total_number_of_guest}."
            )
        if self.start_date > self.end_date:
            raise ValidationError("Start date cannot be after end date.")
        
        if self.start_date < now().date():
            raise ValidationError("Start date cannot be in the past.")
        

        overlapping = bookings.objects.filter(
            home=self.home,
            end_date__gte=self.start_date,
            start_date__lte=self.end_date
        ).exclude(id=self.id)



        if overlapping.exists():
            raise ValidationError("This home is already booked during the selected dates.")
        
    
    def total_amount(self):
        nodays =  (self.end_date - self.start_date).days + 1
        return self.home.base_price*nodays*self.number_of_guests
    

    def save(self, *args, **kwargs):
        self.full_clean()  # to trigger `clean()` validation
        self.amount = self.total_amount()
        super().save(*args, **kwargs)
    




class reviews(models.Model):
    guest = models.ForeignKey(User , on_delete=models.CASCADE)
    home = models.ForeignKey(home , on_delete=models.CASCADE)
    review = models.TextField(max_length= 240)
    rating = models.IntegerField(validators=[MinValueValidator(1),MaxValueValidator(5)])
    created_at = models.DateTimeField(auto_now_add=True)


    class Meta:
        unique_together = ('guest' , 'home')

    def __str__(self):
        return self.review
    
class Favorite(models.Model):
    guest = models.ForeignKey(User , on_delete=models.CASCADE)
    home = models.ForeignKey(home , on_delete=models.CASCADE)

    class Meta:
        unique_together = ('guest' , 'home')
