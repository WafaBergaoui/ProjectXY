import React, { useEffect, useContext } from "react";
import { GameContext } from "../context/GameContext";
import { UserContext } from "../context/UserContext";
import { HomeContext } from "../context/HomeContext";

import ChooseOpponent from "../components/ChooseOpponent";
import ChooseUsername from "../components/ChooseUsername";

import styles from "./HomeScreen.module.css";

const OpponentScreen = () => {
  const [component] = useContext(HomeContext);
  const {
    squares: _squares,
    winner: _winner,
    isX: _isX,
    multiplayer: _multiplayer,
    nextPlayer: _nextPlayer,
  } = useContext(GameContext);
  const { user: _user, room: _room, player: _player } = useContext(UserContext);

  const setSquares = _squares[1];
  const setWinner = _winner[1];
  const setIsX = _isX[1];
  const setMultiplayer = _multiplayer[1];
  const setNextPlayer = _nextPlayer[1];
  const setUser = _user[1];
  const setRoom = _room[1];
  const setPlayer = _player[1];

  useEffect(() => {
    setSquares(Array(9).fill(null));
    setWinner("");
    setIsX(false);
    setMultiplayer(true);
    setNextPlayer("X");
    setUser("");
    setRoom("");
    setPlayer("");
  }, []);

  return (
    <div className={styles.container}>
      {component === "ChooseOpponent" ? (
        <ChooseOpponent />
      ) : component === "ChooseUsername" ? (
        <ChooseUsername />
      ) : (
        <p> An error occured! </p>
      )}
    </div>
  );
};

export default OpponentScreen;
