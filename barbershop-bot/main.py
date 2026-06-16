import os
import sys
import logging
import asyncio
from datetime import datetime

from aiogram import Bot, Dispatcher, F, Router
from aiogram.enums import ParseMode
from aiogram.filters import Command, StateFilter
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.types import (
    Message,
    CallbackQuery,
    ReplyKeyboardMarkup,
    KeyboardButton,
    ReplyKeyboardRemove,
)
from aiogram.utils.keyboard import InlineKeyboardBuilder

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

class ClientState(StatesGroup):
    waiting_for_referral = State()
    waiting_for_review_rating = State()
    waiting_for_review_comment = State()

# Reply Keyboard (persistent menu at the bottom)
def get_main_menu_keyboard():
    keyboard = [
        [KeyboardButton(text="💈 Услуги и цены"), KeyboardButton(text="📅 Записаться")],
        [KeyboardButton(text="📋 Мои записи"), KeyboardButton(text="📍 Адрес и контакты")],
        [KeyboardButton(text="💬 Сбросить диалог")]
    ]
    return ReplyKeyboardMarkup(keyboard=keyboard, resize_keyboard=True)

# ----------------- Command & Menu Handlers -----------------

@router.message(Command("start"))
async def cmd_start(message: Message, state: FSMContext):
    await state.clear()
    ai_engine.clear_user_history(message.from_user.id)
    
    # Check for referral argument
    args = message.text.split()
    referred_by = None
    if len(args) > 1 and args[1].startswith("ref_"):
        ref_code = args[1].replace("ref_", "").strip().upper()
        # Verify if code is valid and belongs to someone else
        inviter = config.get_client_by_referral_code(ref_code)
        if inviter and inviter.get("telegram_user_id") != message.from_user.id:
            client = config.get_client_by_tg_id(message.from_user.id)
            if not client:
                referred_by = ref_code
                logger.info(f"User {message.from_user.id} registered via referral code {ref_code}")
                # Create profile with placeholder
                config.get_or_create_client(
                    telegram_user_id=message.from_user.id,
                    telegram_username=message.from_user.username or "",
                    full_name=message.from_user.first_name or "Клиент",
                    phone="",
                    referred_by=referred_by
                )
    
    ctx = config.get_business_context()
    welcome_text = (
        f"Привет, {message.from_user.first_name}! 💈\n\n"
        f"Добро пожаловать в **{ctx.get('business_name', 'Blade Barbershop')}**.\n\n"
        "Я твой ИИ-помощник. Я могу ответить на любые вопросы о стрижках, ценах, свободных мастерах "
        "или сразу записать тебя на удобное время.\n\n"
        "Пиши мне любое сообщение или используй кнопки меню ниже! 👇"
    )
    if referred_by:
        welcome_text += f"\n\n🎁 **Вы перешли по приглашению друга и получите скидку 10% на первый визит!**"
        
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

# ----------------- Client Cabinet & Bookings Handlers -----------------

