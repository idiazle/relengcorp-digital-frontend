'use client'
import React, { useEffect, useState } from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import Image from 'next/image'
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa6'
// import { ReloadIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'
// import { signIn, useSession } from 'next-auth/react'
// import { useToast } from '@/components/ui/use-toast'

export default function Login() {
  const router = useRouter()

  // const { data: session, status } = useSession()

  // useEffect(() => {
  //   if (status === 'authenticated') {
  //     router.push('/user/menu')
  //   }
  // }, [status, router, session])

  const formSchema = z.object({
    username: z.string().min(1, { message: 'El campo no debe estar vacío' }).max(50),
    password: z.string().min(1, { message: 'El campo no debe estar vacío' }).max(50)
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  })
  const [loading, setLoading] = useState<boolean>(false)
  // const { toast } = useToast()
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    router.push('/user/main')
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     setLoading(false)
    //     router.push('/admin')
    //   }, 3000)
    // })
    // try {
    //   const sendForm = {
    //     userdata: values.username,
    //     password: values.password,
    //     redirect: false
    //   }
      // const res = await signIn('credentials', sendForm)

      // if (res !== null && res !== undefined) {
      //   if (res.status === 200) {
      //     // toast({
      //     //   duration: 3000,
      //     //   variant: 'default',
      //     //   title: 'Datos correctos',
      //     //   description: 'Ingreso exitoso'
      //     // })
      //     router.push('/user/menu')
      //     // router.refresh()
      //     setLoading(false)
      //   }
      //   if (res.error !== null) {
      //     // toast({
      //     //   duration: 3000,
      //     //   variant: 'destructive',
      //     //   title: 'Error',
      //     //   description: `${res?.error}`
      //     // })
      //     setLoading(false)
      //   }
      // }
      // } catch (error) {
      //   // console.log('MY ERROR', error)
      //   // toast({
      //   //   duration: 3000,
      //   //   variant: 'destructive',
      //   //   title: 'Eliminación ',
      //   //   description: 'Error'
      //   // })
      //   setLoading(false)
    // }
  }

  const [showPass, setShowPass] = useState<boolean>(false)

  return (
        <div className="w-full h-[100vh] bg-gray-300">

    <div className='h-full w-full flex flex-col justify-center items-center gap-5'>
      <div className='bg-black/50 p-10 rounded-2xl flex flex-col justify-center items-center gap-5'>
        {/* <Image
          height={301}
          width={301}
          src={'/images/login-background.png'} // Ruta a tu imagen de fondo
          alt='Fondo de inicio de sesión'
          // loading='lazy'
          priority
        // className={'w-full h-full object-cover absolute top-0 left-0'}
        /> */}

        <h3 className='text-white font-bold'>GEMELO DIGITAL DE CONFIABILIDAD</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-80 flex flex-col justify-center items-start gap-3 transition-all">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className='flex flex-col justify-center items-start w-full'>
                  <FormLabel className='flex flex-row gap-1 justify-center items-center text-white'>
                    <FaUser />
                    <p>Usuario</p>
                  </FormLabel>
                  <FormControl>
                    <Input type='email' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className='flex flex-col justify-center items-start w-full'>
                  <FormLabel className='flex flex-row gap-1 justify-center items-center text-white'>
                    <FaLock />
                    <p>Contraseña</p>
                  </FormLabel>
                  <FormControl>
                    <div className='flex flex-row justify-center items-center w-full gap-1'>
                      <Input className='w-10/12' placeholder="*********" {...field} type={showPass ? 'text' : 'password'} />
                      <Button className='w-2/12' variant={'secondary'} type='button' onClick={() => { setShowPass(!showPass) }}>
                        {
                          showPass
                            ? <FaEyeSlash />
                            : <FaEye />
                        }
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='w-full mt-5 hover:bg-[#eb611e]  bg-[#eb611e]' onClick={() => {router.push('/user/main')}}>Ingresar</Button>
            {/* <Button className='w-full mt-5 hover:bg-[#eb611e]  bg-[#eb611e]' type={'submit'} disabled={loading}>
              {
                loading
                  ? <div className='flex flex-row'>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Cargando Sistema
                  </div>
                  : <p>Ingresar</p>
              }
            </Button> */}
          </form>
        </Form>
        {/* <div className='w-80'>
          <button className={'transition-all duration-300 text-sm underline text-cyan-600'}>Olvidé mi contraseña</button>
        </div> */}
        {/* <footer className='flex flex-row justify-center items-center gap-2'>
          <span className='text-xs text-gray-400'>Powered by</span> <p className='text-white'>SmartPaskam</p>
        </footer> */}
      </div>
    </div>
        </div>

  )
}
