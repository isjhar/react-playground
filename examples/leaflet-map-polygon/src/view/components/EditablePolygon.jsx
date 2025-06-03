import { useMap, useMapEvents } from "react-leaflet";
import { Polygon } from "react-leaflet";
import L from "leaflet";
import "leaflet-geometryutil";

const threshold = 10;

export default function EditablePolygon({
  positions,
  pathOptions,
  onStrokeClick,
  onClick,
}) {
  const map = useMap();
  useMapEvents({
    click: (e) => {
      onClick([e.latlng.lat, e.latlng.lng]);
    },
  });

  const handleClick = (e) => {
    const latlng = e.latlng;
    const latlngs = positions;

    let isNearEdge = false;

    for (let i = 0; i < latlngs.length; i++) {
      const dist = L.GeometryUtil.distanceSegment(
        map,
        latlng,
        L.latLng(latlngs[i]),
        L.latLng(latlngs[(i + 1) % latlngs.length])
      );

      if (dist < threshold) {
        // 10 meters threshold
        isNearEdge = true;
        break;
      }
    }

    if (!isNearEdge) return;

    const segment = findClickedSegment(map, latlng, positions);

    if (!segment) return;

    onStrokeClick(segment.endIndex, [latlng.lat, latlng.lng]);
  };

  return (
    <Polygon
      positions={positions}
      pathOptions={pathOptions}
      eventHandlers={{ click: handleClick }}
    />
  );
}

function findClickedSegment(map, latlng, positions) {
  let closestSegment = null;
  let minDistance = Infinity;

  for (let i = 0; i < positions.length; i++) {
    const start = L.latLng(positions[i]);
    const end = L.latLng(positions[(i + 1) % positions.length]);

    const dist = L.GeometryUtil.distanceSegment(map, latlng, start, end);

    if (dist < threshold && dist < minDistance) {
      minDistance = dist;
      closestSegment = {
        startIndex: i,
        endIndex: (i + 1) % positions.length,
        distance: dist,
      };
    }
  }

  return closestSegment;
}
