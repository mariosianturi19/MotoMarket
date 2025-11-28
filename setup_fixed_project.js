import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Types (Strict sesuai Backend & CURL)
const typesIndex = `export interface Brand {
  id: string;
  name: string;
  country: string;
  logo_url: string;
}

export interface Motorcycle {
  id: string;
  model_name: string;
  specs: string;
  price: string | number;
  brand_id: string;
  logo_url: string;
  brands?: { name: string };
}

export interface Review {
  id: string;
  reviewer_name: string;
  comment: string;
  rating: number;
  motorcycle_id: string;
}`;

// 2. API Services
const apiServices = `import { api } from '../api/client';
import type { Brand, Motorcycle, Review } from '../types';

// --- BRANDS ---
export const getBrands = async () => (await api.get<Brand[]>('/brands')).data;
export const createBrand = async (data: Omit<Brand, 'id'>) => (await api.post('/brands', data)).data;
export const updateBrand = async (id: string, data: Partial<Brand>) => (await api.put(\`/brands/\${id}\`, data)).data;
export const deleteBrand = async (id: string) => (await api.delete(\`/brands/\${id}\`)).data;

// --- MOTORCYCLES ---
export const getMotorcycles = async () => (await api.get<Motorcycle[]>('/motorcycles')).data;
export const createMotorcycle = async (data: Omit<Motorcycle, 'id'>) => (await api.post('/motorcycles', data)).data;
export const updateMotorcycle = async (id: string, data: Partial<Motorcycle>) => (await api.put(\`/motorcycles/\${id}\`, data)).data;
export const deleteMotorcycle = async (id: string) => (await api.delete(\`/motorcycles/\${id}\`)).data;

// --- REVIEWS ---
export const getReviews = async () => (await api.get<Review[]>('/reviews')).data;
export const createReview = async (data: Omit<Review, 'id'>) => (await api.post('/reviews', data)).data;
export const updateReview = async (id: string, data: Partial<Review>) => (await api.put(\`/reviews/\${id}\`, data)).data;
export const deleteReview = async (id: string) => (await api.delete(\`/reviews/\${id}\`)).data;`;

// 3. Components: Bottom Nav (Sesuai Fitur Real)
const bottomNavComp = `import React from 'react';
import { FaHome, FaBoxOpen, FaPlus, FaList, FaTags } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_20px_-2px_rgba(0,0,0,0.05)] pb-safe h-[70px] z-50 flex items-center justify-around px-2">
      <Link to="/" className={\`flex flex-col items-center gap-1 p-2 \${isActive('/') ? 'text-blue-600' : 'text-gray-400'}\`}>
        <FaHome size={20} />
        <span className="text-[10px] font-medium">Home</span>
      </Link>
      
      <Link to="/manage/brands" className={\`flex flex-col items-center gap-1 p-2 \${isActive('/manage/brands') ? 'text-blue-600' : 'text-gray-400'}\`}>
        <FaTags size={20} />
        <span className="text-[10px] font-medium">Brands</span>
      </Link>

      {/* Tombol Jual (Manage Motor) */}
      <Link to="/manage/motorcycles" className="relative -top-5">
        <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white transform active:scale-95 transition">
          <FaPlus size={24} />
        </div>
      </Link>

      <Link to="/manage/reviews" className={\`flex flex-col items-center gap-1 p-2 \${isActive('/manage/reviews') ? 'text-blue-600' : 'text-gray-400'}\`}>
        <FaList size={20} />
        <span className="text-[10px] font-medium">Reviews</span>
      </Link>
    </nav>
  );
};

export default BottomNav;`;

