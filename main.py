from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import os
import httpx

app = FastAPI()

# Get the directory where your main.py is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Mount a directory to serve static files (like your HTML)
# This means files in the 'static' directory will be accessible at '/static/{filename}'
app.mount("/static", StaticFiles(directory=os.path.join(BASE_DIR, "static")), name="static")

# If you want to use Jinja2 templates (useful for dynamic HTML)
# templates = Jinja2Templates(directory=os.path.join(BASE_DIR, "templates"))


@app.get("/")
async def read_root():
    return {"message": "Welcome to the Doodle2Character FastAPI app! Go to /agent-preview/typescript to see the TypeScript frontend."}

# Route to serve the new TypeScript frontend (proxy to Next.js dev server)
@app.get("/agent-preview/typescript")
async def serve_typescript_frontend():
    # Redirect to the Next.js development server
    return RedirectResponse(url="http://localhost:3000", status_code=302)

# Option 1: Serve the HTML file directly as a static file (legacy)
@app.get("/agent-preview/static-html", response_class=HTMLResponse)
async def serve_static_html():
    with open(os.path.join(BASE_DIR, "static", "index.html"), "r") as f:
        html_content = f.read()
    return HTMLResponse(content=html_content)

# Option 2: Serve using StaticFiles (more flexible for multiple static assets) (legacy)
@app.get("/agent-preview/{agent_id}/ui", response_class=HTMLResponse)
async def serve_agent_ui(agent_id: str):
    # In a real scenario, you'd look up agent_id to find its specific UI file or configuration
    # For this example, we'll just serve index.html
    html_file_path = os.path.join(BASE_DIR, "static", "index.html")
    if not os.path.exists(html_file_path):
        return HTMLResponse(content="<h1>404 Not Found</h1><p>Agent UI not found.</p>", status_code=404)
    with open(html_file_path, "r") as f:
        html_content = f.read()
    return HTMLResponse(content=html_content)

# Option 3: Using Jinja2Templates for dynamic HTML (if you need server-side rendering)
# @app.get("/agent-preview/dynamic-html/{name}", response_class=HTMLResponse)
# async def serve_dynamic_html(request: Request, name: str):
#     return templates.TemplateResponse("dynamic.html", {"request": request, "name": name})