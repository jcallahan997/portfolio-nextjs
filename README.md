# Portfolio Website

Personal portfolio showcasing data science, machine learning, and generative AI projects.

**Live:** [portfolio-callahan.com](https://www.portfolio-callahan.com/)

## Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Plotly.js
- **Backend:** FastAPI, Python, scikit-learn, pandas, Anthropic Claude API
- **Infrastructure:** Docker, Nginx, Azure App Service

## Features

- **Clustering Analysis** -- Interactive agglomerative clustering on US traffic accident data with Plotly visualizations
- **Table Topics Generator** -- AI-powered Toastmasters practice tool with real-time streaming via Claude
- **SDXL LoRA Gallery** -- Stable Diffusion fine-tuning progression across 18 training epochs
- **Car Price Distribution** -- Embedded R Shiny dashboard exploring price vs. mileage relationships
- **Pac-Man** -- Browser-based Pac-Man built with Vega

## Running Locally

```bash
# Docker (recommended)
cp .env.example .env        # add your ANTHROPIC_API_KEY
docker-compose up            # http://localhost

# Or run frontend/backend separately
cd frontend && npm install && npm run dev
cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload
```

## License

[MIT](LICENSE)
