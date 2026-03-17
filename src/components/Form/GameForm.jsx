import React, { useEffect, useState, useRef } from 'react'
import { CiSearch } from "react-icons/ci";
import './GameForm.scss'
import ClearListUI from '../ClearListUI/ClearListUI';

const GameForm = ({postData, setgamesList, mobileMode}) => {

    const [gameTitle, setGameTitle] = useState('')

    const inputRef = useRef(null)

    useEffect(() => {
      inputRef.current.focus()
    }, [])
    

  return (
    <form className={`${mobileMode && "game-form"}`}>
        <label className='inputSearch' >
            <input ref={inputRef} type="text" name="gameTitle" placeholder='Search for a game data' onChange={(e) => setGameTitle(e.target.value.trim())}/>
            <button type='submit' onClick={(e) => postData(e,gameTitle)}>
                <CiSearch size={30} className={"filter-icons"} />
            </button>
        </label>
        <section className='list-options'>

            <label>
                <ClearListUI size={30} setgamesList = {setgamesList} className={"filter-icons"}/>
            </label>

        </section>
    </form>
  )
}

export default GameForm