// 4. Page: Home (Real Data Only)
const homePage = `import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMotorcycles, getBrands } from '../services/apiServices';
import { FaSearch, FaMapMarkerAlt, FaRoad } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Home = () => {
  const { data: motors, isLoading: loadMotors } = useQuery({ queryKey: ['motorcycles'], queryFn: getMotorcycles });
  const { data: brands, isLoading: loadBrands } = useQuery({ queryKey: ['brands'], queryFn: getBrands });
  
  const [search, setSearch] = useState('');

  // Filter Client-Side (Karena backend belum support filter params)
  const filteredMotors = motors?.filter(m => 
    m.model_name.toLowerCase().includes(search.toLowerCase()) ||
    m.brands?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 pb-24">
      {/* Header / Search */}
      <div className="sticky top-0 bg-[#FAFAFA] z-30 py-2 mb-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">MotoMarket</h1>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Cari motor..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-gray-200 shadow-sm focus:outline-none focus:border-blue-600"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Brands (Real Data) */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-lg text-gray-800">Brands</h2>
        </div>
        {loadBrands ? (
          <div className="flex gap-2"><div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div></div>
        ) : (
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {brands?.map((brand) => (
              <div key={brand.id} className="flex flex-col items-center gap-2 min-w-[70px] cursor-pointer" onClick={() => setSearch(brand.name)}>
                <div className="w-16 h-16 rounded-full bg-white border border-gray-100 flex items-center justify-center p-2 shadow-sm hover:border-blue-600 transition">
                  <img src={brand.logo_url} alt={brand.name} className="w-full h-full object-contain" />
                </div>
                <span className="text-xs font-medium text-gray-600">{brand.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Listing Motors (Real Data) */}
      <div>
        <h2 className="font-bold text-lg text-gray-800 mb-4">Motor Terbaru</h2>
        
        {loadMotors ? (
          <div className="text-center py-10">Loading...</div>
        ) : filteredMotors?.length === 0 ? (
          <div className="text-center py-10 text-gray-500">Tidak ada motor ditemukan.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredMotors?.map((motor) => (
              <Link to={\`/motor/\${motor.id}\`} key={motor.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition">
                <div className="aspect-[4/3] bg-gray-100 relative">
                  <img 
                    src={motor.logo_url} 
                    alt={motor.model_name} 
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image' }} 
                  />
                  <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold uppercase">
                    {motor.brands?.name || 'Motor'}
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 truncate">{motor.model_name}</h3>
                  <p className="text-blue-600 font-bold mt-1">Rp {Number(motor.price).toLocaleString()}</p>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
                    <FaRoad />
                    <span className="truncate">{motor.specs}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;`;

