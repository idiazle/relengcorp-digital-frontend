import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import * as XLSX from 'xlsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getEntities } from '@/app/services/entitiesServices'
import { createMonconReport } from '@/app/services/monconServices'
import type { Entity } from '@/app/admin/entities/_models/entity.model'

type UploadReportsProps = {
  openUploadReports: boolean;
  setOpenUploadReports: (open: boolean) => void;
  getAllReport: () => void;
}

const UploadReports = ({ openUploadReports, setOpenUploadReports, getAllReport }: UploadReportsProps) => {
  const [routeData, setRouteData] = useState<any[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);

  // Cargar entidades al montar el componente
  useEffect(() => {
    getEntities()
      .then((response) => {
        const resp = response.data.filter(entity => entity.type === 3); // Solo componentes
        setEntities(resp);
      });
  }, []);

  const chargeDataFromFile = (file: File | null) => {
    if (!file) {
      alert("Debe seleccionar un archivo Excel");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      if (!data) return;
      // 📘 Leer el libro de Excel
      const wb = XLSX.read(data, { type: "array" });
      // 📗 Tomar la primera hoja
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      // 🔄 Convertir a JSON
      const json: any[] = XLSX.utils.sheet_to_json(ws);
      console.log(json);
      setRouteData(json);
    };
    // Leer el archivo como array buffer (necesario para XLSX)
    reader.readAsArrayBuffer(file);
  };

  function excelDateToString(serial) {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    const date = new Date(excelEpoch.getTime() + serial * 24 * 60 * 60 * 1000);

    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();

    return `${day}/${month}/${year}`;
  }
  const typeServiceOptions = [
    {
      id: 1, name: 'PDM PTAE'
    },
    {
      id: 2, name: 'PDM Antapaccay'
    },
    {
      id: 3, name: 'NDT PTAE'
    },
    {
      id: 4, name: 'NDT Antapaccay'
    },
    {
      id: 5, name: 'NDT Tintaya'
    },
  ];


  const searchTypeService = (typeServiceName: string) => {
    const found = typeServiceOptions.find(option => option.name === typeServiceName);
    return found ? found.id : null;
  }

  const tareaTypeOptions = [
    { id: 1, name: 'Vibraciones y Temperatura' },
    { id: 2, name: 'Alineamiento de ejes' },
    { id: 3, name: 'Alineamiento de poleas' },
    { id: 4, name: 'Ultrasonido acústico' },
    { id: 5, name: 'Termografía infrarroja' },
    { id: 6, name: 'Fuga de corriente' },
    { id: 7, name: 'Vibraciones fases' },
    { id: 8, name: 'Vibraciones ODS' },
    { id: 9, name: 'Vibraciones Pump Test' },
    { id: 10, name: 'Ultrasonido convencional' },
    { id: 11, name: 'Tintes penetrantes' },
    { id: 12, name: 'Partículas magnéticas' },
    { id: 13, name: 'Ultrasonido avanzado' },
    { id: 14, name: 'Metrología' },
    { id: 15, name: 'Inspección visual' },
  ]

  const searchTaskType = (taskTypeName: string) => {
    const found = tareaTypeOptions.find(option => option.name === taskTypeName);
    return found ? found.id : null;
  }

  const getComponentsByTag = (tag: string) => {
    // 1. Encontrar el equipo por tag

    const equipment = entities.find(
      e => e.extra_info?.tag === tag
    );

    if (!equipment) return null;

    // 2. Traer los ids de los componentes (children)
    const componentIds = equipment.children;

    // 3. Buscar los objetos completos
    const components = entities.filter(e => componentIds.includes(e.id));

    return components;
  }

  const searchComponnentByEquipment = (tag: string, componentName: string) => {
    const components = getComponentsByTag(tag);
    if (!components) return null;

    const component = components.find(c =>
      c.name.toLowerCase() === componentName.toLowerCase()
    );

    return component?.id || null;
  }

  const searchCondition = (conditionName: string) => {
    switch (conditionName) {
      case 'Normal':
        return 1;
      case 'Tolerable':
        return 2;
      case 'Precaución':
        return 3;
      case 'Crítico':
        return 4;
      default:
        return null;
    }
  }

  const uploadRouteData = () => {
    const tempData = routeData.map((data) => ({
      entity: searchComponnentByEquipment(data["TAG"], data["COMPONENTE"]),
      service_type: searchTypeService(data["TIPO SERVICIO"]),
      program: data["TIPO ACTIVIDAD"] === "Programado" ? 1 : 2,
      task_type: searchTaskType(data["TIPO TAREA"]),
      condition: searchCondition(data["CONDICION"]),
      execution_status: 2,
    }));
    console.log("Datos de la ruta a subir:", tempData);
    tempData.forEach((report) => {
      createMonconReport(report)
        .then((response) => {
          console.log("Reporte creado:", response.data);
        })
        .catch((error) => {
          console.error("Error al crear el reporte:", error);
        });
    });
    setOpenUploadReports(false);
    setRouteData([]);
    getAllReport()
  }


  return (
    <Dialog open={openUploadReports} onOpenChange={setOpenUploadReports}>
      <DialogContent className='min-w-5/6 bg-slate-200'>
        <DialogHeader>
          <DialogTitle>Crear Ruta de Monitoreo</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col gap-2 w-full justify-start'>
          <div className='flex flex-row gap-2'>
            <div className='flex flex-col gap-2'>
              <Label className='font-semibold'>Subir plantilla <a className='hover:text-gray-500 font-normal' href='/example_moncon.xlsx'>example.xlsx</a>:</Label>
              <Input className='bg-white' type='file' accept='.xlsx' onChange={(e) => {
                const file = e.target.files?.[0] || null;
                chargeDataFromFile(file)
              }}
              />
            </div>
          </div>
          <div className="bg-white mt-4 rounded-lg shadow h-96 overflow-auto">
            <Table>
              <TableHeader className="bg-gray-300 ">
                <TableRow>
                  <TableHead className='w-[2%]'>N°</TableHead>
                  <TableHead className='w-[10%]'>TIPO SERV.</TableHead>
                  <TableHead className='w-[10%]'>FECHA PROGR.</TableHead>
                  <TableHead className='w-[10%]'>PLANTA</TableHead>
                  <TableHead className='w-[10%]'>ÁREA</TableHead>
                  <TableHead className='w-[10%]'>TAG/EQUIPO</TableHead>
                  <TableHead className='w-[10%]'>COMPONENTE</TableHead>
                  <TableHead className='w-[10%]'>TIPO ACTIVIDAD</TableHead>
                  <TableHead className='w-[10%]'>TIPO TAREA</TableHead>
                  <TableHead className='w-[10%]'>CONDICIÓN</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {routeData.length > 0 ? (
                  routeData.map((data, index) => (
                    <TableRow key={index}>
                      <TableCell className='w-[2%]'>{data["ITEM"]}</TableCell>
                      <TableCell className='w-[10%]'>{data["TIPO SERVICIO"]}</TableCell>
                      <TableCell className='w-[10%]'>{excelDateToString(data["FECHA PROGRAMADA"])}
                        {/* {
                          new Date((data["FECHA PROGRAMADA"] - 25569) * 86400 * 1000)
                            .toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' })
                        } */}
                      </TableCell>
                      <TableCell className='w-[10%]'>{data["PLANTA"]}</TableCell>
                      <TableCell className='w-[10%]'>{data["AREA"]}</TableCell>
                      <TableCell className='w-[10%]'>{data["TAG"]}{data["EQUIPO / ITEM"]}</TableCell>
                      <TableCell className='w-[10%]'>{data["COMPONENTE"]}</TableCell>
                      <TableCell className='w-[10%]'>{data["TIPO ACTIVIDAD"]}</TableCell>
                      <TableCell className='w-[10%]'>{data["TIPO TAREA"]}</TableCell>
                      <TableCell className='w-[10%]'>{data["CONDICION"]}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      No hay datos cargados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <DialogFooter>
          <Button variant="destructive" onClick={() => { setOpenUploadReports(false); setRouteData([]); }}>Cancelar</Button>
          <Button
            onClick={() => { uploadRouteData() }}
          >Crear registros</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default UploadReports