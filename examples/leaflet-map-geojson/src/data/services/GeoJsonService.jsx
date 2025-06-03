import axios from 'axios';

export async function getGeoJsonData(countryNames) {
  const response = await axios.get("/data/geo.json");
  const countryGeoJson = response.data.features.filter((feature) =>
    countryNames.includes(feature.properties.name)
  );
  return countryGeoJson;
}
