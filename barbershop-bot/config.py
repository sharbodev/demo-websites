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

CLIENTS_FILE = BASE_DIR / "clients.json"
REVIEWS_FILE = BASE_DIR / "reviews.json"
LOYALTY_LOG_FILE = BASE_DIR / "loyalty_log.json"

# Helper for local JSON persistence
def _load_local_json(file_path: Path) -> list:
    if not file_path.exists():
        return []
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading local json {file_path}: {e}")
        return []

def _save_local_json(file_path: Path, data: list):
    try:
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"Error saving local json {file_path}: {e}")

# Client functions
def get_client_by_tg_id(telegram_user_id: int):
    if supabase_client:
        try:
            res = supabase_client.table("barbershop_clients").select("*").eq("telegram_user_id", telegram_user_id).execute()
            if res.data and len(res.data) > 0:
                return res.data[0]
        except Exception as e:
            print(f"Error fetching client by tg_id from Supabase: {e}")
    # Local fallback
    clients = _load_local_json(CLIENTS_FILE)
    for c in clients:
        if c.get("telegram_user_id") == telegram_user_id:
            return c
    return None

def get_client_by_phone(phone: str):
    # Normalize phone
    clean_phone = "".join(filter(str.isdigit, phone))
    if supabase_client:
        try:
            res = supabase_client.table("barbershop_clients").select("*").execute()
            if res.data:
                for c in res.data:
                    c_clean = "".join(filter(str.isdigit, c.get("phone", "")))
                    if c_clean == clean_phone:
                        return c
        except Exception as e:
            print(f"Error fetching client by phone from Supabase: {e}")
    # Local fallback
    clients = _load_local_json(CLIENTS_FILE)
    for c in clients:
        c_clean = "".join(filter(str.isdigit, c.get("phone", "")))
        if c_clean == clean_phone:
            return c
    return None

def get_or_create_client(telegram_user_id: int, telegram_username: str, full_name: str, phone: str, referred_by: str = None):
    from datetime import datetime
    import random
    import string
    
    # First try by tg_id
    client = get_client_by_tg_id(telegram_user_id)
    if client:
        # If client exists but didn't have phone, update it
        if phone and (not client.get("phone") or client.get("phone") == ""):
            client["phone"] = phone
            client["full_name"] = full_name
            if supabase_client:
                try:
                    supabase_client.table("barbershop_clients").update({
                        "phone": phone,
                        "full_name": full_name
                    }).eq("id", client["id"]).execute()
                except Exception as e:
                    print(f"Error updating client details in Supabase: {e}")
            else:
                clients = _load_local_json(CLIENTS_FILE)
                for i, c in enumerate(clients):
                    if c["id"] == client["id"]:
                        clients[i] = client
                        break
                _save_local_json(CLIENTS_FILE, clients)
        return client

    # Or try by phone
    client = get_client_by_phone(phone)
    if client:
        # Update telegram_user_id
        if client.get("telegram_user_id") != telegram_user_id:
            client["telegram_user_id"] = telegram_user_id
            client["telegram_username"] = telegram_username
            if supabase_client:
                try:
                    supabase_client.table("barbershop_clients").update({
                        "telegram_user_id": telegram_user_id,
                        "telegram_username": telegram_username
                    }).eq("id", client["id"]).execute()
                except Exception as e:
                    print(f"Error updating client tg_id in Supabase: {e}")
            else:
                clients = _load_local_json(CLIENTS_FILE)
                for i, c in enumerate(clients):
                    if c["id"] == client["id"]:
                        clients[i] = client
                        break
                _save_local_json(CLIENTS_FILE, clients)
        return client

    # Generate referral code
    first_part = "".join(filter(str.isalpha, full_name)).upper()[:6]
    if not first_part:
        first_part = "CLIENT"
    random_part = "".join(random.choices(string.digits, k=4))
    referral_code = f"{first_part}-{random_part}"

    new_client = {
        "id": f"cl_{int(datetime.now().timestamp())}_{random.randint(100, 999)}",
        "telegram_user_id": telegram_user_id,
        "telegram_username": telegram_username,
        "full_name": full_name,
        "phone": phone,
        "loyalty_visits": 0,
        "discount_available": False,
        "discount_percent": 20,
        "referral_code": referral_code,
        "referred_by": referred_by,
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    }
    
    if supabase_client:
        try:
            # We omit id so Supabase uses default uuid generator
            insert_data = {k: v for k, v in new_client.items() if k != "id"}
            res = supabase_client.table("barbershop_clients").insert(insert_data).execute()
            if res.data and len(res.data) > 0:
                return res.data[0]
        except Exception as e:
            print(f"Error creating client in Supabase: {e}")
    
    # Local fallback
    clients = _load_local_json(CLIENTS_FILE)
    clients.append(new_client)
    _save_local_json(CLIENTS_FILE, clients)
    return new_client

