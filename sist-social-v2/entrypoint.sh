#!/bin/sh
set -e

# If RUN_MIGRATIONS is set, try to run migrations and collectstatic (safe-guarded)
if [ "${RUN_MIGRATIONS:-0}" = "1" ]; then
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
fi

exec "$@"
