import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Tailwind Config (Colors & Fonts)
const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#005CFF',
        accent: '#1E1E1E',
        background: '#FAFAFA',
        surface: '#FFFFFF',
        border: '#E5E7EB',
        textPrimary: '#111827',
        textSecondary: '#6B7280',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'nav': '0 -4px 20px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}`;

// 2. Global CSS
const indexCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-background text-textPrimary font-sans antialiased;
}

/* Hide Scrollbar for Categories */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}`;

// 3. Components: Header
const headerComp = `import React from 'react';
import { FaSearch, FaBell, FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="sticky top-0 z-40 bg-surface shadow-soft">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4">
        <div className="font-heading font-bold text-xl text-primary flex items-center gap-2">
           MotoMarket
        </div>
        <button className="text-textPrimary p-2">
          <FaBell size={20} />
        </button>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex container mx-auto px-6 py-4 items-center justify-between">
        <Link to="/" className="font-heading font-bold text-2xl text-primary">MotoMarket</Link>
        
        {/* Desktop Search */}
        <div className="flex-1 max-w-xl mx-8 relative">
          <input 
            type="text" 
            placeholder="Cari motor impianmu..." 
            className="w-full pl-12 pr-4 py-3 rounded-full bg-background border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-textSecondary" />
        </div>

        <div className="flex items-center gap-6">
          <Link to="/manage/motorcycles" className="font-medium text-textSecondary hover:text-primary transition">Jual Motor</Link>
          <div className="w-px h-6 bg-border"></div>
          <button className="flex items-center gap-2 font-medium text-textPrimary hover:text-primary">
            <FaUserCircle size={24} />
            <span>Masuk</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;`;

// 4. Components: Bottom Nav
const bottomNavComp = `import React from 'react';
import { FaHome, FaSearch, FaPlus, FaHeart, FaUser } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface shadow-nav pb-safe h-[70px] z-50 flex items-center justify-around px-2">
      <Link to="/" className={\`flex flex-col items-center gap-1 p-2 \${isActive('/') ? 'text-primary' : 'text-gray-400'}\`}>
        <FaHome size={20} />
        <span className="text-[10px] font-medium">Home</span>
      </Link>
      
      <button className="flex flex-col items-center gap-1 p-2 text-gray-400">
        <FaSearch size={20} />
        <span className="text-[10px] font-medium">Cari</span>
      </button>

      {/* FAB (Floating Action Button) Center */}
      <Link to="/manage/motorcycles" className="relative -top-5">
        <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white shadow-lg border-4 border-surface transform active:scale-95 transition">
          <FaPlus size={24} />
        </div>
      </Link>

      <button className="flex flex-col items-center gap-1 p-2 text-gray-400">
        <FaHeart size={20} />
        <span className="text-[10px] font-medium">Favorit</span>
      </button>

      <Link to="/manage/brands" className={\`flex flex-col items-center gap-1 p-2 \${isActive('/manage/brands') ? 'text-primary' : 'text-gray-400'}\`}>
        <FaUser size={20} />
        <span className="text-[10px] font-medium">Akun</span>
      </Link>
    </nav>
  );
};

export default BottomNav;`;

// 5. Components: Layout Wrapper
const layoutComp = `import React from 'react';
import Header from './Header';
import BottomNav from './BottomNav';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 w-full max-w-[1400px] mx-auto pb-24 md:pb-8">
        {children}
      </main>
      <BottomNav />
    </div>
  );
};

export default Layout;`;

// 6. Page: Home (Marketplace Feed)
const homePage = `import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMotorcycles, getBrands } from '../services/apiServices';
import { FaSearch, FaMapMarkerAlt, FaFilter, FaMotorcycle, FaBolt, FaRoad, FaMountain } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  { id: 1, name: 'Matic', icon: <FaMotorcycle /> },
  { id: 2, name: 'Sport', icon: <FaBolt /> },
  { id: 3, name: 'Bebek', icon: <FaRoad /> },
  { id: 4, name: 'Trail', icon: <FaMountain /> },
  { id: 5, name: 'Listrik', icon: <FaBolt /> },
];

const Home = () => {
  const { data: motors, isLoading } = useQuery({ queryKey: ['motorcycles'], queryFn: getMotorcycles });
  const [showFilter, setShowFilter] = useState(false);

  // Mock data generator for UI demo
  const enhanceMotorData = (motor) => ({
    ...motor,
    km: Math.floor(Math.random() * 20000) + 1000,
    year: 2020 + Math.floor(Math.random() * 4),
    location: ['Jakarta Selatan', 'Bandung', 'Surabaya'][Math.floor(Math.random() * 3)],
    condition: Math.random() > 0.5 ? 'Like New' : 'Terawat'
  });

  return (
    <div className="p-4 md:p-6">
      {/* Mobile Search Bar */}
      <div className="md:hidden relative mb-6">
        <input 
          type="text" 
          placeholder="Cari motor yang kamu inginkan..." 
          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-border shadow-sm focus:outline-none focus:border-primary"
        />
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" />
        <button 
          onClick={() => setShowFilter(true)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-primary p-2"
        >
          <FaFilter />
        </button>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h2 className="font-heading font-bold text-lg mb-4 text-textPrimary">Kategori</h2>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x">
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="snap-start flex flex-col items-center gap-2 min-w-[70px] cursor-pointer group">
              <div className="w-14 h-14 rounded-full bg-white border border-border flex items-center justify-center text-textSecondary group-hover:border-primary group-hover:text-primary transition shadow-sm">
                {cat.icon}
              </div>
              <span className="text-xs font-medium text-textSecondary group-hover:text-primary">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Listing Grid */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-heading font-bold text-xl text-textPrimary">Rekomendasi Untukmu</h2>
          <span className="text-primary text-sm font-medium cursor-pointer">Lihat Semua</span>
        </div>

        {isLoading ? (
          <div className="text-center py-10">Loading Listings...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {motors?.map((rawMotor) => {
              const motor = enhanceMotorData(rawMotor);
              return (
                <Link to={\`/motor/\${motor.id}\`} key={motor.id} className="bg-surface rounded-2xl border border-border overflow-hidden hover:shadow-lg transition group">
                  <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                    <img src={motor.logo_url} alt={motor.model_name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-[10px] font-bold px-2 py-1 rounded-md text-textPrimary uppercase tracking-wide">
                      {motor.condition}
                    </span>
                    <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/50 backdrop-blur flex items-center justify-center text-white hover:bg-red-500 hover:text-white transition">
                       <span className="text-lg">♥</span>
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-heading font-bold text-lg text-textPrimary truncate mb-1">{motor.model_name}</h3>
                    <p className="text-primary font-bold text-lg mb-3">Rp {Number(motor.price).toLocaleString()}</p>
                    
                    <div className="flex items-center gap-3 text-xs text-textSecondary border-t border-border pt-3">
                      <span className="flex items-center gap-1"><FaRoad /> {motor.km} km</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                      <span>{motor.year}</span>
                      <div className="flex-1 text-right flex items-center justify-end gap-1 text-textPrimary font-medium">
                        <FaMapMarkerAlt className="text-red-500" size={10} />
                        {motor.location}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Mobile Bottom Sheet Filter (Mock) */}
      {showFilter && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilter(false)}></div>
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 h-[80vh] flex flex-col animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-heading font-bold text-lg">Filter Motor</h3>
              <button onClick={() => setShowFilter(false)} className="text-2xl">&times;</button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <p className="text-gray-400 text-center mt-10">Opsi filter akan muncul di sini...</p>
            </div>
            <button onClick={() => setShowFilter(false)} className="w-full bg-primary text-white font-bold py-3 rounded-xl mt-4">
              Terapkan Filter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;`;

// 7. Page: Detail Motor (PDP)
const detailPage = `import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMotorcycles } from '../services/apiServices';
import { FaArrowLeft, FaShareAlt, FaMapMarkerAlt, FaWhatsapp, FaPhoneAlt, FaStar, FaCheckCircle } from 'react-icons/fa';

const DetailMotor = () => {
  const { id } = useParams();
  const { data: motors } = useQuery({ queryKey: ['motorcycles'], queryFn: getMotorcycles });
  const motor = motors?.find(m => m.id === id);

  if (!motor) return <div className="p-10 text-center">Loading or Not Found...</div>;

  return (
    <div className="pb-24 md:pb-10">
      {/* Mobile Nav Overlay */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 p-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
        <Link to="/" className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white">
          <FaArrowLeft />
        </Link>
        <div className="flex gap-2">
           <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white">
             <FaShareAlt />
           </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:p-6">
        {/* Image Section */}
        <div className="lg:w-3/5">
          <div className="w-full aspect-[4/3] lg:aspect-video bg-gray-200 lg:rounded-2xl overflow-hidden relative">
            <img src={motor.logo_url} alt={motor.model_name} className="w-full h-full object-cover" />
            <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full backdrop-blur">
              1/5 Foto
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="lg:w-2/5 p-4 lg:p-0 flex flex-col gap-6">
          <div>
            <div className="flex justify-between items-start mb-2">
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">Like New</span>
              <span className="text-gray-500 text-sm">Diposting 2 jam lalu</span>
            </div>
            <h1 className="font-heading font-bold text-2xl lg:text-3xl text-textPrimary mb-2">{motor.model_name}</h1>
            <h2 className="text-3xl font-bold text-primary">Rp {Number(motor.price).toLocaleString()}</h2>
            <div className="flex items-center gap-1 text-textSecondary mt-2 text-sm">
              <FaMapMarkerAlt className="text-red-500" />
              <span>Jakarta Selatan, DKI Jakarta</span>
            </div>
          </div>

          {/* Spesifikasi Card */}
          <div className="bg-white rounded-xl border border-border p-4 shadow-sm">
            <h3 className="font-bold text-lg mb-3">Spesifikasi</h3>
            <div className="grid grid-cols-2 gap-y-4 text-sm">
              <div>
                <span className="text-gray-500 block">Tahun</span>
                <span className="font-medium text-textPrimary">2022</span>
              </div>
              <div>
                <span className="text-gray-500 block">Kilometer</span>
                <span className="font-medium text-textPrimary">12.500 km</span>
              </div>
              <div>
                <span className="text-gray-500 block">Kapasitas</span>
                <span className="font-medium text-textPrimary">150 cc</span>
              </div>
              <div>
                <span className="text-gray-500 block">Warna</span>
                <span className="font-medium text-textPrimary">Hitam Doff</span>
              </div>
            </div>
          </div>

          {/* Seller Card */}
          <div className="flex items-center gap-4 bg-white rounded-xl border border-border p-4 shadow-sm">
             <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl">👤</div>
             <div className="flex-1">
               <div className="flex items-center gap-2">
                 <h4 className="font-bold text-textPrimary">Mario Garage</h4>
                 <FaCheckCircle className="text-blue-500 text-xs" />
               </div>
               <div className="flex items-center text-xs text-orange-500 gap-1">
                 <FaStar /> <span>4.9 (120 Review)</span>
               </div>
             </div>
             <button className="text-primary text-sm font-medium border border-primary px-3 py-1 rounded-full hover:bg-blue-50">
               Lihat Profil
             </button>
          </div>
        </div>
      </div>

      {/* Sticky Action Bar (Desktop & Mobile) */}
      <div className="fixed bottom-[70px] md:bottom-0 left-0 right-0 bg-white border-t border-border p-4 lg:relative lg:bottom-auto lg:border-none lg:p-0 lg:bg-transparent z-30">
        <div className="flex gap-3 max-w-[1400px] mx-auto lg:justify-end">
          <button className="flex-1 lg:flex-none lg:w-48 flex items-center justify-center gap-2 border border-primary text-primary font-bold py-3 rounded-xl hover:bg-blue-50 transition">
            <FaPhoneAlt /> Telepon
          </button>
          <button className="flex-1 lg:flex-none lg:w-48 flex items-center justify-center gap-2 bg-primary text-white font-bold py-3 rounded-xl shadow-lg hover:bg-blue-700 transition">
            <FaWhatsapp size={20} /> Chat Penjual
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailMotor;`;

// 8. App Router Update
const appTsx = `import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import DetailMotor from './pages/DetailMotor';
import Brands from './pages/Brands';
import Motorcycles from './pages/Motorcycles';
import Reviews from './pages/Reviews';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/motor/:id" element={<DetailMotor />} />
            
            {/* CRUD Management Routes (Hidden in Account/Sell menu) */}
            <Route path="/manage/brands" element={<Brands />} />
            <Route path="/manage/motorcycles" element={<Motorcycles />} />
            <Route path="/manage/reviews" element={<Reviews />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;`;

// Write Files
const files = {
  'tailwind.config.js': tailwindConfig,
  'src/index.css': indexCss,
  'src/components/Header.tsx': headerComp,
  'src/components/BottomNav.tsx': bottomNavComp,
  'src/components/Layout.tsx': layoutComp,
  'src/pages/Home.tsx': homePage,
  'src/pages/DetailMotor.tsx': detailPage,
  'src/App.tsx': appTsx
};

Object.entries(files).forEach(([filePath, content]) => {
  const absolutePath = path.join(__dirname, filePath);
  const dir = path.dirname(absolutePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(absolutePath, content, 'utf8');
  console.log(`Updated: ${filePath}`);
});

console.log('✅ Modern UI Setup Complete!');