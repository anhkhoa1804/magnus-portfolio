"""
Magnus AI Backend - HuggingFace Space
Provides AI services: Chat, Price Prediction, Object Detection, Translation
"""
import os
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional

# Load .env for local development (no-op on HF Space where secrets are env vars)
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

from flask import Flask, request, jsonify
from flask_cors import CORS

try:
    import pandas as pd
    import numpy as np
    PANDAS_AVAILABLE = True
except ImportError:
    PANDAS_AVAILABLE = False
    logging.warning("pandas/numpy not available - price prediction disabled")

# Check ML/AI library availability WITHOUT importing them at module level.
# Heavy imports (transformers, ultralytics) trigger background network calls to
# huggingface.co and api.ultralytics.com which can fail during HF Space init.
import importlib.util as _iutil

PROPHET_AVAILABLE = _iutil.find_spec('prophet') is not None
if not PROPHET_AVAILABLE:
    logging.warning("Prophet not available - price prediction disabled")

TRANSFORMERS_AVAILABLE = _iutil.find_spec('transformers') is not None
if not TRANSFORMERS_AVAILABLE:
    logging.warning("Transformers not available - translation disabled")

YOLO_AVAILABLE = _iutil.find_spec('ultralytics') is not None
if not YOLO_AVAILABLE:
    logging.warning("YOLO not available - object detection disabled")

WHISPER_AVAILABLE = _iutil.find_spec('whisper') is not None
if not WHISPER_AVAILABLE:
    logging.warning("Whisper not available - IELTS speaking transcription disabled")

# Ensure ffmpeg is on PATH (needed by Whisper for audio decoding)
# On HF Space ffmpeg is pre-installed; on Windows locate via WinGet install path
import shutil as _shutil
if not _shutil.which("ffmpeg"):
    import glob as _glob
    _candidates = _glob.glob(
        r"C:\Users\*\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg*\**\bin",
        recursive=True
    ) + [r"C:\ffmpeg\bin", r"C:\Program Files\ffmpeg\bin"]
    for _p in _candidates:
        if os.path.isdir(_p) and _glob.glob(os.path.join(_p, "ffmpeg*")):
            os.environ["PATH"] = os.environ.get("PATH", "") + os.pathsep + _p
            logging.info(f"Added ffmpeg to PATH: {_p}")
            break

# Import local utilities
from utils import (
    cache,
    validate_price_data,
    prepare_prophet_dataframe,
    calculate_confidence_score,
    format_prediction_response,
    detect_trend,
    sanitize_text,
    extract_error_message,
    logger
)

# Initialize Flask app
app = Flask(__name__)
CORS(app, origins=[
    "http://localhost:3000",
    "https://*.vercel.app",
    "https://magnus.vercel.app",
    "https://*.hf.space"
])

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Model cache (load once, reuse)
class ModelManager:
    def __init__(self):
        self.translator = None
        self.yolo_model = None
    
    def get_translator(self):
        """Load German-English translator (lazy loading)"""
        if not TRANSFORMERS_AVAILABLE:
            raise RuntimeError("Transformers not available")
        
        if self.translator is None:
            logger.info("Loading German-English translator...")
            from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
            self._translator_tokenizer = AutoTokenizer.from_pretrained("Helsinki-NLP/opus-mt-de-en")
            self._translator_model = AutoModelForSeq2SeqLM.from_pretrained("Helsinki-NLP/opus-mt-de-en")
            # Return a callable wrapper
            self.translator = (self._translator_tokenizer, self._translator_model)
            logger.info("Translator loaded")
        return self.translator
    
    def get_yolo(self):
        """Load YOLO model (lazy loading)"""
        if not YOLO_AVAILABLE:
            raise RuntimeError("YOLO not available")
        
        if self.yolo_model is None:
            logger.info("Loading YOLOv8 model...")
            self.yolo_model = YOLO("yolov8n.pt")  # Nano model for speed
            logger.info("YOLO model loaded")
        return self.yolo_model

    def get_doodle_classifier(self):
        """Load QuickDraw doodle classifier (lazy loading, cached)"""
        if not TRANSFORMERS_AVAILABLE:
            raise RuntimeError("Transformers not available")
        
        if not hasattr(self, '_doodle_classifier') or self._doodle_classifier is None:
            logger.info("Loading QuickDraw classifier (nateraw/resnet50-quickdraw)...")
            from transformers import pipeline
            self._doodle_classifier = pipeline(
                "image-classification",
                model="nateraw/resnet50-quickdraw",
                device=-1  # CPU
            )
            logger.info("QuickDraw classifier loaded — 345 sketch categories ready")
        return self._doodle_classifier

