from django.db import migrations

def migrar_enderecos_para_domicilios(apps, schema_editor):
    FamiliaDomicilio = apps.get_model('core', 'FamiliaDomicilio')
    Domicilio = apps.get_model('core', 'Domicilio')

    for familia in FamiliaDomicilio.objects.all():
        # Apenas cria se a família tiver algum dado de endereço preenchido
        tem_endereco = any([
            familia.logradouro_nome,
            familia.logradouro_cep,
            familia.bairro,
            familia.cidade
        ])
        
        if tem_endereco:
            domicilio = Domicilio.objects.create(
                logradouro_cep=familia.logradouro_cep,
                logradouro_nome=familia.logradouro_nome,
                logradouro_numero=familia.logradouro_numero,
                logradouro_complemento=familia.logradouro_complemento,
                bairro=familia.bairro,
                cidade=familia.cidade,
                estado=familia.estado,
                latitude=familia.latitude,
                longitude=familia.longitude,
                complemento_adicional_endereco=familia.complemento_adicional_endereco,
                referencia_para_localizacao=familia.referencia_para_localizacao,
                tipo_especie_domicilio=familia.tipo_especie_domicilio,
                tipo_residencia=familia.tipo_residencia,
                tipo_piso_domicilio=familia.tipo_piso_domicilio,
                tipo_construcao_domicilio=familia.tipo_construcao_domicilio,
                tipo_iluminacao_domicilio=familia.tipo_iluminacao_domicilio,
                agua_canalizada=familia.agua_canalizada,
                tipo_abastecimento_agua=familia.tipo_abastecimento_agua,
                possue_banheiro=familia.possue_banheiro,
                tipo_escoamento_sanitario=familia.tipo_escoamento_sanitario,
                tipo_coleta_lixo=familia.tipo_coleta_lixo,
                calcamento_na_frente_domicilio=familia.calcamento_na_frente_domicilio,
                area_dificil_acesso=familia.area_dificil_acesso,
                tipo_acessibilidade_domicilio=familia.tipo_acessibilidade_domicilio,
                tipo_animal=familia.tipo_animal,
                ativo=True
            )
            familia.domicilio = domicilio
            familia.save(update_fields=['domicilio'])

def reverter_migracao_enderecos(apps, schema_editor):
    FamiliaDomicilio = apps.get_model('core', 'FamiliaDomicilio')
    
    for familia in FamiliaDomicilio.objects.all():
        if familia.domicilio:
            dom = familia.domicilio
            familia.logradouro_cep = dom.logradouro_cep
            familia.logradouro_nome = dom.logradouro_nome
            familia.logradouro_numero = dom.logradouro_numero
            familia.logradouro_complemento = dom.logradouro_complemento
            familia.bairro = dom.bairro
            familia.cidade = dom.cidade
            familia.estado = dom.estado
            familia.latitude = dom.latitude
            familia.longitude = dom.longitude
            familia.complemento_adicional_endereco = dom.complemento_adicional_endereco
            familia.referencia_para_localizacao = dom.referencia_para_localizacao
            familia.tipo_especie_domicilio = dom.tipo_especie_domicilio
            familia.tipo_residencia = dom.tipo_residencia
            familia.tipo_piso_domicilio = dom.tipo_piso_domicilio
            familia.tipo_construcao_domicilio = dom.tipo_construcao_domicilio
            familia.tipo_iluminacao_domicilio = dom.tipo_iluminacao_domicilio
            familia.agua_canalizada = dom.agua_canalizada
            familia.tipo_abastecimento_agua = dom.tipo_abastecimento_agua
            familia.possue_banheiro = dom.possue_banheiro
            familia.tipo_escoamento_sanitario = dom.tipo_escoamento_sanitario
            familia.tipo_coleta_lixo = dom.tipo_coleta_lixo
            familia.calcamento_na_frente_domicilio = dom.calcamento_na_frente_domicilio
            familia.area_dificil_acesso = dom.area_dificil_acesso
            familia.tipo_acessibilidade_domicilio = dom.tipo_acessibilidade_domicilio
            familia.tipo_animal = dom.tipo_animal
            
            familia.domicilio = None
            familia.save()

class Migration(migrations.Migration):

    dependencies = [
        ('core', '0027_domicilio_familiadomicilio_domicilio'),
    ]

    operations = [
        migrations.RunPython(migrar_enderecos_para_domicilios, reverter_migracao_enderecos),
    ]
