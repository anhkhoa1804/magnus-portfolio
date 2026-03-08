import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 300; // Cache for 5 minutes (more up-to-date)

function weatherLabel(code: number): string {
  if (code === 0) return 'Clear';
  if (code === 1 || code === 2) return 'Mostly clear';
  if (code === 3) return 'Overcast';
  if (code >= 45 && code <= 48) return 'Fog';
  if (code >= 51 && code <= 67) return 'Rain';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 82) return 'Showers';
  if (code >= 95) return 'Thunderstorm';
  return 'Weather';
}

function weatherIcon(code: number): string {
  if (code === 0) return '☀️';
  if (code === 1 || code === 2) return '🌤️';
  if (code === 3) return '☁️';
  if (code >= 45 && code <= 48) return '🌫️';
  if (code >= 51 && code <= 67) return '🌧️';
  if (code >= 71 && code <= 77) return '❄️';
  if (code >= 80 && code <= 82) return '🌦️';
  if (code >= 95) return '⛈️';
  return '🌤️';
}

export async function GET() {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    if (!apiKey) {
      // Return mock data if API key not configured
      return NextResponse.json({
        success: true,
        weather: {
          temp: 32,
          condition: 'Sunny',
          icon: '☀️',
          city: 'Ho Chi Minh City',
        },
      });
    }

    // Try WeatherAPI.com first (more accurate for VN, free tier: 1M calls/month)
    const weatherApiKey = process.env.WEATHERAPI_KEY;
    
    if (weatherApiKey) {
      try {
        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=Ho Chi Minh City&aqi=no`,
          { next: { revalidate: 300 } }
        );
        
        if (response.ok) {
          const data = await response.json();
          const condition = data.current.condition.text;
          const isDay = data.current.is_day === 1;
          
          // Map weather conditions to emojis
          let icon = '🌤️';
          const condLower = condition.toLowerCase();
          
          if (condLower.includes('clear') || condLower.includes('sunny')) {
            icon = isDay ? '☀️' : '🌙';
          } else if (condLower.includes('cloud') || condLower.includes('overcast')) {
            icon = '☁️';
          } else if (condLower.includes('rain') || condLower.includes('drizzle')) {
            icon = '🌧️';
          } else if (condLower.includes('thunder')) {
            icon = '⛈️';
          } else if (condLower.includes('snow')) {
            icon = '❄️';
          } else if (condLower.includes('mist') || condLower.includes('fog')) {
            icon = '🌫️';
          }
          
          return NextResponse.json({
            success: true,
            weather: {
              temp: Math.round(data.current.temp_c),
              feelsLike: Math.round(data.current.feelslike_c),
              humidity: data.current.humidity,
              windKph: Math.round(data.current.wind_kph),
              condition: condition,
              icon: icon,
              city: 'Ho Chi Minh City',
              isDay: isDay,
            },
          });
        }
      } catch (weatherApiError) {
        console.warn('WeatherAPI failed, falling back to OpenWeatherMap:', weatherApiError);
      }
    }

    // Fallback to OpenWeatherMap (original implementation)
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=10.8231&lon=106.6297&appid=${apiKey}&units=metric`,
      { next: { revalidate: 300 } }
    );

    if (!response.ok) {
      throw new Error('Weather API failed');
    }

    const data = await response.json();

    // Calculate if it's day or night in HCMC (UTC+7)
    const sunrise = data.sys.sunrise * 1000; // Convert to ms
    const sunset = data.sys.sunset * 1000;
    const now = Date.now();
    const isDay = now >= sunrise && now <= sunset;

    // Map weather conditions to emojis (day/night aware)
    const condition = data.weather[0].main;
    let icon = '🌤️';
    
    if (condition === 'Clear') {
      icon = isDay ? '☀️' : '🌙';
    } else if (condition === 'Clouds') {
      icon = isDay ? '☁️' : '☁️';
    } else if (condition === 'Rain') {
      icon = '🌧️';
    } else if (condition === 'Drizzle') {
      icon = '🌦️';
    } else if (condition === 'Thunderstorm') {
      icon = '⛈️';
    } else if (condition === 'Snow') {
      icon = '❄️';
    } else if (condition === 'Mist' || condition === 'Fog') {
      icon = '🌫️';
    }

    return NextResponse.json({
      success: true,
      weather: {
        temp: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        windKph: Math.round(data.wind.speed * 3.6),
        condition: condition,
        icon: icon,
        city: 'Ho Chi Minh City',
        isDay: isDay,
      },
    });
  } catch (error) {
    console.error('Weather fetch error:', error);
    
    // Fallback to mock data
    return NextResponse.json({
      success: true,
      weather: {
        temp: 32,
        condition: 'Sunny',
        icon: '☀️',
        city: 'Ho Chi Minh City',
      },
    });
  }
}
