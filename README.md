# 🐾 ONG Vira Lata Vira Luxo — Portal de Gestão

Sistema de gestão de animais resgatados para a ONG Vira Lata Vira Luxo. Permite cadastrar, listar, editar e excluir animais, controlar status (abrigo, adotado, lar temporário, etc), upload de fotos e gerenciamento de usuários com autenticação JWT.

---

## 🛠 Tecnologias utilizadas

**Backend**
- Python 3.11+
- Django 6.0
- Django REST Framework
- SimpleJWT (autenticação JWT)
- PostgreSQL
- django-environ, django-cors-headers, django-filter
- Pillow (upload de imagens)
- drf-spectacular (Swagger)
- Whitenoise (arquivos estáticos)

**Frontend**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Axios
- js-cookie
- Tailwind CSS

---

## ✅ Pré-requisitos

Antes de começar, instale:

| Ferramenta | Link |
|---|---|
| Python 3.11+ | https://python.org |
| Node.js 18+ | https://nodejs.org |
| PostgreSQL | https://postgresql.org |
| Git | https://git-scm.com |

---

## 🚀 Como rodar o projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/Ong-vlvl.git
cd Ong-vlvl
```

---

### 2. Criar o banco de dados

Abra o **pgAdmin** e crie um banco com o nome `ong_vlvl`.

---

### 3. Criar o arquivo `.env`

O arquivo `.env` não vai junto com o repositório por segurança. Crie-o manualmente na raiz do projeto (mesma pasta que o `manage.py`):

**Windows (PowerShell):**
```bash
New-Item .env
```

Cole o seguinte conteúdo e ajuste com suas credenciais:

```env
SECRET_KEY=cole-sua-chave-secreta-aqui
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=postgres://postgres:SUA_SENHA@localhost:5432/ong_vlvl
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

Para gerar uma `SECRET_KEY` segura:

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

---

### 4. Configurar o backend

```bash
# Criar o ambiente virtual
python -m venv venv

# Ativar o ambiente virtual (Windows)
venv\Scripts\activate

# Instalar as dependências
pip install -r requirements.txt

# Rodar as migrations
python manage.py migrate

# Criar o superusuário (para acessar o sistema)
python manage.py createsuperuser

# Iniciar o servidor backend
python manage.py runserver
```

O backend estará disponível em `http://localhost:8000`.

---

### 5. Configurar o frontend

Abra um **novo terminal** e execute:

```bash
cd frontend

# Instalar as dependências
npm install

# Iniciar o servidor frontend
npm run dev
```

O frontend estará disponível em `http://localhost:3000`.

---

## 🌐 URLs do sistema

| URL | Descrição |
|---|---|
| `http://localhost:3000/login` | Tela de login |
| `http://localhost:3000/cadastro` | Tela de cadastro de usuário |
| `http://localhost:3000/animais` | Portal de gestão de animais |
| `http://localhost:8000/admin/` | Painel administrativo Django |
| `http://localhost:8000/api/docs/` | Documentação Swagger da API |

---

## 📁 Estrutura do projeto

```
Ong-vlvl/
├── .env                        # Variáveis de ambiente (não sobe para o Git)
├── .gitignore
├── manage.py
├── requirements.txt
├── config/
│   ├── settings.py
│   └── urls.py
├── animais/                    # App de gestão de animais
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
├── usuarios/                   # App de usuários customizados
│   ├── models.py
│   ├── views.py
│   └── urls.py
├── saude/                      # App de saúde dos animais
├── financeiro/                 # App de controle financeiro
└── frontend/                   # Aplicação Next.js
    ├── public/
    │   └── logo.png
    ├── app/
    │   ├── login/page.tsx
    │   ├── cadastro/page.tsx
    │   └── animais/page.tsx
    ├── lib/
    │   ├── api.ts              # Axios + interceptors JWT
    │   └── auth.ts             # login, logout, isAuthenticated
    └── middleware.ts           # Proteção de rotas
```

---

## 🔐 Autenticação

O sistema usa **JWT (JSON Web Token)** com SimpleJWT.

- O token de acesso expira em **60 minutos**
- O token de refresh expira em **7 dias** e é renovado automaticamente
- Os tokens são armazenados em cookies de sessão (apagados ao fechar o navegador)

**Endpoints de autenticação:**

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/api/token/` | Login — retorna access e refresh token |
| POST | `/api/token/refresh/` | Renova o access token |
| POST | `/api/usuarios/cadastrar/` | Cadastra novo usuário |

---

## 🐾 Endpoints de Animais

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/api/animais/` | Lista todos os animais |
| POST | `/api/animais/` | Cadastra um novo animal |
| GET | `/api/animais/{id}/` | Detalhes de um animal |
| PUT | `/api/animais/{id}/` | Atualiza um animal |
| DELETE | `/api/animais/{id}/` | Remove um animal |

**Filtros disponíveis:** `?status=NO_ABRIGO`, `?sexo=M`, `?porte=MEDIO`, `?search=nome`

**Status disponíveis:**

| Valor | Descrição |
|---|---|
| `NO_ABRIGO` | Animal está no abrigo |
| `ADOTADO` | Animal foi adotado |
| `LT` | Lar temporário |
| `DESAPARECIDO` | Animal desaparecido |
| `FALECIDO` | Animal falecido |

---

## 🗃 Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `SECRET_KEY` | Chave secreta do Django |
| `DEBUG` | `True` em desenvolvimento, `False` em produção |
| `ALLOWED_HOSTS` | Hosts permitidos |
| `DATABASE_URL` | URL de conexão com o PostgreSQL |
| `CORS_ALLOWED_ORIGINS` | Origens permitidas pelo CORS |

---

## 📦 Comandos úteis

```bash
# Ativar ambiente virtual (Windows)
venv\Scripts\activate

# Rodar migrations após alterar models
python manage.py makemigrations
python manage.py migrate

# Criar superusuário
python manage.py createsuperuser

# Rodar os testes
pytest

# Ver cobertura de testes
pytest --cov
```

---

## 👥 Contribuindo

1. Crie uma branch a partir da `main`:
```bash
git checkout -b feature/nome-da-feature
```

2. Faça suas alterações e commit:
```bash
git add .
git commit -m "feat: descrição da feature"
```

3. Suba a branch:
```bash
git push origin feature/nome-da-feature
```

4. Abra um **Pull Request** no GitHub apontando para a `main`.

---

## 📄 Licença

Projeto desenvolvido para uso interno da ONG Vira Lata Vira Luxo.