// 5. Page: Detail Motor (Real Data + Reviews)
const detailPage = `import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMotorcycles, getReviews, createReview } from '../services/apiServices';
import { FaArrowLeft, FaStar, FaUserCircle } from 'react-icons/fa';

const DetailMotor = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { data: motors } = useQuery({ queryKey: ['motorcycles'], queryFn: getMotorcycles });
  const { data: reviews } = useQuery({ queryKey: ['reviews'], queryFn: getReviews });
  
  const [reviewForm, setReviewForm] = useState({ reviewer_name: '', comment: '', rating: 5 });

  const motor = motors?.find(m => m.id === id);
  // Filter Review manual sesuai ID motor
  const motorReviews = reviews?.filter(r => r.motorcycle_id === id);

  const mutation = useMutation({
    mutationFn: (e: React.FormEvent) => {
      e.preventDefault();
      return createReview({ ...reviewForm, motorcycle_id: id || '' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      setReviewForm({ reviewer_name: '', comment: '', rating: 5 });
      alert('Review berhasil dikirim!');
    }
  });

  if (!motor) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="pb-24 bg-white min-h-screen">
      {/* Header Image */}
      <div className="relative w-full aspect-[4/3] md:aspect-video bg-gray-100">
        <div className="absolute top-4 left-4 z-10">
          <Link to="/" className="w-10 h-10 rounded-full bg-white/50 backdrop-blur flex items-center justify-center text-gray-800 hover:bg-white transition">
            <FaArrowLeft />
          </Link>
        </div>
        <img src={motor.logo_url} alt={motor.model_name} className="w-full h-full object-cover" />
      </div>

      <div className="p-5 max-w-4xl mx-auto -mt-6 bg-white rounded-t-3xl relative z-10">
        {/* Info Utama */}
        <div className="mb-6">
          <span className="text-sm font-medium text-blue-600 mb-1 block">{motor.brands?.name}</span>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{motor.model_name}</h1>
          <h2 className="text-3xl font-bold text-blue-600">Rp {Number(motor.price).toLocaleString()}</h2>
        </div>

        {/* Specs */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-8">
          <h3 className="font-bold text-gray-800 mb-2">Spesifikasi</h3>
          <p className="text-gray-600 leading-relaxed">{motor.specs}</p>
        </div>

        {/* Reviews Section */}
        <div className="mb-8">
          <h3 className="font-bold text-xl text-gray-800 mb-4 flex items-center gap-2">
            Ulasan Pembeli <span className="text-sm font-normal text-gray-500">({motorReviews?.length || 0})</span>
          </h3>

          <div className="space-y-4 mb-6">
            {motorReviews?.length === 0 ? (
              <p className="text-gray-500 italic">Belum ada ulasan.</p>
            ) : (
              motorReviews?.map((rev) => (
                <div key={rev.id} className="border-b border-gray-100 pb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <FaUserCircle className="text-gray-300 text-xl" />
                      <span className="font-bold text-sm">{rev.reviewer_name}</span>
                    </div>
                    <div className="flex text-yellow-400 text-xs">
                      {[...Array(rev.rating)].map((_, i) => <FaStar key={i} />)}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mt-2">{rev.comment}</p>
                </div>
              ))
            )}
          </div>

          {/* Form Add Review */}
          <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
            <h4 className="font-bold text-sm mb-3">Tulis Ulasan</h4>
            <form onSubmit={mutation.mutate} className="space-y-3">
              <input 
                placeholder="Nama Anda" 
                value={reviewForm.reviewer_name} 
                onChange={e => setReviewForm({...reviewForm, reviewer_name: e.target.value})} 
                className="w-full border p-2 rounded-lg text-sm" 
                required 
              />
              <div className="flex items-center gap-2">
                <span className="text-sm">Rating:</span>
                <input 
                  type="number" min="1" max="5" 
                  value={reviewForm.rating} 
                  onChange={e => setReviewForm({...reviewForm, rating: Number(e.target.value)})} 
                  className="border p-2 rounded-lg w-16 text-sm" 
                />
                <FaStar className="text-yellow-400" />
              </div>
              <textarea 
                placeholder="Komentar..." 
                value={reviewForm.comment} 
                onChange={e => setReviewForm({...reviewForm, comment: e.target.value})} 
                className="w-full border p-2 rounded-lg text-sm h-20" 
                required 
              />
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg text-sm hover:bg-blue-700">
                Kirim Review
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailMotor;`;

// 6. App Router
const appTsx = `import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BottomNav from './components/BottomNav';
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
        <div className="min-h-screen bg-[#FAFAFA] font-sans text-gray-800">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/motor/:id" element={<DetailMotor />} />
            <Route path="/manage/brands" element={<Brands />} />
            <Route path="/manage/motorcycles" element={<Motorcycles />} />
            <Route path="/manage/reviews" element={<Reviews />} />
          </Routes>
          <BottomNav />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;`;

// Write Files
const files = {
  'src/types/index.ts': typesIndex,
  'src/services/apiServices.ts': apiServices,
  'src/components/BottomNav.tsx': bottomNavComp,
  'src/pages/Home.tsx': homePage,
  'src/pages/DetailMotor.tsx': detailPage,
  'src/App.tsx': appTsx
};

Object.entries(files).forEach(([filePath, content]) => {
  const absolutePath = path.join(__dirname, filePath);
  const dir = path.dirname(absolutePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(absolutePath, content, 'utf8');
  console.log(`Fixed: ${filePath}`);
});

console.log('✅ Project Fixed: No fake pages, sync with backend!');