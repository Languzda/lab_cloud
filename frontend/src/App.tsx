import { useState } from "react";

import "./App.css";
import ListElement from "./ListElement";

const API_URL = import.meta.env.VITE_API_URL;

const GameApp = () => {
  const [games, setGames] = useState([]);
  const [stats, setStats] = useState([]);
  const [limit, setLimit] = useState(10);
  const [formData, setFormData] = useState({
    name: "",
    platform: "",
    year: "",
    genre: "",
    publisher: "",
    na_sales: "",
    eu_sales: "",
    jp_sales: "",
    other_sales: "",
    global_sales: "",
  });
  const [searchName, setSearchName] = useState("");
  const [updateId, setUpdateId] = useState("");

  // Fetch all games
  const fetchGames = async () => {
    const response = await fetch(
      `${API_URL}/games${searchName ? `?name=${searchName}` : ""}${searchName && limit ? `&limit=${limit}` : limit ? `?limit=${limit}` : ""}`
    );

    setSearchName("");
    const data = await response.json();

    console.log(data);
    setGames(data);
  };

  // Add a new game
  const addGame = async (e) => {
    e.preventDefault();
    const response = await fetch(`${API_URL}/games`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    alert("Game added successfully!");
    fetchGames();
  };

  // Update an existing game
  const updateGame = async (e) => {
    e.preventDefault();
    const response = await fetch(`${API_URL}/games/${updateId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      alert("Game updated successfully!");
      console.log(await response.json());
      fetchGames();
    } else {
      alert("Failed to update game.");
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    const response = await fetch(`${API_URL}/stats`);
    const data = await response.json();
    setStats(data);
  };

  return (
    <div>
      <h1>Games Sales</h1>

      {/* Fetch Games */}
      <div>
        <h2>Fetch Games</h2>
        <input
          type="text"
          placeholder="Search by name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Limit"
          value={limit}
          min={0}
          max={50}
          onChange={(e) => setLimit(e.target.value)}
        />
        <button onClick={fetchGames}>Fetch Games</button>
        <ul>
          {games.map((game, index) => (
            <ListElement game={game} key={index} />
          ))}
        </ul>
      </div>

      {/* Add Game */}
      <div>
        <h2>Add Game</h2>
        <form onSubmit={addGame}>
          {Object.keys(formData).map((key) => (
            <div key={key}>
              <label>{key}:</label>
              <input
                type={
                  key === "year" || key.includes("sales") ? "number" : "text"
                }
                value={formData[key]}
                onChange={(e) =>
                  setFormData({ ...formData, [key]: e.target.value })
                }
                required
              />
            </div>
          ))}
          <button type="submit">Add Game</button>
        </form>
      </div>

      {/* Update Game */}
      <div>
        <h2>Update Game</h2>
        <form onSubmit={updateGame}>
          <label>Game ID to Update:</label>
          <input
            type="number"
            value={updateId}
            onChange={(e) => setUpdateId(e.target.value)}
            required
          />
          {Object.keys(formData).map((key) => (
            <div key={key}>
              <label>{key}:</label>
              <input
                type={
                  key === "year" || key.includes("sales") ? "number" : "text"
                }
                value={formData[key]}
                onChange={(e) =>
                  setFormData({ ...formData, [key]: e.target.value })
                }
                required
              />
            </div>
          ))}
          <button type="submit">Update Game</button>
        </form>
      </div>

      {/* Fetch Stats */}
      <div>
        <h2>Fetch Stats</h2>
        <button onClick={fetchStats}>Fetch Stats</button>
        <ul>
          {stats.map((stat, index) => (
            <li key={index}>{JSON.stringify(stat)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GameApp;
