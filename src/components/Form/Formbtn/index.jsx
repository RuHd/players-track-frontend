import React from 'react'
import '../GameForm.scss'

const Formbtn = ({Icon}) => {
  return (
    <label>
        <button>
            <Icon size={30} className={"filter-icons"}/>
        </button>
    </label>
  )
}

export default Formbtn