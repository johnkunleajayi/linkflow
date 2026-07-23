import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateWorkspace from "./pages/CreateWorkspace";
import Dashboard from "./pages/Dashboard";
import Connections from "./pages/Connections";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Landing />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/workspace" element={<CreateWorkspace />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/connections" element={<Connections />} />

      </Routes>

    </BrowserRouter>

  );

}

export default App;