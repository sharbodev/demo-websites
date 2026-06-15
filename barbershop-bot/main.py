import os
import sys
import logging
import asyncio
from datetime import datetime

from aiogram import Bot, Dispatcher, F, Router
from aiogram.enums import ParseMode
from aiogram.filters import Command, StateFilter
from aiogram.fsm.context import FSMContext
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.types import (
    Message,
    CallbackQuery,
    ReplyKeyboardMarkup,
    KeyboardButton,
    ReplyKeyboardRemove,
)

import config
import ai_engine
import booking
from booking import BookingState

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("barbershop_bot")

# Verify Token
if not config.TELEGRAM_BOT_TOKEN:
    logger.critical("TELEGRAM_BOT_TOKEN is not set in environment or .env file! Exiting.")
    sys.exit("Error: TELEGRAM_BOT_TOKEN is missing.")

# Initialize Bot and Dispatcher
bot = Bot(token=config.TELEGRAM_BOT_TOKEN)
dp = Dispatcher(storage=MemoryStorage())
router = Router()

# Reply Keyboard (persistent menu at the bottom)
def get_main_menu_keyboard():
    keyboard = [
        [KeyboardButton(text="💈 Услуги и цены"), KeyboardButton(text="📅 Записаться")],
        [KeyboardButton(text="📍 Адрес и контакты"), KeyboardButton(text="💬 Сбросить диалог")]
    ]
    return ReplyKeyboardMarkup(keyboard=keyboard, resize_keyboard=True)

# ----------------- Command & Menu Handlers -----------------

@router.message(Command("start"))
async def cmd_start(message: Message, state: FSMContext):
    await state.clear()
    ai_engine.clear_user_history(message.from_user.id)
    
    ctx = config.get_business_context()
    welcome_text = (
        f"Привет, {message.from_user.first_name}! 💈\n\n"
        f"Добро пожаловать в **{ctx.get('business_name', 'Blade Barbershop')}**.\n\n"
        "Я твой ИИ-помощник. Я могу ответить на любые вопросы о стрижках, ценах, свободных мастерах "
        "или сразу записать тебя на удобное время.\n\n"
        "Пиши мне любое сообщение или используй кнопки меню ниже! 👇"
    )
    await message.answer(
        welcome_text,
        reply_markup=get_main_menu_keyboard(),
        parse_mode=ParseMode.MARKDOWN
    )

@router.message(F.text == "💈 Услуги и цены")
@router.message(Command("services"))
async def show_services(message: Message):
    text = config.format_services_list()
    await message.answer(text, parse_mode=ParseMode.MARKDOWN)

@router.message(F.text == "📍 Адрес и контакты")
@router.message(Command("contacts"))
async def show_contacts(message: Message):
    text = config.format_contact_info()
    await message.answer(text, parse_mode=ParseMode.MARKDOWN)

@router.message(F.text == "💬 Сбросить диалог")
async def reset_chat(message: Message, state: FSMContext):
    await state.clear()
    ai_engine.clear_user_history(message.from_user.id)
    await message.answer(
        "Диалог и история общения были сброшены. 💫\nО чём ты хочешь поговорить?",
        reply_markup=get_main_menu_keyboard()
    )

@router.message(Command("id"))
async def cmd_id(message: Message):
    await message.answer(
        f"👤 Твой Telegram ID: `{message.from_user.id}`\n\n"
        "Скопируй этот ID и впиши его в параметр `ADMIN_TELEGRAM_IDS` в файле `.env`, чтобы получить права администратора.",
        parse_mode=ParseMode.MARKDOWN
    )

