FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gdal-bin \
    libgdal-dev \
    build-essential \
    python3-dev \
    binutils \
    libproj-dev \
    && rm -rf /var/lib/apt/lists/*

# Set environment variable for GDAL
ENV CPLUS_INCLUDE_PATH=/usr/include/gdal
ENV C_INCLUDE_PATH=/usr/include/gdal

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Install Python dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Collect static files (optional)
RUN python manage.py collectstatic --noinput

CMD gunicorn base.wsgi:application --bind 0.0.0.0:8000