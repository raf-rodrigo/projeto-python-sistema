import os
import environ
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env(
    DEBUG=(bool, False)
)

environ.Env.read_env(BASE_DIR / '.env')

SECRET_KEY = env('SECRET_KEY', default='changeme-in-production')

DEBUG = env('DEBUG', default=False)

ALLOWED_HOSTS = env.list(
    'ALLOWED_HOSTS',
    default=['localhost', '127.0.0.1', 'web']
)

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'apps.sist_social',
    'apps.sist_central',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            BASE_DIR / 'templates',
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'apps.sist_central.context_processors.menu_lateral',
                'apps.sist_central.context_processors.google_api_key',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': env('MYSQL_DATABASE', default='sist_social'),
        'USER': env('MYSQL_USER', default='sist_user'),
        'PASSWORD': env('MYSQL_PASSWORD', default='sist_password'),
        'HOST': env('MYSQL_HOST', default='db'),
        'PORT': env('MYSQL_PORT', default='3308'),
        'OPTIONS': {
            'charset': 'utf8mb4',
        },
    },
    'sist_central': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': env('MYSQL_CENTRAL_DATABASE', default='sist_central'),
        'USER': env('MYSQL_USER', default='sist_user'),
        'PASSWORD': env('MYSQL_PASSWORD', default='sist_password'),
        'HOST': env('MYSQL_HOST', default='db'),
        'PORT': env('MYSQL_PORT', default='3308'),
        'OPTIONS': {
        'charset': 'utf8mb4',
        },
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'pt-br'

TIME_ZONE = 'America/Sao_Paulo'

USE_I18N = True

USE_TZ = True

STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

STATICFILES_DIRS = [
    BASE_DIR / 'static',
]

MEDIA_URL = 'media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

GOOGLE_API_KEY = env('GOOGLE_API_KEY', default='')