from django.db import migrations, models


def marcar_encaminhamentos_pendentes(apps, schema_editor):
    AtendimentoSocial = apps.get_model('core', 'AtendimentoSocial')
    AtendimentoSocial.objects.filter(
        origem_atendimento__isnull=False,
        status='Aberto',
    ).update(status='Esperando para ser aberto')


class Migration(migrations.Migration):
    dependencies = [
        ('core', '0037_alter_atendimentosocial_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='atendimentosocial',
            name='status',
            field=models.CharField(
                choices=[
                    ('Aberto', 'Aberto'),
                    ('Finalizado', 'Finalizado'),
                    ('Encaminhado', 'Encaminhado'),
                    ('Esperando para ser aberto', 'Esperando para ser aberto'),
                    ('Encaminhamento Tecnico', 'Encaminhamento Técnico'),
                    ('Encaminhamento Interno', 'Encaminhamento Interno'),
                ],
                default='Aberto',
                max_length=30,
                verbose_name='Status do Atendimento',
            ),
        ),
        migrations.RunPython(marcar_encaminhamentos_pendentes, migrations.RunPython.noop),
    ]
