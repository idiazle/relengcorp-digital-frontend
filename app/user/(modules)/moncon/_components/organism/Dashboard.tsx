import CustomPieChart from '../molecules/CustomPieChart'
import { BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, Bar, Legend, LabelList, LineChart, Line, ComposedChart } from 'recharts'
import CustomBarChart from '../molecules/CustomBarChart'
import ListEquipments from './ListEquipments'
import { useGetDashboard } from '../../_hooks/useGetDashboard.hook'

interface DashboardProps {
  codeArea: string
}

const Dashboard = ({ codeArea }: DashboardProps) => {
  const { data, isLoading, error } = useGetDashboard(130,1)
  console.log('Dashboard data:', codeArea, data)

  if (isLoading) {
    return <div>Cargando datos...</div>
  }

  if (error) {
    return <div>Error al cargar los datos del dashboard</div>
  }

  return (
    <div className=''>
      <div className='flex flex-row w-full h-full gap-2'>
        <div className='flex flex-col w-1/2 gap-2'>
          <div>
            <h1 className='bg-gray-200 text-center w-full text-lg'>Condición de equipos/componentes</h1>
            <div className='flex flex-row'>
              <div className="w-full max-w-[700px] max-h-[30vh] aspect-square border border-gray-300 p-4 bg-gray-100">
                <CustomPieChart data={data?.data.equipPie} />
              </div>
              <div className="w-full max-w-[700px] max-h-[30vh] aspect-square border border-gray-300 p-4 bg-gray-100">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.data.condCompPercentage} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" height={60} tick={{ angle: -45, textAnchor: 'end' }} interval={0} />
                    <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                    <Tooltip formatter={(value) => `${(Number(value) * 100).toFixed(0)}%`} />
                    <Bar dataKey="normal" fill="green" stackId="eq_monitoreo" />
                    <Bar dataKey="tolerable" fill="yellow" stackId="eq_monitoreo" />
                    <Bar dataKey="precaucion" fill="orange" stackId="eq_monitoreo" />
                    <Bar dataKey="critico" fill="red" stackId="eq_monitoreo" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          <div className='flex w-full flex-row'>
            <div className='flex w-full flex-col'>
              <h1 className='bg-gray-200 text-center w-full text-lg'>Cumplimiento</h1>
              <CustomBarChart data={data?.data.cumplimiento} />
              <div className="w-full max-w-[700px] max-h-[30vh] aspect-square border border-gray-300 p-4 bg-gray-100">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.data.eqMonitoreo} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" height={60} tick={{ angle: -45, textAnchor: 'end' }} interval={0} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="mon" fill="blue" stackId="eq_monitoreo">
                      <LabelList dataKey="mon" position="center" fill='#fff' />
                    </Bar>
                    <Bar dataKey="no_mon" fill="red" stackId="eq_monitoreo">
                      <LabelList dataKey="no_mon" position="center" fill='#fff' />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className='flex w-full flex-col'>
              <h1 className='bg-gray-200 text-center w-full text-lg'>Tareas no programadas</h1>
              <div className="w-full max-w-[700px] max-h-[20vh] aspect-square border border-gray-300 p-4 bg-gray-100">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data?.data.noProgramWorks}>
                    <CartesianGrid strokeDasharray="3" />
                    <XAxis dataKey="name" height={60} tick={{ angle: -45, textAnchor: 'end' }} interval={0} />
                    <YAxis />
                    <Tooltip />
                    <Line dataKey="value" stroke="blue" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full max-w-[700px] max-h-[30vh] aspect-square border border-gray-300 p-4 bg-gray-100">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={data?.data.hhData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" height={60} tick={{ angle: -45, textAnchor: 'end' }} interval={0} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line dataKey="hh_programado" stroke="blue" strokeWidth={3} />
                    <Line dataKey="hh_ejecutado" stroke="green" strokeWidth={3} />
                    <Bar dataKey="hh_fuera_ruta" fill="red" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>

        <div className='flex flex-col w-1/2 gap-2'>
          <div>
            <h1 className='bg-gray-200 text-center w-full text-lg'>{`Avisos & OT's`}</h1>
            <div className='flex w-full flex-row'>
              <div className="w-full max-w-[700px] max-h-[30vh] aspect-square border border-gray-300 p-4 bg-gray-100">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.data.avisosOt} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" height={60} tick={{ angle: -45, textAnchor: 'end' }} interval={0} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="avisos" fill="blue">
                      <LabelList dataKey="avisos" position="top" fill='black' />
                    </Bar>
                    <Bar dataKey="ot" fill="red" >
                      <LabelList dataKey="ot" position="top" fill='black' />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full max-w-[700px] max-h-[30vh] aspect-square border border-gray-300 p-4 bg-gray-100">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={data?.data.avisosOtCerrAb} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="abierto" fill="red">
                      <LabelList dataKey="abierto" position="right" />
                    </Bar>
                    <Bar dataKey="cerrado" fill="blue">
                      <LabelList dataKey="cerrado" position="right" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <ListEquipments />
        </div>
      </div>
      <div className='w-full flex flex-row justify-end'>
        <h1>{data?.timestamp && new Date(data?.timestamp).toLocaleString(
          'es-ES',
          {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          }
        )}</h1>
      </div>
    </div>
  )
}

export default Dashboard