@router.message(F.text == "📋 Мои записи")
@router.message(Command("my_bookings"))
async def show_my_bookings(message: Message):
    user_id = message.from_user.id
    
    # 1. Fetch client profile
    client = config.get_client_by_tg_id(user_id)
    
    # 2. Fetch bookings
    bookings = booking.load_bookings()
    my_bookings = [b for b in bookings if b.get("user_id") == user_id]
    
    upcoming = []
    past = []
    
    now = datetime.now()
    for b in my_bookings:
        if b.get("status") == "cancelled":
            continue
        try:
            b_dt = datetime.strptime(f"{b.get('date')} {b.get('time')}", "%Y-%m-%d %H:%M")
            if b_dt >= now:
                upcoming.append((b, b_dt))
            else:
                past.append(b)
        except Exception:
            upcoming.append((b, now))
            
    # Sort upcoming by date
    upcoming.sort(key=lambda x: x[1])
    
    text = "📋 <b>Личный кабинет &amp; Записи</b>\n\n"
    
    # If client is registered, show loyalty card
    if client:
        visits = client.get("loyalty_visits", 0)
        if visits is None:
            visits = 0
        stars = "⭐ " * visits + "☆ " * (3 - visits)
        text += f"🏆 <b>Программа лояльности:</b>\n"
        text += f"▫️ Баланс: {visits}/3 стрижек {stars}\n"
        
        if client.get("discount_available"):
            text += f"🎁 <b>Доступна скидка 20% на следующий визит!</b>\n\n"
        else:
            text += f"ℹ️ <i>После {3 - visits} визитов вы получите скидку 20%!</i> 🎁\n\n"
            
        text += f"👥 <b>Пригласи друга:</b>\n"
        text += f"▫️ Твой код: <code>{client.get('referral_code')}</code>\n"
        bot_info = await bot.get_me()
        ref_link = f"https://t.me/{bot_info.username}?start=ref_{client.get('referral_code')}"
        text += f"🔗 Ссылка для друзей:\n{ref_link}\n"
        text += "<i>(Когда друг завершит первую стрижку, он получит 10% скидки, а тебе зачислится +1 визит!)</i>\n\n"
    else:
        text += "ℹ️ Вы еще не совершали записей. Программа лояльности активируется автоматически после первой записи.\n\n"
        
    builder = InlineKeyboardBuilder()
    
    if upcoming:
        text += "📅 <b>Ваши ближайшие записи:</b>\n"
        for idx, (b, b_dt) in enumerate(upcoming, 1):
            date_formatted = b_dt.strftime("%d.%m.%Y")
            text += (
                f"{idx}. <b>{b.get('service_name')}</b> ({b.get('price')} сом)\n"
                f"   Мастер: {b.get('barber_name')}\n"
                f"   🕒 {date_formatted} в {b.get('time')}\n\n"
            )
            # Add cancel button for this booking
            builder.button(
                text=f"❌ Отменить запись #{idx}",
                callback_data=f"cancel_bk:{b.get('id')}"
            )
    else:
        text += "📅 Предстоящих записей пока нет.\n\n"
        
    # If client has no past bookings and was not referred yet, show option
    if client and not client.get("referred_by") and not past:
        builder.button(text="🔑 Ввести реф. код друга", callback_data="enter_referral")
        
    builder.adjust(1)
    await message.answer(text, reply_markup=builder.as_markup(), parse_mode=ParseMode.HTML)

@router.callback_query(F.data == "enter_referral")
async def cb_enter_referral(callback: CallbackQuery, state: FSMContext):
    await state.set_state(ClientState.waiting_for_referral)
    await callback.message.answer("🔑 Напишите реферальный код вашего друга (например, AZAMAT-1234):")
    await callback.answer()

@router.message(StateFilter(ClientState.waiting_for_referral))
async def process_referral_code(message: Message, state: FSMContext):
    code = message.text.strip().upper()
    user_id = message.from_user.id
    
    # Verify code
    inviter = config.get_client_by_referral_code(code)
    client = config.get_client_by_tg_id(user_id)
    
    if not inviter:
        await message.answer("❌ Неверный реферальный код. Пожалуйста, проверьте и введите снова:")
        return
        
    if inviter.get("telegram_user_id") == user_id:
        await message.answer("❌ Вы не можете использовать собственный код. Попробуйте другой:")
        return
        
    if client and client.get("referred_by"):
        await message.answer("❌ Вы уже активировали реферальный код.", reply_markup=get_main_menu_keyboard())
        await state.clear()
        return

    # Update referred_by
    if not client:
        # Create profile with referred_by
        config.get_or_create_client(
            telegram_user_id=user_id,
            telegram_username=message.from_user.username or "",
            full_name=message.from_user.first_name or "Клиент",
            phone="",
            referred_by=code
        )
    else:
        # Update existing
        if config.supabase_client:
            try:
                config.supabase_client.table("barbershop_clients").update({
                    "referred_by": code
                }).eq("id", client["id"]).execute()
            except Exception as e:
                logger.error(f"Error updating referral in Supabase: {e}")
        else:
            clients = config._load_local_json(config.CLIENTS_FILE)
            for c in clients:
                if c["id"] == client["id"]:
                    c["referred_by"] = code
                    break
            config._save_local_json(config.CLIENTS_FILE, clients)
            
    await message.answer(
        f"🎉 **Реферальный код активирован!**\n\n"
        f"Вы получите **скидку 10%** на свой первый визит в наш барбершоп! 🎁",
        reply_markup=get_main_menu_keyboard(),
        parse_mode=ParseMode.MARKDOWN
    )
    await state.clear()

