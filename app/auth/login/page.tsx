'use client'
import React, { useState } from 'react'
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
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa6'
import { useRouter } from 'next/navigation'
import { login, LoginServiceError } from './services/login.service'
import { toast } from 'sonner'


export default function Login() {
  const router = useRouter()

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
    try {
      const res = await login(values.username, values.password)

      if (res.status >= 200 && res.status < 300) {
        toast('Inicio de sesion exitoso')
        router.push('/user/menu')
      }
    } catch (error) {
      const { status, message } = error as LoginServiceError

      if (status === 401) {
        toast('Error al iniciar sesion, por favor verifica tus credenciales e intenta nuevamente.')
      } else {
        toast(message || 'No se pudo iniciar sesion, intenta nuevamente.')
      }
    }
    finally {
      setLoading(false)
    }
  }

  const [showPass, setShowPass] = useState<boolean>(false)

  return (
    <div className="w-full h-[100vh] bg-[url('/images/login-background.png')] bg-cover bg-center bg-no-repeat">
      <div className='h-full w-full flex flex-col justify-center items-center gap-5'>
        <div className='bg-black/60 p-10 rounded-2xl flex flex-col justify-center items-center gap-5'>
          <div className='flex flex-col justify-center items-center w-36'>
            <h1 className='text-3xl text-white font-bold text-right'>GEMELO DIGITAL DE CONFIABILIDAD</h1>
          </div>
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
                      <Input className='bg-white' {...field} />
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
                        <Input className='w-10/12 bg-white' placeholder="*********" {...field} type={showPass ? 'text' : 'password'} />
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
              <Button className='w-full mt-5 hover:bg-[#eb611e]  bg-[#eb611e]' type={'submit'} disabled={loading}>
                {
                  loading
                    ? <div className='flex flex-row'>
                      <span className='mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white' />
                      Cargando Sistema
                    </div>
                    : <p>Ingresar</p>
                }
              </Button>
            </form>
          </Form>
          <div className='w-80'>
            <button className={'transition-all duration-300 text-sm underline text-cyan-600'}>Olvidé mi contraseña</button>
          </div>
          <footer className='flex flex-row justify-center items-center gap-2'>
            <span className='text-xs text-gray-400'>Powered by</span> <p className='text-white'>SmartPaskam</p>
          </footer>
        </div>
      </div>
    </div>

  )
}
