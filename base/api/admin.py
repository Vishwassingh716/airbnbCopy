from django.contrib import admin
from .models import *
# Register your models here.

from django.contrib.gis.admin import GISModelAdmin
from .models import home

@admin.register(home)
class propertAdmin(GISModelAdmin):
    list_display = ('name', 'location')

admin.site.register(Profile)
admin.site.register(User)
admin.site.register(homeImage)
# admin.site.register(bookings)
admin.site.register(reviews)
admin.site.register(ProfileImage)
admin.site.register(Favorite)

@admin.register(bookings)
class BookingAdmin(admin.ModelAdmin):
    # list_display = ('id', 'home', 'guest', 'created_at')
    readonly_fields = ('razorpay_order_id','razorpay_payment_id','razorpay_signature','created_at')