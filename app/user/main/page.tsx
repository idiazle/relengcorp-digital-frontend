'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import modulesMock from './_mock/modules_mock.json'

const Main = () => {
  const [activeModule, setActiveModule] = useState<number | null>(null)
  const modules = modulesMock.data;
  
  const handleModuleClick = (moduleId: number) => {
    // Permitir toggle incluso si está desactivado para ver submódulos
    setActiveModule(activeModule === moduleId ? null : moduleId)
  }

  return (
    <div className='h-full w-full bg-cover bg-center bg-no-repeat'>
      {/* Overlay oscuro */}      
      <div className=' flex flex-col items-center justify-start pt-12 pb-20 h-full'>
        {/* Títulos */}
        <div className='text-center mb-16'>
          <h1 className='text-4xl font-bold tracking-wider mb-2'>GEMELO DIGITAL DE CONFIABILIDAD DTR</h1>
          <h2 className='text-2xl font-semibold tracking-wide'>MÓDULOS</h2>
        </div>
        {/* Iconos inferiores */}
        <div className='flex justify-center items-center gap-8 mt-auto'>
         {modules.map((module) => (
            <div 
              key={module.id} 
              className='relative'
              onMouseEnter={() => module.submodules.length > 0 && setActiveModule(module.id)}
              onMouseLeave={() => setActiveModule(null)}
            >
              {/* Submódulos desplegables hacia arriba */}
              {module.submodules.length > 0 && activeModule === module.id && (
                <div 
                  className='absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-black/60 backdrop-blur-sm border border-white/20 rounded-lg shadow-2xl z-50 overflow-hidden animate-in slide-in-from-bottom-2 duration-300 min-w-[280px]'
                >
                  <div className='p-4'>
                    <div className='flex flex-col'>
                      {module.submodules.map((submodule) => (
                        // Si el módulo padre está desactivado, forzar todos los submódulos como desactivados
                        (submodule.enabled && module.enabled) ? (
                          <Link 
                            key={submodule.id} 
                            href={submodule.link} 
                            className='text-white hover:text-blue-300 hover:bg-white/10 p-3 rounded transition-all duration-200 text-sm text-left border border-white/10 bg-gray-700 cursor-pointer'
                          >
                            {submodule.name}
                          </Link>
                        ) : (
                          <div
                            key={submodule.id}
                            className='text-gray-200 p-3 rounded text-sm text-left border border-white/10 opacity-50 cursor-not-allowed'
                          >
                            {submodule.name} <span className='text-xs'>(Desactivado)</span>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div 
                className={`transition-all duration-300 cursor-pointer ${
                  activeModule === module.id ? 'scale-105' : 'hover:scale-102'
                } ${!module.enabled ? 'opacity-50' : ''}`}
                onClick={() => handleModuleClick(module.id)}
              >
                <div className={`w-48 h-48 bg-black/60 backdrop-blur-md rounded-lg border border-white/20 flex flex-col items-center justify-center p-4 shadow-xl transition-all ${
                  module.enabled ? 'hover:bg-black/70' : ''
                }`}>
                  <div className='text-6xl mb-3'>{module.iconPath}</div>
                  <h3 className='text-white text-center text-sm font-medium leading-tight'>
                    {module.name}
                  </h3>
                  {!module.enabled && (
                    <span className='text-xs text-red-400 mt-2'>Desactivado</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Main