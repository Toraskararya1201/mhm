import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingIcons from './components/FloatingIcons';
import Home from './pages/Home';
import About from './pages/About';
import Admission from './pages/Admission';
import Donate from './pages/Donate';

function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    // Fixed: 'instant' breaks on mobile/Safari. This ensures it reliably snaps to the top.
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

function App() {
  return (
    <Router>
      {/* Fixed: Removed 'scroll-smooth' from this wrapper. It breaks page transitions! */}
      <div className="min-h-screen flex flex-col">
        <ScrollToTop />
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/admission" element={<Admission />} />
            <Route path="/donate" element={<Donate />} />
          </Routes>
        </main>
        <Footer />
        <FloatingIcons />
      </div>
    </Router>
  );
}

export default App;