@router.callback_query(F.data.startswith("cancel_bk:"))
async def cb_cancel_booking(callback: CallbackQuery):
    booking_id = callback.data.split(":")[1]
    user_id = callback.from_user.id
    
    bookings = booking.load_bookings()
    target_booking = next((b for b in bookings if b.get("id") == booking_id), None)
    
    if not target_booking:
        await callback.answer("Запись не найдена.", show_alert=True)
        return
        
    # Check 3 hour rule
    try:
        b_dt = datetime.strptime(f"{target_booking.get('date')} {target_booking.get('time')}", "%Y-%m-%d %H:%M")
        now = datetime.now()
        time_diff = b_dt - now
        if time_diff < timedelta(hours=3):
            await callback.message.answer(
                "❌ **Отмена невозможна.**\n\n"
                "До визита осталось менее 3 часов. По правилам нашего барбершопа, отмена в такое позднее время "
                "производится только через администратора по телефону. Спасибо за понимание! 🙏",
                parse_mode=ParseMode.MARKDOWN
            )
            await callback.answer()
            return
    except Exception as e:
        logger.error(f"Error parsing date during cancellation check: {e}")
        
    # Cancel the booking
    target_booking["status"] = "cancelled"
    
    if config.supabase_client:
        try:
            config.supabase_client.table("barbershop_bookings").update({"status": "cancelled"}).eq("id", booking_id).execute()
        except Exception as e:
            logger.error(f"Error cancelling booking in Supabase: {e}")
    else:
        # Save locally
        local_bookings = booking.load_bookings()
        for idx, b in enumerate(local_bookings):
            if b.get("id") == booking_id:
                local_bookings[idx]["status"] = "cancelled"
                break
        try:
            with open(booking.BOOKINGS_FILE, "w", encoding="utf-8") as f:
                json.dump(local_bookings, f, ensure_ascii=False, indent=2)
        except Exception as e:
            logger.error(f"Error saving cancelled booking locally: {e}")
            
    await callback.message.edit_text("❌ **Запись успешно отменена.** Ждем вас в другой раз!", parse_mode=ParseMode.MARKDOWN)
    await callback.answer()
    
    # Notify Admin of cancellation
    date_obj = datetime.strptime(target_booking.get("date"), "%Y-%m-%d")
    date_formatted = date_obj.strftime("%d.%m.%Y")
    
    admin_msg = (
        f"🚨 **Запись отменена клиентом!**\n\n"
        f"👤 **Клиент:** {target_booking.get('client_name')} (@{target_booking.get('username', '')})\n"
        f"📱 **Телефон:** {target_booking.get('client_phone')}\n"
        f"💇‍♂️ **Услуга:** {target_booking.get('service_name')} ({target_booking.get('price')} сом)\n"
        f"💈 **Мастер:** {target_booking.get('barber_name')}\n"
        f"📅 **Дата:** {date_formatted}\n"
        f"🕒 **Время:** {target_booking.get('time')}\n"
    )
    for admin_id in config.ADMIN_TELEGRAM_IDS:
        try:
            await bot.send_message(admin_id, admin_msg, parse_mode=ParseMode.MARKDOWN)
        except Exception as e:
            logger.error(f"Error sending admin cancellation notification: {e}")

# ----------------- Review Handlers -----------------

@router.callback_query(F.data.startswith("rate:"))
async def cb_rate_visit(callback: CallbackQuery, state: FSMContext):
    parts = callback.data.split(":")
    rating = int(parts[1])
    booking_id = parts[2]
    
    bookings = booking.load_bookings()
    bk = next((b for b in bookings if b.get("id") == booking_id), None)
    if not bk:
        await callback.answer("Запись не найдена.")
        return
        
    client = config.get_client_by_tg_id(callback.from_user.id)
    client_id = client["id"] if client else None
    
    # Save rating with placeholder comment
    config.save_review(
        booking_id=booking_id,
        client_id=client_id,
        barber_id=bk.get("barber_id"),
        rating=rating,
        comment=""
    )
    
    await state.update_data(current_review_booking_id=booking_id, current_review_rating=rating)
    await state.set_state(ClientState.waiting_for_review_comment)
    
    stars = "⭐" * rating
    await callback.message.edit_text(
        f"Вы поставили: {stars} ({rating} из 5)\n\n"
        "Спасибо за вашу оценку! 📝 Хотите оставить короткий комментарий о работе мастера? "
        "Напишите его в ответном сообщении или нажмите кнопку «Пропустить».",
        reply_markup=InlineKeyboardBuilder().button(text="Пропустить ⏩", callback_data="skip_comment").as_markup()
    )
    await callback.answer()

