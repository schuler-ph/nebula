import { ref } from "vue";

export function useDiaryContent() {
  const date = ref([new Date()]);
  const title = ref("");
  const content = ref("");

  const todoDaily = ref<string[]>([]);

  const currentWeight = ref<number | null>(0.0);
  const weightSlider = ref(0.0);

  return {
    date,
    title,
    content,
    todoDaily,
    currentWeight,
    weightSlider,
  };
}
