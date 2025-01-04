import { useEffect, useState } from "react";
import { Routes, Route } from 'react-router-dom';
import { IndexPage } from "./views/IndexPage";
import { LoginAdmin } from "./views/LoginAdmin";
import { LoginEntrenador } from "./views/LoginEntrenador";
import { SingupEntrenador } from "./views/SingupEntrenador";
import { IndexEntrenador } from "./views/IndexEntrenador";
import { IndexAdmin } from "./views/IndexAdmin";
import { FormEvento } from "./views/FormEvento";
import { DetallesEvento } from "./views/DetallesEvento";
import { InscribirCompetidores } from "./views/InscribirCompetidores";
import { RegistroCompetidores } from "./views/RegistroCompetidores";

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
      <Route path="/AdminLogin" element={<LoginAdmin />} />
      <Route path="/EntrenadorLogin" element={<LoginEntrenador />} />
      <Route path="/RegistroEntrenador" element={<SingupEntrenador />} />
      <Route path="/IndexEntrenador" element={<IndexEntrenador />} />
      <Route path="/IndexAdmin" element={<IndexAdmin />} />
      <Route path="/FormEvento" element={<FormEvento />}/>
      <Route path="/DetallesEvento/:id" element={<DetallesEvento />}/>
      <Route path="/InscribirCompetidores/:id" element={<InscribirCompetidores />}/>
      <Route path="/RegistroCompetidor" element={<RegistroCompetidores />} />
    </Routes>
  );
}

export default App;
