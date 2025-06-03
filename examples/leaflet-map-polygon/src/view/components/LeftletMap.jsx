import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L from "leaflet";
import "leaflet-draw";
import icon from "leaflet/dist/images/marker-icon.png";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";
import shadow from "leaflet/dist/images/marker-shadow.png";
import { useMemo, useState } from "react";
import DraggableCircleMarker from "./DraggableCircleMarker";
import EditablePolygon from "./EditablePolygon";
import { EDIT_MODE } from "./MapEditingTools";
import MapEditingTools from "./MapEditingTools";
import MapTools from "./MapTools";

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: icon,
  shadowUrl: shadow,
});

const buttonIcon = L.divIcon({
  className: "custom-button-marker",
  html: `<button class="bg-blue-500 text-white rounded-md border-4 border-white p-2">Edit</button>`,
  iconSize: [50, 50], // adjust based on your button size
  iconAnchor: [20, 0], // center the icon
});

export default function LeftletMap({
  height,
  center = [0, 0],
  zoom = 2,
  polygonPositions = [],
  onSave,
}) {
  const [enableEdit, setEnableEdit] = useState(false);
  const [editMode, setEditMode] = useState(EDIT_MODE.addNode);
  const [isDragMarker, setIsDragMarker] = useState(false);
  const [drawnPolygonPositions, setDrawnPolygonPositions] = useState([
    ...polygonPositions,
  ]);

  const editMarkerPosition = useMemo(() => {
    if (drawnPolygonPositions.length == 0 || enableEdit) {
      return [];
    }
    const xPoints = drawnPolygonPositions.map((p) => p[0]);
    const yPoints = drawnPolygonPositions.map((p) => p[1]);
    return [Math.max(...xPoints), Math.max(...yPoints)];
  }, [drawnPolygonPositions, enableEdit]);

  return (
    <div className="relative" style={{ height: height, width: "100%" }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <EditablePolygon
          positions={drawnPolygonPositions}
          pathOptions={{ color: "red" }}
          onStrokeClick={(segmentIndex, pos) => {
            if (!enableEdit || editMode != EDIT_MODE.addNode || isDragMarker)
              return;
            const newDrawPolygonPositions = [...drawnPolygonPositions];
            newDrawPolygonPositions.splice(segmentIndex, 0, pos);
            setDrawnPolygonPositions(newDrawPolygonPositions);
          }}
          onClick={(pos) => {
            if (
              editMode != EDIT_MODE.addNode ||
              drawnPolygonPositions.length > 2
            )
              return;
            const newDrawPolygonPositions = [...drawnPolygonPositions];
            newDrawPolygonPositions.push(pos);
            setDrawnPolygonPositions(newDrawPolygonPositions);
          }}
        />

        {enableEdit &&
          drawnPolygonPositions.map((p, index) => {
            return (
              <DraggableCircleMarker
                key={`marker-${index}`}
                center={p}
                radius={5}
                pathOptions={{
                  color: "black",
                  fillColor: "black",
                  fillOpacity: 0.7,
                }}
                onStartDrag={() => {
                  setIsDragMarker(true);
                  if (editMode == EDIT_MODE.deleteNode) {
                    const newDrawPolygonPositions = [...drawnPolygonPositions];
                    newDrawPolygonPositions.splice(index, 1);
                    setDrawnPolygonPositions(newDrawPolygonPositions);
                  }
                }}
                onEndDrag={() => {
                  setIsDragMarker(false);
                }}
                onDrag={(newPos) => {
                  if (editMode != EDIT_MODE.addNode) return;
                  const newPositions = drawnPolygonPositions.map(
                    (oldPos, posIndex) => {
                      if (posIndex == index) {
                        return newPos;
                      }
                      return oldPos;
                    }
                  );
                  setDrawnPolygonPositions(newPositions);
                }}
              />
            );
          })}

        {editMarkerPosition.length > 1 && !enableEdit && (
          <Marker
            position={editMarkerPosition}
            icon={buttonIcon}
            eventHandlers={{
              click: () => {
                setEnableEdit(true);
                setEditMode(EDIT_MODE.addNode);
              },
            }}
          />
        )}
      </MapContainer>
      {enableEdit && (
        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 z-[2000]">
          <MapTools
            onSaveClick={() => {
              setEnableEdit(false);
              onSave(drawnPolygonPositions);
            }}
            onCancelClick={() => {
              setEnableEdit(false);
              setDrawnPolygonPositions(polygonPositions);
            }}
          />
        </div>
      )}
      {enableEdit && (
        <div className="absolute right-0 top-4 z-[2000]">
          <MapEditingTools
            mode={editMode}
            onChange={(mode) => {
              setEditMode(mode);
            }}
          />
        </div>
      )}
    </div>
  );
}
