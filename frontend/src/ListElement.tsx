import React from "react";
import "./ListElement.css"; // import stylów

type Game = {
  rank: number;
  name: string;
  platform: string;
  year: number;
  genre: string;
  publisher: string;
  na_sales: number;
  eu_sales: number;
  jp_sales: number;
  other_sales: number;
  global_sales: number;
};

type GameListItemProps = {
  game: Game;
};

const GameListItem: React.FC<GameListItemProps> = ({ game }) => {
  return (
    <li className="game-card">
      <div className="game-header">
        <span className="rank">#{game.rank}</span>
        <span className="title">{game.name}</span>
        <span className="year">({game.year})</span>
      </div>
      <div className="game-details">
        <p>
          <strong>Platform:</strong> {game.platform}
        </p>
        <p>
          <strong>Genre:</strong> {game.genre}
        </p>
        <p>
          <strong>Publisher:</strong> {game.publisher}
        </p>
        <p className="sales-line">
          <strong>Sales:</strong>
          <span> NA: {game.na_sales}M ·</span>
          <span> EU: {game.eu_sales}M ·</span>
          <span> JP: {game.jp_sales}M ·</span>
          <span> Other: {game.other_sales}M ·</span>
          <strong> Global: {game.global_sales}M</strong>
        </p>
      </div>
    </li>
  );
};

export default GameListItem;