@router.callback_query(F.data == "skip_comment")
@router.message(StateFilter(ClientState.waiting_for_review_comment))
async def process_review_comment(event, state: FSMContext):
    comment = ""
    is_cb = isinstance(event, CallbackQuery)
    
    state_data = await state.get_data()
    booking_id = state_data.get("current_review_booking_id")
    
    if not is_cb:
        comment = event.text.strip()
        
    if booking_id:
        reviews = config._load_local_json(config.REVIEWS_FILE)
        review_updated = False
        
        if config.supabase_client:
            try:
                config.supabase_client.table("barbershop_reviews").update({"comment": comment}).eq("booking_id", booking_id).execute()
                review_updated = True
            except Exception as e:
                logger.error(f"Error updating review comment in Supabase: {e}")
                
        if not review_updated:
            for r in reviews:
                if r.get("booking_id") == booking_id:
                    r["comment"] = comment
                    break
            config._save_local_json(config.REVIEWS_FILE, reviews)
            
    response_text = "🎉 **Спасибо за отзыв!**\nВаше мнение помогает нам становиться лучше. Ждем вас снова! 💈"
    
    if is_cb:
        await event.message.edit_text(response_text, parse_mode=ParseMode.MARKDOWN)
        await event.answer()
    else:
        await event.answer(response_text, reply_markup=get_main_menu_keyboard(), parse_mode=ParseMode.MARKDOWN)
        
    await state.clear()

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
    user_id = message.from_user.id
    
    # 1. Fetch client profile
    client_profile = config.get_client_by_tg_id(user_id)
    
    # 2. Check if client has a discount available
    discount_applied = False
    discount_source = ""
    final_price = data["price"]
    
    # Check if this is their first booking
    existing_bookings = [b for b in booking.load_bookings() if b.get("user_id") == user_id and b.get("status") != "cancelled"]
    is_first_booking = len(existing_bookings) == 0
    
    if client_profile and client_profile.get("discount_available"):
        discount_applied = True
        discount_percent = client_profile.get("discount_percent", 20)
        final_price = data["price"] * (100 - discount_percent) // 100
        discount_source = "Программа лояльности (20%)"
    elif is_first_booking and client_profile and client_profile.get("referred_by"):
        discount_applied = True
        final_price = data["price"] * 90 // 100 # 10% discount
        discount_source = "Реферальная скидка (10%)"
        
    # Ensure client record exists
    config.get_or_create_client(
        telegram_user_id=user_id,
        telegram_username=message.from_user.username or "",
        full_name=data["client_name"],
        phone=phone
    )
    
    # Structure booking record
    booking_record = {
        "id": f"bk_{int(datetime.now().timestamp())}",
        "user_id": user_id,
        "username": message.from_user.username or "",
        "client_name": data["client_name"],
        "client_phone": phone,
        "service_id": data["service_id"],
        "service_name": data["service_name"],
        "price": final_price,
        "barber_id": data["barber_id"],
        "barber_name": data["barber_name"],
        "date": data["date"],
        "time": data["time"],
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "status": "confirmed",
        "loyalty_processed": False,
        "discount_applied": discount_applied,
        "reminder_sent_24h": False,
        "reminder_sent_2h": False,
        "review_requested": False
    }
    
    # Save booking
    booking.save_booking(booking_record)
    
    # Format date for display
    date_obj = datetime.strptime(data["date"], "%Y-%m-%d")
    date_formatted = date_obj.strftime("%d.%m.%Y")
    
    success_text = (
        "🎉 **Запись успешно оформлена!**\n\n"
        f"👤 **Имя:** {data['client_name']}\n"
        f"📞 **Телефон:** {phone}\n"
        f"💇‍♂️ **Услуга:** {data['service_name']} ({final_price} сом)\n"
    )
    if discount_applied:
        success_text += f"🎁 **Применена скидка:** {discount_source} (Обычная цена: {data['price']} сом)\n"
        
    success_text += (
        f"💈 **Мастер:** {data['barber_name']}\n"
        f"📅 **Дата:** {date_formatted}\n"
        f"🕒 **Время:** {data['time']}\n\n"
        "Ждём тебя в гости! Если твои планы изменятся, пожалуйста, отмени запись через меню «Мои записи». 😉"
    )
    
    await message.answer(
        success_text,
        reply_markup=get_main_menu_keyboard(),
        parse_mode=ParseMode.MARKDOWN
    )
    
    # Admin notification
    admin_msg = (
        f"🆕 **Новая запись!**\n\n"
        f"👤 **Клиент:** {data['client_name']} (@{message.from_user.username or ''})\n"
        f"📱 **Телефон:** {phone}\n"
        f"💇‍♂️ **Услуга:** {data['service_name']} ({final_price} сом"
        f"{' - применилась скидка!' if discount_applied else ''})\n"
        f"💈 **Мастер:** {data['barber_name']}\n"
        f"📅 **Дата:** {date_formatted}\n"
        f"🕒 **Время:** {data['time']}\n"
    )
    for admin_id in config.ADMIN_TELEGRAM_IDS:
        try:
            await bot.send_message(admin_id, admin_msg, parse_mode=ParseMode.MARKDOWN)
        except Exception as e:
            logger.error(f"Error sending admin notification: {e}")
            
    await state.clear()