models = ModelManager()


# ============= API ENDPOINTS =============

@app.route('/')
def home():
    """Health check endpoint"""
    return jsonify({
        "service": "Magnus AI Backend",
        "status": "running",
        "version": "1.0.0",
        "endpoints": [
            "/api/chat",
            "/api/predict-price",
            "/api/detect-objects",
            "/api/german-news",
            "/api/classify-doodle",
            "/api/ielts-writing",
            "/api/ielts-speaking"
        ],
        "features": {
            "prophet": PROPHET_AVAILABLE,
            "transformers": TRANSFORMERS_AVAILABLE,
            "yolo": YOLO_AVAILABLE
        },
        "timestamp": datetime.now().isoformat()
    })


@app.route('/api/chat', methods=['POST'])
def chat():
    """
    Chat endpoint with Groq AI (Llama-3.3-70B)
    """
    try:
        data = request.json
        query = sanitize_text(data.get('query', ''))
        conversation_history = data.get('conversation_history', [])
        
        if not query:
            return jsonify({
                "success": False,
                "error": "Query is required"
            }), 400
        
        logger.info(f"Chat query: {query[:100]}...")
        
        # Use Groq API (Llama-3.3-70B - fast & high quality)
        try:
            import requests
            
            groq_api_key = os.environ.get('GROQ_API_KEY')
            if not groq_api_key:
                raise Exception("GROQ_API_KEY not set")
            
            # Build conversation context
            messages = []
            for msg in conversation_history[-5:]:  # Last 5 messages
                messages.append({"role": msg["role"], "content": msg["content"]})
            messages.append({"role": "user", "content": query})
            
            # Call Groq API
            api_url = "https://api.groq.com/openai/v1/chat/completions"
            headers = {
                "Authorization": f"Bearer {groq_api_key}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "model": "llama-3.3-70b-versatile",  # Fast & high quality
                "messages": messages,
                "temperature": 0.7,
                "max_tokens": 500,
                "top_p": 0.9,
            }
            
            response = requests.post(api_url, headers=headers, json=payload, timeout=30)
            response.raise_for_status()
            
            result = response.json()
            
            # Extract response
            generated_text = result["choices"][0]["message"]["content"]
            
            return jsonify({
                "success": True,
                "response": generated_text,
                "model": "llama-3.3-70b-versatile",
                "timestamp": datetime.now().isoformat()
            })
            
        except Exception as groq_error:
            logger.warning(f"Groq API failed: {groq_error}, using fallback")
            
            # Intelligent fallback based on query
            response = generate_smart_fallback(query)
            
            return jsonify({
                "success": True,
                "response": response,
                "model": "fallback",
                "timestamp": datetime.now().isoformat()
            })
    
    except Exception as e:
        logger.error(f"Chat error: {e}")
        return jsonify({
            "success": False,
            "error": extract_error_message(e)
        }), 500


def generate_smart_fallback(query: str) -> str:
    """Generate contextual fallback responses"""
    query_lower = query.lower()
    
    if any(word in query_lower for word in ['hello', 'hi', 'hey']):
        return "Hello! I'm Phi-3, an AI assistant. How can I help you today?"
    elif any(word in query_lower for word in ['how are you', 'how do you do']):
        return "I'm functioning well, thank you! I'm here to help answer questions and assist with various tasks."
    elif any(word in query_lower for word in ['what can you do', 'what are you', 'who are you']):
        return "I'm Phi-3, a compact AI language model by Microsoft. I can help with answering questions, explaining concepts, writing assistance, and general conversation."
    elif any(word in query_lower for word in ['thank', 'thanks']):
        return "You're welcome! Feel free to ask if you have any other questions."
    else:
        return f"I understand you're asking about: '{query}'. While I'm processing your request, note that full AI capabilities are available through the HuggingFace Inference API. Your question has been logged and I'll provide the best response possible."



