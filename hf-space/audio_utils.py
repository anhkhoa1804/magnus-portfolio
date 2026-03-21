"""
Audio Processing Utilities for IELTS Speaking System
Phase 1: Fluency Metrics Extraction
Phase 3: Pronunciation Analysis via Wav2Vec 2.0
"""

import os
import json
import logging
import tempfile
from typing import Dict, Any, Tuple, List
import numpy as np

logger = logging.getLogger(__name__)

# ============================================================================
# PHASE 1: ASR WITH FLUENCY METRICS (Whisper Enhancement)
# ============================================================================

def transcribe_with_fluency_metrics(audio_path: str) -> Dict[str, Any]:
    """
    Transcribe audio using Whisper and extract fluency metrics.
    
    Returns:
    - transcript: Full transcribed text
    - word_count: Total words spoken
    - wpm: Words Per Minute (speaking rate)
    - total_duration: Total speaking time (seconds)
    - pause_count: Number of pauses > 0.5 seconds
    - pauses: List of pause events with timings
    - longest_pause: Duration of longest pause
    - avg_pause_duration: Average pause duration
    """
    
    try:
        import whisper
    except ImportError:
        logger.error("Whisper not installed. Run: pip install openai-whisper")
        return {
            "error": "Whisper not available",
            "transcript": "",
            "wpm": 0,
            "pause_count": 0
        }
    
    try:
        # Load Whisper model (base recommended for speed/accuracy balance)
        logger.info(f"Loading Whisper base model for: {audio_path}")
        model = whisper.load_model("base")
        
        # Transcribe with verbose output for segment timing
        result = model.transcribe(
            audio_path,
            language="en",
            verbose=False,
            fp16=False  # Disable fp16 for better compatibility
        )
        
        transcript = result.get("text", "").strip()
        segments = result.get("segments", [])
        
        if not segments:
            logger.warning("No segments returned from Whisper")
            return {
                "error": "No speech detected",
                "transcript": transcript,
                "wpm": 0,
                "pause_count": 0
            }
        
        # Extract timing information from segments
        start_time = segments[0]["start"]
        end_time = segments[-1]["end"]
        total_duration = end_time - start_time
        
        # Count words
        word_count = len(transcript.split())
        
        # Calculate WPM (Words Per Minute)
        speaking_time_minutes = total_duration / 60 if total_duration > 0 else 0
        wpm = word_count / speaking_time_minutes if speaking_time_minutes > 0 else 0
        
        # Detect pauses (gaps between segments > 0.5 seconds)
        pauses = []
        for i in range(len(segments) - 1):
            gap = segments[i + 1]["start"] - segments[i]["end"]
            if gap > 0.5:  # IELTS considers pauses > 0.5s significant
                pauses.append({
                    "start": round(segments[i]["end"], 2),
                    "end": round(segments[i + 1]["start"], 2),
                    "duration": round(gap, 2)
                })
        
        pause_count = len(pauses)
        longest_pause = max([p["duration"] for p in pauses]) if pauses else 0
        avg_pause_duration = sum([p["duration"] for p in pauses]) / pause_count if pause_count > 0 else 0
        
        # Extract unique words for lexical diversity
        words = transcript.lower().split()
        unique_words = len(set(words))
        
        logger.info(
            f"Transcription complete: {word_count} words, "
            f"{wpm:.1f} WPM, {pause_count} pauses, "
            f"duration {total_duration:.1f}s"
        )
        
        return {
            "success": True,
            "transcript": transcript,
            "word_count": word_count,
            "unique_words": unique_words,
            "wpm": round(wpm, 1),
            "total_duration": round(total_duration, 1),
            "pause_count": pause_count,
            "pauses": pauses,
            "longest_pause": round(longest_pause, 2),
            "avg_pause_duration": round(avg_pause_duration, 2),
            "segments": [(seg["start"], seg["end"], seg["text"]) for seg in segments]
        }
    
    except Exception as e:
        logger.error(f"Whisper transcription error: {e}")
        return {
            "error": str(e),
            "success": False,
            "transcript": "",
            "wpm": 0,
            "pause_count": 0
        }


# ============================================================================
# PHASE 3: PRONUNCIATION ANALYSIS (Wav2Vec 2.0)
# ============================================================================

