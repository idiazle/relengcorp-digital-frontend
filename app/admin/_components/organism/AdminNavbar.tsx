import Logo from "../atoms/Logo";
import UserMenu from "../molecules/UserMenu";

export const AdminNavbar = () => {
  return (
    <div className="bg-[#16292f] flex justify-between p-2 items-center text-white">
      <Logo />
      <UserMenu />
    </div >
  )
}

export default AdminNavbar;
