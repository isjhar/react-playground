import { useRef } from "react";
import { CircleMarker, useMapEvents } from "react-leaflet";

export default function DraggableCircleMarker({
  center,
  radius,
  pathOptions,
  onDrag,
  onStartDrag,
  onEndDrag,
}) {
  const markerRef = useRef(null);
  const map = useMapEvents({
    mousemove(e) {
      if (markerRef.current?.dragging) {
        onDrag([e.latlng.lat, e.latlng.lng]);
      }
    },
    mouseup() {
      if (markerRef.current?.dragging) {
        markerRef.current.dragging = false;
        map.dragging.enable();
        onEndDrag();
      }
    },
  });

  return (
    <CircleMarker
      center={center}
      radius={radius}
      pathOptions={pathOptions}
      eventHandlers={{
        mousedown: () => {
          markerRef.current = { dragging: true };
          map.dragging.disable();
          onStartDrag();
        },
      }}
    />
  );
}
