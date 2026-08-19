#!/bin/sh
set -e

echo "Instalando/Atualizando dependências do requirements.txt..."
pip install -r requirements.txt


# Executa as migrations, popular dados e collectstatic sempre na inicialização
if [ -f manage.py ]; then
  echo "Running migrations..."
  python manage.py migrate --noinput || true
  echo "Populating default data (admin, etc)..."
  python manage.py popular_dados || true
  echo "Collecting static files..."
  python manage.py collectstatic --noinput || true
else
  echo "manage.py not found, skipping migrations"
fi


exec "$@"
