"""
IELTS Speaking Band Descriptors & Scoring System (Official British Council Standards)
Reference: https://www.ielts.org/about-the-test/band-scores
"""

from typing import Dict, Any, List
import json

# ============================================================================
# OFFICIAL IELTS BAND DESCRIPTORS (1-9 Scale)
# ============================================================================

IELTS_BAND_DESCRIPTORS = {
    "fluency_and_coherence": {
        9: {
            "short": "Expert",
            "description": "Speaks fluently with only rare repetition or self-correction. No effort required to understand; sentences are logically sequenced and well-linked with varied connectives.",
            "indicators": ["Seamless flow", "Native-like pacing", "Minimal pauses", "Complex linking"]
        },
        8: {
            "short": "Very Good",
            "description": "Speaks fluently and spontaneously with only occasional repetition or self-correction. Connections between ideas are generally well-marked and easy to follow; extensive use of linking phrases.",
            "indicators": ["Usually fluent", "Few hesitations", "Variable sentence structure", "Coherent development"]
        },
        7: {
            "short": "Good",
            "description": "Speaks at length without much effort or loss of coherence. May demonstrate language-related hesitation at times or some repetition and/or self-correction; uses a range of connectives and discourse markers but not always appropriately.",
            "indicators": ["Mostly fluent", "Some repetition", "Generally logical", "Occasional poor linking"]
        },
        6: {
            "short": "Competent",
            "description": "Expresses ideas clearly but may be imprecise at times. Uses connectives to develop argument although this may lack clarity or prominence; may be some repetition or self-correction.",
            "indicators": ["Clear expression", "Basic connectives", "Some hesitation", "Straightforward linking"]
        },
        5: {
            "short": "Modest",
            "description": "Usually produces stretches of connected speech despite some repetition and/or self-correction. Uses a limited range of connectives and may repeat themselves in their use.",
            "indicators": ["Connected speech with gaps", "Frequent repetition", "Limited connectives", "Repair attempts"]
        },
        4: {
            "short": "Limited",
            "description": "Produces isolated utterances or very short formulaic sequences. Little communication occurs despite repetition and self-correction of what is said.",
            "indicators": ["Fragmented speech", "Very limited range", "Difficult to understand", "Frequent hesitation"]
        },
        3: {
            "short": "Extremely Limited",
            "description": "Speaks with very long pauses. Has considerable difficulty in producing connected speech. Cannot initiate speech or sustain it without significant pausing or repair.",
            "indicators": ["Prolonged pauses", "Minimal sequences", "Listener effort required", "Breakdown in communication"]
        },
        1: {
            "short": "Non-User",
            "description": "Does not attempt to speak or only produces isolated words.",
            "indicators": []
        }
    },
    
    "lexical_resource": {
        9: {
            "short": "Expert",
            "description": "Uses sophisticated vocabulary with precise and natural collocations. Rare minor errors in word choice or word formation. Able to use less common lexical items accurately.",
            "indicators": ["Sophisticated range", "Natural collocations", "Precise word choice", "Rare errors"]
        },
        8: {
            "short": "Very Good",
            "description": "Uses a wide range of vocabulary fluently and with good precision. Occasional minor errors in collocations or word choice do not impede communication.",
            "indicators": ["Wide range", "Mostly accurate", "Well-chosen vocabulary", "Few collocation errors"]
        },
        7: {
            "short": "Good",
            "description": "Uses vocabulary effectively to discuss most topics at length, although may show some repetition. Attempts to use less common items but this may be unsuccessful at times.",
            "indicators": ["Adequate range", "Some repetition", "Good flexibility", "Some unsuccessful attempts"]
        },
        6: {
            "short": "Competent",
            "description": "Uses adequate vocabulary to talk about most topics. Some use of less common items but limited precision. Some errors in word choice or usage do not impede communication.",
            "indicators": ["Adequate range", "Some less common items", "Minor errors acceptable", "Communicates main ideas"]
        },
        5: {
            "short": "Modest",
            "description": "Uses vocabulary that is mostly adequate to talk about familiar topics. Limited use of less common items, but these may be used inappropriately. Errors in word choice or use may impede communication.",
            "indicators": ["Limited range", "Mostly familiar vocabulary", "Inappropriate item use", "Some obstruction"]
        },
        4: {
            "short": "Limited",
            "description": "Uses basic vocabulary which may be imprecise or inappropriate. Limited range restricts communication. Errors in word choice or use are frequent and may impede communication.",
            "indicators": ["Basic vocabulary", "Imprecise items", "Frequent errors", "Communication difficult"]
        },
        3: {
            "short": "Extremely Limited",
            "description": "Uses vocabulary that is largely inappropriate for the circumstances. Limited range of basic words with frequent errors impede understanding.",
            "indicators": ["Very basic vocabulary", "Inappropriate range", "Frequent errors", "Understanding impeded"]
        },
        1: {
            "short": "Non-User",
            "description": "Does not attempt to use vocabulary or only produces isolated words.",
            "indicators": []
        }
    },

    "grammatical_range_and_accuracy": {
        9: {
            "short": "Expert",
            "description": "Uses a wide range of structures accurately and with flexibility. Rare minor errors or inappropriacies occur. Complex structures are used accurately and effectively.",
            "indicators": ["Accurate complex structures", "Wide range", "Rare errors", "Effective use"]
        },
        8: {
            "short": "Very Good",
            "description": "Uses a wide range of structures accurately and appropriately. Most errors in complex structures still allow the message to be understood and do not noticeably impede communication.",
            "indicators": ["Good accuracy", "Complex structures", "Minor errors", "Message clear"]
        },
        7: {
            "short": "Good",
            "description": "Uses a range of structures to convey meaning. Accuracy is generally good although some errors in complex structures are present. These rarely impede communication.",
            "indicators": ["Good accuracy", "Reasonable range", "Some structural errors", "Meaning remains clear"]
        },
        6: {
            "short": "Competent",
            "description": "Uses a mix of simple and complex structures but these are not always used accurately or appropriately. However, complex grammatical forms are attempted and the meaning is generally clear.",
            "indicators": ["Mixed structures", "Accuracy adequate", "Some grammatical errors", "Meaning conveyed"]
        },
        5: {
            "short": "Modest",
            "description": "Uses a limited range of structures. Attempts complex sentences but these usually contain errors. Errors in both simple and complex structures are frequent and may cause difficulty for the listener.",
            "indicators": ["Limited range", "Errors in simple forms", "Frequent mistakes", "Some comprehension difficulty"]
        },
        4: {
            "short": "Limited",
            "description": "Produces a very limited range of structures. Attempts simple sentence forms but these are frequently incorrect. Basic errors are common and communication is significantly impeded.",
            "indicators": ["Very limited range", "Simple form errors", "Frequent basic mistakes", "Significantly impaired communication"]
        },
        3: {
            "short": "Extremely Limited",
            "description": "Very limited control of grammatical structures. Errors in basic and simple structures are frequent. Messages are difficult to understand as a result.",
            "indicators": ["Minimal control", "Basic structure errors", "Message unclear", "Comprehension difficult"]
        },
        1: {
            "short": "Non-User",
            "description": "Does not attempt to use structures or only produces isolated words.",
            "indicators": []
        }
    },

    "pronunciation": {
        9: {
            "short": "Expert",
            "description": "Uses a native-like accent and intonation patterns. Stress is placed appropriately; is intelligible and pleasant to listen to. Only rare phonemic errors occur.",
            "indicators": ["Native-like flow", "Natural stress", "Precise intonation", "Extremely clear"]
        },
        8: {
            "short": "Very Good",
            "description": "Generally uses an accent and intonation that is intelligible and pleasant. Stress is usually placed appropriately; intonation patterns are generally secure. Occasional phonemic errors occur.",
            "indicators": ["Clear accent", "Good stress patterns", "Secure intonation", "Mostly intelligible"]
        },
        7: {
            "short": "Good",
            "description": "Uses an accent and intonation that is generally intelligible. Stress is usually placed appropriately; intonation patterns are generally secure, though these may be somewhat limited. Phonemic errors occasionally occur.",
            "indicators": ["Intelligible accent", "Appropriate stress", "Secure intonation", "Occasional errors"]
        },
        6: {
            "short": "Competent",
            "description": "An accent and intonation are broadly intelligible. Stress and intonation patterns are generally appropriate. Phonemic errors occasionally occur and may cause listener effort.",
            "indicators": ["Broadly intelligible", "Generally appropriate stress", "Some pressure on listener", "Occasional errors"]
        },
        5: {
            "short": "Modest",
               "description": "Accent and intonation are intelligible but with noticeable deviation from native patterns so that listener effort is required at times. Phonemic errors regularly occur.",
            "indicators": ["Some accent deviation", "Listener effort needed", "Regular phonemic errors", "Somewhat intelligible"]
        },
        4: {
            "short": "Limited",
            "description": "Accent and intonation present some difficulty for listener. Stress patterns may be inappropriate. Phonemic errors are frequent and may require listener effort.",
            "indicators": ["Difficult accent", "Poor stress patterns", "Frequent phonemic errors", "Listener strain"]
        },
        3: {
            "short": "Extremely Limited",
            "description": "Accent and intonation are difficult to understand, which requires significant listener effort. Stress patterns are frequently inappropriate. Many phonemic errors occur.",
            "indicators": ["Very difficult accent", "Severe stress errors", "Many phonemic errors", "High listener effort"]
        },
        1: {
            "short": "Non-User",
            "description": "Does not produce intelligible speech.",
            "indicators": []
        }
    }
}

