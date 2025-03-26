-- Tworzenie tabeli, jeśli nie istnieje
CREATE TABLE IF NOT EXISTS games (
    rank SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    platform TEXT,
    year INTEGER,
    genre TEXT,
    publisher TEXT,
    na_sales FLOAT,
    eu_sales FLOAT,
    jp_sales FLOAT,
    other_sales FLOAT,
    global_sales FLOAT
);

-- Import danych z CSV
COPY games(rank, name, platform, year, genre, publisher, na_sales, eu_sales, jp_sales, other_sales, global_sales)
FROM '/docker-entrypoint-initdb.d/vgsales_cleaned.csv'
DELIMITER ','
CSV HEADER;

SELECT setval('games_rank_seq', COALESCE((SELECT MAX(rank) FROM games), 0)+1, false);
