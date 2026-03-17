'use client';

import style from './page.module.scss'
import { useState, useEffect, useRef } from "react";

import GameCard from '@/components/GameCard/GameCard';
import Image from 'next/image';
import Loading from '@/components/Loading/Loading';
import Modal from '@/components/Modal/Modal';
import logoImg from '../assets/images/heroLogo.png'
import HeaderMobile from '@/components/HeaderMobile/HeaderMobile';
import GameForm from '@/components/Form/GameForm';
import { FaRegCopyright } from "react-icons/fa";
import { checkSearchCondition, fetchGameData } from '@/utils/functions';
import { HOST } from '@/assets/constants';
import ErrorBlock from '@/components/ErrorBlock/ErrorBlock';
import useFetchGameList from '@/hooks/useFetchGame';


export default function Home() {

  const [gamesList, setgamesList] = useState([])
  const [loading, setLoading] = useState(false)
  const [btnClicked, setbtnClicked] = useState(false)
  const [modalStats, setmodalStats] = useState(null)
  const [windowWidth, setwindowWidth] = useState(null)
  const [errorMessage, setErrorMessage] = useState('');

  const dateObj = new Date()
  const listRef = useRef(null);

  const deleteGame = (e, gameId, setwasClicked) => {

    e.stopPropagation();
    setwasClicked(true);
    setTimeout(() => {
      setgamesList(prev => prev.filter((game) => parseInt(game.appid) !== parseInt(gameId)))
    }, 800)
  }

  const postData = async (e,titleGame) => {

    e !== undefined && e.preventDefault();

    if (checkSearchCondition(titleGame, gamesList, btnClicked)) {
        setErrorMessage(titleGame === '' ? 'Please enter a game title' : 'Game already exists in the list');
        if (btnClicked) setErrorMessage('Please wait for the current request to finish');
        return;
    }

    setbtnClicked(true);
    setLoading(true);

    const gameListJson = await useFetchGameList()
    const game = gameListJson.find(game => game.name.toLowerCase() === titleGame.toLowerCase())

    if(game == undefined) {
      setErrorMessage('Game not found. Please check the title and try again.');
      setLoading(false);
      setbtnClicked(false);
      return
    }

    const {status, data} = await fetchGameData('getGame', 'POST', game)


    if(status == 200) {
      setgamesList((prev) => [...prev, data])
    } else {
      setErrorMessage('Failed to fetch game data. Please try again later.');
    }

    setLoading(false);
    setbtnClicked(false);
  }

  // Get games from localStorage on initial load
  useEffect(() => {
    setwindowWidth(window.innerWidth)
    const storedGames = localStorage.getItem('gamesList')

    if (storedGames) {
      setgamesList(JSON.parse(storedGames))
    }

    const interval = setInterval(async () => {
      const res = await fetch(`${HOST}updateJSON`)

      if (!res.ok) alert('Failed to update JSON file');
    }, 300000)

    return () => clearInterval(interval); // Cleanup on unmount
  }, [])

  // Save gamesList to localStorage whenever it changes

  useEffect(() => {
    const getWindowWidth = () => {
      setwindowWidth(window.innerWidth)
    };

    window.addEventListener('resize', getWindowWidth);
    localStorage.setItem('gamesList', JSON.stringify(gamesList))

    // Scroll to the bottom of the list when a new game is added
    if (listRef.current && gamesList.length > 4) {
      
      listRef.current.scrollTop = listRef.current.scrollHeight
    }

    return () => window.removeEventListener('resize', getWindowWidth);

  }, [gamesList])
  
  return (
    
    <>
      {errorMessage.length > 0 && <ErrorBlock errorMessage={errorMessage} setErrorMessage={setErrorMessage}/>}
      {modalStats && <Modal gameStats={modalStats} setErrorMessage={setErrorMessage}/>}
      <main className={ `${modalStats ? style['darkMode'] : ''} ${style.app}`} style={modalStats && {pointerEvents: "none"}}>
          
          {loading && <Loading/>}
          {windowWidth != null && windowWidth <= 768 && 
            <HeaderMobile>
                <GameForm postData={postData} 
                          gamesList={gamesList} 
                          setgamesList={setgamesList} 

                          mobileMode = {windowWidth <= 768}
                />
            </HeaderMobile>          
          }
          {windowWidth == null || windowWidth > 768 &&
            <section className={style['info-section']}>
              <Image src={logoImg} width={100} height={100} alt='Logo' className={style['logo']}/>
              <div className={style['page-title']}>
                <h1>Players Track</h1>
                <p>source from <strong>Steam</strong></p>
              </div>
              <GameForm mobileMode = {windowWidth <= 768} postData={postData} gamesList={gamesList} setgamesList={setgamesList}/>
            
            </section>
          }
          
          {gamesList.length === 0 && <h2 style={{opacity: '.5'}}>Search for a game to see the players online</h2>}
          
          <ul className={`${style['game-list']} `} ref={listRef}>
            {gamesList.length > 0 &&
                
                gamesList.map((game) => (
                  <GameCard key={game.appid} 
                            setmodalStats={setmodalStats} 
                            game={game} 
                            img={game.image ? game.image : null} 
                            id = {parseInt(game.appid)} 
                            deleteFunction = {deleteGame} 
                            setgamesList = {setgamesList} 
                           
                  />
                  ))
                
              }
            </ul> 
                
        </main>
        <footer className={style["footer-page"]}>
          <FaRegCopyright />
          <p>Made By Ruan Mesquita - {dateObj.getFullYear()}</p>
        </footer>    
    </>
  );
}
