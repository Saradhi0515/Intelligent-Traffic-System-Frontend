import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Home from "./Components/Home/Home";
import Footer from "./Components/Footer/Footer";
import ANPR_ATCC from "./Components/ANPR-ATCC/ANPR-ATCC";

const App = () => (
  <BrowserRouter basename="/Intelligent-Traffic-System-Frontend">
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/anpr-atcc" element={<ANPR_ATCC />} />
    </Routes>
    <Footer />
  </BrowserRouter>
);

export default App;