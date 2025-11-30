import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Layout from './components/Layout'; // Import Layout baru
import Home from './pages/Home';
import DetailMotor from './pages/DetailMotor';
import Brands from './pages/Brands';
import Motorcycles from './pages/Motorcycles';
import Reviews from './pages/Reviews';
import Profile from './pages/Profile';

const queryClient = new QueryClient();

// Component kecil untuk handle scroll ke atas saat pindah halaman
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false, // Animation happens every time you scroll
      mirror: true, // Elements animate out while scrolling past them
      offset: 100,
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        {/* Bungkus Routes dengan Layout */}
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/motor/:id" element={<DetailMotor />} />
            <Route path="/manage/brands" element={<Brands />} />
            <Route path="/manage/motorcycles" element={<Motorcycles />} />
            <Route path="/manage/reviews" element={<Reviews />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;