@router.message(Command("admin"))
async def cmd_admin(message: Message):
    user_id = message.from_user.id
    if user_id not in config.ADMIN_TELEGRAM_IDS:
        await message.answer(
            "❌ У тебя нет прав администратора.\n\n"
            "Чтобы получить их, впиши свой Telegram ID в файл `.env` в параметр `ADMIN_TELEGRAM_IDS` и перезапусти бота.\n"
            "Твой ID можно узнать с помощью команды /id."
        )
        return

    bookings = booking.load_bookings()
    if not bookings:
        await message.answer("📋 **Панель Администратора**\n\nЗаписей пока нет.", parse_mode=ParseMode.MARKDOWN)
        return

    total_bookings = len(bookings)
    unique_clients = len(set(b.get("user_id") for b in bookings))
    
    text = (
        "📋 **Панель Администратора**\n\n"
        f"📊 **Статистика:**\n"
        f"▫️ Всего записей: {total_bookings}\n"
        f"▫️ Уникальных клиентов: {unique_clients}\n\n"
        "📅 **Последние 5 записей:**\n\n"
    )

    last_bookings = bookings[-5:]
    for idx, b in enumerate(reversed(last_bookings), 1):
        date_str = b.get("date", "")
        try:
            date_obj = datetime.strptime(date_str, "%Y-%m-%d")
            date_formatted = date_obj.strftime("%d.%m.%Y")
        except Exception:
            date_formatted = date_str
            
        text += (
            f"{idx}. 👤 **{b.get('client_name')}** ({b.get('client_phone')})\n"
            f"   💇‍♂️ {b.get('service_name')} ({b.get('price')} сом) — Мастер: {b.get('barber_name')}\n"
            f"   🕒 {date_formatted} в {b.get('time')}\n\n"
        )

    await message.answer(text, parse_mode=ParseMode.MARKDOWN)

# ----------------- Booking Wizard Flow -----------------

@router.message(F.text == "📅 Записаться")
@router.message(Command("book"))
async def start_booking(message: Message, state: FSMContext):
    await state.clear()
    await state.set_state(BookingState.waiting_for_service)
    
    await message.answer(
        "💇‍♂️ **Давай запишем тебя на стрижку!**\n\nВыбери желаемую услугу из списка:",
        reply_markup=booking.get_services_keyboard(),
        parse_mode=ParseMode.MARKDOWN
    )

@router.callback_query(F.data == "cancel_booking")
async def cancel_booking_callback(callback: CallbackQuery, state: FSMContext):
    await state.clear()
    await callback.message.edit_text("❌ Запись отменена. Если захочешь записаться снова, нажми кнопку меню.")
    await callback.answer()

# 1. Service Selected -> Ask for Barber
@router.callback_query(StateFilter(BookingState.waiting_for_service), F.data.startswith("select_service:"))
async def process_service(callback: CallbackQuery, state: FSMContext):
    service_id = callback.data.split(":")[1]
    
    # Find service in active services list
    services = config.get_active_services()
    service = next((s for s in services if s["id"] == service_id), None)
    if not service:
        await callback.answer("Услуга не найдена, попробуйте еще раз.")
        return
        
    await state.update_data(
        service_id=service_id,
        service_name=service["name"],
        price=service["price"]
    )
    
    await state.set_state(BookingState.waiting_for_barber)
    await callback.message.edit_text(
        f"Выбрано: **{service['name']}**\n\n"
        "Теперь выбери мастера, к которому хочешь записаться:",
        reply_markup=booking.get_barbers_keyboard(),
        parse_mode=ParseMode.MARKDOWN
    )
    await callback.answer()

# 2. Barber Selected -> Ask for Date
@router.callback_query(StateFilter(BookingState.waiting_for_barber), F.data.startswith("select_barber:"))
async def process_barber(callback: CallbackQuery, state: FSMContext):
    barber_id = callback.data.split(":")[1]
    
    barber_name = "Любой свободный мастер"
    if barber_id != "any":
        barbers = config.get_active_barbers()
        barber = next((b for b in barbers if b["id"] == barber_id), None)
        if barber:
            barber_name = barber["name"]
            
    await state.update_data(barber_id=barber_id, barber_name=barber_name)
    await state.set_state(BookingState.waiting_for_date)
    
    data = await state.get_data()
    await callback.message.edit_text(
        f"Выбрано: **{data['service_name']}**\n"
        f"Мастер: **{barber_name}**\n\n"
        "Выбери удобный день для визита:",
        reply_markup=booking.get_dates_keyboard(),
        parse_mode=ParseMode.MARKDOWN
    )
    await callback.answer()

# 3. Date Selected -> Ask for Time slot
@router.callback_query(StateFilter(BookingState.waiting_for_date), F.data.startswith("select_date:"))
async def process_date(callback: CallbackQuery, state: FSMContext):
    date_str = callback.data.split(":")[1]
    
    await state.update_data(date=date_str)
    await state.set_state(BookingState.waiting_for_time)
    
    data = await state.get_data()
    # Format date for display
    date_obj = datetime.strptime(date_str, "%Y-%m-%d")
    date_formatted = date_obj.strftime("%d.%m.%Y")
    
    await callback.message.edit_text(
        f"Выбрано: **{data['service_name']}**\n"
        f"Мастер: **{data['barber_name']}**\n"
        f"Дата: **{date_formatted}**\n\n"
        "Выбери подходящее время:",
        reply_markup=booking.get_times_keyboard(date_str, data["barber_id"]),
        parse_mode=ParseMode.MARKDOWN
    )
    await callback.answer()

