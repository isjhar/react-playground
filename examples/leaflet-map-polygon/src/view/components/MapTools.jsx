export default function MapTools({ onSaveClick, onCancelClick }) {
  return (
    <div className="flex flex-row gap-2 bg-white p-2 text-xs">
      <button
        className="bg-blue-500 text-white rounded-md px-2 py-1"
        onClick={onSaveClick}
      >
        Save
      </button>
      <button
        className="bg-white text-blue-500 rounded-md px-2 py-1 border-blue-500 border-2"
        onClick={onCancelClick}
      >
        Cancel
      </button>
    </div>
  );
}
