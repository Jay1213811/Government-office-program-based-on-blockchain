from django.contrib import admin
from user.models import User, Suggest, OfficeFile, Office, OfficeMember, DataDisclosure


# Register your models here.

"""class InformationDisclosureAdmin(admin.ModelAdmin):
    fields = ('info4', 'info5', 'target1', 'target2', 'target3')"""


admin.site.register(User)
admin.site.register(Suggest)
admin.site.register(OfficeFile)
admin.site.register(Office)
admin.site.register(OfficeMember)
admin.site.register(DataDisclosure)
# admin.site.register(Data)
# admin.site.register(DownloadRecord)
# admin.site.register(InformationDisclosure, InformationDisclosureAdmin)
