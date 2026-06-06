'use client'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TabsContent } from '@radix-ui/react-tabs'
import { avisos_ot, avisos_ot_cerr_ab, cond_comp_percentage, eq_monitoreo, equip_pie, hh_data, no_program_works } from './_utils/data.constant';
import { ResponsiveContainer, ComposedChart, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, BarChart, Bar, LabelList } from 'recharts';
import CustomBarChart from './_components/molecules/CustomBarChart';
import CustomPieChart from './_components/molecules/CustomPieChart'
import ListEquipments from './_components/organism/ListEquipments';

const Moncon = () => {
  return (
    <div className='w-full h-[88vh]'>
      <Tabs defaultValue='pdma' className='w-full h-full flex flex-col'>
        <TabsList className='w-full flex flex-row bg-gray-300 '>
          <TabsTrigger value='pdmp' className='cursor-pointer hover:bg-gray-400'>PDM PTAE</TabsTrigger>
          <TabsTrigger disabled value='pdma' className='cursor-pointer hover:bg-gray-400'>PDM ANTAPACCAY</TabsTrigger>
          <TabsTrigger disabled value='ndtp' className='cursor-pointer hover:bg-gray-400'>NDT TUBERIAS PTAE</TabsTrigger>
          <TabsTrigger disabled value='ndta' className='cursor-pointer hover:bg-gray-400'>NDT TUBERIAS ANTAPACCAY</TabsTrigger>
          <TabsTrigger disabled value='ndtt' className='cursor-pointer hover:bg-gray-400'>NDT TUBERIAS TINTAYA</TabsTrigger>
        </TabsList>
        <TabsContent value='pdmp' className='flex flex-row w-full h-full gap-2'>

        </TabsContent>
        <TabsContent value='pdma'>
          <div className='flex flex-row w-full h-full gap-2'>
            <div className='flex flex-col w-1/2 gap-2'>
              <div>
                <h1 className='bg-gray-200 text-center w-full text-lg'>Condición de equipos/componentes</h1>
                <div className='flex flex-row'>
                  <div className="w-full max-w-[700px] max-h-[30vh] aspect-square border border-gray-300 p-4 bg-gray-100">
                    <CustomPieChart data={equip_pie} />
                  </div>
                  <div className="w-full max-w-[700px] max-h-[30vh] aspect-square border border-gray-300 p-4 bg-gray-100">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={cond_comp_percentage} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
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
                  <CustomBarChart />
                  <div className="w-full max-w-[700px] max-h-[30vh] aspect-square border border-gray-300 p-4 bg-gray-100">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={eq_monitoreo} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
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
                      <LineChart data={no_program_works}>
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
                      <ComposedChart data={hh_data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
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

            <div className='flex flex-col w-1/2 h-full gap-2'>
              <div>
                <h1 className='bg-gray-200 text-center w-full text-lg'>{`Avisos & OT's`}</h1>
                <div className='flex w-full flex-row'>
                  <div className="w-full max-w-[700px] max-h-[30vh] aspect-square border border-gray-300 p-4 bg-gray-100">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={avisos_ot} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
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
                      <BarChart layout="vertical" data={avisos_ot_cerr_ab} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
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

        </TabsContent>
        <TabsContent value='ndtp'>
          <h1>NDT TUBERIAS PTAE</h1>
        </TabsContent>
        <TabsContent value='ndta'>
          <h1>NDT TUBERIAS ANTAPACCAY</h1>
        </TabsContent>
        <TabsContent value='ndtt'>
          <h1>NDT TUBERIAS TINTAYA</h1>
        </TabsContent>
      </Tabs>
    </div >
  )
}

export default Moncon