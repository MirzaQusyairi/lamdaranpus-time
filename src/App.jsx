import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import WelcomePage from "./pages/WelcomePage";
import Dashboard from "./pages/Dashboard";
import Daftar from "./pages/Daftar";
import LoginValidation from "./pages/LoginValidation";
import SignUpValidation from "./pages/SignUpValidation";
import AdditionalData from "./pages/AdditionalData";
import QueueRegisterForUser from "./pages/QueueRegisterForUser";
import QueueRegisterForOther from "./pages/QueueRegisterForOther";
import AdminLogin from "./pages/AdminLogin";
import AdminPageTB from "./pages/AdminPageTB";
import AdminPageInfeksius from "./pages/AdminPageInfeksius";
import AdminPageUmum from "./pages/AdminPageUmum";
import AdminPageKIA from "./pages/AdminPageKIA";
import AdminPageGigi from "./pages/AdminGigi";
import AntrianSaya from "./pages/AntrianSaya";
import ProfilePage from "./pages/ProfilePage";
import PasienDetail from "./pages/PasienDetail";
import AdminHistoryGigi from "./pages/AdminHistoryGigi";
import AdminHistoryInfeksius from "./pages/AdminHistoryInfeksius";
import AdminHistoryKIA from "./pages/AdminHistoryKIA";
import AdminHistoryTB from "./pages/AdminHistoryTB";
import AdminHistoryUmum from "./pages/AdminHistoryUmum";
import HistoriDetail from "./pages/HistoriDetail";
import OTPVerification from "./pages/OTPVerification";

function App() {
  return (
    <Routes>
      <Route path="verifikasi-akun" element={<OTPVerification />} />

      <Route path="/login" element={<LoginValidation />} />

      <Route path="/admin-login" element={<AdminLogin />} />

      <Route path="/signup" element={<SignUpValidation />} />

      <Route path="/welcome" element={<WelcomePage />} />

      <Route path="/additional-data" element={<ProtectedRoute />}>
        <Route path="/additional-data" element={<AdditionalData />} />
      </Route>

      <Route exact path="/" element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
      </Route>

      <Route exact path="/daftar" element={<ProtectedRoute />}>
        <Route path="/daftar" element={<Daftar />} />
      </Route>

      <Route exact path="/queue-register-other" element={<ProtectedRoute />}>
        <Route
          path="/queue-register-other"
          element={<QueueRegisterForOther />}
        />
      </Route>

      <Route exact path="/queue-register-user" element={<ProtectedRoute />}>
        <Route path="/queue-register-user" element={<QueueRegisterForUser />} />
      </Route>

      <Route exact path="/manage-queue-tb" element={<ProtectedRoute />}>
        <Route path="/manage-queue-tb" element={<AdminPageTB />} />
      </Route>

      <Route exact path="/manage-queue-infeksius" element={<ProtectedRoute />}>
        <Route
          path="/manage-queue-infeksius"
          element={<AdminPageInfeksius />}
        />
      </Route>

      <Route exact path="/manage-queue-umum" element={<ProtectedRoute />}>
        <Route path="/manage-queue-umum" element={<AdminPageUmum />} />
      </Route>

      <Route exact path="/manage-queue-kia" element={<ProtectedRoute />}>
        <Route path="/manage-queue-kia" element={<AdminPageKIA />} />
      </Route>

      <Route exact path="/manage-queue-gigi" element={<ProtectedRoute />}>
        <Route path="/manage-queue-gigi" element={<AdminPageGigi />} />
      </Route>

      <Route exact path="/antrian-saya" element={<ProtectedRoute />}>
        <Route path="/antrian-saya" element={<AntrianSaya />} />
      </Route>

      <Route exact path="/profil-saya" element={<ProtectedRoute />}>
        <Route path="/profil-saya" element={<ProfilePage />} />
      </Route>

      <Route exact path="/histori-TB" element={<ProtectedRoute />}>
        <Route path="/histori-TB" element={<AdminHistoryTB />} />
      </Route>
      <Route exact path="/histori-infeksius" element={<ProtectedRoute />}>
        <Route path="/histori-infeksius" element={<AdminHistoryInfeksius />} />
      </Route>
      <Route exact path="/histori-gigi" element={<ProtectedRoute />}>
        <Route path="/histori-gigi" element={<AdminHistoryGigi />} />
      </Route>
      <Route exact path="/histori-kia" element={<ProtectedRoute />}>
        <Route path="/histori-kia" element={<AdminHistoryKIA />} />
      </Route>
      <Route exact path="/histori-umum" element={<ProtectedRoute />}>
        <Route path="/histori-umum" element={<AdminHistoryUmum />} />
      </Route>

      <Route exact path="/pasien-detail/:pasienID" element={<ProtectedRoute />}>
        <Route path="/pasien-detail/:pasienID" element={<PasienDetail />} />
      </Route>

      <Route exact path="/histori-detail/:historiID" element={<ProtectedRoute />}>
        <Route path="/histori-detail/:historiID" element={<HistoriDetail />} />
      </Route>

    </Routes>
  );
}

export default App;
