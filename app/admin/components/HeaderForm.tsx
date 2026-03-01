import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { FaPlus } from "react-icons/fa6"

interface HeaderFormProps {
  setOpenModal: (open: boolean) => void
  nameModule: string
}

const HeaderForm = ({ setOpenModal, nameModule }: HeaderFormProps) => {
  return (
    <div className="flex flex-col gap-1">
      <div className='flex justify-between items-center'>
        <h1 className='font-bold text-lg'>GESTIÓN DE {nameModule.toUpperCase()}</h1>
        <Button className='' onClick={() => { setOpenModal(true) }}><FaPlus /> Nuevo {nameModule.toLowerCase()}</Button>
      </div>
      <Separator className='my-2' />
    </div>
  )
}

export default HeaderForm