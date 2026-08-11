from apps.sist_central.services.login_service import obter_menu_sistema
from django.conf import settings

def menu_lateral(request):
    if request.session.get('usuarioLogado') and request.session.get('idUsuario'):
        menu = obter_menu_sistema(request.session['idUsuario'])
        return {'menu_lateral': menu}
    return {'menu_lateral': []}

def google_api_key(request):
    return {'GOOGLE_API_KEY': settings.GOOGLE_API_KEY}
