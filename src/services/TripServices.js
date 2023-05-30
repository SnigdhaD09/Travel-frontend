import apiClient from "./services";

export default {
  getTrips() {
    return apiClient.get("trips");
  },
  getRegisteredTripsByUserId(userId) {
    return apiClient.get("trips/registered/" + userId);
  },
  getTrip(id) {
    return apiClient.get("trips/" + id);
  },
  addTrip(trip) {
    return apiClient.post("trips", trip);
  },
  updateTrip(tripId, trip) {
    return apiClient.put("trips/" + tripId, trip);
  },
  deleteTrip(tripId) {
    return apiClient.delete("trips/" + tripId);
  },
};
