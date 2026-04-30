import { getEntities } from "@/app/services/entitiesServices";
import { useQuery } from "@tanstack/react-query";
import { Entity } from "../_models/entity.model";

const useGetPlantsAndAreas = () => {
  const fetchPlantsAndAreas = async () => {
    const response = await getEntities();
    const resp = response.data.results
    const filtered = resp.filter((ent: Entity) => ent.type === 1 || ent.type === 2)
    const ordered = filtered.sort((a: Entity, b: Entity) => a.type - b.type)
    return ordered;
  };

  return useQuery({
    queryKey: ["plantsAndAreas"],
    queryFn: fetchPlantsAndAreas,
    refetchOnWindowFocus: false,
  });
};

export default useGetPlantsAndAreas;