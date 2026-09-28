# Universal Web Scraper

A professional full-stack web scraping application built with Python, FastAPI, React, and PostgreSQL.

The application accepts a website URL, extracts structured web content, stores the scraped information in PostgreSQL, and provides APIs and a web interface for managing the stored data.

---

## Features

### Web Scraping

- Accepts a website URL dynamically.
- Uses `requests` and `BeautifulSoup` for HTTP-based scraping.
- Uses Playwright as a browser-based fallback for dynamically rendered pages.
- Extracts:
  - Page title
  - Headings
  - Paragraphs
  - Links

### Database

- PostgreSQL database.
- Structured storage using JSONB for headings, paragraphs, and links.
- Repository pattern for database operations.

### CRUD APIs

The application provides:

- Create record
- Read all records
- Read record by ID
- Update record
- Delete record

### Schema APIs

The application provides APIs to:

- List database tables.
- View table columns.
- View data types.
- View nullable information.
- View column defaults.

### CSV Export

Two CSV export options are available:

1. Python command-line CSV generation script.
2. CSV download through the frontend.

### Frontend

The React frontend provides:

- Dashboard
- Website scraping interface
- Scraped data management
- Search
- Record details
- Record editing
- Record deletion
- Database schema viewer
- CSV export

---

# Technology Stack

## Backend

- Python
- FastAPI
- Requests
- BeautifulSoup4
- Playwright
- PostgreSQL
- psycopg2
- Pydantic

## Frontend

- React
- Vite
- Tailwind CSS
- Axios
- React Router

---

# Project Architecture

The application follows a layered architecture.

