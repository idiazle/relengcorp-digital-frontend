import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Bar, LabelList, BarChart } from 'recharts';
import { cumplimiento } from '../../_utils/data.constant';

const CustomBarChart = () => {
  return (
    <div className="w-full max-w-[700px] h-[20vh] min-h-[180px] min-w-0 border border-gray-300 p-2 bg-gray-100">
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={180}>
        <BarChart data={cumplimiento} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" height={60} tick={{ angle: -45, textAnchor: 'end', fontSize: 12 }} interval={0} />
          <YAxis
            tickFormatter={(value) => `${(typeof value === 'number' ? value * 100 : 0).toFixed(0)}%`}
            tick={{ fontSize: 12 }}
            />
          <Tooltip formatter={(value) => `${(typeof value === 'number' ? value * 100 : 0).toFixed(0)}%`} />
          <Bar dataKey="value" fill="blue">
            <LabelList dataKey="value" position="top" formatter={(value) => `${(typeof value === 'number' ? value * 100 : 0).toFixed(0)}%`} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CustomBarChart;
