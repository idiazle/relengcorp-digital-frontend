import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Controller, useWatch, type Control, type UseFormSetValue } from 'react-hook-form'
import type { Entity } from '../../../entities/_models/entity.model'
import type { Report } from '../../_models/moncon.model'
import { works, services } from '../../_config/options'

interface TreeEntity extends Omit<Entity, 'parent'> {
  parent_id?: number | null
  children?: TreeEntity[]
}

interface ReportHierarchySelectProps {
  control: Control<Report>
  setValue: UseFormSetValue<Report>
  entities: Entity[]
  selectedPlant: number | undefined
  setSelectedPlant: (id: number | undefined) => void
  selectedArea: number | undefined
  setSelectedArea: (id: number | undefined) => void
  selectedRoute: number | undefined
  setSelectedRoute: (id: number | undefined) => void
  selectedEquipment: number | undefined
  setSelectedEquipment: (id: number | undefined) => void
  selectedItem: number | undefined
  setSelectedItem: (id: number | undefined) => void
}

const ReportHierarchySelect = ({
  control,
  setValue,
  entities,
  selectedPlant,
  setSelectedPlant,
  selectedArea,
  setSelectedArea,
  selectedRoute,
  setSelectedRoute,
  selectedEquipment,
  setSelectedEquipment,
  selectedItem,
  setSelectedItem,
}: ReportHierarchySelectProps) => {
  const treeEntities = entities as TreeEntity[]

  const findNodeById = (nodes: TreeEntity[], id?: number): TreeEntity | undefined => {
    if (!id) return undefined

    for (const node of nodes) {
      if (node.id === id) return node

      const childMatch = node.children ? findNodeById(node.children, id) : undefined
      if (childMatch) return childMatch
    }

    return undefined
  }

  const childrenOf = (parentId?: number, type?: number) => {
    const parentNode = findNodeById(treeEntities, parentId)
    const children = parentNode?.children ?? []
    return type ? children.filter((child) => child.type === type) : children
  }

  const plants = treeEntities.filter((e) => e.type === 1)
  const areas = childrenOf(selectedPlant, 2)
  const routes = childrenOf(selectedArea, 3)
  const equipments = childrenOf(selectedRoute, 4)
  const items = childrenOf(selectedRoute, 4)
  const components = selectedEquipment || selectedItem ? childrenOf(selectedEquipment || selectedItem, 6) : []

  const selectedWorkType = Number(useWatch({ control, name: 'work_type' })) || 0
  const useEquipmentFlow = selectedWorkType === 1
  const useItemFlow = selectedWorkType === 2
  const changeType = useEquipmentFlow ? 1 : useItemFlow ? 2 : 0

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full flex flex-row gap-2">
        <div className="flex flex-col gap-2 w-1/5">
          <Label className="font-semibold">Tipo de Trabajo:</Label>
          <Controller
            name="work_type"
            control={control}
            render={({ field }) => (
              <Select
                value={String(field.value)}
                onValueChange={(v) => {
                  field.onChange(parseInt(v))
                  setSelectedEquipment(undefined)
                  setSelectedItem(undefined)
                  setValue('entity', 0)
                }}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  {works.map((w) => (
                    <SelectItem key={w.id} value={String(w.id)}>{w.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="flex flex-col gap-2 w-1/4">
          <Label className="font-semibold">Tipo de servicio:</Label>
          <Controller
            name="service_type"
            control={control}
            render={({ field }) => (
              <Select value={String(field.value)} onValueChange={(v) => field.onChange(parseInt(v))}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                 {
                    services.filter((s) => selectedWorkType === 0 || works.find((w) => w.id === selectedWorkType)?.service_types.includes(s.id))
                    .map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                    ))
                 }
                </SelectContent>
              </Select>
            )}
          />
        </div>

       {/*  <div className="flex flex-col gap-2 w-1/5">
          <Label className="font-semibold">Condición:</Label>
          <Controller
            name="condition"
            control={control}
            render={({ field }) => (
              <Select value={String(field.value)} onValueChange={(v) => field.onChange(parseInt(v))}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Normal</SelectItem>
                  <SelectItem value="2">Tolerable</SelectItem>
                  <SelectItem value="3">Precaución</SelectItem>
                  <SelectItem value="4">Crítico</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div> */}
      </div>

      <div className="w-full flex flex-row gap-2">
        <div className="flex flex-col gap-2 w-1/5">
          <Label className="font-semibold">Planta:</Label>
          <Select value={selectedPlant ? String(selectedPlant) : ''} onValueChange={(v) => {
            setSelectedPlant(parseInt(v))
            setSelectedArea(undefined)
            setSelectedRoute(undefined)
            setSelectedEquipment(undefined)
            setSelectedItem(undefined)
            setValue('entity', 0)
          }}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Seleccionar..." />
            </SelectTrigger>
            <SelectContent>
              {plants.map((p) => (
                <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2 w-1/5">
          <Label className="font-semibold">Área:</Label>
          <Select disabled={!selectedPlant} value={selectedArea ? String(selectedArea) : ''} onValueChange={(v) => {
            setSelectedArea(parseInt(v))
            setSelectedRoute(undefined)
            setSelectedEquipment(undefined)
            setSelectedItem(undefined)
            setValue('entity', 0)
          }}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder={!selectedPlant ? 'Selecciona planta' : 'Seleccionar...'} />
            </SelectTrigger>
            <SelectContent>
              {areas.map((a) => (
                <SelectItem key={a.id} value={String(a.id)}>{a.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2 w-1/5">
          <Label className="font-semibold">Ruta:</Label>
          <Select disabled={!selectedArea} value={selectedRoute ? String(selectedRoute) : ''} onValueChange={(v) => {
            setSelectedRoute(parseInt(v))
            setSelectedEquipment(undefined)
            setSelectedItem(undefined)
            setValue('entity', 0)
          }}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder={!selectedArea ? 'Selecciona área' : 'Seleccionar...'} />
            </SelectTrigger>
            <SelectContent>
              {routes.map((r) => (
                <SelectItem key={r.id} value={String(r.id)}>{r.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {changeType === 1 && (
          <div className="flex flex-col gap-2 w-1/5">
            <Label className="font-semibold">Equipo:</Label>
            <Select disabled={!selectedRoute} value={selectedEquipment ? String(selectedEquipment) : ''} onValueChange={(v) => {
              setSelectedEquipment(parseInt(v))
              setSelectedItem(undefined)
              setValue('entity', 0)
            }}>
              <SelectTrigger className="bg-white w-full">
                <SelectValue placeholder={!selectedRoute ? 'Selecciona ruta' : 'Seleccionar...'} />
              </SelectTrigger>
              <SelectContent>
                {equipments.map((e) => (
                  <SelectItem key={e.id} value={String(e.id)}>{e.tag}/{e.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {changeType === 2 && (
          <div className="flex flex-col gap-2 w-1/5">
            <Label className="font-semibold">Ítem:</Label>
            <Select disabled={!selectedRoute} value={selectedItem ? String(selectedItem) : ''} onValueChange={(v) => {
              setSelectedItem(parseInt(v))
              setSelectedEquipment(undefined)
              setValue('entity', 0)
            }}>
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder={!selectedRoute ? 'Selecciona ruta' : 'Seleccionar...'} />
              </SelectTrigger>
              <SelectContent>
                {items.map((i) => (
                  <SelectItem key={i.id} value={String(i.id)}>{i.tag}/{i.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="flex flex-col gap-2 w-1/5">
          <Label className="font-semibold">Componente:</Label>
          <Controller
            name="entity"
            control={control}
            render={({ field }) => (
              <Select
                disabled={useEquipmentFlow ? !selectedEquipment : useItemFlow ? !selectedItem : true}
                value={field.value ? String(field.value) : ''}
                onValueChange={(v) => field.onChange(parseInt(v))}
              >
                <SelectTrigger className="bg-white w-full">
                  <SelectValue
                    placeholder={
                      useEquipmentFlow
                        ? !selectedEquipment
                          ? 'Selecciona equipo'
                          : 'Seleccionar...'
                        : useItemFlow
                          ? !selectedItem
                            ? 'Selecciona ítem'
                            : 'Seleccionar...'
                          : 'Selecciona tipo de trabajo'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {components.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
    </div>
  )
}

export default ReportHierarchySelect
