from django.urls import path

from . import views

urlpatterns = [
    path('get_openid_session_key', views.get_openid_session_key, name='get_openid_session_key'),
    path('check_token', views.check_token, name='check_token'),
    path('getUserInfo', views.getUserInfo, name='getUserInfo'),
    path('setPassword', views.setPassword, name='setPassword'),
    path('addSuggest', views.addSuggest, name='addSuggest'),
    path('return_qiniu_upload_token', views.return_qiniu_upload_token, name='return_qiniu_upload_token'),
    # path('getData', views.getData, name='getData'),
    path('returnSuggestList', views.returnSuggestList, name='returnSuggestList'),
    # path('returnResourceList', views.returnResourceList, name='returnResourceList'),
    path('dataDownload', views.dataDownload, name='dataDownload'),
    path('returnFileListToStaff', views.returnFileListToStaff, name='returnFileListToStaff'),
    path('getApplyData', views.getApplyData, name='getApplyData'),
    path('returnApplyStatus', views.returnApplyStatus, name='returnApplyStatus'),
    path('postApplicationListToAdminToSign', views.postApplicationListToAdminToSign,
         name='postApplicationListToAdminToSign'),
    path('postPublicityList', views.postPublicityList, name='postPublicityList'),
    path('bossSign', views.bossSign, name='bossSign'),
    path('bossCheck', views.bossCheck, name='bossCheck'),
    path('getAdminPassword', views.getAdminPassword, name='getAdminPassword'),


    path('returnDisclosureInfo', views.returnDisclosureInfo, name='returnDisclosureInfo'),
    path('setDisclosureObject', views.setDisclosureObject, name='setDisclosureObject'),
    path('returnDataDisclosure', views.returnDataDisclosure, name='returnDataDisclosure'),
    path('setHighDiskArea', views.setHighDiskArea, name='setHighDiskArea'),
    path('setLowDiskArea', views.setLowDiskArea, name='setLowDiskArea'),
    path('setUserPassingArea', views.setUserPassingArea, name='setUserPassingArea'),
    path('getUserPassingArea', views.getUserPassingArea, name='getUserPassingArea'),
    # path('getInformationDisclosure', views.getInformationDisclosure, name='getInformationDisclosure'),
    # path('returnInformationDisclosure', views.returnInformationDisclosure, name='returnInformationDisclosure'),
    # path('getOwnList', views.getOwnList, name='getOwnList'),
    path('getOwnSuggestList', views.getOwnSuggestList, name='getOwnSuggestList'),
    # path('getResourceUpList', views.getResourceUpList, name='getResourceUpList'),
    path('getResourceDownList', views.getResourceDownList, name='getResourceDownList'),
    # path('getDownloaderList', views.getDownloaderList, name='getDownloaderList'),
]
