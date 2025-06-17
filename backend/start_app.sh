#!/bin/sh

# Function to handle Ctrl+C
trap 'echo "Stopping processes..."; kill 0; exit' SIGINT

# Run overseer.py
echo "Starting overseer.py..."
uv run overseer.py &
OVERSEER_PID=$!

# Run ingester.py
echo "Starting ingester.py..."
uv run ingester.py &
INGESTER_PID=$!

# Run main.py
echo "Starting main.py..."
uv run main.py &
MAIN_PID=$!

# Wait for all processes to finish
wait $OVERSEER_PID $INGESTER_PID $MAIN_PID
