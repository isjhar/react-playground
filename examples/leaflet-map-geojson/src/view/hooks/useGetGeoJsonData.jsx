import { useEffect, useState } from "react";
import { getGeoJsonData } from "../../data/services/GeoJsonService";

export function useGetGeoJsonData(countryNames) {
  const [countryGeoJsons, setCountryGeoJsons] = useState([]);

  useEffect(() => {
    getGeoJsonData(countryNames).then((data) => {
      setCountryGeoJsons(data);
    });
  }, [countryNames]);

  return countryGeoJsons;
}
