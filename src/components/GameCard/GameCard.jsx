import Image from "next/image"
import { IoTrendingUp, IoTrendingDown } from "react-icons/io5";
import { calculatePorcentage, openModal, refreshPlayersCount } from "@/utils/functions";
import { IoPersonSharp } from "react-icons/io5";
import "./GameCard.scss"
import { Suspense, useEffect, useState } from "react";
import LoadingImg from "../LoadingImg";

const GameCard = ({game, img, id, deleteFunction, setgamesList, setmodalStats}) => {

  const [updatedNum, setUpdatedNum] = useState(false);
  const [wasClosed, setwasClosed] = useState(false)
  const [gameStats, setgameStats] = useState({
    appid: id,
    players: game.players,
    previous_players: game.players,
    name: game.name,
    image: img
  })

  const porcentage = calculatePorcentage(gameStats.players, gameStats.previous_players)


  useEffect(() => {
    const interval = setInterval(() => {

      refreshPlayersCount(id, setgamesList, setUpdatedNum, setgameStats, gameStats.players)

    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval); 
  }, [gameStats]);

  return (
    <article onClick={(e) => openModal(e, gameStats, setmodalStats)} className = {`game-card popsup ${wasClosed ? "closed" : ""}`} >
      <h5 className="game-title-card">{game.name}</h5>

      <section className="game-card-info">
          <div className="img-container">
              <Suspense fallback={<LoadingImg/>}>
                <Image src={img} alt="game card image" width={100} height={100} unoptimized/> 
              </Suspense>
          </div>
          <div className="game-info">
              <p className={`playersCount ${updatedNum && "updateAnimation"}`}>
                <IoPersonSharp className="player-icon"/>
                <span>{gameStats.players}</span>
                <span className="players-porcentage">
                  {gameStats.players > gameStats.previous_players ? <IoTrendingUp /> : (gameStats.players < gameStats.previous_players ? <IoTrendingDown/> : null)}
                  {porcentage}
                </span>
              </p>
          </div>
      </section> 
    </article>
  )
}

export default GameCard