# ============================================================================
# OBJECTIVE FLUENCY METRICS TO IELTS BAND CONVERSION
# ============================================================================

def calculate_fluency_band(wpm: float, pause_count: int, longest_pause: float, total_duration: float) -> Dict[str, Any]:
    """
    Convert objective fluency metrics to IELTS Fluency & Coherence band (1-9)
    with calibration based on native speaker data.
    
    Metrics:
    - wpm: Words Per Minute (speaking rate)
    - pause_count: Number of pauses > 0.5 seconds
    - longest_pause: Duration of longest pause (seconds)
    - total_duration: Total speaking time (seconds)
    
    IELTS Band Reference Data:
    - Band 9 (Native): 150-180 WPM, ≤2 pauses, max pause <1s
    - Band 8: 140-160 WPM, ≤3 pauses, max pause <1.2s
    - Band 7: 120-140 WPM, ≤5 pauses, max pause <1.5s
    - Band 6: 100-120 WPM, ≤8 pauses, max pause <2s
    - Band 5: 80-100 WPM, ≤12 pauses, max pause <2.5s
    - Band 4: 60-80 WPM, >12 pauses, max pause >2.5s
    """
    
    # Determine band based on WPM (primary metric)
    if wpm >= 150 and pause_count <= 2 and longest_pause < 1.0:
        base_band = 9.0
        reasoning = f"Excellent pace ({wpm:.0f} WPM) with minimal hesitations"
    elif wpm >= 140 and pause_count <= 3 and longest_pause < 1.2:
        base_band = 8.5
        reasoning = f"Very good pace ({wpm:.0f} WPM) with few pauses"
    elif wpm >= 130 and pause_count <= 4 and longest_pause < 1.5:
        base_band = 8.0
        reasoning = f"Good pace ({wpm:.0f} WPM) with occasional hesitations"
    elif wpm >= 120 and pause_count <= 5 and longest_pause < 1.5:
        base_band = 7.5
        reasoning = f"Competent pace ({wpm:.0f} WPM) with some pauses"
    elif wpm >= 110 and pause_count <= 6 and longest_pause < 1.8:
        base_band = 7.0
        reasoning = f"Steady pace ({wpm:.0f} WPM) with moderate pauses"
    elif wpm >= 100 and pause_count <= 8 and longest_pause < 2.0:
        base_band = 6.5
        reasoning = f"Acceptable pace ({wpm:.0f} WPM) with noticeable hesitations"
    elif wpm >= 90 and pause_count <= 10 and longest_pause < 2.5:
        base_band = 6.0
        reasoning = f"Moderate pace ({wpm:.0f} WPM) with frequent pauses"
    elif wpm >= 80 and pause_count <= 12 and longest_pause < 3.0:
        base_band = 5.5
        reasoning = f"Slow pace ({wpm:.0f} WPM) with many pauses"
    elif wpm >= 70 and pause_count <= 15:
        base_band = 5.0
        reasoning = f"Very slow pace ({wpm:.0f} WPM) with hesitations"
    elif wpm >= 60:
        base_band = 4.5
        reasoning = f"Extremely slow pace ({wpm:.0f} WPM) with significant difficulty"
    else:
        base_band = 3.5
        reasoning = f"Non-continuous speech ({wpm:.0f} WPM)"
    
    # Penalty adjustments
    adjustments = []
    band = base_band
    
    # Excessive pauses penalty
    if pause_count > 15:
        band = min(base_band, 4.0)
        adjustments.append(f"Penalty: Excessive pauses ({pause_count})")
    elif pause_count > 10 and base_band > 5.5:
        band = max(base_band - 0.5, 5.0)
        adjustments.append(f"Penalty: High pause count ({pause_count})")
    
    # Very long pauses penalty (indicates severe difficulty)
    if longest_pause > 4.0:
        band = max(band - 1.0, 1.0)
        adjustments.append(f"Penalty: Very long pause ({longest_pause:.1f}s)")
    elif longest_pause > 3.0 and base_band > 5.0:
        band = max(band - 0.5, 4.0)
        adjustments.append(f"Penalty: Long pause ({longest_pause:.1f}s)")
    
    # Normalization - round to nearest 0.5
    band = round(band * 2) / 2
    band = min(9.0, max(1.0, band))
    
    return {
        "fluency_band": band,
        "wpm": round(wpm, 1),
        "pause_count": pause_count,
        "longest_pause": round(longest_pause, 2),
        "base_band": base_band,
        "adjustments": adjustments,
        "reasoning": reasoning
    }


