'use client'

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ResponsiveContainer, PieChart, Pie, Tooltip, Legend } from 'recharts';
import { PieItem } from '../../_models/dashboard.model';

interface CustomPieChartProps {
  data: PieItem[] | undefined;
}

const CustomPieChart = ({ data }: CustomPieChartProps) => {
  const [pieModalOpen, setPieModalOpen] = useState(false);
  /* const [selectedPieItem, setSelectedPieItem] = useState<PieItem | null>(null); */

  /*   const handlePieClick = (_: unknown, index: number) => {
      const item = data[index];

      if (!item) return;

      setSelectedPieItem(item);
      setPieModalOpen(true);
    }; */

  return (
    <>
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={220}>
        <PieChart>
          <Tooltip formatter={(value) => `${value}`} />
          <Legend verticalAlign="bottom" />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius="90%"
            //onClick={handlePieClick}
            cursor="pointer"
          />
        </PieChart>
      </ResponsiveContainer>

      <Dialog open={pieModalOpen} onOpenChange={setPieModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalle de condición</DialogTitle>
            <DialogDescription>
              Información del valor seleccionado en el gráfico circular.
            </DialogDescription>
          </DialogHeader>

         {/*  {selectedPieItem && (
            <div className="space-y-2 text-sm">
              <div><strong>Nombre:</strong> {selectedPieItem.name}</div>
              <div><strong>Valor:</strong> {selectedPieItem.value}</div>
            </div>
          )} */}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CustomPieChart;
