#!/bin/bash

# Doodle2Character Setup Script
# This script sets up both Python and Node.js environments

set -e  # Exit on any error

echo "🚀 Setting up Doodle2Character development environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check Python version
PYTHON_VERSION=$(python3 -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
print_status "Found Python $PYTHON_VERSION"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_warning "Node.js is not installed. The TypeScript frontend will not work without it."
    print_status "Please install Node.js 18+ from https://nodejs.org/"
else
    NODE_VERSION=$(node --version)
    print_status "Found Node.js $NODE_VERSION"
fi

# Setup Python environment
print_status "Setting up Python virtual environment..."

if [ ! -d "venv" ]; then
    python3 -m venv venv
    print_success "Created Python virtual environment"
else
    print_status "Virtual environment already exists"
fi

# Activate virtual environment
print_status "Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
print_status "Upgrading pip..."
pip install --upgrade pip

# Install Python dependencies
print_status "Installing Python dependencies..."
pip install -r requirements.txt
print_success "Python dependencies installed"

# Setup Node.js environment (if Node.js is available)
if command -v node &> /dev/null; then
    print_status "Setting up Node.js dependencies..."
    
    if [ ! -f "package.json" ]; then
        print_warning "package.json not found, skipping Node.js setup"
    else
        # Check if npm is available
        if command -v npm &> /dev/null; then
            npm install
            print_success "Node.js dependencies installed"
        else
            print_warning "npm not found, please install npm"
        fi
    fi
else
    print_warning "Skipping Node.js setup (Node.js not installed)"
fi

echo ""
print_success "Setup complete! 🎉"
echo ""
echo "Next steps:"
echo "1. Activate the Python virtual environment:"
echo "   source venv/bin/activate"
echo ""
echo "2. Start the backend server:"
echo "   uvicorn main:app --reload --port 8003"
echo ""
if command -v node &> /dev/null; then
    echo "3. Start the TypeScript frontend (in a new terminal):"
    echo "   npm run dev"
    echo ""
    echo "4. Access the applications:"
    echo "   - TypeScript Frontend: http://localhost:3000"
    echo "   - Backend API: http://localhost:8003"
    echo "   - TypeScript Route: http://localhost:8003/agent-preview/typescript"
    echo "   - Legacy HTML: http://localhost:8003/agent-preview/static-html"
else
    echo "3. Access the legacy HTML version:"
    echo "   http://localhost:8003/agent-preview/static-html"
fi
echo ""
print_status "Happy coding! 🚀" 