#!/bin/bash

echo "Starting VClub Project with 2D Cards..."
echo

echo "Installing dependencies..."
npm install

echo
echo "Starting development servers..."
echo "Frontend will be available at: http://localhost:3000"
echo "Backend will be available at: http://localhost:5000"
echo

echo "Starting backend server..."
node server.js &
BACKEND_PID=$!

echo "Waiting 3 seconds for backend to start..."
sleep 3

echo "Starting frontend server..."
npm run dev &
FRONTEND_PID=$!

echo
echo "Both servers are starting..."
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo
echo "To test the 2D Cards section:"
echo "1. Go to http://localhost:3000"
echo "2. Click on '2D Cards' in the navigation"
echo "3. Test the features!"
echo
echo "Press Ctrl+C to stop both servers"
echo

# Wait for user to stop
wait 