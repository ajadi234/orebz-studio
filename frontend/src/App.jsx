
import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Hero from "./Hero";
import Booking from "./Booking";
import ClientGalleries from "./ClientGalleries";

import "./App.css";

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
}

function App() {
  return (
    <>
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/booking" element={<Booking />} />

        <Route
          path="/client-galleries"
          element={<ClientGalleries />}
        />

        <Route
          path="/client-galleries/*"
          element={<ClientGalleries />}
        />
      </Routes>
    </>
  );
}

export default App;