def calculate_lexical_band(
    word_count: int,
    unique_words: int,
    advanced_vocab_count: int,
    errors: List[str] = None
) -> Dict[str, Any]:
    """
    Convert lexical characteristics to IELTS Lexical Resource band (1-9).
    
    Parameters:
    - word_count: Total words spoken
    - unique_words: Number of distinct words used
    - advanced_vocab_count: Count of words from advanced vocabulary list
    - errors: List of vocabulary/collocation errors detected
    """
    
    errors = errors or []
    
    # Calculate lexical diversity (Type-Token Ratio: unique/total)
    lexical_diversity = unique_words / max(word_count, 1) if word_count > 0 else 0
    
    # Advanced vocabulary ratio
    advanced_ratio = advanced_vocab_count / max(word_count, 1) if word_count > 0 else 0
    
    # IELTS Lexical Band Reference:
    # Band 9: TTR > 0.55, advanced vocab >25%, rare errors
    # Band 8: TTR > 0.50, advanced vocab >20%, occasional errors
    # Band 7: TTR > 0.40, advanced vocab >15%, some errors
    # Band 6: TTR > 0.35, advanced vocab >10%, acceptable errors
    # Band 5: TTR > 0.30, advanced vocab >5%, frequent errors
    
    if advanced_ratio > 0.25 and lexical_diversity > 0.55 and len(errors) <= 1:
        band = 9.0
        reasoning = "Sophisticated, precise vocabulary with excellent diversity"
    elif advanced_ratio > 0.20 and lexical_diversity > 0.50 and len(errors) <= 2:
        band = 8.5
        reasoning = "Wide range of vocabulary with good precision"
    elif advanced_ratio > 0.18 and lexical_diversity > 0.48 and len(errors) <= 3:
        band = 8.0
        reasoning = "Good range of advanced vocabulary with minor errors"
    elif advanced_ratio > 0.15 and lexical_diversity > 0.40 and len(errors) <= 4:
        band = 7.5
        reasoning = "Effective vocabulary for most topics"
    elif advanced_ratio > 0.12 and lexical_diversity > 0.38 and len(errors) <= 5:
        band = 7.0
        reasoning = "Adequate vocabulary with some advanced attempts"
    elif advanced_ratio > 0.10 and lexical_diversity > 0.35 and len(errors) <= 7:
        band = 6.5
        reasoning = "Adequate vocabulary with acceptable errors"
    elif advanced_ratio > 0.08 and lexical_diversity > 0.32 and len(errors) <= 9:
        band = 6.0
        reasoning = "Adequate range but limited precision"
    elif advanced_ratio > 0.05 and lexical_diversity > 0.30 and len(errors) <= 12:
        band = 5.5
        reasoning = "Limited range with frequent errors"
    elif advanced_ratio > 0.02 and lexical_diversity > 0.28:
        band = 5.0
        reasoning = "Mostly basic vocabulary with errors"
    else:
        band = 4.0
        reasoning = "Basic vocabulary, frequent inappropriate use"
    
    # Penalty for excessive errors
    if len(errors) > 15:
        band = max(band - 1.5, 1.0)
    elif len(errors) > 10:
        band = max(band - 1.0, 2.0)
    
    band = round(band * 2) / 2
    band = min(9.0, max(1.0, band))
    
    return {
        "lexical_band": band,
        "word_count": word_count,
        "unique_words": unique_words,
        "lexical_diversity": round(lexical_diversity, 3),
        "advanced_vocab_count": advanced_vocab_count,
        "advanced_vocab_ratio": round(advanced_ratio, 3),
        "error_count": len(errors),
        "reasoning": reasoning
    }


