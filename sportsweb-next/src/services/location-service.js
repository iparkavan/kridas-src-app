import axios from "axios";

class LocationService {
  async getLocation() {
    const res = await axios.get(
      `https://extreme-ip-lookup.com/json?key=${process.env.NEXT_PUBLIC_IP_KEY}`
    );
    return res.data;
  }
}

export default new LocationService();
