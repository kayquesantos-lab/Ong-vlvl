# Guia de Deploy — ONG Vira Lata Vira Luxo

Setup completo para deploy gratuito em produção:

- **Frontend** (Next.js) → Vercel
- **Backend** (Django) → Render
- **Banco** (Postgres) → Neon
- **Fotos** (uploads) → Cloudinary (opcional, recomendado)

> **Tempo total:** ~30 minutos. Tudo gratuito sem cartão de crédito.

---

## 1. Banco de dados — Neon Postgres

Necessário antes de tudo, porque tanto o backend quanto o frontend dependem dele rodando.

1. Acesse https://neon.tech e crie conta com GitHub.
2. Clique em **Create project** → nome `ong-vlvl-prod`, região mais próxima (ex: AWS São Paulo).
3. Na tela do projeto, copie a **Connection string** (formato `postgres://user:pass@host/db`).
4. Guarde essa string — será o `DATABASE_URL`.

**Limites do plano grátis:** 0.5 GB storage, suficiente para anos do projeto.

---

## 2. Backend Django — Render

1. Acesse https://render.com e crie conta com GitHub.
2. Clique em **New +** → **Web Service**.
3. Conecte o repositório do projeto.
4. Configure:
   - **Name:** `ong-vlvl-api`
   - **Region:** São Paulo (Oregon se não tiver SP no free)
   - **Branch:** `develop` (ou `main`)
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt && python manage.py collectstatic --noinput`
   - **Start Command:** `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`
   - **Plan:** Free
5. Em **Environment Variables**, adicione (uma por linha):

```env
SECRET_KEY=<gere com: python -c "import secrets; print(secrets.token_urlsafe(50))">
DEBUG=False
ALLOWED_HOSTS=ong-vlvl-api.onrender.com,localhost
DATABASE_URL=<a string do Neon>
CORS_ALLOWED_ORIGINS=https://ong-vlvl.vercel.app,http://localhost:3000
CSRF_TRUSTED_ORIGINS=https://ong-vlvl.vercel.app,http://localhost:3000
```

> Substitua `ong-vlvl-api.onrender.com` pelo domínio real que o Render der.
> Substitua `ong-vlvl.vercel.app` pelo domínio real que a Vercel der (item 3).

6. Clique em **Create Web Service**. Build leva ~5 min.
7. Após o primeiro deploy bem-sucedido, abra o **Shell** do Render e rode:

```bash
python manage.py migrate
python manage.py createsuperuser
```

8. Teste: `https://ong-vlvl-api.onrender.com/api/docs/` deve abrir o Swagger.

**Atenção — cold start:** o plano grátis do Render dorme após 15 minutos sem requisições. A primeira chamada depois disso demora ~30 segundos. Para evitar: configure um cron-job grátis em https://cron-job.org para pingar `/api/docs/` a cada 14 minutos.

---

## 3. Frontend Next.js — Vercel

1. Acesse https://vercel.com e crie conta com GitHub.
2. Clique em **Add New** → **Project**.
3. Importe o repositório.
4. Configure:
   - **Root Directory:** `frontend`  ← **importante**, projeto é monorepo
   - **Framework Preset:** Next.js (detectado automaticamente)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)
5. Em **Environment Variables**:

```env
NEXT_PUBLIC_API_URL=https://ong-vlvl-api.onrender.com/api
```

> Note o `/api` no final — é o prefixo de todas as rotas Django.

6. Clique em **Deploy**. Build leva ~2 min.
7. Após deploy, abra a URL fornecida (algo como `https://ong-vlvl.vercel.app`).
8. **Volte ao passo 2** e atualize `CORS_ALLOWED_ORIGINS` e `CSRF_TRUSTED_ORIGINS` no Render com o domínio real da Vercel.

---

## 4. Fotos dos animais — Cloudinary (recomendado)

Por padrão, o Django salva uploads em `media/` no disco do servidor. **Problema:** o Render free tem filesystem efêmero — os arquivos somem a cada deploy.

**Solução grátis:** Cloudinary (25 GB / 25k transformações/mês).

1. Crie conta em https://cloudinary.com.
2. No dashboard, copie: **Cloud Name**, **API Key**, **API Secret**.
3. Adicione ao `requirements.txt`:
   ```
   django-cloudinary-storage==0.3.0
   cloudinary==1.41.0
   ```
4. Em `config/settings.py`, adicione no fim:
   ```python
   if not DEBUG:
       INSTALLED_APPS.append('cloudinary_storage')
       INSTALLED_APPS.append('cloudinary')
       DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'
       CLOUDINARY_STORAGE = {
           'CLOUD_NAME': env('CLOUDINARY_CLOUD_NAME'),
           'API_KEY':    env('CLOUDINARY_API_KEY'),
           'API_SECRET': env('CLOUDINARY_API_SECRET'),
       }
   ```
5. No Render, adicione as variáveis `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.

> Sem isso, fotos antigas somem quando o Render reinicia. Para um MVP de demo, pode pular este passo.

---

## 5. Configurar domínio customizado (opcional)

- **Vercel:** Settings → Domains → Add. Aponte o CNAME do seu domínio para `cname.vercel-dns.com`.
- **Render:** Settings → Custom Domain. Aponte o CNAME para o domínio fornecido.

Ambos emitem certificados SSL gratuitos automaticamente.

---

## 6. Checklist de produção

- [ ] `DEBUG=False` no Render
- [ ] `SECRET_KEY` único de produção (não o de dev)
- [ ] `CORS_ALLOWED_ORIGINS` aponta para domínio real da Vercel
- [ ] `NEXT_PUBLIC_API_URL` aponta para domínio real do Render (com `/api`)
- [ ] `python manage.py migrate` rodado no shell do Render
- [ ] `python manage.py createsuperuser` rodado para conta admin
- [ ] Cron-job pingando `/api/docs/` a cada 14 min (anti cold-start)
- [ ] Cloudinary configurado se precisa preservar fotos
- [ ] Tester `/login` → cadastra usuário → admin aprova → acessa portal

---

## 7. Custo total

| Serviço | Plano | Limite | Custo |
|---|---|---|---|
| Neon | Free | 0.5 GB | R$ 0 |
| Render Web | Free | 512 MB RAM, dorme após 15min | R$ 0 |
| Vercel | Hobby | 100 GB bandwidth/mês | R$ 0 |
| Cloudinary | Free | 25 GB storage, 25k transformações | R$ 0 |
| **Total** | | | **R$ 0/mês** |

Se o projeto crescer e precisar manter o Render sempre ativo, o plano **Starter** ($7/mês) elimina o cold start.