@app.route('/api/predict-price', methods=['POST'])
def predict_price():
    """
    Price prediction using Prophet
    Expects: { "symbol": "BTC", "prices": [...], "days": 7 }
    """
    try:
        if not PROPHET_AVAILABLE:
            return jsonify({
                "success": False,
                "error": "Prophet not installed. Add 'prophet' to requirements.txt"
            }), 500
        
        data = request.json
        symbol = data.get('symbol', 'UNKNOWN')
        prices = data.get('prices', [])
        days = data.get('days', 7)
        
        logger.info(f"Price prediction: {symbol}, {len(prices)} data points, {days} days forecast")
        
        # Validate input
        if not validate_price_data(prices):
            return jsonify({
                "success": False,
                "error": "Insufficient or invalid price data (need at least 30 data points)"
            }), 400
        
        # Check cache
        cache_key = f"predict_{symbol}_{len(prices)}_{days}"
        cached_result = cache.get(cache_key, ttl_seconds=3600)  # 1 hour TTL
        if cached_result:
            return jsonify(cached_result)
        
        # Prepare data for Prophet
        df = prepare_prophet_dataframe(prices)
        
        # Train Prophet model
        from prophet import Prophet
        model = Prophet(
            changepoint_prior_scale=0.05,
            seasonality_mode='multiplicative',
            daily_seasonality=False
        )
        model.fit(df)
        
        # Make predictions
        future = model.make_future_dataframe(periods=days)
        forecast = model.predict(future)
        
        # Extract predictions (last N days)
        predictions = forecast['yhat'].tail(days).tolist()
        dates = forecast['ds'].tail(days).dt.strftime('%Y-%m-%d').tolist()
        
        # Calculate confidence & trend
        confidence = calculate_confidence_score(predictions, prices)
        trend = detect_trend(prices + predictions)
        
        # Format response
        result = format_prediction_response(predictions, dates, confidence, trend)
        
        # Cache result
        cache.set(cache_key, result)
        
        logger.info(f"Prediction complete: {symbol}, trend={trend}, confidence={confidence}")
        return jsonify(result)
    
    except Exception as e:
        logger.error(f"Price prediction error: {e}")
        return jsonify({
            "success": False,
            "error": extract_error_message(e)
        }), 500


@app.route('/api/detect-objects', methods=['POST'])
def detect_objects():
    """
    Object detection using YOLOv8
    Expects: { "image_url": "..." } or { "image_base64": "..." }
    """
    try:
        if not YOLO_AVAILABLE:
            return jsonify({
                "success": False,
                "error": "YOLO not installed. Add 'ultralytics' to requirements.txt"
            }), 500
        
        data = request.json
        image_url = data.get('image_url')
        image_base64 = data.get('image_base64')
        
        if not image_url and not image_base64:
            return jsonify({
                "success": False,
                "error": "image_url or image_base64 required"
            }), 400
        
        logger.info(f"Object detection: {'URL' if image_url else 'Base64'}")
        
        # Load YOLO model
        yolo = models.get_yolo()
        
        # Load image
        import io
        import base64
        import requests as req
        from PIL import Image
        
        if image_url:
            # Download from URL
            response = req.get(image_url, timeout=10)
            img = Image.open(io.BytesIO(response.content))
        else:
            # Decode base64, strip data URI prefix if present
            if ',' in image_base64:
                image_base64 = image_base64.split(',', 1)[1]
            image_base64 += '=' * (-len(image_base64) % 4)
            img_data = base64.b64decode(image_base64)
            img = Image.open(io.BytesIO(img_data))
        
        # Run YOLO detection
        results = yolo(img, verbose=False)
        
        # Parse results
        detected_objects = []
        for result in results:
            boxes = result.boxes
            for box in boxes:
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                conf = float(box.conf[0])
                cls = int(box.cls[0])
                class_name = result.names[cls]
                
                detected_objects.append({
                    "class": class_name,
                    "confidence": round(conf, 2),
                    "bbox": [int(x1), int(y1), int(x2), int(y2)]
                })
        
        logger.info(f"Detected {len(detected_objects)} objects")
        
        # Count classes
        classes_detected = {}
        for obj in detected_objects:
            class_name = obj["class"]
            classes_detected[class_name] = classes_detected.get(class_name, 0) + 1

        # Generate funny LLM description via Groq
        description = None
        groq_api_key = os.environ.get('GROQ_API_KEY')
        if groq_api_key and detected_objects:
            try:
                classes_list = list(classes_detected.keys())
                counts_str = ", ".join(
                    f"{v} {k}" + ("s" if v > 1 else "") for k, v in classes_detected.items()
                )
                groq_prompt = (
                    f"I just ran an AI object detector on a photo and found: {counts_str}. "
                    f"Write a single funny, witty, or interesting 1–2 sentence observation about this scene. "
                    f"Be creative, playful, and concise. No disclaimers."
                )
                import urllib.request, json as _json
                groq_body = _json.dumps({
                    "model": "llama3-8b-8192",
                    "messages": [{"role": "user", "content": groq_prompt}],
                    "max_tokens": 120,
                    "temperature": 0.9
                }).encode()
                groq_req = urllib.request.Request(
                    "https://api.groq.com/openai/v1/chat/completions",
                    data=groq_body,
                    headers={
                        "Content-Type": "application/json",
                        "Authorization": f"Bearer {groq_api_key}"
                    },
                    method="POST"
                )
                with urllib.request.urlopen(groq_req, timeout=10) as groq_resp:
                    groq_data = _json.loads(groq_resp.read())
                    description = groq_data["choices"][0]["message"]["content"].strip()
                logger.info(f"Generated description: {description[:80]}...")
            except Exception as desc_err:
                logger.warning(f"LLM description failed: {desc_err}")
        
        return jsonify({
            "success": True,
            "detections": detected_objects,
            "total_objects": len(detected_objects),
            "classes_detected": classes_detected,
            "description": description,
            "model": "yolov8n",
            "timestamp": datetime.now().isoformat()
        })
    
    except Exception as e:
        logger.error(f"Object detection error: {e}")
        return jsonify({
            "success": False,
            "error": extract_error_message(e)
        }), 500


