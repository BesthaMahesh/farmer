import requests
import os
from dotenv import load_dotenv

load_dotenv()

def get_weather_data(city):
    try:
        # Using wttr.in as requested by the user
        url = f"https://wttr.in/{city.lower()}?format=%C+%t"
        response = requests.get(url, timeout=5)
        
        if response.status_code == 200:
            result = response.text.strip()
            # result might look like "Partly cloudy +31°C"
            parts = result.rsplit(' ', 1)
            
            condition = "Unknown"
            temp_str = result
            
            if len(parts) == 2:
                condition = parts[0]
                temp_str = parts[1]
                
            # Extract numbers from temp_str (e.g. "+31°C" -> 31)
            temp_val = 25 # default fallback
            import re
            temp_match = re.search(r'[-+]?\d+', temp_str)
            if temp_match:
                temp_val = float(temp_match.group())
                
            return {
                "temp": temp_val,
                "humidity": 65, # wttr.in simple format doesn't provide this, mocking
                "rainfall": 150, # Mocking rainfall
                "condition": condition,
                "description": result,
                "icon": "04d"
            }
        return {"error": "City not found or service unavailable", "temp": 25, "humidity": 70, "rainfall": 150, "condition": "Cloudy", "icon": "04d"}
    except Exception as e:
        print(f"Weather API Error: {e}")
        return {"error": str(e), "temp": 25, "humidity": 70, "rainfall": 150, "condition": "Cloudy", "icon": "04d"}

def get_market_prices(crop):
    # This would typically call Agmarknet or a similar service
    # Agmarknet often requires scraping or specific XML formats.
    # Providing a mock implementation for demonstration.
    prices = {
        "rice": {"price": "₹2200/quintal", "trend": "up"},
        "maize": {"price": "₹1800/quintal", "trend": "stable"},
        "cotton": {"price": "₹6000/quintal", "trend": "down"},
        "jute": {"price": "₹4500/quintal", "trend": "stable"},
    }
    return prices.get(crop.lower(), {"price": "Data Unavailable", "trend": "N/A"})
