import { IoTrashBinSharp } from "react-icons/io5";
import styles from './ClearListUI.module.scss';
import { preventDefault } from '@/utils/functions';

const ClearListUI = ({setgamesList}) => {

  const handleClick = (ev) => {
    
    preventDefault(ev)
    setgamesList([])
  }
  return (
    <button onClick={(e)=> handleClick(e)} className={styles['clear-list-btn']}>
        <IoTrashBinSharp size={30} fill='white'/>
    </button>
  )
}

export default ClearListUI