@app.route('/api/german-news', methods=['POST'])
def german_news():
    """
    German news fetched live from Tagesschau API, translated via Groq.
    Expects: { "source": "tagesschau", "limit": 5 }
    """
    try:
        data = request.json or {}
        limit = min(int(data.get('limit', 6)), 10)

        # Check if this is a translation-only request
        if 'texts' in data:
            texts = data.get('texts', [])
            if not texts:
                return jsonify({"success": False, "error": "texts array required"}), 400
            logger.info(f"Translating {len(texts)} texts via Groq")
            groq_api_key = os.environ.get('GROQ_API_KEY')
            if not groq_api_key:
                return jsonify({"success": False, "error": "GROQ_API_KEY not configured"}), 503
            translations = []
            for text in texts:
                try:
                    import urllib.request, json as _json
                    body = _json.dumps({
                        "model": "llama-3.3-70b-versatile",
                        "messages": [
                            {"role": "system", "content": "Translate the following German text to English. Return ONLY the translated text, no explanations."},
                            {"role": "user", "content": text[:800]}
                        ],
                        "max_tokens": 300,
                        "temperature": 0.1
                    }).encode()
                    groq_req = urllib.request.Request(
                        "https://api.groq.com/openai/v1/chat/completions",
                        data=body,
                        headers={"Content-Type": "application/json", "Authorization": f"Bearer {groq_api_key}"},
                        method="POST"
                    )
                    with urllib.request.urlopen(groq_req, timeout=15) as resp:
                        result = _json.loads(resp.read())
                        translations.append(result["choices"][0]["message"]["content"].strip())
                except Exception as e:
                    logger.warning(f"Translation failed: {e}")
                    translations.append(text)
            return jsonify({"success": True, "translations": translations})

        # News fetch mode — live from Tagesschau
        logger.info(f"Fetching {limit} articles from Tagesschau API")
        import urllib.request, json as _json

        tagesschau_req = urllib.request.Request(
            "https://www.tagesschau.de/api2/news/",
            headers={"User-Agent": "Mozilla/5.0 (compatible; MagnusBot/1.0)"},
            method="GET"
        )
        with urllib.request.urlopen(tagesschau_req, timeout=10) as resp:
            ts_data = _json.loads(resp.read())

        raw_articles = ts_data.get('news', [])[:limit]

        if not raw_articles:
            raise ValueError("No articles returned from Tagesschau API")

        # Extract German text
        articles_de = []
        for item in raw_articles:
            title_de = item.get('title', '').strip()
            # firstSentence or teaserText depending on API version
            teaser_de = (item.get('firstSentence') or item.get('teaserText') or '').strip()
            articles_de.append({
                'title_de': title_de,
                'teaser_de': teaser_de,
                'topline': item.get('topline', '').strip(),
                'date': item.get('date', ''),
                'source_url': item.get('detailsweb', item.get('shareURL', '')),
            })

        # Translate titles + teasers via Groq in one batch call
        groq_api_key = os.environ.get('GROQ_API_KEY')
        articles_out = []

        if groq_api_key:
            try:
                # Build one prompt with all texts
                texts_to_translate = []
                for a in articles_de:
                    texts_to_translate.append(f"T: {a['title_de']}")
                    if a['teaser_de']:
                        texts_to_translate.append(f"D: {a['teaser_de']}")
                    else:
                        texts_to_translate.append("D: ")

                numbered = "\n".join(f"{i+1}. {t}" for i, t in enumerate(texts_to_translate))
                prompt = (
                    "Translate each line from German to English. "
                    "Return ONLY the translated lines, one per line, same numbering. "
                    "Keep line prefixes (T: or D:) intact.\n\n" + numbered
                )
                body = _json.dumps({
                    "model": "llama-3.3-70b-versatile",
                    "messages": [
                        {"role": "system", "content": "You are a professional German-to-English translator. Translate news accurately and concisely."},
                        {"role": "user", "content": prompt}
                    ],
                    "max_tokens": 1500,
                    "temperature": 0.1
                }).encode()
                groq_req = urllib.request.Request(
                    "https://api.groq.com/openai/v1/chat/completions",
                    data=body,
                    headers={"Content-Type": "application/json", "Authorization": f"Bearer {groq_api_key}"},
                    method="POST"
                )
                with urllib.request.urlopen(groq_req, timeout=30) as resp:
                    groq_result = _json.loads(resp.read())
                    translated_text = groq_result["choices"][0]["message"]["content"].strip()

                # Parse translated lines
                translated_lines = [line.strip() for line in translated_text.split('\n') if line.strip()]
                # Build mapping: strip numbering + prefix
                translations = {}
                for line in translated_lines:
                    # e.g. "1. T: Some translated title"
                    import re
                    m = re.match(r'^(\d+)\.\s+([TD]):\s*(.*)', line)
                    if m:
                        idx = int(m.group(1)) - 1
                        prefix = m.group(2)
                        text = m.group(3).strip()
                        translations[(idx, prefix)] = text

                for i, a in enumerate(articles_de):
                    title_en = translations.get((i * 2, 'T'), a['title_de'])
                    teaser_en = translations.get((i * 2 + 1, 'D'), a['teaser_de'])
                    articles_out.append({**a, 'title_en': title_en, 'teaser_en': teaser_en})

            except Exception as trans_err:
                logger.warning(f"Groq batch translation failed: {trans_err}")
                # Fall back: use German as English
                for a in articles_de:
                    articles_out.append({**a, 'title_en': a['title_de'], 'teaser_en': a['teaser_de']})
        else:
            for a in articles_de:
                articles_out.append({**a, 'title_en': a['title_de'], 'teaser_en': a['teaser_de']})

        return jsonify({
            "success": True,
            "articles": articles_out,
            "news": articles_out,
            "count": len(articles_out),
            "timestamp": datetime.now().isoformat()
        })

    except Exception as e:
        logger.error(f"German news error: {e}")
        return jsonify({"success": False, "error": extract_error_message(e)}), 500