# ----------------- Fallback Text Handler (AI Agent) -----------------

@router.message(F.text)
async def handle_user_text(message: Message):
    # Show typing action to simulate active thinking
    await bot.send_chat_action(chat_id=message.chat.id, action="typing")
    
    # Send request to AI Engine
    ai_reply = await ai_engine.generate_ai_reply(message.from_user.id, message.text)
    
    await message.answer(ai_reply, parse_mode=ParseMode.MARKDOWN)

# ----------------- Background Async Loops -----------------

async def booking_reminder_loop():
    import json
    while True:
        try:
            bookings = booking.load_bookings()
            now = datetime.now()
            
            for b in bookings:
                if b.get("status") != "confirmed":
                    continue
                
                try:
                    b_dt = datetime.strptime(f"{b.get('date')} {b.get('time')}", "%Y-%m-%d %H:%M")
                except Exception:
                    continue
                    
                time_to_appt = b_dt - now
                user_id = b.get("user_id")
                
                if not user_id:
                    continue
                    
                # 24 hour reminder
                if timedelta(hours=22) <= time_to_appt <= timedelta(hours=24) and not b.get("reminder_sent_24h"):
                    date_obj = datetime.strptime(b.get("date"), "%Y-%m-%d")
                    date_formatted = date_obj.strftime("%d.%m.%Y")
                    msg = (
                        f"🔔 **Напоминание о записи!**\n\n"
                        f"Завтра в **{b.get('time')}** вас ждет стрижка у мастера **{b.get('barber_name')}**.\n"
                        f"Услуга: {b.get('service_name')} ({b.get('price')} сом).\n\n"
                        f"Ждем вас! Если планы изменились, пожалуйста, отмените запись через меню «Мои записи»."
                    )
                    try:
                        await bot.send_message(user_id, msg, parse_mode=ParseMode.MARKDOWN)
                        b["reminder_sent_24h"] = True
                        if config.supabase_client:
                            config.supabase_client.table("barbershop_bookings").update({"reminder_sent_24h": True}).eq("id", b.get("id")).execute()
                        else:
                            with open(booking.BOOKINGS_FILE, "w", encoding="utf-8") as f:
                                json.dump(bookings, f, ensure_ascii=False, indent=2)
                        logger.info(f"Sent 24h reminder to user {user_id} for booking {b.get('id')}")
                    except Exception as e:
                        logger.error(f"Error sending 24h reminder: {e}")
                        
                # 2 hour reminder
                if timedelta(hours=1.5) <= time_to_appt <= timedelta(hours=2) and not b.get("reminder_sent_2h"):
                    msg = (
                        f"⚡ **Визит уже скоро!**\n\n"
                        f"Через 2 часа (в **{b.get('time')}**) у вас запись у мастера **{b.get('barber_name')}**.\n"
                        f"Пожалуйста, не опаздывайте! 😉"
                    )
                    try:
                        await bot.send_message(user_id, msg, parse_mode=ParseMode.MARKDOWN)
                        b["reminder_sent_2h"] = True
                        if config.supabase_client:
                            config.supabase_client.table("barbershop_bookings").update({"reminder_sent_2h": True}).eq("id", b.get("id")).execute()
                        else:
                            with open(booking.BOOKINGS_FILE, "w", encoding="utf-8") as f:
                                json.dump(bookings, f, ensure_ascii=False, indent=2)
                        logger.info(f"Sent 2h reminder to user {user_id} for booking {b.get('id')}")
                    except Exception as e:
                        logger.error(f"Error sending 2h reminder: {e}")
                        
        except Exception as e:
            logger.error(f"Error in booking reminder loop: {e}")
            
        await asyncio.sleep(30)

