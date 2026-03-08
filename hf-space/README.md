---
title: Magnus AI Backend
emoji: 🤖
colorFrom: blue
colorTo: purple
sdk: docker
sdk_version: "4.44.0"
app_file: app.py
pinned: false
license: mit
---

# Magnus AI Backend

AI services for Magnus Platform: Chat (Groq Llama-3.3-70B), Price Prediction (Prophet), Translation (Helsinki-NLP), Object Detection (YOLOv8), Doodle Classification, IELTS Evaluation

## Endpoints

- `GET /` - Health check
- `POST /api/chat` - AI chat with Groq Llama-3.3-70B
- `POST /api/predict-price` - Prophet ML stock forecasting
- `POST /api/german-news` - German→English translation
- `POST /api/detect-objects` - YOLOv8 object detection
- `POST /api/classify-doodle` - Quick Draw style doodle classification
- `POST /api/ielts-writing` - IELTS Writing Task 1/2 evaluation
- `POST /api/ielts-speaking` - IELTS Speaking evaluation

## Environment Variables

Required:
- `GROQ_API_KEY` - For chat and IELTS evaluation

## Usage

See API documentation for request/response formats.

## Status

Check service health: [https://anhkhoa1804-magnus-ai-backend.hf.space/](https://anhkhoa1804-magnus-ai-backend.hf.space/)
