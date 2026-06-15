import asyncio
import logging
from supabase import create_client, Client
import config

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("seed_db")

async def seed():
    if not config.SUPABASE_URL or not config.SUPABASE_KEY:
        logger.error("SUPABASE_URL and SUPABASE_KEY must be set in your .env file to run seeding.")
        return

    logger.info("Connecting to Supabase...")
    supabase: Client = create_client(config.SUPABASE_URL, config.SUPABASE_KEY)
    
    ctx = config.BUSINESS_CONTEXT

    # 1. Seed Services
    logger.info("Seeding services...")
    services = ctx.get("services", [])
    for s in services:
        data = {
            "id": s["id"],
            "name": s["name"],
            "price": s["price"],
            "duration_minutes": s["duration_minutes"],
            "description": s["description"],
            "is_active": True
        }
        try:
            supabase.table("barbershop_services").upsert(data).execute()
            logger.info(f"Service upserted: {s['name']}")
        except Exception as e:
            logger.error(f"Error seeding service {s['id']}: {e}")

    # 2. Seed Barbers
    logger.info("Seeding barbers...")
    barbers = ctx.get("barbers", [])
    for b in barbers:
        data = {
            "id": b["id"],
            "name": b["name"],
            "rating": b["rating"],
            "is_active": True
        }
        try:
            supabase.table("barbershop_barbers").upsert(data).execute()
            logger.info(f"Barber upserted: {b['name']}")
        except Exception as e:
            logger.error(f"Error seeding barber {b['id']}: {e}")

    # 3. Seed Settings (address, phone, hours, instructions)
    logger.info("Seeding settings...")
    settings = {
        "business_name": ctx["business_name"],
        "niche": ctx["niche"],
        "language": ctx["language"],
        "currency": ctx["currency"],
        "address": ctx["address"],
        "phone": ctx["phone"],
        "working_hours": ctx["working_hours"],
        "faq": ctx["faq"],
        "ai_instructions": ctx["ai_instructions"]
    }
    
    try:
        supabase.table("barbershop_settings").upsert({
            "key": "general",
            "value": settings
        }).execute()
        logger.info("General settings seeded successfully.")
    except Exception as e:
        logger.error(f"Error seeding settings: {e}")

    logger.info("Database seeding completed!")

if __name__ == "__main__":
    asyncio.run(seed())
