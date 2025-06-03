import { useEffect, useState } from "react";
import { getLocations } from "../../data/services/LocationService";

export function useGetLocations({ search }) {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    getLocations({
      search: search,
    }).then((data) => {
      setLocations(data);
    });
  }, [search]);

  return locations;
}