```text
                    React Frontend
                          |
                          v
                    Axios API Layer
                          |
                          v
                    FastAPI Routes
                          |
                          v
                    Service Layer
                          |
                          v
                  Repository Layer
                          |
                          v
                     PostgreSQL

Scraping Architecture

                 Website URL
                      |
                      v
                Scraper Factory
                      |
                      v
                Generic Scraper
                 /           \
                /             \
               v               v
     Requests Scraper    Browser Scraper
               |               |
               v               v
           HTTP HTML       Rendered HTML
               \               /
                \             /
                 v           v
                  HTML Extractor
                       |
                       v
               Structured Data
                       |
                       v
                  Normalizer
                       |
                       v
                  PostgreSQL

# Project Structure

universal-web-scraper/
│
├── app/
│   ├── api/
│   │   ├── scrape_routes.py
│   │   ├── crud_routes.py
│   │   ├── schema_routes.py
│   │   └── csv_routes.py
│   │
│   ├── core/
│   │   ├── config.py
│   │   ├── exceptions.py
│   │   └── logger.py
│   │
│   ├── database/
│   │   ├── connection.py
│   │   └── migrations.py
│   │
│   ├── models/
│   │   └── scraped_data.py
│   │
│   ├── repositories/
│   │   ├── base_repository.py
│   │   └── scraped_data_repository.py
│   │
│   ├── schemas/
│   │   ├── scrape_schema.py
│   │   └── response_schema.py
│   │
│   ├── scrapers/
│   │   ├── base_scraper.py
│   │   ├── requests_scraper.py
│   │   ├── browser_scraper.py
│   │   ├── html_extractor.py
│   │   └── scraper_factory.py
│   │
│   ├── services/
│   │   ├── scraper_service.py
│   │   ├── database_service.py
│   │   ├── csv_service.py
│   │   └── schema_service.py
│   │
│   └── main.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── scripts/
│   └── generate_csv.py
│
├── tests/
│
├── .env.example
├── .gitignore
├── requirements.txt
└── README.md


Database

Create a PostgreSQL database named: web_scraper

The application automatically creates the required table when the backend starts.


Main Table

scraped_pages
Column  	Type
id      	SERIAL
url     	TEXT
title   	TEXT
headings	JSONB
paragraphs	JSONB
links   	JSONB
scraped_at	TIMESTAMP


Environment Configuration

Create a .env file in the project root.
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=web_scraper
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
REQUEST_TIMEOUT=15

Never commit the actual .env file to GitHub.

Use .env.example for sharing configuration structure.


Backend Installation

Clone the repository:   git clone <YOUR_GITHUB_REPOSITORY_URL>

Move into the project:  cd universal-web-scraper

Create a virtual environment:   python -m venv venv

Activate it.

Windows
venv\Scripts\activate

Linux/macOS
source venv/bin/activate

Install dependencies:
pip install -r requirements.txt

Install Playwright Chromium:
python -m playwright install chromium


Run Backend

From the project root:
uvicorn app.main:app --reload

Backend:
http://127.0.0.1:8000

Swagger API documentation:
http://127.0.0.1:8000/docs

Run Frontend

Move into the frontend:
cd frontend

Install dependencies:
npm install

Start development server:
npm run dev

Frontend:
http://localhost:5173


API Endpoints
Scraping

Scrape Website
POST /scrape/

Request:
{
  "url": "https://example.com"
}

CRUD
Create
POST /data/

Get All Records
GET /data/

Get Record
GET /data/{id}

Update Record
PUT /data/{id}

Delete Record
DELETE /data/{id}


Schema APIs

Get Tables
GET /schema/tables

Get Table Schema
GET /schema/tables/{table_name}


CSV Export

API Export
GET /export/csv

The API returns:
scraped_data.csv

Command-Line Export

From the project root:
python scripts/generate_csv.py

The generated file will be:
scraped_data.csv


Scraping Flow

The scraping process follows these steps:
1. User enters website URL
          |
          v
2. React sends POST /scrape/
          |
          v
3. FastAPI receives request
          |
          v
4. Scraper Factory creates scraper
          |
          v
5. Generic Scraper attempts HTTP scraping
          |
          v
6. Requests + BeautifulSoup extract content
          |
          v
7. Browser fallback is used when required
          |
          v
8. HTML content is converted into structured data
          |
          v
9. Data is normalized
          |
          v
10. Repository stores data in PostgreSQL
          |
          v
11. API returns stored records
          |
          v
12. React displays the result


Error Handling

The backend uses custom exceptions for different failure scenarios.

Examples include:

Invalid URL
Network failure
Parsing failure
Database connection failure
Database query failure

The application also uses logging to help diagnose runtime issues.

Design Principles

The project follows several software engineering principles:

Separation of Concerns

Each layer has a specific responsibility.

Single Responsibility Principle

Scraping, parsing, database operations, API handling, and CSV generation are separated.

Repository Pattern

Database queries are isolated inside repository classes.

Dependency Injection

FastAPI dependencies are used to provide services and repositories to routes.

Abstraction

Scraper implementations inherit from the common BaseScraper.

Factory Pattern

ScraperFactory is responsible for creating the appropriate scraper implementation.

Limitations

The scraper is designed for publicly accessible websites.

Some websites may not be scrapeable because of:

Authentication requirements
CAPTCHA
Anti-bot protection
Geo restrictions
Robots or access restrictions
Highly customized client-side rendering

The Playwright fallback helps with many JavaScript-rendered websites but cannot guarantee successful extraction from every website.

Future Improvements

Possible future improvements include:

Authentication and user management
Background scraping jobs
Rate limiting
Advanced SSRF protection
Pagination
Scheduled scraping
More advanced content extraction
Export to additional formats
Docker deployment
Cloud deployment
Automated test coverage


Assignment Requirements Covered
Requirement         	Status
Dynamic website URL 	Completed
Web scraping        	Completed
Requests + BeautifulSoup	Completed
PostgreSQL           	Completed
CRUD APIs	            Completed
Schema APIs         	Completed
CSV generation      	Completed
React frontend      	Completed
GitHub repository   	To submit
README/documentation	Completed
Loom demonstration  	To record


Author

Nandan Kumar
Developer intern :- NestorBird
