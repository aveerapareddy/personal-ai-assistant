#!/bin/bash

# Personal AI Assistant - Startup Script
# This script starts both the backend (FastAPI) and frontend (React) servers

echo "🚀 Starting Personal AI Assistant..."

# Function to cleanup background processes on exit
cleanup() {
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Check if we're in the right directory
if [ ! -f "backend/main.py" ] || [ ! -f "frontend/package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Start Backend
echo "📡 Starting backend server..."
cd backend
if [ ! -d "venv" ]; then
    echo "❌ Error: Backend virtual environment not found. Please run 'python -m venv venv' and 'pip install -r requirements.txt' in the backend directory"
    exit 1
fi

source venv/bin/activate
python main.py &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Check if backend started successfully
if ! curl -s http://localhost:8000/health > /dev/null; then
    echo "❌ Error: Backend failed to start"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo "✅ Backend server running on http://localhost:8000"

# Start Frontend
echo "🎨 Starting frontend server..."
cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Start frontend on port 3001 if 3000 is busy
PORT=3001
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 3000 is busy, using port 3001"
    PORT=3001
else
    PORT=3000
fi

npm start -- --port $PORT &
FRONTEND_PID=$!
cd ..

# Wait a moment for frontend to start
sleep 5

echo "✅ Frontend server running on http://localhost:$PORT"
echo ""
echo "🎉 Personal AI Assistant is ready!"
echo "   Frontend: http://localhost:$PORT"
echo "   Backend:  http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait 