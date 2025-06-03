import axios from "axios";

export async function getLocations({ search }) {
  const response = await axios.get("/data/locations.json");
  return response.data.filter(
    (l) =>
      !search || (l.name && l.name.toLowerCase().includes(search.toLowerCase()))
  );
}
