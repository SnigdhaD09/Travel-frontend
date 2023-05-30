<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const showDetails = ref(false);
const user = ref(null);

const props = defineProps({
  trip: {
    required: true,
  },
});

onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
});

function navigateToEdit() {
  router.push({ name: "editTrip", params: { id: props.trip.id } });
}
</script>

<template>
  <v-card
    class="rounded-lg elevation-5 mb-8"
    @click="showDetails = !showDetails"
  >
    <v-card-title class="headline">
      <v-row align="center">
        <v-col cols="10">
          {{ trip.tripTitle }}
          <v-chip class="ma-2" color="primary" label>
            <v-icon start icon="mdi-clock-outline"></v-icon>
            Trip Start: {{ new Date(trip.startdate).toDateString() }} 
          </v-chip>
          <v-chip class="ma-2" color="accent" label>
            <v-icon start icon="mdi-clock-outline"></v-icon>
            Trip End: {{ new Date(trip.enddate).toDateString() }}
          </v-chip>
        </v-col>
        <v-col class="d-flex justify-end">
          <v-icon
            v-if="user !== null"
            size="small"
            icon="mdi-pencil"
            @click="navigateToEdit()"
          ></v-icon>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text class="body-1">
      {{ trip.tripDestination }}
    </v-card-text>
    
  </v-card>
</template>
