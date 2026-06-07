import UserNavbar from "./_components/organism/UserNavbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full h-screen bg-gray-50 overflow-hidden">
      <div className="flex-1 flex flex-col">
        <UserNavbar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}