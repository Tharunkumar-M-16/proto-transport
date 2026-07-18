import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import RoleSelectPage from './pages/RoleSelectPage';
import AreaSelectPage from './pages/user/AreaSelectPage';
import BusSelectPage from './pages/user/BusSelectPage';
import LiveTrackingPage from './pages/user/LiveTrackingPage';
import DriverLoginPage from './pages/driver/DriverLoginPage';
import DriverLocationPage from './pages/driver/DriverLocationPage';
import DriverRegisterBusPage from './pages/driver/DriverRegisterBusPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RoleSelectPage />} />
          <Route path="/user/area" element={<AreaSelectPage />} />
          <Route path="/user/bus" element={<BusSelectPage />} />
          <Route path="/user/tracking" element={<LiveTrackingPage />} />
          <Route path="/driver/login" element={<DriverLoginPage />} />
          <Route path="/driver/location" element={<DriverLocationPage />} />
          <Route path="/driver/register" element={<DriverRegisterBusPage />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}