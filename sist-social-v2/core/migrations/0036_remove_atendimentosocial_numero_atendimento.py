# Generated manually on 2026-08-21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0035_alter_atendimentosocial_modalidade'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='atendimentosocial',
            name='numero_atendimento',
        ),
    ]
