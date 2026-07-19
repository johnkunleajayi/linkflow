import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";


import Dashboard from "./pages/Dashboard";
import Connections from "./pages/Connections";



function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Dashboard />}
        />


        <Route
          path="/connections"
          element={<Connections />}
        />

      </Routes>

    </BrowserRouter>

  );

}


export default App;