async def loyalty_processing_loop():
    import json
    while True:
        try:
            bookings = booking.load_bookings()
            now = datetime.now()
            
            for b in bookings:
                user_id = b.get("user_id")
                booking_id = b.get("id")
                
                if not user_id:
                    continue
                    
                # 1. Processing completed visits (Loyalty)
                if b.get("status") == "completed" and not b.get("loyalty_processed"):
                    # Find or create client
                    client = config.get_or_create_client(
                        telegram_user_id=user_id,
                        telegram_username=b.get("username", ""),
                        full_name=b.get("client_name", ""),
                        phone=b.get("client_phone", "")
                    )
                    
                    visits_before = client.get("loyalty_visits", 0)
                    discount_applied = b.get("discount_applied", False)
                    
                    if discount_applied:
                        visits_after = 0
                        discount_available = False
                        action = "discount_used"
                        details = "Использована скидка 20% по программе лояльности"
                    else:
                        visits_after = visits_before + 1
                        if visits_after >= 3:
                            discount_available = True
                            action = "discount_earned"
                            details = "Получена скидка 20% за 3 выполненных визита"
                        else:
                            discount_available = False
                            action = "visit_counted"
                            details = f"Начислен визит {visits_after}/3 до скидки"
                            
                    config.update_client_loyalty(client["id"], visits_after, discount_available)
                    config.log_loyalty_action(client["id"], booking_id, action, visits_before, visits_after, details)
                    
                    stars = "⭐" * visits_after + "☆" * (3 - visits_after)
                    msg = (
                        f"✂️ **Стрижка выполнена!**\n\n"
                        f"Спасибо за визит в наш барбершоп! Ваш визит успешно подтвержден.\n\n"
                    )
                    if discount_applied:
                        msg += "🎁 Вы успешно воспользовались своей скидкой 20%! Счётчик лояльности сброшен.\n\n"
                    else:
                        msg += f"🏆 Баланс лояльности: **{visits_after}/3** {stars}\n\n"
                        if discount_available:
                            msg += "🎉 **Поздравляем! Ваша следующая (4-я) стрижка будет со скидкой 20%!** Скидка применится автоматически при следующей записи через бота.\n\n"
                        else:
                            msg += f"ℹ️ *После {3 - visits_after} визитов вы получите скидку 20%!* 🎁\n\n"
                            
                    try:
                        await bot.send_message(user_id, msg, parse_mode=ParseMode.MARKDOWN)
                    except Exception as e:
                        logger.error(f"Error notifying client about visit completion: {e}")
                        
                    # REFERRAL BONUS CHECK
                    client_completed_bookings = [
                        bk for bk in bookings 
                        if bk.get("user_id") == user_id 
                        and bk.get("status") == "completed" 
                        and bk.get("id") != booking_id
                    ]
                    is_first_completed_visit = len(client_completed_bookings) == 0
                    
                    if is_first_completed_visit and client.get("referred_by"):
                        inviter_code = client.get("referred_by")
                        inviter = config.get_client_by_referral_code(inviter_code)
                        
                        if inviter and inviter.get("id") != client.get("id"):
                            inv_visits_before = inviter.get("loyalty_visits", 0)
                            inv_visits_after = inv_visits_before + 1
                            inv_discount_available = inviter.get("discount_available", False)
                            
                            inv_details = f"Бонус за приглашение друга @{b.get('username', '')}"
                            inv_action = "referral_bonus"
                            
                            if inv_visits_after >= 3:
                                inv_discount_available = True
                                inv_details += " (получена скидка 20%)"
                                
                            config.update_client_loyalty(inviter["id"], inv_visits_after, inv_discount_available)
                            config.log_loyalty_action(inviter["id"], None, inv_action, inv_visits_before, inv_visits_after, inv_details)
                            
                            inv_stars = "⭐" * inv_visits_after + "☆" * (3 - inv_visits_after)
                            inv_msg = (
                                f"👥 **Ваш реферал завершил стрижку!**\n\n"
                                f"Ваш друг **{client.get('full_name')}** совершил свой первый визит! Вам начислен +1 бонусный визит к лояльности. 🎉\n\n"
                                f"🏆 Баланс лояльности: **{inv_visits_after}/3** {inv_stars}\n"
                            )
                            if inv_discount_available and not inviter.get("discount_available"):
                                inv_msg += "\n🎉 **Поздравляем! Ваша следующая стрижка будет со скидкой 20%!**"
                                
                            inv_tg_id = inviter.get("telegram_user_id")
                            if inv_tg_id:
                                try:
                                    await bot.send_message(inv_tg_id, inv_msg, parse_mode=ParseMode.MARKDOWN)
                                except Exception as e:
                                    logger.error(f"Error notifying inviter {inv_tg_id}: {e}")
                                    
                    # Mark booking as loyalty processed
                    b["loyalty_processed"] = True
                    if config.supabase_client:
                        try:
                            config.supabase_client.table("barbershop_bookings").update({"loyalty_processed": True}).eq("id", booking_id).execute()
                        except Exception as e:
                            logger.error(f"Error updating loyalty_processed in Supabase: {e}")
                    else:
                        with open(booking.BOOKINGS_FILE, "w", encoding="utf-8") as f:
                            json.dump(bookings, f, ensure_ascii=False, indent=2)
                            
                    logger.info(f"Processed loyalty for completed booking {booking_id}")
                    
                # 2. Sending review requests (1 hour after completed appt)
                if b.get("status") == "completed" and b.get("loyalty_processed") and not b.get("review_requested"):
                    try:
                        b_dt = datetime.strptime(f"{b.get('date')} {b.get('time')}", "%Y-%m-%d %H:%M")
                    except Exception:
                        continue
                        
                    time_since_appt = now - b_dt
                    
                    # For live operations, 1 hour delay.
                    if time_since_appt >= timedelta(hours=1):
                        kb_builder = InlineKeyboardBuilder()
                        for r in range(5, 0, -1):
                            stars_str = "⭐" * r
                            kb_builder.button(text=f"{stars_str} ({r})", callback_data=f"rate:{r}:{booking_id}")
                        kb_builder.adjust(1)
                        
                        review_msg = (
                            f"👋 **Как вам стрижка у мастера {b.get('barber_name')}?**\n\n"
                            f"Нам очень важно ваше мнение! Пожалуйста, оцените визит от 1 до 5 звезд 👇"
                        )
                        try:
                            await bot.send_message(user_id, review_msg, reply_markup=kb_builder.as_markup(), parse_mode=ParseMode.MARKDOWN)
                            b["review_requested"] = True
                            
                            if config.supabase_client:
                                config.supabase_client.table("barbershop_bookings").update({"review_requested": True}).eq("id", booking_id).execute()
                            else:
                                with open(booking.BOOKINGS_FILE, "w", encoding="utf-8") as f:
                                    json.dump(bookings, f, ensure_ascii=False, indent=2)
                                    
                            logger.info(f"Sent review request to user {user_id} for booking {booking_id}")
                        except Exception as e:
                            logger.error(f"Error sending review request: {e}")
                            
        except Exception as e:
            logger.error(f"Error in loyalty processing loop: {e}")
            
        await asyncio.sleep(30)

