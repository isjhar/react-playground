import { useState } from "react";
import "./App.css";
import LeftletMap from "./view/components/LeftletMap";
import GroupMap from "./view/components/GroupMap";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <GroupMap />
    </>
  );
}

export default App;
