import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  Popup,
  Tooltip,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";
import shadow from "leaflet/dist/images/marker-shadow.png";
import { useEffect, useMemo, useRef, useState } from "react";
import { useGetGeoJsonData } from "../hooks/useGetGeoJsonData";

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: icon,
  shadowUrl: shadow,
});

export default function LeftletMap({ countries = [] }) {
  const geoJsonData = useMemo(() => {
    return countries
      .filter((country) => country.geo)
      .map(
        (country) => {
          return {
            data: country,
            style: {
              fillColor: country.color,
              fillOpacity: 0.5,
              color: country.color,
              weight: 2,
            },
          };
        },
        [countries]
      );
  });

  const onEachFeature = (layer, data) => {
    const popupContent = `
      <strong>${data.name}</strong><br />
      Group: ${data.groupName}<br />
      Upvotes: ${data.upVotes}<br />
      Category: ${data.riskCategory}<br />      
      Time Posted: ${data.timePosted}<br />
      Start Date: ${data.startDate.toLocaleDateString("en-GB")}<br />
      End Date: ${data.endDate.toLocaleDateString("en-GB")}<br />
    `;
    layer.bindPopup(popupContent);
  };

  return (
    <MapContainer
      center={[0, 0]}
      zoom={2}
      style={{ height: "700px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {geoJsonData.length > 0 &&
        geoJsonData.map((geoJson, index) => (
          <GeoJSON
            key={geoJson.data.name + Date.now()}
            data={geoJson.data.geo}
            style={geoJson.style}
            onEachFeature={(feature, layer) =>
              onEachFeature(layer, geoJson.data)
            }
          />
        ))}
    </MapContainer>
  );
}
