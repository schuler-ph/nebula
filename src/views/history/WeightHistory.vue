<template>
  <Line v-if="loadingDataFinished" :data="plotData" :options="plotOptions" />
</template>

<script setup lang="ts">
import { supabase } from "@/lib/supabaseClient";
import { onMounted, ref } from "vue";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface WeightData {
  day: string;
  weight: number;
}

const loadingDataFinished = ref(false);
const plotData = ref({
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "Data One",
      backgroundColor: "#f87979",
      data: [40, 39, 10, 40, 39, 80, 40],
    },
  ],
});
const plotOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  tension: 0.5,
});

onMounted(async () => {
  const { data, error } = await supabase
    .from("diary")
    .select("day,currentWeight")
    .not("currentWeight", "is", null)
    .order("day", { ascending: false });
  if (error === null && data.length !== 0) {
    console.log(data);
    // plotData.value.datasets[0].data = data;
    loadingDataFinished.value = true;
  } else {
    console.log(error);
  }
});
</script>

<style scoped></style>
