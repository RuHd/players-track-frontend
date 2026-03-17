import Image from "next/image"
import suspensionIcon from '../../assets/images/suspenseIcon.png'

const LoadingImg = () => {
  return (
    <Image width={100} height={100} src={suspensionIcon} alt="Suspension Icon"/>
  )
}

export default LoadingImg