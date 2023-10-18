import { Row } from "@/types/supabaseHelper";
import { useStorageStore } from "../storageStore";

export type TodoTemplate = Row<"todo"> & { subtodos?: Row<"todo">[] };

export const getDailyTodos = (onlyActiveOnes: boolean) => {
  let activeDailyTodos: TodoTemplate[] = [];

  const { allTodos } = useStorageStore();

  let req = allTodos;

  if (onlyActiveOnes) {
    req = req.filter((t) => t.inactive !== true);
  }

  req = req
    .filter((t) => t.category === "daily")
    .sort((a, b) => {
      if (a.order! < b.order!) return -1;
      else if (a.order! > b.order!) return 1;
      return 0;
    });

  let mainTodos: Row<"todo">[];
  mainTodos = req.filter((d) => d.subtodo_of === null);
  mainTodos.forEach((t) => {
    const subtodos = req.filter((d) => d.subtodo_of === t.id);
    activeDailyTodos.push({
      ...t,
      subtodos,
    });
  });
  return activeDailyTodos;
};

export const getLongtermTodos = (
  category: string,
  showLtDoneTodos: boolean
) => {
  let longtermTodos: TodoTemplate[] = [];

  const { allTodos } = useStorageStore();

  let req = allTodos
    .filter((at) => at.category === category)
    .sort((a, b) => {
      if (a.updated_at < b.updated_at) return 1;
      else if (a.updated_at > b.updated_at) return -1;
      return 0;
    })
    .sort((a, b) => {
      if (a.linked_date! < b.linked_date!) return -1;
      if (a.linked_date! > b.linked_date!) return 1;
      return 0;
    });
  // latest updated_at is on top

  if (!showLtDoneTodos) {
    req = req.filter((r) => r.done !== true);
  }

  let mainTodos: Row<"todo">[];
  mainTodos = req.filter((d) => d.subtodo_of === null);
  mainTodos.forEach((t) => {
    const subtodos = req.filter((d) => d.subtodo_of === t.id);
    longtermTodos.push({
      ...t,
      subtodos,
    });
  });

  return longtermTodos;
};
