from .base import *


SECRET_KEY = 'DEV'

DEBUG = True

HOSTNAME = 'http://localhost:8000'

ALLOWED_HOSTS = ['*']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'forms',
        'USER': 'postgres',
        'PASSWORD': 'postgres',
        'HOST': '127.0.0.1',
        'PORT': '5432',
    }
}

TIME_ZONE = 'America/Mexico_City'
