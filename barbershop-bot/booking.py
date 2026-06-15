import json
import logging
from pathlib import Path
from datetime import datetime, timedelta
from aiogram.fsm.state import State, StatesGroup
from aiogram.utils.keyboard import InlineKeyboardBuilder
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
import config

logger = logging.getLogger(__name__)

# File to persist bookings locally (fallback)
BOOKINGS_FILE = Path(__file__).resolve().parent / "bookings.json"

class BookingState(StatesGroup):
    waiting_for_service = State()
    waiting_for_barber = State()
    waiting_for_date = State()
    waiting_for_time = State()
    waiting_for_name = State()
    waiting_for_phone = State()

def load_bookings() -> list:
    """
    Loads all bookings from Supabase, with local JSON file fallback.
    """
    if config.supabase_client:
        try:
            res = config.supabase_client.table("barbershop_bookings").select("*").execute()
            if res.data is not None:
                return res.data
        except Exception as e:
            logger.error(f"Error loading bookings from Supabase: {e}")
            
    # Local fallback
    if not BOOKINGS_FILE.exists():
        return []
    try:
        with open(BOOKINGS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Error loading bookings: {e}")
        return []

def save_booking(booking_data: dict):
    """
    Saves a booking to Supabase, with local JSON file fallback.
    """
    if config.supabase_client:
        try:
            # Supabase upsert/insert
            config.supabase_client.table("barbershop_bookings").insert(booking_data).execute()
            logger.info("Booking saved to Supabase successfully.")
            return
        except Exception as e:
            logger.error(f"Error saving booking to Supabase: {e}")
            # Continue to local fallback as safety measure
            
    # Local fallback
    bookings = load_bookings()
    bookings.append(booking_data)
    try:
        with open(BOOKINGS_FILE, "w", encoding="utf-8") as f:
            json.dump(bookings, f, ensure_ascii=False, indent=2)
        logger.info("Booking saved locally.")
    except Exception as e:
        logger.error(f"Error saving booking locally: {e}")

# Keyboard Builders for States
def get_services_keyboard() -> InlineKeyboardMarkup:
    builder = InlineKeyboardBuilder()
    services = config.get_active_services()
    ctx = config.get_business_context()
    for s in services:
        builder.button(
            text=f"{s['name']} ({s['price']} {ctx.get('currency', 'сом')})",
            callback_data=f"select_service:{s['id']}"
        )
    builder.adjust(1)
    builder.button(text="❌ Отмена", callback_data="cancel_booking")
    return builder.as_markup()

def get_barbers_keyboard() -> InlineKeyboardMarkup:
    builder = InlineKeyboardBuilder()
    barbers = config.get_active_barbers()
    
    # Any barber option
    builder.button(text="💇‍♂️ Любой свободный мастер", callback_data="select_barber:any")
    
    for b in barbers:
        builder.button(
            text=f"💈 {b['name']} ({b.get('rating', 5.0)} ⭐)",
            callback_data=f"select_barber:{b['id']}"
        )
    builder.adjust(1)
    builder.button(text="❌ Отмена", callback_data="cancel_booking")
    return builder.as_markup()

def get_dates_keyboard() -> InlineKeyboardMarkup:
    builder = InlineKeyboardBuilder()
    today = datetime.now()
    
    # Generate buttons for next 5 days
    for i in range(5):
        date_val = today + timedelta(days=i)
        date_str = date_val.strftime("%Y-%m-%d")
        date_display = date_val.strftime("%d.%m")
        # Weekday name in Russian
        weekdays_ru = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]
        wday = weekdays_ru[date_val.weekday()]
        
        day_label = "Сегодня" if i == 0 else "Завтра" if i == 1 else f"{wday}, {date_display}"
        builder.button(
            text=day_label,
            callback_data=f"select_date:{date_str}"
        )
    builder.adjust(2)
    builder.button(text="❌ Отмена", callback_data="cancel_booking")
    return builder.as_markup()

def get_times_keyboard(date_str: str, barber_id: str) -> InlineKeyboardMarkup:
    builder = InlineKeyboardBuilder()
    
    # Standard working time slots
    all_slots = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"]
    
    # Filter out already booked slots
    bookings = load_bookings()
    booked_slots = set()
    for b in bookings:
        if b.get("date") == date_str:
            if barber_id == "any" or b.get("barber_id") == barber_id:
                booked_slots.add(b.get("time"))
                
    available_slots = [slot for slot in all_slots if slot not in booked_slots]
    
    for slot in available_slots:
        builder.button(text=slot, callback_data=f"select_time:{slot}")
        
    builder.adjust(4)
    builder.row(InlineKeyboardButton(text="❌ Отмена", callback_data="cancel_booking"))
    return builder.as_markup()