def update_client_loyalty(client_id: str, visits: int, discount_available: bool, discount_percent: int = 20):
    from datetime import datetime
    if supabase_client:
        try:
            supabase_client.table("barbershop_clients").update({
                "loyalty_visits": visits,
                "discount_available": discount_available,
                "discount_percent": discount_percent,
                "updated_at": datetime.now().isoformat()
            }).eq("id", client_id).execute()
            return True
        except Exception as e:
            print(f"Error updating client loyalty in Supabase: {e}")
            return False
            
    # Local fallback
    clients = _load_local_json(CLIENTS_FILE)
    for c in clients:
        if c["id"] == client_id:
            c["loyalty_visits"] = visits
            c["discount_available"] = discount_available
            c["discount_percent"] = discount_percent
            c["updated_at"] = datetime.now().isoformat()
            break
    _save_local_json(CLIENTS_FILE, clients)
    return True

def log_loyalty_action(client_id: str, booking_id: str, action: str, visits_before: int, visits_after: int, details: str = None):
    from datetime import datetime
    log_entry = {
        "id": f"log_{int(datetime.now().timestamp())}",
        "client_id": client_id,
        "booking_id": booking_id,
        "action": action,
        "visits_before": visits_before,
        "visits_after": visits_after,
        "details": details,
        "created_at": datetime.now().isoformat()
    }
    if supabase_client:
        try:
            insert_data = {k: v for k, v in log_entry.items() if k != "id"}
            supabase_client.table("barbershop_loyalty_log").insert(insert_data).execute()
            return
        except Exception as e:
            print(f"Error logging loyalty in Supabase: {e}")
            
    # Local fallback
    logs = _load_local_json(LOYALTY_LOG_FILE)
    logs.append(log_entry)
    _save_local_json(LOYALTY_LOG_FILE, logs)

def save_review(booking_id: str, client_id: str, barber_id: str, rating: int, comment: str):
    from datetime import datetime
    review = {
        "id": f"rev_{int(datetime.now().timestamp())}",
        "booking_id": booking_id,
        "client_id": client_id,
        "barber_id": barber_id,
        "rating": rating,
        "comment": comment,
        "created_at": datetime.now().isoformat()
    }
    if supabase_client:
        try:
            insert_data = {k: v for k, v in review.items() if k != "id"}
            supabase_client.table("barbershop_reviews").insert(insert_data).execute()
            return
        except Exception as e:
            print(f"Error saving review to Supabase: {e}")
            
    # Local fallback
    reviews = _load_local_json(REVIEWS_FILE)
    reviews.append(review)
    _save_local_json(REVIEWS_FILE, reviews)

def get_client_by_referral_code(referral_code: str):
    if not referral_code:
        return None
    referral_code = referral_code.strip().upper()
    if supabase_client:
        try:
            res = supabase_client.table("barbershop_clients").select("*").eq("referral_code", referral_code).execute()
            if res.data and len(res.data) > 0:
                return res.data[0]
        except Exception as e:
            print(f"Error fetching client by referral code from Supabase: {e}")
    # Local fallback
    clients = _load_local_json(CLIENTS_FILE)
    for c in clients:
        if c.get("referral_code") == referral_code:
            return c
    return None

