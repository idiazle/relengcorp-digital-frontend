'use client'
import Link from 'next/link'
import React, { useState } from 'react'

const Main = () => {
  const [activeModule, setActiveModule] = useState<number | null>(null)
  const modules = [
    {
      id: 1,
      name: 'Gemelo DTR',
      iconPath: '#',
      link: '',
      enabled: false,
      submodules: [
        { id: 1, name: 'Visor 360', iconPath: '#', link: '/user/moncon', enabled: true },
        { id: 2, name: 'DFD Diagrama de Dependencias Funcionales', iconPath: '#', link: '/user/moncon', enabled: false }
      ]
    },
    {
      id: 2,
      name: 'Aplicaciones',
      iconPath: '#',
      link: '',
      enabled: false,
      submodules: [
        { id: 1, name: 'Celdas de Flotación', iconPath: '#', link: '/user/celdas-flotacion', enabled: true },
        { id: 2, name: 'Fajas Transportadoras', iconPath: '#', link: '/user/fajas-transportadoras', enabled: true },
        { id: 3, name: 'Auditoria de Pernos', iconPath: '#', link: '/user/auditoria-pernos', enabled: false },
        { id: 4, name: 'Elongación de pernos', iconPath: '#', link: '/user/elongacion-pernos', enabled: true }
      ]
    },
    {
      id: 3,
      name: 'Software de Analisis de Confiabilidad',
      iconPath: '#',
      link: '/user/moncon',
      enabled: false,
      submodules: [
        { id: 1, name: 'Taxonomía', iconPath: '#', link: '/user/taxonomia', enabled: true },
        { id: 2, name: 'Análisis de Criticidad', iconPath: '#', link: '/user/analisis-criticidad', enabled: true },
        { id: 3, name: 'RCA', iconPath: '#', link: '/user/rca', enabled: true },
        { id: 4, name: 'RCM/FMEA', iconPath: '#', link: '/user/rcm-fmea', enabled: false },
        { id: 5, name: 'LCC', iconPath: '#', link: '/user/lcc', enabled: true },
        { id: 6, name: 'Análisis de Repuestos', iconPath: '#', link: '/user/analisis-repuestos', enabled: true }
      ]
    },
    {
      id: 4,
      name: 'Monitoreo de Condiciones',
      iconPath: '#',
      link: '',
      enabled: true,
      submodules: [
        { id: 1, name: 'Estatus de Avisos', iconPath: '#', link: '/user/moncon', enabled: true },
        { id: 2, name: 'Estatus de Equipos Estaticos', iconPath: '#', link: '/user/equipos-estaticos', enabled: true },
        { id: 3, name: 'Estatus de Equipos Rotatorio', iconPath: '#', link: '/user/equipos-rotatorios', enabled: true },
        { id: 4, name: "Estatus de KPI's", iconPath: '#', link: '/user/kpis', enabled: false },
        { id: 5, name: 'Reportes de Monitoreo', iconPath: '#', link: '/user/reportes-monitoreo', enabled: false }
      ]
    },
    {
      id: 5,
      name: 'Analítica Predictiva',
      iconPath: '#',
      link: '',
      enabled: false,
      submodules: []
    }
  ]
  
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