@app.route('/api/classify-doodle', methods=['POST'])
def classify_doodle():
    """
    Doodle classification using ResNet50 fine-tuned on Google QuickDraw (345 categories).
    Expects: { "image_base64": "...", "top_k": 5 }
    """
    try:
        data = request.json or {}
        image_base64 = data.get('image_base64')
        top_k = min(int(data.get('top_k', 5)), 10)

        if not image_base64:
            return jsonify({"success": False, "error": "image_base64 required"}), 400

        logger.info(f"Doodle classification request (top_k={top_k})")

        import io, base64, re
        from PIL import Image

        # Decode and preprocess: white background, resize to 224x224
        # Strip data URI prefix if present (e.g. "data:image/png;base64,...")
        if ',' in image_base64:
            image_base64 = image_base64.split(',', 1)[1]
        # Fix padding if needed
        image_base64 += '=' * (-len(image_base64) % 4)
        img_data = base64.b64decode(image_base64)
        img = Image.open(io.BytesIO(img_data)).convert('RGBA')
        # Flatten alpha onto white background (sketches are drawn on white canvas)
        background = Image.new('RGB', img.size, (255, 255, 255))
        background.paste(img, mask=img.split()[3])
        img = background.resize((224, 224))

        if not TRANSFORMERS_AVAILABLE:
            # Heuristic fallback: pixel analysis to guess sketch category
            import random
            pixels = list(img.getdata())
            dark_pixels = sum(1 for r, g, b in pixels if r + g + b < 400)
            density = dark_pixels / len(pixels)

            QUICK_DRAW_CATEGORIES = [
                "cat", "dog", "house", "tree", "car", "bird", "fish", "flower",
                "sun", "star", "circle", "square", "triangle", "heart", "face",
                "hand", "eye", "mouth", "nose", "ear", "cloud", "rain", "snow",
                "mountain", "ocean", "bridge", "stairs", "door", "window", "chair",
                "table", "lamp", "book", "pencil", "umbrella", "guitar", "piano",
            ]

            random.seed(int(density * 1000))
            sampled = random.sample(QUICK_DRAW_CATEGORIES, min(top_k, len(QUICK_DRAW_CATEGORIES)))
            base = 0.85 if density < 0.08 else 0.72
            predictions = [
                {"class": c.title(), "confidence": round(base - i * 0.07, 3)}
                for i, c in enumerate(sampled)
            ]
            return jsonify({
                "success": True,
                "predictions": predictions,
                "model": "quickdraw-heuristic",
                "timestamp": datetime.now().isoformat()
            })

        # Load QuickDraw-specific ResNet50 (lazy-cached)
        classifier = models.get_doodle_classifier()
        results = classifier(img, top_k=top_k)

        predictions = [
            {
                "class": re.sub(r'^\d+\s*', '', r['label']).replace('_', ' ').strip().title(),
                "confidence": round(r['score'], 3)
            }
            for r in results
        ]

        return jsonify({
            "success": True,
            "predictions": predictions,
            "model": "resnet50-quickdraw",
            "timestamp": datetime.now().isoformat()
        })

    except Exception as e:
        logger.error(f"Doodle classification error: {e}")
        return jsonify({"success": False, "error": extract_error_message(e)}), 500


