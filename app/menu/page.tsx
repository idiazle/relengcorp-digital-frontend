import Link from 'next/link'

const Menu = () => {
  return (
    <div className='flex flex-col gap-2'>

      <Link href="/admin/moncon">
        Ir a administracion Monitoreo de Condiciones
      </Link>
      <Link href="/user/moncon">
        Ir a dashboard Monitoreo de Condiciones
      </Link>
    </div>)
}

export default Menu