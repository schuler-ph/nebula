import { ref } from "vue";

export function useDiaryContent() {
  const date = ref([new Date()]);
  const title = ref("");
  const content = ref("");
  const contentUni = ref("");
  const contentTraining = ref("");
  const contentProjects = ref("");

  const showContentUni = ref(false);
  const showContentTraining = ref(false);
  const showContentProjects = ref(false);

  return {
    date,
    title,
    content,
    contentUni,
    contentTraining,
    contentProjects,
    showContentUni,
    showContentTraining,
    showContentProjects,
  };
}
