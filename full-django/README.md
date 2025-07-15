# LoveFI - Django implementation

# Project structure

full-django
├── lovefi (project)
│ ├── db.sqlite3
│ ├── lovefi (app)
│ │ ├── admin.py (app)
│ │ ├── apps.py (app)
│ │ ├── asgi.py (project)
│ │ ├── migrations/ (app)
│ │ ├── models.py (app)
│ │ ├── settings.py (project)
│ │ ├── templates/ (app)
│ │ │ └── lovefi/
│ │ ├── tests.py (app)
│ │ ├── urls.py (project)
│ │ ├── views.py (app)
│ │ └── wsgi.py (project)
│ └── manage.py (cli)
├── pyproject.toml
└── scripts/

- the project is called 'lovefi'
- the only app to this date is also called 'lovefi'
- the app could have been named differently to be in a second directory but it was not desired, therefore we configure the app in the same folder as the project
- `settings.py` configures the project
- `manage.py` is the CLI to perform various operations
- `scripts/` holds various shell scripts to perform operations:
  - `runserver.sh` starts the webserver
  - `startapp.sh` creates a new app (requires to specify the app name)
  - `makemigrations.sh` creates the required migration files under `migrations/`
  - `sqlmigrate.sh` shows the SQL for a specific migration
  - `check.sh` checks for any migration problems without applying any
  - `migrate.sh` apply the migrations
  - `createsuperuser.sh` creates a super user to access the admin pages
- `models.py` holds the various data models
- `templates/` holds the templated HTML with Jinja2, which must be under a subdirectory with the app name in case of multiple apps in-use
- `static/` holds staitc files, such as CSS, JavaScript or SVG
- `tests.py` is likely for unit tests
- `urls.py` is the first part of the controler, registering every URL
- `views.py` is the second part of the controler, handling requests, reponses and data

## Tools

- `uv`: package manager, dependency resolver and virtual environments
- `sqlite`: local development database
