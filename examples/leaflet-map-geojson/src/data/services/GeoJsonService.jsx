import geoJsonData from "../custom.geo.json";

export async function getGeoJsonData(countryNames) {
  const countryGeoJson = geoJsonData.features.filter((feature) =>
    countryNames.includes(feature.properties.name)
  );
  return countryGeoJson;
}
