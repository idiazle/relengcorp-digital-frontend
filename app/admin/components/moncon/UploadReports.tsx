import { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import * as XLSX from 'xlsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type UploadReportsProps = {
  openUploadReports: boolean;
  setOpenUploadReports: (open: boolean) => void;
}

const UploadReports = ({ openUploadReports, setOpenUploadReports }: UploadReportsProps) => {
  const [routeData, setRouteData] = useState<any[]>([]);

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

  return (
     <Dialog open={openUploadReports} onOpenChange={setOpenUploadReports}>
        <DialogContent className='min-w-[1000px] bg-slate-200'>
          <DialogHeader>
            <DialogTitle>Crear Ruta de Monitoreo</DialogTitle>
          </DialogHeader>
          <div className='flex flex-col gap-2 w-full justify-start'>
            <div className='flex flex-row gap-2'>
              <div className='flex flex-col gap-2'>
                <Label className='font-semibold'>Unidad Minera:</Label>
                <Input className='bg-white' placeholder='Ejemplo: Molienda' value={'Antapaccay'} disabled />
              </div>
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
                    <TableHead className='w-[10%]'>FECHA PROGR.</TableHead>
                    <TableHead className='w-[10%]'>PROGRAMA</TableHead>
                    <TableHead className='w-[10%]'>AREA</TableHead>
                    <TableHead className='w-[10%]'>TAG/EQUIPO</TableHead>
                    <TableHead className='w-[10%]'>COMPONENTE</TableHead>
                    {/* <TableHead className='w-[10%]'>CONDICIÓN</TableHead> */}
                    <TableHead className='w-[10%]'>T. TAREA</TableHead>
                    {/* <TableHead className='w-[10%]'>ACCIONES</TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {routeData.length > 0 ? (
                    routeData.map((data, index) => (
                      <TableRow key={index}>
                        <TableCell className='w-[2%]'>{data["ITEM"]}</TableCell>
                        <TableCell className='w-[10%]'>
                          {
                            new Date((data["FECHA PROGRAMADA"] - 25569) * 86400 * 1000)
                              .toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' })
                          }
                        </TableCell>
                        <TableCell className='w-[10%]'>{data["TIPO ACTIVIDAD"]}</TableCell>
                        <TableCell className='w-[10%]'>{data["AREA"]}</TableCell>
                        <TableCell className='w-[10%]'>{data["TAG"]}</TableCell>
                        <TableCell className='w-[10%]'>{data["COMPONENTE"]}</TableCell>
                        {/* <TableCell className='w-[10%]'>{data["CONDICION"]}</TableCell> */}
                        <TableCell className='w-[10%]'>{data["TIPO TAREA"]}</TableCell>
                        {/* <TableCell className='w-[10%]'>
                            <div className='flex flex-row gap-1'>
                              <Button size="sm"><FaPencil /></Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => { console.log("Eliminando...") }}>
                                <FaTrash />
                              </Button>
                            </div>
                          </TableCell> */}
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
          // onClick={() => { addReportsInGeneralData(routeData); setRouteData([]); }}
          >Crear registros</Button>
        </DialogFooter>
        </DialogContent>
      </Dialog>
  )
}

export default UploadReports