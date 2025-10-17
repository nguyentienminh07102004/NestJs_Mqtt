import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./page/Home";
import Profile from "./page/Profile";
import Sensor from "./page/Sensor";
import ActionHistory from "./page/ActionHistory";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="sensor" element={<Sensor />} />
          <Route path="action-history" element={<ActionHistory />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
