-- Tworzenie tabeli, jeśli nie istnieje
CREATE TABLE IF NOT EXISTS games (
    rank INTEGER PRIMARY KEY,
    name TEXT,
    platform TEXT,
    year INTEGER,
    genre TEXT,
    publisher TEXT,
    na_sales NUMERIC,
    eu_sales NUMERIC,
    jp_sales NUMERIC,
    other_sales NUMERIC,
    global_sales NUMERIC
);

-- Import danych z CSV
COPY games(rank, name, platform, year, genre, publisher, na_sales, eu_sales, jp_sales, other_sales, global_sales)
FROM '/docker-entrypoint-initdb.d/vgsales_cleaned.csv'
DELIMITER ','
CSV HEADER;
