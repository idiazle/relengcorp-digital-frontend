import { FaCircle } from "react-icons/fa6";
import { works } from "../_config/options";
import { Report } from "../_models/moncon.model";

export const getConditionName = (conditionCode: number) => {
  switch (conditionCode) {
    case 1:
      return (
        <div className='flex flex-row gap-1 items-center'>
          <FaCircle className='text-green-500' />
          <h1>Normal</h1>
        </div>
      );
    case 2:
      return (
        <div className='flex flex-row gap-1 items-center'>
          <FaCircle className='text-yellow-500' />
          <h1>Tolerable</h1>
        </div>
      );
    case 3:
      return (
        <div className='flex flex-row gap-1 items-center'>
          <FaCircle className='text-orange-500' />
          <h1>Precaución</h1>
        </div>
      );
    case 4:
      return (
        <div className='flex flex-row gap-1 items-center'>
          <FaCircle className='text-red-500' />
          <h1>Crítico</h1>
        </div>
      );
    case 5:
      return (
        <div className='flex flex-row gap-1 items-center'>
          <FaCircle className='text-gray-500' />
          <h1>No Monitoreado</h1>
        </div>
      );
    default:
      return (
        <div className='flex flex-row gap-1 items-center'>
          <FaCircle className='text-black' />
          <h1>Desconocido</h1>
        </div>
      );
  }
};

export const getTaskTypeName = (taskTypeCode: number) => {
  return works.find((tarea) => tarea.id === taskTypeCode)?.name || 'Desconocido'
};

export const getRouteName = (report: Report) => {
  const routeName = report.parents?.find((entity) => entity.type === 3)?.name
  return routeName || 'N/A'
}

export const getComponentName = (report: Report) => {
  const componentName = report.parents?.find((entity) => entity.type === 6)?.name
  return componentName || 'N/A'
}

export const getEquipmentTag = (report: Report) => {
  const routeOrEquipmentTag = report.parents?.find((entity) => entity.type === 3 || entity.type === 4)?.tag
  return routeOrEquipmentTag || 'N/A'
}