import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Home from "./Components/Home/Home";
import Footer from "./Components/Footer/Footer";
import ANPR_ATCC from "./Components/ANPR-ATCC/ANPR-ATCC";
import AccidentDetection from "./Components/AccidentDetection/AccidentDetection";
import SignalControl from "./Components/SignalControl/SignalControl";
import EmergencyVehicle from "./Components/EmergencyVehicle/EmergencyVehicle";

const App = () => (
  <BrowserRouter basename="/Intelligent-Traffic-System-Frontend">
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/anpr-atcc" element={<ANPR_ATCC />} />
      <Route path="/accident" element={<AccidentDetection />} />
      <Route path="/signal" element={<SignalControl />} />
      <Route path="/emergency" element={<EmergencyVehicle />} />
    </Routes>
    <Footer />
  </BrowserRouter>
);

export default App;