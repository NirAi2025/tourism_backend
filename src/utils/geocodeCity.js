import NodeGeocoder from "node-geocoder";
import axios from "axios";

const options = {
  provider: "openstreetmap",
};

const geocoder = NodeGeocoder(options);

export const getCoordinates = async (cityName) => {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;

    const url = `https://maps.googleapis.com/maps/api/geocode/json`;

    const response = await axios.get(url, {
      params: {
        address: cityName,
        key: apiKey,
      },
    });

    const data = response.data;
    console.log("data ----> ", data);

    if (data.status === "OK") {
      const location = data.results[0].geometry.location;
      const placeId = data.results[0].place_id;
      const latitude = location.lat;
      const longitude = location.lng;
      console.log(`latitude : ${latitude} || longitude: ${longitude}`);

      return {
        placeId,
        latitude,
        longitude,
      };
    }

    return null;
  } catch (error) {
    console.error("Geocoding Error:", error.message);
    return null;
  }
};
