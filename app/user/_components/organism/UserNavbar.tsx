import { FaUser } from "react-icons/fa6";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import Image from "next/image";

export const UserNavbar = () => {
  const userName = "User 01";

  return (
    <div className="bg-[#16292f] flex justify-between p-2 items-center text-white">
      <div className="flex items-center gap-4">
        <Image
          src="/images/logo_releng.png"
          alt="Logo"
          width={120}
          height={10}
          className="bg-white p-1"
        />
        <h1 className="text-lg font-bold">Gemelo Digital</h1>
      </div>
   {/*    <div className="flex items-center gap-4">
        <div>
          <h1 className="text-sm">Último acceso: 01/01/2024 12:00</h1>
        </div>
        <div className="w-px h-6 bg-gray-400" />
        <div>
          <h1 className="text-sm">Rol: Administrador</h1>
        </div>
        <div className="w-px h-6 bg-gray-400" />
        <div>
          <h1 className="text-sm">Área: Mantenimiento</h1>
        </div>
      </div> */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-2 cursor-pointer">
            <h1 className="text-sm"> {userName}</h1>
            <FaUser className="bg-white rounded-full p-1" size={32} color="black"/>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40" align="start">
          <DropdownMenuItem>Perfil</DropdownMenuItem>
          <DropdownMenuItem>Configuración</DropdownMenuItem>
          <DropdownMenuItem>Soporte</DropdownMenuItem>
          <DropdownMenuItem>Cerrar sesión</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div >
  )
}

export default UserNavbar;
