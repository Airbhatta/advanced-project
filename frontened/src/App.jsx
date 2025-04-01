import { Box, useColorModeValue } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";

// Importing pages and components
import LoginPage from "./pages/loginPage";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import UploadPrescription from "./pages/UploadPrescription";
import AdminProduct from "./pages/Product";
import { AuthProvider } from "./admin/useAuth";
import Profile from "./pages/profile";
import PaymentPage from "./pages/PaymentPage";
import CreatePage from "./pages/CreatePage";
function App() {
  return (
    <AuthProvider>
      <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Product" element={<AdminProduct />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/UploadPrescription" element={<UploadPrescription />} />
          <Route path="/payment" element={<PaymentPage />} />
		  <Route path="/profile" element={< Profile />}/>
      <Route path='/create' element={<CreatePage />} />
        </Routes>
      </Box>
    </AuthProvider>
  );
}

export default App;