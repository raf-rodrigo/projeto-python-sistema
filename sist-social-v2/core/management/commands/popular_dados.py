from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Popula o banco de dados com dados padrão iniciais (Ex: Administrador adm)'

    def handle(self, *args, **options):
        self.stdout.write("Inicializando população de dados padrão...")

        # 1. Criar Superusuário Administrador Padrao
        username = 'adm'
        password = 'adm123'
        email = 'adm@sistsocial.com'

        if not User.objects.filter(username=username).exists():
            self.stdout.write(f"Criando superusuário '{username}'...")
            User.objects.create_superuser(
                username=username,
                email=email,
                password=password
            )
            self.stdout.write(self.style.SUCCESS(f"Superusuário '{username}' criado com sucesso!"))
        else:
            self.stdout.write(self.style.WARNING(f"Superusuário '{username}' já existe. Ignorado."))

        # Aqui podemos adicionar mais populações no futuro:
        # Ex: popular dados a partir de CSVs
        # self.popular_unidades_de_csv()

        self.stdout.write(self.style.SUCCESS("População de dados finalizada."))
