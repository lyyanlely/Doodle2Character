# Doodle2Character

A marketplace service for business owners to find and interact with AI agents. This application converts doodles to characters using Gemini AI.

## 🎉 **NEW: TypeScript Frontend Available!**

This project now has **two versions**:

### 🚀 **TypeScript Version (Recommended)**
- **Technology**: Next.js + React + TypeScript
- **Features**: Type safety, modern development, enhanced UX
- **Status**: ✅ **Active Development**
- **Documentation**: [README_TYPESCRIPT.md](README_TYPESCRIPT.md)

### 📄 **Legacy HTML Version**
- **Technology**: Vanilla HTML/CSS/JavaScript  
- **Status**: 🔒 **Maintenance Mode**
- **Location**: `static/index.html`

---

## Quick Start

### Prerequisites
- **Python 3.8+** (for backend)
- **Node.js 18+** (for TypeScript frontend)
- **Gemini API key**

### Python Backend Setup

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Start backend server
uvicorn main:app --reload --port 8003
```

### Option 1: TypeScript Frontend (Recommended)

```bash
# Install Node.js dependencies
npm install

# Start frontend
npm run dev
# → Visit http://localhost:3000

# Backend should already be running from above
# → Visit http://localhost:8003/agent-preview/typescript
```

### Option 2: Legacy HTML Version

```bash
# Backend should already be running from Python setup above
# → Visit http://localhost:8003/agent-preview/static-html
```

---

## Project Structure

```
Doodle2Character/
├── 🆕 app/                    # TypeScript Next.js App
│   ├── components/            # React components
│   ├── contexts/              # State management
│   ├── types/                 # TypeScript definitions
│   └── ...
├── 📄 static/                 # Legacy HTML version
│   └── index.html
├── 🐍 main.py                 # FastAPI backend
├── 🐍 schemas.py              # Pydantic schemas
├── 📦 package.json            # Node.js dependencies
├── 📋 requirements.txt        # Python dependencies
├── 📋 requirements-dev.txt    # Python dev dependencies
├── 🔧 tsconfig.json           # TypeScript config
└── 📚 README_TYPESCRIPT.md    # Detailed TypeScript docs
```

## Features

- 🎨 **Canvas Drawing**: Mouse and touch support
- 🤖 **AI Character Generation**: Powered by Gemini 2.0 Flash
- 🎭 **Multiple Art Styles**: Cartoon, Anime, Pixel Art, etc.
- 📱 **Responsive Design**: Works on desktop and mobile
- ⬬ **Download Characters**: Save generated images
- 🔄 **Real-time Status**: Progress updates during generation

## API Endpoints

### Backend Routes (FastAPI)
- `GET /` - API info
- `GET /agent-preview/typescript` - Redirect to TypeScript frontend
- `GET /agent-preview/static-html` - Serve legacy HTML
- `GET /agent-preview/{agent_id}/ui` - Dynamic agent UI

### Frontend (Next.js)
- `http://localhost:3000` - TypeScript React application

## Development

### Python Backend Dependencies

The project uses the following main Python packages:
- **FastAPI** - Modern web framework
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation
- **Jinja2** - Template engine
- **HTTPx** - HTTP client

Install with:
```bash
pip install -r requirements.txt          # Production
pip install -r requirements-dev.txt     # Development (includes testing tools)
```

### Environment Setup

#### Python Virtual Environment
```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # macOS/Linux
# venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt
```

#### Gemini API Key
The API key is currently hardcoded in the code for demo purposes:
```
AIzaSyBkgodDSBSnawhl3qKmU5pacuZeksccraw
```

For production, set environment variable:
```bash
export NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

### Running the Application

#### Backend (Required for both versions)
```bash
# Make sure virtual environment is activated
source venv/bin/activate

# Start FastAPI server
uvicorn main:app --reload --port 8003
```

#### TypeScript Frontend
```bash
npm install
npm run dev
```

#### Legacy HTML
The HTML version is served directly by the FastAPI backend.

## Technology Comparison

| Feature | Legacy HTML | TypeScript |
|---------|-------------|------------|
| **Language** | JavaScript | TypeScript |
| **Framework** | Vanilla | Next.js + React |
| **State Management** | Global variables | React Context |
| **Type Safety** | ❌ | ✅ |
| **Hot Reload** | ❌ | ✅ |
| **Component Reusability** | ❌ | ✅ |
| **Development Experience** | Basic | Modern |
| **Maintainability** | Limited | High |

## Migration Benefits

The TypeScript version provides:
- 🎯 **Type Safety**: Catch errors at compile time
- 🚀 **Better DX**: IntelliSense, auto-completion, hot reload
- 🧩 **Modularity**: Reusable React components
- 📱 **Enhanced Mobile**: Better touch event handling
- 🛡️ **Error Handling**: Comprehensive error states and retry logic
- 🎨 **Modern UI**: Improved styling and responsiveness

## Documentation

- **TypeScript Version**: [README_TYPESCRIPT.md](README_TYPESCRIPT.md)
- **Migration Log**: [log.txt](log.txt)
- **API Reference**: See `reference.ts` for Gemini API examples

## Contributing

This project follows the coding philosophy of making changes from the backend if needed and then coordinating coherently over the system from backend to frontend.

### Development Workflow
1. Set up Python virtual environment and install requirements
2. Make backend changes in `main.py` if needed
3. Update frontend (TypeScript preferred)
4. Ensure type safety with `npm run type-check`
5. Test both frontend and backend integration

## Troubleshooting

### Common Issues
1. **Python dependencies**: Make sure virtual environment is activated and requirements are installed
2. **Port conflicts**: Ensure ports 3000 and 8003 are available
3. **Node.js dependencies**: Run `npm install` for TypeScript version
4. **API key**: Verify Gemini API key is valid
5. **Type errors**: Run `npm run type-check` to diagnose

### Support
- Check [log.txt](log.txt) for recent changes
- See [README_TYPESCRIPT.md](README_TYPESCRIPT.md) for detailed TypeScript docs
- Review error messages in browser console and terminal

---

## ⚡ Quick Commands

### Backend Setup
```bash
# One-time setup
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt

# Daily development
source venv/bin/activate
uvicorn main:app --reload --port 8003
```

### Frontend Development
```bash
# TypeScript version (recommended)
npm install
npm run dev  # http://localhost:3000

# Type checking
npm run type-check

# Legacy HTML only
# Just visit http://localhost:8003/agent-preview/static-html (backend must be running)
```