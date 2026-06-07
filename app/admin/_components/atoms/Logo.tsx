import Image from 'next/image'

const Logo = () => {
  return (
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
  )
}

export default Logo;
