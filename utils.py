"""
Utility functions for Magnus AI Backend
"""
import os
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, Any, Optional, List
import numpy as np
import pandas as pd

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class CacheManager:
    """Simple in-memory cache for API responses"""
    
    def __init__(self):
        self.cache: Dict[str, Dict[str, Any]] = {}
    
    def get(self, key: str, ttl_seconds: int = 3600) -> Optional[Any]:
        """Get cached value if not expired"""
        if key not in self.cache:
            return None
        
        entry = self.cache[key]
        age = (datetime.now() - entry['timestamp']).total_seconds()
        
        if age > ttl_seconds:
            del self.cache[key]
            return None
        
        logger.info(f"Cache hit: {key} (age: {age:.1f}s)")
        return entry['value']
    
    def set(self, key: str, value: Any) -> None:
        """Store value in cache"""
        self.cache[key] = {
            'value': value,
            'timestamp': datetime.now()
        }
        logger.info(f"Cache set: {key}")
    
    def clear(self) -> None:
        """Clear all cached data"""
        self.cache.clear()
        logger.info("Cache cleared")


def validate_price_data(data: List[float], min_length: int = 30) -> bool:
    """Validate price data for Prophet forecasting"""
    if not data or len(data) < min_length:
        logger.warning(f"Insufficient data: {len(data) if data else 0} < {min_length}")
        return False
    
    if any(pd.isna(data)):
        logger.warning("Data contains NaN values")
        return False
    
    if all(x == data[0] for x in data):
        logger.warning("All values are identical")
        return False
    
    return True


def prepare_prophet_dataframe(prices: List[float], dates: Optional[List[str]] = None) -> pd.DataFrame:
    """
    Prepare data for Prophet model
    Prophet requires columns: 'ds' (dates) and 'y' (values)
    """
    if dates is None:
        # Generate daily dates going backwards from today
        dates = [
            (datetime.now() - timedelta(days=i)).strftime('%Y-%m-%d')
            for i in range(len(prices) - 1, -1, -1)
        ]
    
    df = pd.DataFrame({
        'ds': pd.to_datetime(dates),
        'y': prices
    })
    
    logger.info(f"Prepared Prophet DataFrame: {len(df)} rows")
    return df


def calculate_confidence_score(
    predictions: List[float],
    historical_prices: List[float],
    volatility_weight: float = 0.5
) -> float:
    """
    Calculate confidence score for predictions (0-1)
    Based on data quality and volatility
    """
    if not predictions or not historical_prices:
        return 0.0
    
    # Calculate historical volatility (coefficient of variation)
    prices_array = np.array(historical_prices)
    mean_price = np.mean(prices_array)
    std_price = np.std(prices_array)
    cv = std_price / mean_price if mean_price > 0 else 1.0
    
    # Lower volatility = higher confidence
    volatility_score = max(0, 1 - (cv * volatility_weight))
    
    # Data quality score based on sample size
    data_quality = min(1.0, len(historical_prices) / 100)
    
    # Combined confidence
    confidence = (volatility_score + data_quality) / 2
    
    logger.info(f"Confidence: {confidence:.2f} (volatility: {cv:.3f}, samples: {len(historical_prices)})")
    return round(confidence, 2)


def format_prediction_response(
    predictions: List[float],
    dates: List[str],
    confidence: float,
    trend: str = "neutral"
) -> Dict[str, Any]:
    """Format prediction response for API"""
    return {
        "success": True,
        "predictions": [
            {"date": date, "price": float(price)}
            for date, price in zip(dates, predictions)
        ],
        "confidence": confidence,
        "trend": trend,
        "model": "prophet",
        "timestamp": datetime.now().isoformat()
    }


def detect_trend(prices: List[float], window: int = 7) -> str:
    """
    Detect price trend: bullish, bearish, or neutral
    """
    if len(prices) < window:
        return "neutral"
    
    recent = prices[-window:]
    older = prices[-2*window:-window] if len(prices) >= 2*window else prices[:-window]
    
    recent_avg = np.mean(recent)
    older_avg = np.mean(older)
    
    change_pct = ((recent_avg - older_avg) / older_avg) * 100
    
    if change_pct > 2:
        return "bullish"
    elif change_pct < -2:
        return "bearish"
    else:
        return "neutral"


def sanitize_text(text: str, max_length: int = 1000) -> str:
    """Sanitize and truncate text input"""
    if not text:
        return ""
    
    # Remove excessive whitespace
    text = ' '.join(text.split())
    
    # Truncate if too long
    if len(text) > max_length:
        text = text[:max_length] + "..."
    
    return text


def extract_error_message(error: Exception) -> str:
    """Extract clean error message from exception"""
    error_msg = str(error)
    
    # Common error patterns to clean up
    if "No module named" in error_msg:
        module = error_msg.split("'")[1] if "'" in error_msg else "unknown"
        return f"Missing dependency: {module}. Please check requirements.txt"
    
    return error_msg


# Global cache instance
cache = CacheManager()


if __name__ == "__main__":
    # Test utilities
    print("Testing utils.py...")
    
    # Test cache
    cache.set("test_key", {"value": 123})
    result = cache.get("test_key")
    print(f"Cache test: {result}")
    
    # Test Prophet DataFrame
    test_prices = [100, 102, 101, 105, 107, 106, 110]
    df = prepare_prophet_dataframe(test_prices)
    print(f"\nProphet DataFrame:\n{df}")
    
    # Test trend detection
    trend = detect_trend(test_prices)
    print(f"\nTrend: {trend}")
    
    # Test confidence calculation
    predictions = [111, 112, 113]
    confidence = calculate_confidence_score(predictions, test_prices)
    print(f"\nConfidence: {confidence}")
    
    print("\n✅ All tests passed!")
