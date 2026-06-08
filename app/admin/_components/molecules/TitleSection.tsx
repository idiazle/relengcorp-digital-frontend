import { Button } from '@/components/ui/button'
import { FaPlus, FaUpload } from 'react-icons/fa6'

interface TitleSectionProps {
  title: string
  labelFirstButton: string
  labelSecondButton: string
  labelThirdButton: string
  firstButton: () => void
  secondButton: () => void
  thirdButton: () => void
}

const TitleSection = ({
  title,
  labelFirstButton,
  labelSecondButton,
  labelThirdButton,
  firstButton,
  secondButton,
  thirdButton,
}: TitleSectionProps) => {
  return (
    <div className='flex justify-between items-center'>
      <h1 className='font-bold text-lg'>{title}</h1>
      <div className='flex flex-row items-center gap-2'>
        <Button onClick={firstButton}><FaUpload /> {labelFirstButton}</Button>
        <Button onClick={secondButton}><FaUpload /> {labelSecondButton}</Button>
        <Button onClick={thirdButton}><FaPlus /> {labelThirdButton}</Button>
      </div>
    </div>
  )
}

export default TitleSection