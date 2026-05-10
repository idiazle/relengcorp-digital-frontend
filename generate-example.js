const XLSX = require('xlsx');
const path = require('path');

// Datos de ejemplo
const exampleData = [
  {
    "ITEM": 1,
    "TIPO SERVICIO": "Mantenimiento Preventivo",
    "FECHA PROGRAMADA": 45000, // Fecha en formato Excel
    "PLANTA": "Planta Principal",
    "AREA": "Área de Producción",
    "TAG": "EQ-001",
    "EQUIPO / ITEM": "Bomba Centrifuga",
    "COMPONENTE": "Rodamiento",
    "TIPO ACTIVIDAD": "Programado",
    "TIPO TAREA": "Inspección",
    "CONDICION": "Normal"
  },
  {
    "ITEM": 2,
    "TIPO SERVICIO": "Mantenimiento Correctivo",
    "FECHA PROGRAMADA": 45001,
    "PLANTA": "Planta Principal",
    "AREA": "Área de Producción",
    "TAG": "EQ-001",
    "EQUIPO / ITEM": "Bomba Centrifuga",
    "COMPONENTE": "Sello Mecánico",
    "TIPO ACTIVIDAD": "No Programado",
    "TIPO TAREA": "Reparación",
    "CONDICION": "Tolerable"
  },
  {
    "ITEM": 3,
    "TIPO SERVICIO": "Mantenimiento Preventivo",
    "FECHA PROGRAMADA": 45002,
    "PLANTA": "Planta Principal",
    "AREA": "Área de Compresores",
    "TAG": "EQ-002",
    "EQUIPO / ITEM": "Compresor Rotatorio",
    "COMPONENTE": "Válvula de Descarga",
    "TIPO ACTIVIDAD": "Programado",
    "TIPO TAREA": "Limpieza",
    "CONDICION": "Normal"
  },
  {
    "ITEM": 4,
    "TIPO SERVICIO": "Inspección Técnica",
    "FECHA PROGRAMADA": 45003,
    "PLANTA": "Planta Secundaria",
    "AREA": "Área de Almacén",
    "TAG": "EQ-003",
    "EQUIPO / ITEM": "Motor Eléctrico",
    "COMPONENTE": "Bobinado",
    "TIPO ACTIVIDAD": "Programado",
    "TIPO TAREA": "Medición",
    "CONDICION": "Precaución"
  },
  {
    "ITEM": 5,
    "TIPO SERVICIO": "Mantenimiento Preventivo",
    "FECHA PROGRAMADA": 45004,
    "PLANTA": "Planta Principal",
    "AREA": "Área de Control",
    "TAG": "EQ-004",
    "EQUIPO / ITEM": "Turbina",
    "COMPONENTE": "Alabe",
    "TIPO ACTIVIDAD": "Programado",
    "TIPO TAREA": "Lubricación",
    "CONDICION": "Normal"
  },
  {
    "ITEM": 6,
    "TIPO SERVICIO": "Mantenimiento Correctivo",
    "FECHA PROGRAMADA": 45005,
    "PLANTA": "Planta Secundaria",
    "AREA": "Área de Producción",
    "TAG": "EQ-005",
    "EQUIPO / ITEM": "Válvula de Control",
    "COMPONENTE": "Asiento",
    "TIPO ACTIVIDAD": "No Programado",
    "TIPO TAREA": "Reparación",
    "CONDICION": "Crítico"
  },
  {
    "ITEM": 7,
    "TIPO SERVICIO": "Inspección Técnica",
    "FECHA PROGRAMADA": 45006,
    "PLANTA": "Planta Principal",
    "AREA": "Área de Generación",
    "TAG": "EQ-006",
    "EQUIPO / ITEM": "Generador",
    "COMPONENTE": "Estator",
    "TIPO ACTIVIDAD": "Programado",
    "TIPO TAREA": "Diagnóstico",
    "CONDICION": "Tolerable"
  },
  {
    "ITEM": 8,
    "TIPO SERVICIO": "Mantenimiento Preventivo",
    "FECHA PROGRAMADA": 45007,
    "PLANTA": "Planta Principal",
    "AREA": "Área de Producción",
    "TAG": "EQ-002",
    "EQUIPO / ITEM": "Compresor Rotatorio",
    "COMPONENTE": "Filtro de Aire",
    "TIPO ACTIVIDAD": "Programado",
    "TIPO TAREA": "Cambio",
    "CONDICION": "Normal"
  },
  {
    "ITEM": 9,
    "TIPO SERVICIO": "Mantenimiento Correctivo",
    "FECHA PROGRAMADA": 45008,
    "PLANTA": "Planta Secundaria",
    "AREA": "Área de Bombeo",
    "TAG": "EQ-007",
    "EQUIPO / ITEM": "Bomba Hidráulica",
    "COMPONENTE": "Cilindro",
    "TIPO ACTIVIDAD": "No Programado",
    "TIPO TAREA": "Reparación",
    "CONDICION": "Precaución"
  },
  {
    "ITEM": 10,
    "TIPO SERVICIO": "Inspección Técnica",
    "FECHA PROGRAMADA": 45009,
    "PLANTA": "Planta Principal",
    "AREA": "Área de Control",
    "TAG": "EQ-008",
    "EQUIPO / ITEM": "PLC",
    "COMPONENTE": "Módulo de Entrada",
    "TIPO ACTIVIDAD": "Programado",
    "TIPO TAREA": "Verificación",
    "CONDICION": "Normal"
  }
];

// Crear workbook
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(exampleData);

// Ajustar ancho de columnas
ws['!cols'] = [
  { wch: 8 },   // ITEM
  { wch: 25 },  // TIPO SERVICIO
  { wch: 15 },  // FECHA PROGRAMADA
  { wch: 20 },  // PLANTA
  { wch: 20 },  // AREA
  { wch: 12 },  // TAG
  { wch: 20 },  // EQUIPO / ITEM
  { wch: 20 },  // COMPONENTE
  { wch: 18 },  // TIPO ACTIVIDAD
  { wch: 15 },  // TIPO TAREA
  { wch: 15 }   // CONDICION
];

XLSX.utils.book_append_sheet(wb, ws, "Ruta Monitoreo");

// Guardar archivo
const outputPath = path.join(__dirname, 'public', 'example_moncon.xlsx');
XLSX.writeFile(wb, outputPath);

console.log(`✅ Archivo creado exitosamente: ${outputPath}`);
