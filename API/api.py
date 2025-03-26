from fastapi import FastAPI, Depends, HTTPException
import asyncpg
from typing import List, Optional
from pydantic import BaseModel
import os

app = FastAPI()

DB_HOST = os.environ.get("DB_HOST", "lc-postgres")  # Nazwa kontenera PostgreSQL
DB_NAME = os.environ.get("DB_NAME","postgres")
DB_USER = os.environ.get("DB_USER", "postgres")
DB_PASSWORD = os.environ.get("DB_PASSWORD","admin")

# Model danych do walidacji
class Game(BaseModel):
    name: str
    platform: str
    year: Optional[int] = None
    genre: str
    publisher: str
    na_sales: float
    eu_sales: float
    jp_sales: float
    other_sales: float
    global_sales: float

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

# 1️⃣ Pobieranie wszystkich rekordów (ocena 3.0)
@app.get("/games", response_model=List[dict])
async def get_games(name: Optional[str] = None, db=Depends(get_db)):
    if name:
        query = "SELECT * FROM games WHERE name ILIKE $1;"
        rows = await db.fetch(query, f"%{name}%")
    else:
        query = "SELECT * FROM games;"
        rows = await db.fetch(query)

    return [dict(row) for row in rows]

# 2️⃣ Dodawanie nowego rekordu (ocena 4.0)
@app.post("/games")
async def add_game(game: Game, db=Depends(get_db)):
    query = """
    INSERT INTO games (name, platform, year, genre, publisher, 
                      na_sales, eu_sales, jp_sales, other_sales, global_sales)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *;
    """
    row = await db.fetchrow(query, game.name, game.platform, game.year, 
                            game.genre, game.publisher, game.na_sales, game.eu_sales, 
                            game.jp_sales, game.other_sales, game.global_sales)
    
    return dict(row)

# 3️⃣ Modyfikacja istniejącego rekordu (ocena 4.5)
@app.put("/games/{game_id}")
async def update_game(game_id: int, game: Game, db=Depends(get_db)):
    query = """
    UPDATE games 
    SET name = $1, platform = $2, year = $3, genre = $4, publisher = $5,
        na_sales = $6, eu_sales = $7, jp_sales = $8, other_sales = $9, global_sales = $10
    WHERE rank = $11
    RETURNING *;
    """
    row = await db.fetchrow(query, game.name, game.platform, game.year, 
                            game.genre, game.publisher, game.na_sales, game.eu_sales, 
                            game.jp_sales, game.other_sales, game.global_sales, game_id)

    if not row:
        raise HTTPException(status_code=404, detail="Gra nie znaleziona")
    
    return dict(row)

# 4️⃣ Zaawansowane przetwarzanie – statystyki sprzedaży (ocena 5.0)
@app.get("/stats")
async def get_stats(db=Depends(get_db)):
    query = """
    SELECT genre, COUNT(*) AS total_games, 
           SUM(global_sales) AS total_sales, 
           AVG(global_sales) AS avg_sales 
    FROM games 
    GROUP BY genre 
    ORDER BY total_sales DESC;
    """
    rows = await db.fetch(query)
    return [dict(row) for row in rows]

# Uruchamianie aplikacji
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8082)
