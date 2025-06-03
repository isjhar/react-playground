export default function MapEditingToolButton({ children, isActive, onClick }) {
  return (
    <button
      className={`${isActive ? "bg-blue-900" : "bg-blue-500"} text-white p-1`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