# 4. Time Selected -> Ask for Name
@router.callback_query(StateFilter(BookingState.waiting_for_time), F.data.startswith("select_time:"))
async def process_time(callback: CallbackQuery, state: FSMContext):
    time_str = callback.data.split(":")[1]
    
    await state.update_data(time=time_str)
    await state.set_state(BookingState.waiting_for_name)
    
    await callback.message.edit_text(
        "📝 Напиши, пожалуйста, своё имя для записи:"
    )
    await callback.answer()

# 5. Name Entered -> Ask for Phone number
@router.message(StateFilter(BookingState.waiting_for_name))
async def process_name(message: Message, state: FSMContext):
    name = message.text.strip()
    if len(name) < 2:
        await message.answer("Имя слишком короткое. Введите настоящее имя:")
        return
        
    await state.update_data(client_name=name)
    await state.set_state(BookingState.waiting_for_phone)
    
    # Request contact sharing or typing
    phone_keyboard = ReplyKeyboardMarkup(
        keyboard=[[KeyboardButton(text="📱 Поделиться контактом", request_contact=True)]],
        resize_keyboard=True,
        one_time_keyboard=True
    )
    await message.answer(
        "📞 Укажите ваш номер телефона для связи. Вы можете нажать на кнопку ниже, чтобы автоматически поделиться контактом, или ввести номер вручную:",
        reply_markup=phone_keyboard
    )

# 6. Phone Entered / Shared -> Finalize booking
@router.message(StateFilter(BookingState.waiting_for_phone))
async def process_phone(message: Message, state: FSMContext):
    phone = ""
    if message.contact:
        phone = message.contact.phone_number
    else:
        phone = message.text.strip()
        # Basic validation: ensure there are numbers
        cleaned_phone = "".join(filter(str.isdigit, phone))
        if len(cleaned_phone) < 6:
            await message.answer("Номер телефона введен неверно. Введите правильный номер:")
            return
            
    data = await state.get_data()
    
    # Structure booking record
    booking_record = {
        "id": f"bk_{int(datetime.now().timestamp())}",
        "user_id": message.from_user.id,
        "username": message.from_user.username or "",
        "client_name": data["client_name"],
        "client_phone": phone,
        "service_id": data["service_id"],
        "service_name": data["service_name"],
        "price": data["price"],
        "barber_id": data["barber_id"],
        "barber_name": data["barber_name"],
        "date": data["date"],
        "time": data["time"],
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    
    # Save booking to JSON storage
    booking.save_booking(booking_record)
    
    # Format date for display
    date_obj = datetime.strptime(data["date"], "%Y-%m-%d")
    date_formatted = date_obj.strftime("%d.%m.%Y")
    
    success_text = (
        "🎉 **Запись успешно оформлена!**\n\n"
        f"👤 **Имя:** {data['client_name']}\n"
        f"📞 **Телефон:** {phone}\n"
        f"💇‍♂️ **Услуга:** {data['service_name']} ({data['price']} сом)\n"
        f"💈 **Мастер:** {data['barber_name']}\n"
        f"📅 **Дата:** {date_formatted}\n"
        f"🕒 **Время:** {data['time']}\n\n"
        "Ждём тебя в гости! Если твои планы изменятся, пожалуйста, предупреди нас заранее. 😉"
    )
    
    await message.answer(
        success_text,
        reply_markup=get_main_menu_keyboard(),
        parse_mode=ParseMode.MARKDOWN
    )
    await state.clear()

# ----------------- Fallback Text Handler (AI Agent) -----------------

@router.message(F.text)
async def handle_user_text(message: Message):
    # Show typing action to simulate active thinking
    await bot.send_chat_action(chat_id=message.chat.id, action="typing")
    
    # Send request to AI Engine
    ai_reply = await ai_engine.generate_ai_reply(message.from_user.id, message.text)
    
    await message.answer(ai_reply, parse_mode=ParseMode.MARKDOWN)

# ----------------- Main Startup -----------------

async def main():
    dp.include_router(router)
    logger.info("Starting Telegram Barbershop AI Bot...")
    await dp.start_polling(bot)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except (KeyboardInterrupt, SystemExit):
        logger.info("Bot stopped.")
