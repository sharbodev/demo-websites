import os
import json
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent

# API Tokens & Keys
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

# Supabase Configurations
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

# Admin Configuration
ADMIN_TELEGRAM_IDS = [
    int(x.strip()) for x in os.getenv("ADMIN_TELEGRAM_IDS", "").split(",") if x.strip().isdigit()
]

# Load Local Barbershop Context
CONTEXT_FILE = BASE_DIR / "templates" / "barbershop.json"

def load_local_context():
    if not CONTEXT_FILE.exists():
        raise FileNotFoundError(f"Context file not found at {CONTEXT_FILE}")
    with open(CONTEXT_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

# Global local context fallback
LOCAL_CONTEXT = load_local_context()

# Initialize Supabase Client
supabase_client = None
if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        print(f"Error initializing Supabase client: {e}")

def get_business_context():
    """
    Dynamically loads general settings from Supabase.
    Falls back to local barbershop.json if Supabase is not available.
    """
    if supabase_client:
        try:
            res = supabase_client.table("barbershop_settings").select("value").eq("key", "general").execute()
            if res.data and len(res.data) > 0:
                return res.data[0]["value"]
        except Exception as e:
            print(f"Error loading context from Supabase: {e}")
    return LOCAL_CONTEXT

def get_active_services():
    """
    Returns list of active services from Supabase, or local fallback.
    """
    if supabase_client:
        try:
            res = supabase_client.table("barbershop_services").select("*").eq("is_active", True).execute()
            if res.data:
                return res.data
        except Exception as e:
            print(f"Error loading services from Supabase: {e}")
    return LOCAL_CONTEXT.get("services", [])

def get_active_barbers():
    """
    Returns list of active barbers from Supabase, or local fallback.
    """
    if supabase_client:
        try:
            res = supabase_client.table("barbershop_barbers").select("*").eq("is_active", True).execute()
            if res.data:
                return res.data
        except Exception as e:
            print(f"Error loading barbers from Supabase: {e}")
    return LOCAL_CONTEXT.get("barbers", [])

# Formatting helpers for menus
def format_services_list():
    services = get_active_services()
    ctx = get_business_context()
    currency = ctx.get("currency", "сом")
    text = "💈 **Наши услуги и цены:**\n\n"
    for s in services:
        text += f"▪️ **{s['name']}** — {s['price']} {currency}\n"
        text += f"  _{s.get('description', '')}_ ({s['duration_minutes']} мин.)\n\n"
    return text

def format_contact_info():
    ctx = get_business_context()
    text = f"📍 **Контакты {ctx.get('business_name', 'Blade Barbershop')}:**\n\n"
    text += f"🏠 **Адрес:** {ctx.get('address', '')}\n"
    text += f"📞 **Телефон:** {ctx.get('phone', '')}\n\n"
    text += "⏰ **Режим работы:**\n"
    
    working_hours = ctx.get('working_hours', {})
    for day, hours in working_hours.items():
        day_ru = {
            "weekdays": "Будни",
            "saturday": "Суббота",
            "sunday": "Воскресенье"
        }.get(day, day)
        text += f"  ▫️ {day_ru}: {hours}\n"
    return text