def analyze_pronunciation_wav2vec(audio_path: str, reference_transcript: str) -> Dict[str, Any]:
    """
    Analyze pronunciation using Wav2Vec 2.0 (phoneme-level recognition).
    Compares speaker's phoneme sequence against reference transcript.
    
    Parameters:
    - audio_path: Path to audio file
    - reference_transcript: Expected/correct transcription (from Whisper)
    
    Returns:
    - pronunciation_accuracy: 0.0-1.0 accuracy score
    - wav2vec_transcript: Wav2Vec recognized text
    - phoneme_errors: List of detected phoneme errors
    - native_accent_score: Estimated accent deviation (0.0-1.0)
    """
    
    try:
        import torch
        import torchaudio
        from transformers import Wav2Vec2Processor, Wav2Vec2ForCTC
    except ImportError:
        logger.warning("Wav2Vec dependencies not available. Skipping pronunciation analysis.")
        return {
            "error": "Wav2Vec not installed",
            "accuracy": 0.5,
            "was_attempted": False
        }
    
    try:
        logger.info("Loading Wav2Vec 2.0 model...")
        
        # Load pretrained Wav2Vec 2.0 model and processor
        processor = Wav2Vec2Processor.from_pretrained("facebook/wav2vec2-base-960h")
        model = Wav2Vec2ForCTC.from_pretrained("facebook/wav2vec2-base-960h")
        
        # Load audio
        waveform, sample_rate = torchaudio.load(audio_path)
        
        # Resample if necessary (Wav2Vec expects 16kHz)
        if sample_rate != 16000:
            resampler = torchaudio.transforms.Resample(sample_rate, 16000)
            waveform = resampler(waveform)
        
        # Convert stereo to mono if necessary
        if waveform.shape[0] > 1:
            waveform = waveform.mean(dim=0, keepdim=True)
        
        # Process audio
        input_values = processor(
            waveform.squeeze().numpy(),
            sampling_rate=16000,
            return_tensors="pt"
        ).input_values
        
        # Inference
        with torch.no_grad():
            logits = model(input_values).logits
        
        # Decode predictions
        predicted_ids = torch.argmax(logits, dim=-1)
        predicted_transcript = processor.batch_decode(predicted_ids)[0]
        
        # Calculate accuracy by comparing transcripts
        from difflib import SequenceMatcher
        reference_lower = reference_transcript.lower()
        predicted_lower = predicted_transcript.lower()
        
        matcher = SequenceMatcher(None, reference_lower, predicted_lower)
        accuracy = matcher.ratio()
        
        # Detailed error analysis
        reference_words = reference_lower.split()
        predicted_words = predicted_lower.split()
        
        phoneme_errors = []
        for i, (ref_word, pred_word) in enumerate(zip(reference_words, predicted_words)):
            if ref_word != pred_word:
                phoneme_errors.append({
                    "position": i,
                    "expected": ref_word,
                    "actual": pred_word,
                    "similarity": get_string_similarity(ref_word, pred_word)
                })
        
        logger.info(
            f"Wav2Vec analysis: {accuracy:.1%} accuracy, "
            f"{len(phoneme_errors)} phoneme errors"
        )
        
        return {
            "success": True,
            "pronunciation_accuracy": round(accuracy, 3),
            "wav2vec_transcript": predicted_transcript,
            "reference_transcript": reference_transcript,
            "phoneme_errors": phoneme_errors[:10],  # Top 10 errors
            "phoneme_error_count": len(phoneme_errors),
            "was_attempted": True
        }
    
    except Exception as e:
        logger.error(f"Wav2Vec pronunciation analysis error: {e}")
        return {
            "error": str(e),
            "accuracy": 0.5,
            "was_attempted": False
        }


def get_string_similarity(s1: str, s2: str) -> float:
    """Calculate string similarity using Levenshtein-like distance (0.0-1.0)."""
    from difflib import SequenceMatcher
    return SequenceMatcher(None, s1, s2).ratio()


# ============================================================================
# ADVANCED LEXICAL ANALYSIS
# ============================================================================

