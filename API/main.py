from fastapi import FastAPI, Depends
import asyncpg
from typing import List

app = FastAPI()

DB_HOST = "lc-postgres"  # Nazwa kontenera PostgreSQL
DB_NAME = "postgres"
DB_USER = "postgres"
DB_PASSWORD = "admin"

# Tworzenie połączenia z bazą danych
async def connect_to_db():
    return await asyncpg.create_pool(
        host=DB_HOST,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD
    )

# Dependency injection dla połączenia DB
async def get_db():
    async with db_pool.acquire() as connection:
        yield connection

@app.on_event("startup")
async def startup():
    global db_pool
    db_pool = await connect_to_db()

@app.on_event("shutdown")
async def shutdown():
    await db_pool.close()

# Endpoint do pobierania gier
@app.get("/games", response_model=List[dict])
async def get_games(db=Depends(get_db)):
    rows = await db.fetch("SELECT * FROM games LIMIT 10;")
    return [dict(row) for row in rows]

# Uruchamianie aplikacji
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8082)