# ----------------- Main Startup -----------------

def run_dummy_web_server():
    import threading
    from http.server import SimpleHTTPRequestHandler, HTTPServer
    
    port = int(os.getenv("PORT", "8080"))
    class DummyHandler(SimpleHTTPRequestHandler):
        def do_GET(self):
            self.send_response(200)
            self.send_header("Content-type", "text/plain")
            self.end_headers()
            self.wfile.write(b"Bot is online!")
            
    try:
        server = HTTPServer(("0.0.0.0", port), DummyHandler)
        logger.info(f"Starting dummy HTTP server on port {port} for Render health checks...")
        
        # Start server in a daemon thread
        t = threading.Thread(target=server.serve_forever, daemon=True)
        t.start()
    except Exception as e:
        logger.error(f"Error starting dummy web server: {e}")

async def main():
    # Run the dummy web server to keep Render Free Tier Web Service alive
    run_dummy_web_server()
    
    # Start background loop tasks
    asyncio.create_task(booking_reminder_loop())
    asyncio.create_task(loyalty_processing_loop())
    
    dp.include_router(router)
    logger.info("Starting Telegram Barbershop AI Bot...")
    await dp.start_polling(bot)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except (KeyboardInterrupt, SystemExit):
        logger.info("Bot stopped.")