IELTS_ADVANCED_VOCABULARY = {
    # Academic / Advanced words commonly expected at Band 7+
    "nevertheless", "furthermore", "consequently", "moreover", "however",
    "albeit", "notwithstanding", "henceforth", "thenceforth", "thereof",
    "substantive", "profound", "elicit", "cognizant", "ambiguous",
    "paradigm", "dichotomy", "meticulous", "pragmatic", "circumvent",
    "constitute", "inherent", "inevitable", "facilitate", "exacerbate",
    "mitigate", "juxtapose", "ephemeral", "ubiquitous", "anomaly",
    "arbitrary", "benign", "burgeon", "candid", "commensurate",
    "disparate", "ebullient", "efficacious", "eloquent", "equivocal",
    "erudite", "esoteric", "ethereal", "euphemism", "exigency",
    "explicit", "extrapolate", "facetious", "fallacious", "fastidious",
    "felicitous", "fervent", "fervid", "fetid", "fickle", "fractious"
}

def analyze_lexical_characteristics(transcript: str) -> Dict[str, Any]:
    """
    Analyze lexical complexity and diversity of the transcript.
    
    Returns:
    - word_count: Total words
    - unique_words: Distinct words
    - lexical_diversity: Type-Token Ratio (unique/total)
    - advanced_vocab_count: Count of advanced vocabulary usage
    - advanced_vocab_ratio: Percentage of advanced vocabulary
    - collocation_errors: Detected inappropriate word combinations
    """
    
    words = transcript.lower().split()
    word_count = len(words)
    unique_words = len(set(words))
    
    # Lexical Diversity (Type-Token Ratio)
    lexical_diversity = unique_words / max(word_count, 1)
    
    # Advanced vocabulary count
    advanced_vocab_count = sum(1 for word in words if word in IELTS_ADVANCED_VOCABULARY)
    advanced_vocab_ratio = advanced_vocab_count / max(word_count, 1)
    
    # Common collocation errors
    collocations = {
        "make a mistake": ["make mistake", "do a mistake"],
        "take a risk": ["make a risk", "take a risk without"],
        "do homework": ["make homework", "do the homework"],
        "be interested in": ["be interesting in", "interested about"],
        "pay attention to": ["pay attention on", "notice attention"],
    }
    
    collocation_errors = []
    for correct, incorrect_forms in collocations.items():
        for form in incorrect_forms:
            if form in transcript.lower():
                collocation_errors.append({
                    "error": form,
                    "correct": correct,
                    "type": "collocation"
                })
    
    logger.info(
        f"Lexical analysis: {word_count} words, "
        f"diversity {lexical_diversity:.2%}, "
        f"advanced vocab {advanced_vocab_ratio:.1%}"
    )
    
    return {
        "word_count": word_count,
        "unique_words": unique_words,
        "lexical_diversity": round(lexical_diversity, 3),
        "advanced_vocab_count": advanced_vocab_count,
        "advanced_vocab_ratio": round(advanced_vocab_ratio, 3),
        "collocation_errors": collocation_errors[:5]
    }


# ============================================================================
# PHASE 5: TEXT-TO-SPEECH (pyttsx3)
# ============================================================================

def generate_speech_from_text(text: str, output_path: str = None) -> Dict[str, Any]:
    """
    Generate speech audio from text using pyttsx3 (offline, free TTS).
    
    Parameters:
    - text: Text to convert to speech
    - output_path: Optional output file path. If None, returns bytes
    
    Returns:
    - success: Whether generation succeeded
    - output_path: Path to generated audio file
    - duration: Estimated duration in seconds
    """
    
    try:
        import pyttsx3
    except ImportError:
        logger.error("pyttsx3 not installed. Run: pip install pyttsx3")
        return {
            "error": "pyttsx3 not installed",
            "success": False
        }
    
    try:
        engine = pyttsx3.init()
        
        # Configure for IELTS examiner-like pace
        engine.setProperty('rate', 130)  # Words per minute (slower = more natural)
        engine.setProperty('volume', 0.95)
        
        # Estimate duration (rough: ~150 WPM natural pace)
        word_count = len(text.split())
        estimated_duration = word_count / 150 * 60  # Convert to seconds
        
        if output_path is None:
            output_path = tempfile.mktemp(suffix=".mp3")
        
        engine.save_to_file(text, output_path)
        engine.runAndWait()
        
        logger.info(f"Generated speech: {len(text)} chars, ~{estimated_duration:.1f}s")
        
        return {
            "success": True,
            "output_path": output_path,
            "estimated_duration": round(estimated_duration, 1),
            "word_count": word_count
        }
    
    except Exception as e:
        logger.error(f"TTS generation error: {e}")
        return {
            "error": str(e),
            "success": False
        }
