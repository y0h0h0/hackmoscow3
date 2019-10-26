## Moscow.Hack v3 / Edu Crunch

Для начала кладем `keychain.yml` в `server/app/`.
Чтобы локально поднять сервак (Nginx + uwsgi + Flask):
```bash
cd server
docker-compose up
``` 

**Статика** в папке `/server/app/static`. Раздается как `host/static/file` или просто `host/file`.
