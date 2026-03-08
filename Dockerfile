FROM python:3.10-slim

WORKDIR /app

# Disable telemetry and hub connectivity at build/runtime
ENV HF_HUB_DISABLE_TELEMETRY=1 \
    TRANSFORMERS_VERBOSITY=error \
    YOLO_VERBOSE=False \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Install system dependencies for OpenCV and YOLO
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (for Docker layer caching)
COPY requirements.txt .

# Install Python dependencies and pre-download YOLO model
RUN pip install --no-cache-dir -r requirements.txt && \
    python -c "from ultralytics import YOLO; YOLO('yolov8n.pt')"

# Copy application code
COPY app.py utils.py ./

# Expose port (HuggingFace uses 7860)
EXPOSE 7860

# Run with gunicorn for production stability
CMD ["gunicorn", "--bind", "0.0.0.0:7860", "--workers", "1", "--timeout", "300", "--preload", "app:app"]
