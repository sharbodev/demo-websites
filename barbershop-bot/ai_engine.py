import logging
import google.generativeai as genai
import config

logger = logging.getLogger(__name__)

# Configure Google Gemini API key once on startup
if config.GEMINI_API_KEY:
    try:
        genai.configure(api_key=config.GEMINI_API_KEY)
    except Exception as e:
        logger.error(f"Failed to configure Gemini API: {e}")
else:
    logger.warning("GEMINI_API_KEY is not set. AI replies will use fallback responses.")

# Simple in-memory memory manager for storing conversation context
# Format: {user_id: [ {"role": "user/model", "content": "text"}, ... ]}
CONVERSATION_HISTORY = {}
MAX_HISTORY_LENGTH = 12  # Keep last 6 exchanges (12 messages) to conserve context/tokens

def get_system_prompt() -> str:
    """
    Dynamically builds system prompt from database context.
    """
    ctx = config.get_business_context()
    services = config.get_active_services()
    barbers = config.get_active_barbers()
    
    services_str = "\n".join([
        f"- {s['name']}: {s['price']} {ctx.get('currency', 'сом')} ({s['duration_minutes']} мин) - {s.get('description', '')}"
        for s in services
    ])
    
    barbers_str = "\n".join([
        f"- {b['name']} (Рейтинг: {b.get('rating', 5.0)})"
        for b in barbers
    ])
    
    faq_str = "\n".join([
        f"Вопрос: {f['question']}\nОтвет: {f['answer']}"
        for f in ctx.get("faq", [])
    ])

    system_prompt = f"""
Ты — профессиональный, дружелюбный и стильный AI-администратор барбершопа "{ctx.get('business_name', 'Blade Barbershop')}".
Твоя цель — консультировать клиентов по услугам, ценам, расписанию и помогать им записаться на стрижку.

ИНФОРМАЦИЯ О БИЗНЕСЕ:
- Название: {ctx.get('business_name', 'Blade Barbershop')}
- Адрес: {ctx.get('address', '')}
- Телефон: {ctx.get('phone', '')}
- Режим работы:
  Будни: {ctx.get('working_hours', {}).get('weekdays', '')}
  Суббота: {ctx.get('working_hours', {}).get('saturday', '')}
  Воскресенье: {ctx.get('working_hours', {}).get('sunday', '')}

НАШИ УСЛУГИ:
{services_str}

НАШИ МАСТЕРА:
{barbers_str}

ЧАСТО ЗАДАВАЕМЫЕ ВОПРОСЫ:
{faq_str}

ПРАВИЛА ОБЩЕНИЯ:
{ctx.get('ai_instructions', '')}
1. Отвечай кратко, 1-3 предложения. Избегай огромных абзацев.
2. Общайся дружелюбно, на 'ты', создавай атмосферу хорошего барбершопа.
3. Если клиент хочет записаться, скажи, что он может сделать это прямо сейчас, нажав на кнопку "Записаться на стрижку" в меню бота, или ты можешь помочь ему, если он назовет услугу, желаемую дату и время.
4. Отвечай только на темы, связанные с барбершопом. Если спрашивают не по теме, мягко и с юмором переведи разговор обратно на стрижки.
"""
    return system_prompt

async def generate_ai_reply(user_id: int, user_message: str) -> str:
    """
    Sends the user message along with memory context to Gemini API.
    If no key is configured, uses a smart fallback.
    """
    # 1. Check if Gemini API is available
    if not config.GEMINI_API_KEY:
        return (
            "Привет! Мой ИИ-мозг временно настраивается администратором. 💈\n\n"
            "Но я всё равно готов помочь! Нажмите кнопку **Услуги и цены** в меню или напишите **Записаться**, "
            "чтобы выбрать время для стрижки."
        )

    # 2. Initialize history for user if not exists
    if user_id not in CONVERSATION_HISTORY:
        CONVERSATION_HISTORY[user_id] = []

    # 3. Build contents list including system instruction and history
    history = CONVERSATION_HISTORY[user_id]
    
    # We append the current messages to our local memory
    history.append({"role": "user", "parts": [user_message]})
    
    # Convert local history to format required by Google GenAI
    api_history = []
    for msg in history:
        api_history.append({
            "role": msg["role"],
            "parts": msg["parts"]
        })
        
    try:
        # Create model instance dynamically to pick up any settings changes
        model = genai.GenerativeModel(
            model_name="gemini-3.5-flash",
            system_instruction=get_system_prompt()
        )
        
        # Request reply from Gemini
        response = await model.generate_content_async(
            contents=api_history,
            generation_config=genai.types.GenerationConfig(
                temperature=0.7,
            )
        )
        
        reply = response.text.strip()
        
        # Save model reply to history
        history.append({"role": "model", "parts": [reply]})
        
        # Limit history size to prevent context bloat
        if len(history) > MAX_HISTORY_LENGTH:
            CONVERSATION_HISTORY[user_id] = history[-MAX_HISTORY_LENGTH:]
            
        return reply

    except Exception as e:
        logger.error(f"Error calling Gemini API for user {user_id}: {e}")
        return (
            "Упс, небольшие технические неполадки на моей стороне. 🛠️\n"
            "Давай я просто покажу наши услуги или помогу записаться. Воспользуйся кнопками меню!"
        )

def clear_user_history(user_id: int):
    if user_id in CONVERSATION_HISTORY:
        del CONVERSATION_HISTORY[user_id]
