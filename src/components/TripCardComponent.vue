<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import TripServices from "../services/TripServices.js";

const router = useRouter();

const showDetails = ref(false);
const user = ref(null);

const props = defineProps({
  trip: {
    required: true,
  },
});
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
});

function navigateToEdit() {
  router.push({ name: "editTrip", params: { id: props.trip.id } });
}
async function copyTrip(tripId) {
  await TripServices.copyTrip(tripId)
    .then((response) => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = response.data.message;
      setTimeout(() => {
        router.push({ name: "viewTrip", params: { id: response.data.id } });
      }, "2000");      
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

function navigateToView() {
  router.push({ name: "viewTrip", params: { id: props.trip.id } });
}
</script>

<template>
  <v-card
    class="rounded-lg elevation-5 mb-8"
    @click="navigateToView()"
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
            v-if="user !== null && user.isAdmin"
            size="small"
            icon="mdi-content-copy"
            @click.stop="copyTrip(trip.id)"
          ></v-icon>
        </v-col>
        <v-col class="d-flex justify-end">
          <v-icon
            v-if="user !== null && user.isAdmin"
            size="small"
            icon="mdi-pencil"
            @click.stop="navigateToEdit()"
          ></v-icon>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text class="body-1">
      {{ trip.tripDestination }}
    </v-card-text>
    
  </v-card>
  <v-snackbar v-model="snackbar.value" rounded="pill">
        {{ snackbar.text }}

        <template v-slot:actions>
          <v-btn
            :color="snackbar.color"
            variant="text"
            @click="closeSnackBar()"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
</template>
