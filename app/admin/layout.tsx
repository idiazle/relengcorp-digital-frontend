import AdminNavbar from "./_components/organism/AdminNavbar";
import Sidebar from "./_components/organism/Sidebar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col w-full h-screen bg-gray-50 overflow-hidden">
      <AdminNavbar />
      <div className="flex flex-row flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 px-4 py-2 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
