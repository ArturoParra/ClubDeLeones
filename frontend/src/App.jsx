import { useEffect, useState } from "react";
import { Routes, Route } from 'react-router-dom';
import { IndexPage } from "./views/IndexPage";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api")
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <Routes>
      <Route exact path="/" element={<IndexPage />} />
    </Routes>
  );
}

export default App;
