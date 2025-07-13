# SSE Text Streamer

A real-time Server-Sent Events (SSE) application that streams text character by character using FastAPI backend and React frontend.

## Features

- **FastAPI Backend**: Single SSE endpoint for character-by-character text streaming
- **React Frontend**: Real-time character display with typing animation
- **Character-by-Character Streaming**: Each character appears individually with smooth animations
- **Progress Tracking**: Visual progress bar showing streaming progress
- **Auto-completion**: Automatically stops when streaming is complete

## Quick Start

### Prerequisites

- **Python 3.8+** (for backend)
- **Node.js 16+** (for frontend)
- **Git** (to clone the repository)

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd sse-example
```

### 2. Backend Setup

#### Create Virtual Environment

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate
```

#### Install Dependencies

```bash
# Install requirements
pip install -r requirements.txt
```

#### Run FastAPI Server

```bash
# Start the server
fastapi run
```

The FastAPI server will start on `http://0.0.0.0:8000`

**Alternative: Using uvicorn directly**
```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The React app will start on `http://localhost:5173`

### 4. Using Docker (Alternative)

```bash
# From the root directory
docker-compose up
```

This will start both services automatically.

## How to Use

1. **Enter text** in the textarea on the frontend
2. **Click "Start Streaming"** to begin character-by-character streaming
3. **Watch characters appear** one by one with smooth animations
4. **Monitor progress** with the real-time progress bar
5. **Streaming stops automatically** when complete

## API Endpoints

### SSE Endpoint

- **GET `/sse?text=YourMessage`**: Streams text character by character
  - Sends each character individually with 500ms delay
  - Includes position and total character count
  - Sends completion message when done

### Regular Endpoints

- **GET `/`**: API information
- **GET `/docs`**: Interactive API documentation (Swagger UI)

## Example Usage

### Backend API Call

```bash
curl "http://localhost:8000/sse?text=Hello World"
```

### SSE Response Format

```javascript
// Each character event
{"character": "H", "position": 1, "total": 11}
{"character": "e", "position": 2, "total": 11}
{"character": "l", "position": 3, "total": 11}
{"character": "l", "position": 4, "total": 11}
{"character": "o", "position": 5, "total": 11}
{"character": " ", "position": 6, "total": 11}  // Space preserved
{"character": "W", "position": 7, "total": 11}
{"character": "o", "position": 8, "total": 11}
{"character": "r", "position": 9, "total": 11}
{"character": "l", "position": 10, "total": 11}
{"character": "d", "position": 11, "total": 11}

// Completion event
{"message": "Text streaming completed!", "total_characters": 11}
```

## Development Setup Guide

### Backend Development

#### Virtual Environment Management

```bash
# Create virtual environment
python -m venv venv

# Activate (macOS/Linux)
source venv/bin/activate

# Activate (Windows)
venv\Scripts\activate

# Deactivate
deactivate
```

#### Installing Requirements

```bash
# Install from requirements.txt
pip install -r requirements.txt

# Or install individual packages
pip install fastapi uvicorn python-multipart
```

#### Running in Development Mode

```bash
# Using Python directly
python app.py

# Using uvicorn with auto-reload
uvicorn app:app --host 0.0.0.0 --port 8000 --reload

# Using uvicorn with specific settings
uvicorn app:app --host 0.0.0.0 --port 8000 --reload --log-level debug
```

#### Testing the API

```bash
# Test the root endpoint
curl http://localhost:8000/

# Test SSE endpoint
curl "http://localhost:8000/sse?text=Test"

# View API documentation
# Open http://localhost:8000/docs in your browser
```

### Frontend Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
sse-example/
├── backend/
│   ├── app.py              # FastAPI application with SSE endpoint
│   ├── requirements.txt    # Python dependencies
│   ├── venv/              # Virtual environment (created locally)
│   └── Dockerfile         # Docker configuration
├── frontend/
│   ├── src/
│   │   ├── App.tsx        # Main React component
│   │   ├── App.css        # Component styles
│   │   └── index.css      # Global styles
│   ├── package.json       # Node.js dependencies
│   └── vite.config.ts     # Vite configuration
├── docker-compose.yml     # Docker services
└── README.md             # This file
```

## How SSE Works

Server-Sent Events (SSE) is a web standard that allows servers to push data to web clients over HTTP connections. Unlike WebSockets, SSE is:

- **Unidirectional**: Server to client only
- **HTTP-based**: Uses standard HTTP connections
- **Automatic Reconnection**: Built-in reconnection handling
- **Simple Protocol**: Easy to implement and debug

### SSE Message Format

```javascript
data: {"character": "H", "position": 1, "total": 11}

```

## Customization

### Adjusting Streaming Speed

Modify the delay in `backend/app.py`:

```python
await asyncio.sleep(0.5)  # Change 0.5 to your desired delay in seconds
```

### Adding New Features

1. **New SSE endpoints**: Add new routes in `backend/app.py`
2. **Frontend features**: Modify `frontend/src/App.tsx`
3. **Styling**: Update `frontend/src/App.css`

## Troubleshooting

### Common Issues

1. **Port already in use**:
   ```bash
   # Kill process on port 8000
   lsof -ti:8000 | xargs kill -9
   ```

2. **Virtual environment not activated**:
   ```bash
   # Check if venv is active (should show venv path)
   which python
   ```

3. **CORS errors**: Backend CORS is configured for all origins in development

4. **No characters appearing**: Check browser console for SSE connection errors

### Debug Mode

```bash
# Backend with debug logging
uvicorn app:app --reload --log-level debug

# Frontend - check browser developer tools console
```

## Production Deployment

### Backend Production

```bash
# Install production dependencies
pip install gunicorn

# Run with Gunicorn
gunicorn app:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Frontend Production

```bash
# Build for production
npm run build

# Serve static files with a web server like nginx
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Backend configuration
HOST=0.0.0.0
PORT=8000
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

## License

MIT License - feel free to use this code for your own projects!