def calculate_pronunciation_band(
    whisper_to_wav2vec_accuracy: float,
    native_speaker_comparison: str = None
) -> Dict[str, Any]:
    """
    Convert speech recognition accuracy to pronunciation band (1-9).
    
    Parameters:
    - whisper_to_wav2vec_accuracy: Accuracy ratio (0.0-1.0) comparing Whisper transcription
                                   with Wav2Vec phoneme-level recognition
    - native_speaker_comparison: Optional descriptor from Wav2Vec analysis
    
    IELTS Pronunciation Band Reference:
    - Band 9: 98-100% accuracy (native-like)
    - Band 8: 95-97% accuracy (very clear)
    - Band 7: 90-94% accuracy (intelligible)
    - Band 6: 85-89% accuracy (broadly intelligible)
    - Band 5: 80-84% accuracy (intelligible with effort)
    - Band 4: 70-79% accuracy (difficult)
    - Band 3: 60-69% accuracy (very difficult)
    """
    
    accuracy_pct = whisper_to_wav2vec_accuracy * 100
    
    if accuracy_pct >= 98:
        band = 9.0
        reasoning = "Native-like pronunciation; phonemic errors extremely rare"
    elif accuracy_pct >= 95:
        band = 8.5
        reasoning = "Very clear pronunciation; occasional phonemic errors"
    elif accuracy_pct >= 92:
        band = 8.0
        reasoning = "Clear pronunciation; intelligible throughout"
    elif accuracy_pct >= 88:
        band = 7.5
        reasoning = "Mostly intelligible; some phonemic inaccuracy"
    elif accuracy_pct >= 85:
        band = 7.0
        reasoning = "Intelligible; noticeable deviation from native patterns"
    elif accuracy_pct >= 82:
        band = 6.5
        reasoning = "Broadly intelligible; listener effort sometimes required"
    elif accuracy_pct >= 80:
        band = 6.0
        reasoning = "Adequate intelligibility; regular phonemic errors"
    elif accuracy_pct >= 75:
        band = 5.5
        reasoning = "Intelligible with significant listener effort"
    elif accuracy_pct >= 70:
        band = 5.0
        reasoning = "Challenging; frequent phonemic errors"
    elif accuracy_pct >= 65:
        band = 4.5
        reasoning = "Difficult to understand; many pronunciation issues"
    elif accuracy_pct >= 60:
        band = 4.0
        reasoning = "Very difficult; significant phonemic errors"
    else:
        band = 3.0
        reasoning = "Extremely difficult; severe pronunciation problems"
    
    return {
        "pronunciation_band": band,
        "accuracy_percentage": round(accuracy_pct, 1),
        "reasoning": reasoning,
        "whisper_accuracy": round(whisper_to_wav2vec_accuracy, 3)
    }


