import { FaUser } from "react-icons/fa6";
import Sidebar from "./components/Sidebar";

const AdminLayout =({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col w-full h-screen bg-gray-50 overflow-hidden">
      <div className="bg-[#16292f] flex justify-between p-2 items-center text-white gap-4 shrink-0">
        <div className="flex flex-row items-center gap-2 bg-white p-2 rounded">
          <h1 className="font-bold text-lg text-black">RelengCorp</h1>
        </div>
        <div>
          <h1 className="font-bold text-lg">RelengCorp Digital - Administracion</h1>
        </div>
        <div className="flex flex-row items-center gap-2">
          <h1 className="italic">Hola User 01</h1>
          <FaUser className="bg-white rounded-full p-4" color="blue" />
        </div>
      </div>
      <div className="flex flex-row flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 p-2 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;