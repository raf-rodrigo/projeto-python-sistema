import os
import time
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.db import connections
from PIL import Image

from apps.sist_central.models.ImagensParametrizacao import ImagensParametrizacao

IMAGES_CONFIG = [
    {
        'tipo': 'login',
        'title': 'Imagem da Tela de Login',
        'desc': 'Logotipo exibido centralizado na caixa de login (.png/.jpg)',
        'id_input': 'imagem_login'
    },
    {
        'tipo': 'background_login',
        'title': 'Fundo da Tela de Login',
        'desc': 'Imagem de plano de fundo da tela de login (.png/.jpg)',
        'id_input': 'background_login'
    },
    {
        'tipo': 'recuperacao',
        'title': 'Imagem de Recuperação de Senha',
        'desc': 'Logotipo exibido na tela de alteração/recuperação de senha (.png/.jpg)',
        'id_input': 'recuperacao'
    },
    {
        'tipo': 'rodape',
        'title': 'Imagem de Rodapé',
        'desc': 'Logotipo secundário exibido no rodapé da página (.png/.jpg)',
        'id_input': 'rodape'
    },
    {
        'tipo': 'background_bem_vindo',
        'title': 'Fundo da Tela de Boas-Vindas',
        'desc': 'Plano de fundo da tela inicial de boas-vindas (.png/.jpg)',
        'id_input': 'background_bem_vindo'
    },
    {
        'tipo': 'bem_vindo_um',
        'title': 'Imagem de Boas-Vindas 1',
        'desc': 'Primeira imagem ilustrativa da tela inicial (.png/.jpg)',
        'id_input': 'bem_vindo_um'
    },
    {
        'tipo': 'bem_vindo_dois',
        'title': 'Imagem de Boas-Vindas 2',
        'desc': 'Segunda imagem ilustrativa da tela inicial (.png/.jpg)',
        'id_input': 'bem_vindo_dois'
    },
    {
        'tipo': 'relatorio',
        'title': 'Brasão para Relatórios',
        'desc': 'Logotipo oficial do município exibido nos cabeçalhos de relatórios (.png/.jpg)',
        'id_input': 'relatorio'
    },
]

def list_images(request):
    """
    Renders the image parametrization page list of cards.
    """
    if not request.session.get('usuarioLogado'):
        return redirect('login')
        
    db_images = {img.tipo: img.caminho for img in ImagensParametrizacao.objects.using('sist_central').all()}
    
    cards = []
    for config in IMAGES_CONFIG:
        tipo = config['tipo']
        db_path = db_images.get(tipo, '')
        
        if db_path:
            url = f"/media/{db_path}" if not db_path.startswith('/') else db_path
            # Thumbnail is located under thumbs/ subfolder
            filename = os.path.basename(db_path)
            thumb_url = f"/media/uploads/imagens/thumbs/{filename}"
        else:
            url = ''
            thumb_url = ''
            
        cards.append({
            'tipo': tipo,
            'title': config['title'],
            'desc': config['desc'],
            'id_input': config['id_input'],
            'url': url,
            'thumb_url': thumb_url
        })
        
    return render(request, 'sist_central/Imagens/listar.html', {'cards': cards})


@csrf_exempt
def upload_image(request):
    """
    Receives and processes uploaded images. Saves the thumbnail using Pillow
    and updates the path reference in the database.
    """
    if not request.session.get('usuarioLogado'):
        return JsonResponse({'success': False, 'message': 'Não autorizado.'}, status=401)
        
    if request.method != 'POST':
        return JsonResponse({'success': False, 'message': 'Método inválido.'}, status=405)
        
    tipo = request.POST.get('tipo')
    if not tipo:
        return JsonResponse({'success': False, 'message': 'Tipo de imagem não informado.'}, status=400)
        
    config_match = None
    for config in IMAGES_CONFIG:
        if config['tipo'] == tipo:
            config_match = config
            break
            
    if not config_match:
        return JsonResponse({'success': False, 'message': 'Tipo de imagem inválido.'}, status=400)
        
    file_obj = request.FILES.get(config_match['id_input'])
    if not file_obj:
        return JsonResponse({'success': False, 'message': 'Arquivo não enviado.'}, status=400)
        
    ext = os.path.splitext(file_obj.name)[1].lower()
    if ext not in ['.png', '.jpg', '.jpeg']:
        return JsonResponse({'success': False, 'message': 'Formato inválido. Apenas .png, .jpg ou .jpeg são permitidos.'}, status=400)
        
    # Create target directories under Django settings MEDIA_ROOT
    imagens_dir = os.path.join(settings.MEDIA_ROOT, 'uploads', 'imagens')
    thumbs_dir = os.path.join(imagens_dir, 'thumbs')
    os.makedirs(thumbs_dir, exist_ok=True)
    
    file_name = f"{tipo}_image_{int(time.time())}{ext}"
    file_path = os.path.join(imagens_dir, file_name)
    
    # Save file chunks
    with open(file_path, 'wb+') as destination:
        for chunk in file_obj.chunks():
            destination.write(chunk)
            
    # Generate thumbnail using Pillow
    thumb_path = os.path.join(thumbs_dir, file_name)
    try:
        with Image.open(file_path) as img:
            img.thumbnail((100, 100))
            img.save(thumb_path)
    except Exception as e:
        return JsonResponse({'success': False, 'message': f'Erro ao gerar miniatura: {str(e)}'}, status=500)
        
    # Save the relative path in the central DB
    db_relative_path = f"uploads/imagens/{file_name}"
    try:
        ImagensParametrizacao.objects.using('sist_central').update_or_create(
            tipo=tipo,
            defaults={'caminho': db_relative_path}
        )
        
        # If type is relatorio, update configuracoes table
        if tipo == 'relatorio':
            with connections['sist_central'].cursor() as cursor:
                cursor.execute(
                    "UPDATE configuracoes SET valor = %s WHERE chave = 'IMAGEM_RELATORIO'",
                    [f"/media/{db_relative_path}"]
                )
    except Exception as e:
        return JsonResponse({'success': False, 'message': f'Erro ao atualizar o banco de dados: {str(e)}'}, status=500)
        
    return JsonResponse({
        'success': True,
        'url': f"/media/{db_relative_path}",
        'thumb_url': f"/media/uploads/imagens/thumbs/{file_name}"
    })
