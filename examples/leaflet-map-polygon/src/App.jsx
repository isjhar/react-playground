import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import AutoComplete from "./view/components/AutoComplete";
import LeftletMap from "./view/components/LeftletMap";
import { useGetLocations } from "./view/hooks/useGetLocations";

function App() {
  const [search, setSearch] = useState("");
  const [center, setCenter] = useState([]);

  const locations = useGetLocations({
    search: search,
  });
  const [selectedLocation, setSelectedLocation] = useState({
    name: "",
    position: [-6.2, 106.8],
    polygons: [],
  });

  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    setSuggestions(
      locations.map((l) => {
        return {
          id: l.name,
          name: l.name,
        };
      })
    );
  }, [locations]);

  useEffect(() => {
    setCenter(selectedLocation.position);
  }, [selectedLocation]);

  return (
    <>
      <div className="container mx-auto px-4 flex flex-col items-center">
        <span className="flex text-3xl font-bold mb-4">
          What Will My Roof Cost
        </span>
        <span className="font-bold mb-3">Roof 1 Detected</span>

        <div className="mb-4 w-full">
          <AutoComplete
            suggestions={suggestions}
            onChange={(search) => {
              setSearch(search);
            }}
            onSelect={(item) => {
              const filteredLocations = locations.filter(
                (l) => l.name == item.id
              );
              if (filteredLocations && filteredLocations.length > 0) {
                setSelectedLocation(filteredLocations[0]);
              }
            }}
          />
        </div>

        {center.length > 0 && (
          <LeftletMap
            key={center.toString()}
            height={"500px"}
            zoom={22}
            center={center}
            polygonPositions={selectedLocation.polygons}
            onSave={(newPositions) => {
              console.log(newPositions);
            }}
          />
        )}
      </div>
    </>
  );
}

export default App;
