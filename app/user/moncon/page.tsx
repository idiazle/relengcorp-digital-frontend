'use client'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TabsContent } from '@radix-ui/react-tabs'
import Link from 'next/link'
import React from 'react'
import { FaHouse } from 'react-icons/fa6'
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryGroup,
  VictoryLabel,
  VictoryLegend,
  VictoryLine,
  VictoryPie
  , VictoryStack, VictoryTheme
} from "victory";

const Moncon = () => {
  const myDataset = [
    [ // Condicion Normal
      { x: "a", y: 1 },
      { x: "b", y: 2 },
      { x: "c", y: 3 },
      { x: "d", y: 2 },
      { x: "e", y: 3 },
      { x: "f", y: 3 },
      { x: "g", y: 3 },
    ],
    [ // Condicion Tolerable
      { x: "a", y: 2 },
      { x: "b", y: 3 },
      { x: "c", y: 7 },
      { x: "d", y: 5 },
      { x: "e", y: 3 },
      { x: "f", y: 3 },
      { x: "g", y: 3 },
    ],
    [ // Condicion Precaucion
      { x: "a", y: 5 },
      { x: "b", y: 2 },
      { x: "c", y: 3 },
      { x: "d", y: 4 },
      { x: "e", y: 4 },
      { x: "f", y: 4 },
      { x: "g", y: 4 },
    ],
    [ // Condicion Critico
      { x: "a", y: 5 },
      { x: "b", y: 2 },
      { x: "c", y: 3 },
      { x: "d", y: 4 },
      { x: "e", y: 4 },
      { x: "f", y: 4 },
      { x: "g", y: 4 },
    ],
  ];

  function transformData(dataset) {
    const totals = dataset[0].map(
      (data, i) => {
        return dataset.reduce(
          (memo, curr) => {
            return memo + curr[i].y;
          },
          0,
        );
      },
    );
    return dataset.map((data) => {
      return data.map((datum, i) => {
        return {
          x: datum.x,
          y:
            (datum.y / totals[i]) * 100,
        };
      });
    });
  }

  const dataset =
    transformData(myDataset);

  const dataCerrado = [
    { category: "OTs", value: 12 },
    { category: "Avisos", value: 18 },
  ];

  const dataAbierto = [
    { category: "OTs", value: 25 },
    { category: "Avisos", value: 21 },
  ];


  return (
    <div className='w-full h-full gap-2 flex flex-col'>
      <Tabs defaultValue='pdmp' className='w-full h-full flex flex-col'>
        <TabsList className='w-full flex flex-row bg-gray-200'>
          <TabsTrigger value='pdmp'>PDM PTAE</TabsTrigger>
          <TabsTrigger value='pdma'>PDM ANTAPACCAY</TabsTrigger>
          <TabsTrigger value='ndtp'>NDT TUBERIAS PTAE</TabsTrigger>
          <TabsTrigger value='ndta'>NDT TUBERIAS ANTAPACCAY</TabsTrigger>
          <TabsTrigger value='ndtt'>NDT TUBERIAS TINTAYA</TabsTrigger>
        </TabsList>
        <TabsContent value='pdmp' className='flex flex-row w-full h-full gap-2'>
          <div className=' flex flex-col w-1/2 h-full gap-2'>
            <div className='flex flex-col w-full h-1/3 bg-white rounded-md border border-gray-300'>
              <div className='w-full flex justify-center bg-gray-200 font-bold p-1 rounded-t-md'><h1>CONDICION DE EQUIPOS/COMPONENTES</h1></div>
              <div className='flex flex-row gap-1'>
                <div className='flex w-1/2'>
                  <VictoryPie
                    labels={({ datum }) => `${datum.x}: ${datum.y}%`}
                    data={[
                      { x: "Normal", y: 35 },
                      { x: "Tolerable", y: 40 },
                      { x: "Precaucion", y: 55 },
                      { x: "Critico", y: 55 },
                    ]}
                    theme={VictoryTheme.clean}
                  />
                  {/* <VictoryLegend x={125} y={10}
                      orientation="vertical"
                      gutter={20}
                      data={[
                        { name: "Normal", symbol: { fill: "blue" } },
                        { name: "Tolerable", symbol: { fill: "green" } },
                        { name: "Precaucion", symbol: { fill: "orange" } },
                        { name: "Critico", symbol: { fill: "red" } },
                      ]}
                    /> */}
                </div>
                <div className='flex w-1/2'>
                  <VictoryChart
                    domainPadding={{ x: 30, y: 20 }}
                    theme={VictoryTheme.clean}
                  >
                    <VictoryStack>
                      {dataset.map((data, i) => {
                        return (
                          <VictoryBar
                            data={data}
                            key={i}
                          />
                        );
                      })}
                    </VictoryStack>
                    <VictoryAxis
                      dependentAxis
                      tickFormat={(tick) =>
                        `${tick}%`
                      }
                    />
                    <VictoryAxis
                      tickFormat={[
                        "a",
                        "b",
                        "c",
                        "d",
                        "e",
                        "f",
                        "g",
                      ]}
                    />
                    <VictoryLegend x={10} y={10}
                      orientation="horizontal"
                      gutter={20}
                      data={[
                        { name: "Normal", symbol: { fill: "blue" } },
                        { name: "Tolerable", symbol: { fill: "green" } },
                        { name: "Precaucion", symbol: { fill: "orange" } },
                        { name: "Critico", symbol: { fill: "red" } },
                      ]}
                    />
                  </VictoryChart>

                </div>
              </div>
            </div>
            <div className='flex flex-col w-full h-2/3 bg-white rounded-md'>
              <div className='flex flex-row gap-1'>
                <div className='flex flex-col w-1/2 border border-gray-300 h-full rounded-md'>
                  <div className='w-full flex justify-center bg-gray-200 font-bold p-1 rounded-t-md'><h1>CUMPLIMIENTO</h1></div>
                  <div className='w-full flex justify-center font-bold p-1 rounded-t-md gap-2 flex-row'>
                    <button className='w-1/3 border border-black bg-gray-100 hover:bg-gray-200 cursor-pointer'>Dia</button>
                    <button className='w-1/3 border border-black bg-gray-100 hover:bg-gray-200 cursor-pointer'>Semana</button>
                    <button className='w-1/3 border border-black bg-gray-100 hover:bg-gray-200 cursor-pointer'>Mes</button>
                  </div>
                  <div className='flex flex-row'>
                    <VictoryChart
                      domain={{ x: [0.5, 5.5], y: [0, 100] }}
                      theme={VictoryTheme.clean}
                    >
                      <VictoryBar data={
                        [
                          { x: '10 nov', y: 80 },
                          { x: '11 nov', y: 90 },
                          { x: '12 nov', y: 75 },
                          { x: '13 nov', y: 95 },
                          { x: '14 nov', y: 85 },
                          { x: '15 nov', y: 85 },
                          { x: '16 nov', y: 85 },
                        ]
                      } />
                    </VictoryChart>

                  </div>
                  <div className='flex flex-row'>
                    <VictoryChart
                      domainPadding={{ x: 30, y: 20 }}
                      theme={VictoryTheme.clean}
                    >
                      <VictoryStack>
                        {dataset.map((data, i) => {
                          return (
                            <VictoryBar
                              data={data}
                              key={i}
                            />
                          );
                        })}
                      </VictoryStack>
                      <VictoryAxis
                        dependentAxis
                        tickFormat={(tick) =>
                          `${tick}%`
                        }
                      />
                      <VictoryAxis
                        tickFormat={[
                          "a",
                          "b",
                          "c",
                          "d",
                          "e",
                          "f",
                          "g",
                        ]}
                      />
                    </VictoryChart>

                  </div>
                </div>
                <div className='flex flex-col w-1/2 border border-gray-300 h-full rounded-md'>
                  <div className='w-full flex justify-center bg-gray-200 font-bold p-1 rounded-t-md'><h1>TAREAS NO PROGRAMADAS</h1></div>
                  <div className='w-full flex justify-center font-bold p-1 rounded-t-md gap-2 flex-row'>
                    <button className='w-1/3 border border-black bg-gray-100 hover:bg-gray-200 cursor-pointer'>Semana</button>
                    <button className='w-1/3 border border-black bg-gray-100 hover:bg-gray-200 cursor-pointer'>Mes</button>
                  </div>
                  <div>
                    <VictoryChart
                      theme={VictoryTheme.clean}
                    >
                      <VictoryLine
                        domain={{ y: [0, 50] }}
                        data={[
                          { x: "Sem 35", y: 22 },
                          { x: "Sem 36", y: 34 },
                          { x: "Sem 37", y: 18 },
                          { x: "Sem 38", y: 30 },
                          { x: "Sem 39", y: 26 },
                          { x: "Sem 40", y: 22 },
                          { x: "Sem 41", y: 24 },
                        ]}
                      />
                    </VictoryChart>

                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className=' flex flex-col w-1/2 h-full gap-2'>
            <div className='flex flex-col w-full h-2/3 bg-white rounded-md border border-gray-300'>

            </div>
            <div className='flex flex-col w-full h-1/3 bg-white rounded-md border border-gray-300'>
              <div className='w-full flex justify-center bg-gray-200 font-bold p-1 rounded-t-md'><h1>AVISOS & OT</h1></div>
              <div className='flex flex-row gap-1'>
                <div className='flex w-1/2'>
                  <h1>Grafica Circular</h1>
                </div>
                <div className='flex w-1/2 flex-col'>
                  <VictoryChart
                    horizontal
                    domain={{ x: [0, 30] }}
                    height={250}
                    padding={{ top: 20, bottom: 20, left: 80, right: 70 }}

                  >
                    {/* Categorías */}
                    <VictoryAxis
                      style={{
                        axis: { stroke: "transparent" },
                        tickLabels: { fontSize: 14, padding: 5 },
                      }}
                    />

                    {/* Eje numérico */}
                    <VictoryAxis
                      dependentAxis
                      tickValues={[0, 10, 20, 30]}
                      tickFormat={(t) => t}
                      style={{
                        grid: { stroke: "#ccc", strokeDasharray: "4" },
                        tickLabels: { fontSize: 12 },
                      }}
                    />

                    {/* GRUPOS DE BARRAS */}
                    <VictoryGroup
                      offset={20} // separación entre barras del grupo
                      colorScale={["#1f4bd8", "#ff5722"]} // azul / naranja
                    >
                      {/* Cerrado */}
                      <VictoryBar
                        data={dataCerrado}
                        x="category"
                        y="value"
                        barWidth={16}
                        labels={({ datum }) => datum.value}
                        labelComponent={<VictoryLabel dx={25} />}
                      />

                      {/* Abierto */}
                      <VictoryBar
                        data={dataAbierto}
                        x="category"
                        y="value"
                        barWidth={16}
                        labels={({ datum }) => datum.value}
                        labelComponent={<VictoryLabel dx={25} />}
                      />
                    </VictoryGroup>
                  </VictoryChart>

                  {/* LEYENDA ABAJO */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 30,
                      marginTop: 10,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 14, height: 14, background: "#1f4bd8" }}></div>
                      Cerrado
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 14, height: 14, background: "#ff5722" }}></div>
                      Abierto
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value='pdma'>
          <h1>PDM ANTAPACCAY</h1>
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
    </div>
  )
}

export default Moncon