def calculate_overall_band(
    fluency: float,
    lexical: float,
    grammar: float,
    pronunciation: float
) -> Dict[str, Any]:
    """
    Calculate overall IELTS speaking band (1-9) from four criteria.
    IELTS uses simple average of four criteria to determine final band.
    """
    
    overall = (fluency + lexical + grammar + pronunciation) / 4
    
    # IELTS rounding rule: Round to nearest 0.5
    overall = round(overall * 2) / 2
    overall = min(9.0, max(1.0, overall))
    
    return {
        "overall_band": overall,
        "criteria_average": {
            "fluency_and_coherence": fluency,
            "lexical_resource": lexical,
            "grammatical_range_and_accuracy": grammar,
            "pronunciation": pronunciation
        }
    }


def extract_band_descriptor(criterion: str, band: float) -> Dict[str, str]:
    """Retrieve official band descriptor for a given criterion and band."""
    
    # Round band to nearest 0.5 for descriptor lookup
    band_int = int(band) if band == int(band) else int(band)
    
    if criterion not in IELTS_BAND_DESCRIPTORS:
        return {}
    
    if band_int not in IELTS_BAND_DESCRIPTORS[criterion]:
        # Find nearest band with descriptor
        available_bands = sorted(IELTS_BAND_DESCRIPTORS[criterion].keys())
        band_int = min(available_bands, key=lambda x: abs(x - band))
    
    descriptor = IELTS_BAND_DESCRIPTORS[criterion][band_int]
    return {
        "band": band_int,
        "short": descriptor.get("short", ""),
        "description": descriptor.get("description", ""),
        "indicators": descriptor.get("indicators", [])
    }
