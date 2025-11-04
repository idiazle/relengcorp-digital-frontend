import { FaUser } from "react-icons/fa6";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-row w-full h-screen bg-gray-50">
      <div className="flex-1 overflow-auto">
        <div className="h-[4%] bg-[#16292f] flex justify-end p-4 items-center text-white gap-4">
          <h1 className="italic">Hola User 01</h1>
          <FaUser className="bg-white rounded-full p-4" color="blue" />
        </div>
        <div className="h-[96%] p-4">
          {children}
        </div>
      </div>
    </div>
  );
}