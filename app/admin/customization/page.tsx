'use client';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

type CustomizationType = {
  platformName: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
}

const CustomizationPage = () => {
  const [customizationData, setCustomizationData] = useState<CustomizationType>({
    platformName: '',
    logoUrl: '',
    primaryColor: '',
    secondaryColor: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomizationData({
      ...customizationData,
      [name]: value
    });
  }

  const submit = () => {
    console.log("Guardar datos de personalización:", customizationData);
  }

  return (
    <div className='flex flex-col h-full'>
      <div className='flex justify-between items-center'>
        <h1 className='font-bold text-lg'>PERSONALIZACIÓN</h1>
        {/* <Button className=''>Crear Nuevo Permiso</Button> */}
      </div>
      <Separator className='my-2' />
      <div className='flex flex-row gap-8'>
        <div className='flex overflow-auto flex flex-col gap-2 w-1/2'>
          <h1 className='font-bold text-lg'>Configuración General</h1>
          <Separator />
          <div className='flex flex-col gap-2'>
            <Label className='font-semibold'>Nombre de proyecto</Label>
            <Input
              name="platformName"
              value={customizationData.platformName}
              onChange={handleInputChange}
              type="text"
              placeholder="Ingrese el nombre del proyecto"
              className="w-full max-w-sm" />
          </div>
          <div className='flex flex-col gap-2'>
            <Label className='font-semibold'>Logo de proyecto</Label>
            <Input
              name="logoUrl"
              value={customizationData.logoUrl}
              onChange={handleInputChange}
              type="file"
              accept="image/*"
              className="w-full max-w-sm" />
          </div>
          <div className='flex flex-col gap-2'>
            <Label className='font-semibold'>Color primario (hexadecimal)</Label>
            <Input
              name="primaryColor"
              value={customizationData.primaryColor}
              onChange={handleInputChange}
              type="text"
              placeholder="#16292f"
              className="w-full max-w-sm" />
          </div>
          <div className='flex flex-col gap-2'  >
            <Label className='font-semibold'>Color secundario (hexadecimal)</Label>
            <Input
              name="secondaryColor"
              value={customizationData.secondaryColor}
              onChange={handleInputChange}
              type="text"
              placeholder="#ffffff"
              className="w-full max-w-sm" />
          </div>
        </div>
        <div className='w-1/2'>
          <h1 className='font-bold text-lg'>Módulos</h1>
          <Separator className='my-2' />
          <div className='flex flex-col gap-4'>
            <div className='flex flex-row gap-2 items-center w-1/2'>
              <Input type="checkbox" className='w-5 h-5' />
              <Label className='font-semibold'>Módulo de Usuarios</Label>
            </div>
            <div className='flex flex-row gap-2 items-center w-1/2'>
              <Input type="checkbox" className='w-5 h-5' />
              <Label className='font-semibold'>Módulo de Permisos</Label>
            </div>
            <div className='flex flex-row gap-2 items-center w-1/2'>
              <Input type="checkbox" className='w-5 h-5' />
              <Label className='font-semibold'>Módulo de Monitoreo de Condiciones</Label>
            </div>
            <div className='flex flex-row gap-2 items-center w-1/2'>
              <Input type="checkbox" className='w-5 h-5' />
              <Label className='font-semibold'>Módulo de Equipos Rotatorios</Label>
            </div>
            <div className='flex flex-row gap-2 items-center w-1/2'>
              <Input type="checkbox" className='w-5 h-5' />
              <Label className='font-semibold'>Módulo de Equipos Estáticos</Label>
            </div>
            <div className='flex flex-row gap-2 items-center w-1/2'>
              <Input type="checkbox" className='w-5 h-5' />
              <Label className='font-semibold'>Módulo de Planos</Label>
            </div>
            <div className='flex flex-row gap-2 items-center w-1/2'>
              <Input type="checkbox" className='w-5 h-5' />
              <Label className='font-semibold'>Módulo de Interactivos</Label>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Button
          className='mt-4'
          onClick={submit}>
          Guardar Cambios
        </Button>
      </div>
    </div>
  )
}

export default CustomizationPage;
