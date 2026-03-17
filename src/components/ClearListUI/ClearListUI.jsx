import React from 'react'
import { IoTrashBinSharp } from "react-icons/io5";
import './ClearListUI.scss'
import { preventDefault } from '@/utils/functions';

const ClearListUI = ({setgamesList}) => {

  const handleClick = (ev) => {
    
    preventDefault(ev)
    setgamesList([])
  }
  return (
    <button onClick={(e)=> handleClick(e)} className='clear-list-btn'>
        <IoTrashBinSharp size={30} fill='white'/>
    </button>
  )
}

export default ClearListUI