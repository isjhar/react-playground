import MapEditingToolButton from "./MapEditingToolButton";

export const EDIT_MODE = {
  addNode: 1,
  deleteNode: 2,
};

export default function MapEditingTools({ mode, onChange }) {
  return (
    <div className="flex flex-col">
      <MapEditingToolButton
        isActive={mode == EDIT_MODE.addNode}
        onClick={() => onChange(EDIT_MODE.addNode)}
      >
        Add
      </MapEditingToolButton>
      <MapEditingToolButton
        isActive={mode == EDIT_MODE.deleteNode}
        onClick={() => onChange(EDIT_MODE.deleteNode)}
      >
        Delete
      </MapEditingToolButton>
    </div>
  );
}
