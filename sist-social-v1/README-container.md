# Como usar os containers para iniciar um projeto Django

Esses arquivos criam um ambiente mínimo com `web` (Python) e `db` (Postgres). Você pode criar o projeto Django manualmente dentro do container e rodar o servidor quando quiser.

Passos rápidos:

1. Copie `.env.example` para `.env` e ajuste se necessário:

```bash
cp .env.example .env
```

2. Build e start dos containers:

```bash
docker compose up -d --build
```

3. Abrir um shell no container `web` para criar o projeto Django (os arquivos ficam mapeados no host porque usamos volume `.:/app`):

```bash
docker compose exec web bash
# dentro do container
django-admin startproject mysite .
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 0.0.0.0:8000
```

4. Alternativamente, use o host para executar comandos dentro do container:

```bash
docker compose exec web django-admin startproject mysite .
docker compose exec web python manage.py migrate
docker compose exec web python manage.py createsuperuser
docker compose exec web python manage.py runserver 0.0.0.0:8000
```

Observação: o `entrypoint.sh` tem um comportamento opcional de rodar migrations/collectstatic quando `RUN_MIGRATIONS=1` no `.env`.
