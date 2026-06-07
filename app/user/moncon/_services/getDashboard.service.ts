import { DashboardResponse } from './contract/Dashboard.contract';
import dash01 from '../_mocks/dash01.json';
import dash02 from '../_mocks/dash02.json';
import dash03 from '../_mocks/dash03.json';
import dash04 from '../_mocks/dash04.json';
import dash05 from '../_mocks/dash05.json';

export const getDashboard = async (codeArea: string): Promise<DashboardResponse> => {
  try {
    switch (codeArea) {
      case 'pdmp':
        return dash01 as DashboardResponse;
      case 'pdma':
        return dash02 as DashboardResponse;
      case 'ndtp':
        return dash03 as DashboardResponse;
      case 'ndta':
        return dash04 as DashboardResponse;
      case 'ndtt':
        return dash05 as DashboardResponse;
      default:
        throw new Error(`No se encontraron datos para el área con código: ${codeArea}`);
    }
  } catch (error) {
    console.error('Error al cargar los datos de prueba del dashboard:', error);
    throw error;
  }
};