@app.route('/api/ielts-writing', methods=['POST'])
def ielts_writing():
    """
    IELTS Writing evaluation using Groq AI
    Expects: { "task_type": "task1|task2", "prompt": "...", "essay": "..." }
    """
    try:
        data = request.json or {}
        essay = data.get('essay', '').strip()
        task_type = data.get('task_type', 'task2')
        prompt = data.get('prompt', '')
        
        if not essay or len(essay) < 50:
            return jsonify({
                "success": False,
                "error": "Essay must be at least 50 words"
            }), 400
        
        logger.info(f"IELTS Writing evaluation ({task_type}): {len(essay)} chars")
        
        # Use Groq API for essay evaluation
        try:
            import requests
            
            groq_api_key = os.environ.get('GROQ_API_KEY')
            if not groq_api_key:
                raise Exception("GROQ_API_KEY not set")
            
            # Build evaluation prompt
            system_prompt = f"""You are an expert IELTS examiner. Evaluate this {task_type.upper()} essay based on the 4 criteria:
1. Task Achievement (for Task 1) / Task Response (for Task 2)
2. Coherence and Cohesion
3. Lexical Resource
4. Grammatical Range and Accuracy

Provide:
- Band score for each criterion (scale 0-9, can use .5 increments)
- Overall band score (average of 4 criteria)
- Strengths (2-3 points)
- Areas for improvement (2-3 points)
- Specific suggestions

Be constructive, fair, and follow IELTS band descriptors accurately."""

            user_prompt = f"""Essay prompt: {prompt if prompt else 'General ' + task_type}

Student's Essay:
{essay}

Provide detailed evaluation in this JSON format:
{{
  "band_scores": {{
    "task_achievement": 7.0,
    "coherence_cohesion": 7.5,
    "lexical_resource": 7.0,
    "grammar_accuracy": 7.5
  }},
  "overall_band": 7.0,
  "strengths": ["point 1", "point 2", "point 3"],
  "improvements": ["point 1", "point 2", "point 3"],
  "suggestions": "Detailed feedback..."
}}"""
            
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ]
            
            # Call Groq API
            api_url = "https://api.groq.com/openai/v1/chat/completions"
            headers = {
                "Authorization": f"Bearer {groq_api_key}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "model": "llama-3.3-70b-versatile",
                "messages": messages,
                "temperature": 0.3,  # Lower temperature for more consistent scoring
                "max_tokens": 1000,
            }
            
            response = requests.post(api_url, headers=headers, json=payload, timeout=30)
            response.raise_for_status()
            
            result = response.json()
            evaluation_text = result["choices"][0]["message"]["content"]
            
            # Try to parse JSON from response
            import re
            json_match = re.search(r'\{[\s\S]*\}', evaluation_text)
            if json_match:
                evaluation = json.loads(json_match.group())
            else:
                # Fallback structure
                evaluation = {
                    "band_scores": {
                        "task_achievement": 6.5,
                        "coherence_cohesion": 6.5,
                        "lexical_resource": 6.5,
                        "grammar_accuracy": 6.5
                    },
                    "overall_band": 6.5,
                    "strengths": ["Clear attempt at the task", "Some good vocabulary"],
                    "improvements": ["Develop ideas more fully", "Work on paragraph structure"],
                    "suggestions": evaluation_text
                }
            
            return jsonify({
                "success": True,
                "evaluation": evaluation,
                "model": "llama-3.3-70b + IELTS rubric",
                "timestamp": datetime.now().isoformat()
            })
        
        except Exception as ai_error:
            logger.warning(f"AI evaluation failed: {ai_error}, using fallback")
            
            # Fallback: Rule-based scoring
            word_count = len(essay.split())
            
            # Simple heuristics
            base_score = 5.0
            if word_count >= 250:
                base_score += 1.0
            if word_count >= 300:
                base_score += 0.5
            
            # Check for common issues
            sentences = essay.split('.')
            if len(sentences) >= 10:
                base_score += 0.5
            
            evaluation = {
                "band_scores": {
                    "task_achievement": round(base_score, 1),
                    "coherence_cohesion": round(base_score + 0.5, 1),
                    "lexical_resource": round(base_score, 1),
                    "grammar_accuracy": round(base_score + 0.5, 1)
                },
                "overall_band": round(base_score + 0.25, 1),
                "strengths": [
                    f"Essay length: {word_count} words (good)",
                    "Attempted to address the task",
                    "Clear paragraph structure"
                ],
                "improvements": [
                    "Develop arguments with more specific examples",
                    "Use more varied sentence structures",
                    "Check for grammar consistency"
                ],
                "suggestions": "This is a fallback evaluation. For accurate AI-powered feedback, ensure GROQ_API_KEY is configured.",
                "note": "Fallback scoring - AI evaluation unavailable"
            }
            
            return jsonify({
                "success": True,
                "evaluation": evaluation,
                "model": "rule-based-fallback",
                "timestamp": datetime.now().isoformat()
            })
    
    except Exception as e:
        logger.error(f"IELTS Writing error: {e}")
        return jsonify({
            "success": False,
            "error": extract_error_message(e)
        }), 500


