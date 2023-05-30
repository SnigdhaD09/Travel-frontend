<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import RecipeCard from "../components/RecipeCardComponent.vue";
import TripServices from "../services/TripServices.js";
import HotelServices from "../services/HotelServices.js";

const trips = ref([]);
const hotels = ref([]);
const isAdd = ref(false);
const isAddHotel = ref(false);
const isViewHotel = ref(false);
const user = ref(null);
var isAdmin = ref(false);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const newTrip = ref({
  tripTitle: undefined,
  startdate: undefined,
  enddate: undefined,
  tripDescription: undefined,
  tripDestination: undefined,
  isArchived: false,
});
const newHotel = ref({
  hotelName: undefined,
  address: undefined,
  website: undefined,
  hotelImage: undefined,
  checkinDate: undefined,
  checkoutDate: undefined,
  phoneNumber: undefined,
});

onMounted(async () => {
  await getTrips();
  user.value = JSON.parse(localStorage.getItem("user"));
  isAdmin.value = user.value.isAdmin;
  await getHotels();
});

async function getTrips() {
  user.value = JSON.parse(localStorage.getItem("user"));
  if (user.value !== null && user.value.id !== null && user.value.isAdmin !== false) {
    await TripServices.getRegisteredTripsByUserId(user.value.id)
      .then((response) => {
        trips.value = response.data;
      })
      .catch((error) => {
        console.log(error);
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = error.response.data.message;
      });
  } else {
    await TripServices.getTrips()
      .then((response) => {
        trips.value = response.data;
      })
      .catch((error) => {
        console.log(error);
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = error.response.data.message;
      });
  }
}

async function addTrip() {
  await TripServices.addTrip(newTrip.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newTrip.value.tripTitle} added successfully!`;
      isAdd.value = false;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getTrips();
}
async function getHotels() {
  await HotelServices.getHotels()
    .then((response) => {
      hotels.value = response.data;
      console.log(hotels);
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

async function addHotel() {
  await HotelServices.addHotel(newHotel.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newHotel.value.hotelName} added successfully!`;
      isAddHotel.value = false;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

function openAdd() {
  isAdd.value = true;
}

function closeAdd() {
  isAdd.value = false;
}

function openAddHotel() {
  closeViewHotel();
  isAddHotel.value = true;
}

function closeAddHotel() {
  isAddHotel.value = false;
}

function openViewHotel() {
  isViewHotel.value = true;
}

function closeViewHotel() {
  isViewHotel.value = false;
}

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>
  <v-container>
    <div id="body">
      <v-row align="center" class="mb-4">
        <v-col cols="6"
          ><v-card-title class="pl-0 text-h4 font-weight-bold"
            >HomePage
          </v-card-title>
        </v-col>
        <v-col class="d-flex justify-end" cols="2">
          <v-btn v-if="isAdmin" color="accent" @click="openAddHotel()"
            >Add Hotel</v-btn
          >
        </v-col>
        <v-col class="d-flex justify-end" cols="2">
          <v-btn v-if="isAdmin" color="accent" @click="openViewHotel()"
            >View Hotels</v-btn
          >
        </v-col>
        <v-col class="d-flex justify-end" cols="2">
          <v-btn v-if="isAdmin" color="accent" @click="openAdd()"
            >Add Trip</v-btn
          >
        </v-col>
      </v-row>

      <RecipeCard
        v-for="trip in trips"
        :key="trip.id"
        :trip="trip"
        @deletedList="getLists()"
      />

      <v-dialog persistent v-model="isAdd" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="headline mb-2">Add Trip </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="newTrip.tripTitle"
              label="Title"
              required
            ></v-text-field>

            <v-text-field
              v-model.date="newTrip.startdate"
              label="Start Date"
              type="date"
              required
            ></v-text-field>
            <v-text-field
              v-model.date="newTrip.enddate"
              label="End Date"
              type="date"
              required
            ></v-text-field>

            <v-textarea
              v-model="newTrip.tripDescription"
              label="Description"
              required
            ></v-textarea>
            <v-text-field
              v-model="newTrip.tripDestination"
              label="Destination"
              required
            ></v-text-field>
            <v-switch
              v-model="newTrip.isArchived"
              hide-details
              inset
              :label="`Archive? ${newTrip.isArchived ? 'Yes' : 'No'}`"
            ></v-switch>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="secondary" @click="closeAdd()"
              >Close</v-btn
            >
            <v-btn variant="flat" color="primary" @click="addTrip()"
              >Add Trip</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

<!-- Add Hotels Dialog-->
      <v-dialog persistent v-model="isAddHotel" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="headline mb-2">Add Hotel</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="newHotel.hotelName"
              label="Hotel Name"
              required
            ></v-text-field>
            <v-textarea
              v-model="newHotel.address"
              label="Address"
              type="date"
              required
            ></v-textarea>
            <v-text-field
              v-model="newHotel.website"
              label="Website"
              required
            ></v-text-field>

            <v-text-field
              v-model="newHotel.hotelImage"
              label="Image Link"
              required
            ></v-text-field>
            <v-text-field
              v-model.date="newHotel.checkinDate"
              label="Checkin Date"
              type="date"
              required
            ></v-text-field>
            <v-text-field
              v-model.date="newHotel.checkoutDate"
              label="Checkout Date"
              type="date"
              required
            ></v-text-field>
            <v-text-field
              v-model="newHotel.phoneNumber"
              label="Phone Number"
              required
            ></v-text-field>
            
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="secondary" @click="closeAddHotel()"
              >Close</v-btn
            >
            <v-btn variant="flat" color="primary" @click="addHotel()"
              >Add Hotel</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
<!-- View Hotels Dialog-->
      <v-dialog persistent v-model="isViewHotel" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="headline mb-2">View Hotels</v-card-title>
          <v-card-text>
            <v-table>
              <thead>
                <tr>
                  <th>Hotel Name</th>
                  <th>Address</th>
                  <th>Website</th>
                  <th>Image</th>
                  <th>CheckIn Date</th>
                  <th>CheckOut Date</th>
                  <th>Phone Number</th>
                </tr>
              </thead>
              <tbody>
                <tr  v-for="hotel in hotels"
                  :key="hotel.id"
                >
                  <td>{{ hotel.hotelName }}</td>
                  <td>{{ hotel.address }}</td>
                  <td>{{ hotel.website }}</td>
                  <td>{{ hotel.hotelImage }}</td>
                  <td>{{ hotel.checkinDate }}</td>
                  <td>{{ hotel.checkoutDate }}</td>
                  <td>{{ hotel.phoneNumber }}</td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="secondary" @click="closeAddHotel()"
              >Close</v-btn
            >
            <v-btn variant="flat" color="primary" @click="openAddHotel()"
              >Add Hotel</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

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
    </div>
  </v-container>
</template>