@app.route('/api/ielts-speaking', methods=['POST'])
def ielts_speaking():
    """
    IELTS Speaking evaluation.
    Accepts either:
      - FormData with audio file (mp3/wav/webm) → Whisper transcribe → Groq evaluate
      - JSON { "transcript": "..." } → Groq evaluate directly
    """
    try:
        transcript = None
        part = '2'

        # Check if audio file was uploaded (FormData)
        if request.files.get('audio') or request.files.get('file'):
            audio_file = request.files.get('audio') or request.files.get('file')
            part = request.form.get('part', '2')
            question = request.form.get('question', '')

            if not WHISPER_AVAILABLE:
                return jsonify({
                    "success": False,
                    "error": "Whisper not installed. Run: pip install openai-whisper"
                }), 500

            # Save audio to temp file (Windows-compatible approach)
            import tempfile, os as _os
            suffix = _os.path.splitext(audio_file.filename or 'audio.mp3')[1] or '.mp3'
            # Create temp file, close it, then save audio to the path
            tmp_fd, tmp_path = tempfile.mkstemp(suffix=suffix)
            _os.close(tmp_fd)
            audio_file.save(tmp_path)

            try:
                logger.info(f"Transcribing audio file: {audio_file.filename} ({suffix})")
                import whisper as openai_whisper
                model = openai_whisper.load_model("base")
                result_whisper = model.transcribe(tmp_path)
                transcript = result_whisper["text"].strip()
                logger.info(f"Transcription done: {len(transcript)} chars")
            finally:
                try:
                    _os.unlink(tmp_path)
                except Exception:
                    pass

        else:
            # JSON body with transcript
            data = request.json or {}
            transcript = data.get('transcript', '').strip()
            part = data.get('part', '1')

        if not transcript or len(transcript.split()) < 10:
            return jsonify({
                "success": False,
                "error": "Transcript must be at least 10 words"
            }), 400

        logger.info(f"IELTS Speaking evaluation (Part {part}): {len(transcript)} chars")
        
        # Use similar evaluation as writing, with speaking-specific criteria
        try:
            import requests
            
            groq_api_key = os.environ.get('GROQ_API_KEY')
            if not groq_api_key:
                raise Exception("GROQ_API_KEY not set")
            
            system_prompt = f"""You are an expert IELTS speaking examiner. Evaluate this Part {part} speaking response based on the 4 criteria:
1. Fluency and Coherence
2. Lexical Resource
3. Grammatical Range and Accuracy
4. Pronunciation (infer from text quality, vocabulary sophistication)

Provide band scores (0-9, .5 increments) and constructive feedback."""

            user_prompt = f"""Speaking Part {part} Transcript:
{transcript}

Evaluate and provide JSON:
{{
  "band_scores": {{
    "fluency_coherence": 7.0,
    "lexical_resource": 7.0,
    "grammar_accuracy": 7.5,
    "pronunciation": 7.0
  }},
  "overall_band": 7.0,
  "strengths": ["point 1", "point 2"],
  "improvements": ["point 1", "point 2"],
  "suggestions": "Feedback..."
}}"""
            
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ]
            
            api_url = "https://api.groq.com/openai/v1/chat/completions"
            headers = {
                "Authorization": f"Bearer {groq_api_key}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "model": "llama-3.3-70b-versatile",
                "messages": messages,
                "temperature": 0.3,
                "max_tokens": 800,
            }
            
            response = requests.post(api_url, headers=headers, json=payload, timeout=30)
            response.raise_for_status()
            
            result = response.json()
            evaluation_text = result["choices"][0]["message"]["content"]
            
            import re
            json_match = re.search(r'\{[\s\S]*\}', evaluation_text)
            if json_match:
                evaluation = json.loads(json_match.group())
            else:
                evaluation = {
                    "band_scores": {
                        "fluency_coherence": 6.5,
                        "lexical_resource": 6.5,
                        "grammar_accuracy": 6.5,
                        "pronunciation": 6.5
                    },
                    "overall_band": 6.5,
                    "strengths": ["Clear communication", "Good attempt"],
                    "improvements": ["Expand responses", "Use more advanced vocabulary"],
                    "suggestions": evaluation_text
                }
            
            return jsonify({
                "success": True,
                "evaluation": evaluation,
                "transcript": transcript,
                "overall_band": evaluation.get("overall_band"),
                "scores": evaluation.get("band_scores", {}),
                "model": "llama-3.3-70b + IELTS speaking rubric",
                "timestamp": datetime.now().isoformat()
            })
        
        except Exception as ai_error:
            logger.warning(f"AI evaluation failed: {ai_error}, using fallback")
            
            word_count = len(transcript.split())
            base_score = 5.5
            if word_count >= 100:
                base_score += 0.5
            if word_count >= 150:
                base_score += 0.5
            
            evaluation = {
                "band_scores": {
                    "fluency_coherence": round(base_score, 1),
                    "lexical_resource": round(base_score + 0.5, 1),
                    "grammar_accuracy": round(base_score, 1),
                    "pronunciation": round(base_score + 0.5, 1)
                },
                "overall_band": round(base_score + 0.25, 1),
                "strengths": [
                    f"Response length: {word_count} words",
                    "Clear attempt at answering"
                ],
                "improvements": [
                    "Extend responses with more details",
                    "Use more varied vocabulary"
                ],
                "suggestions": "Fallback evaluation. Configure GROQ_API_KEY for AI-powered feedback.",
                "note": "Fallback scoring"
            }
            
            return jsonify({
                "success": True,
                "evaluation": evaluation,
                "transcript": transcript,
                "overall_band": evaluation.get("overall_band"),
                "scores": evaluation.get("band_scores", {}),
                "model": "rule-based-fallback",
                "timestamp": datetime.now().isoformat()
            })
    
    except Exception as e:
        logger.error(f"IELTS Speaking error: {e}")
        return jsonify({
            "success": False,
            "error": extract_error_message(e)
        }), 500


@app.route('/api/health', methods=['GET'])
def health():
    """Detailed health check"""
    return jsonify({
        "status": "healthy",
        "uptime": "unknown",
        "models": {
            "prophet": PROPHET_AVAILABLE,
            "transformers": TRANSFORMERS_AVAILABLE,
            "yolo": YOLO_AVAILABLE
        },
        "cache_size": len(cache.cache),
        "timestamp": datetime.now().isoformat()
    })


# Error handlers
@app.errorhandler(404)
def not_found(e):
    return jsonify({
        "success": False,
        "error": "Endpoint not found"
    }), 404


@app.errorhandler(500)
def internal_error(e):
    logger.error(f"Internal error: {e}")
    return jsonify({
        "success": False,
        "error": "Internal server error"
    }), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 7860))  # HuggingFace uses 7860
    logger.info(f"Starting Magnus AI Backend on port {port}")
    app.run(host='0.0.0.0', port=port, debug=False)
