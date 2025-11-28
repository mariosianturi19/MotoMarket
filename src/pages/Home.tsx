import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMotorcycles, getBrands } from '../services/apiServices';
import { FaSearch, FaMapMarkerAlt, FaFilter, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Home = () => {
  const { data: motors, isLoading: loadMotors } = useQuery({ queryKey: ['motorcycles'], queryFn: getMotorcycles });
  const { data: brands, isLoading: loadBrands } = useQuery({ queryKey: ['brands'], queryFn: getBrands });
  
  const [search, setSearch] = useState('');

  const filteredMotors = motors?.filter(m => 
    m.model_name.toLowerCase().includes(search.toLowerCase()) ||
    m.brands?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24 md:pb-12">
      {/* --- HERO SECTION (Desktop Only) --- */}
      <div className="hidden md:block relative bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center text-center">
          <span className="text-primary font-bold tracking-wider text-sm mb-3 bg-blue-50 px-3 py-1 rounded-full">MARKETPLACE MOTOR NO. #1</span>
          <h1 className="font-heading font-extrabold text-5xl text-gray-900 mb-6 leading-tight">
            Jual Beli Motor <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Lebih Mudah & Aman</span>
          </h1>
          
          {/* Main Search Bar Desktop */}
          <div className="relative w-full max-w-2xl mt-4 group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-200"></div>
            <div className="relative flex items-center bg-white rounded-xl shadow-sm p-2 border border-gray-100">
              <FaSearch className="text-gray-400 ml-4 text-lg" />
              <input 
                type="text" 
                placeholder="Cari motor impianmu (contoh: Yamaha NMAX)..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-3 bg-transparent outline-none text-gray-700 placeholder-gray-400"
              />
              <button className="bg-primary hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold transition shadow-md">
                Cari
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- MOBILE SEARCH HEADER (Mobile Only) --- */}
      <div className="md:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Cari motor..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-100 border-none focus:ring-2 focus:ring-primary/20 transition text-sm font-medium"
          />
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 p-1">
            <FaFilter size={14} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 md:mt-12">
        
        {/* --- CATEGORIES / BRANDS --- */}
        <section className="mb-12">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="font-heading font-bold text-xl md:text-2xl text-gray-900">Brand Populer</h2>
              <p className="text-gray-500 text-sm mt-1 hidden md:block">Pilih motor berdasarkan pabrikan favoritmu</p>
            </div>
            <button className="text-primary text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
              Lihat Semua <FaArrowRight size={12} />
            </button>
          </div>
          
          {loadBrands ? (
             <div className="flex gap-4 overflow-hidden">
               {[1,2,3,4,5,6].map(i => <div key={i} className="w-24 h-28 bg-gray-200 rounded-xl animate-pulse"></div>)}
             </div>
          ) : (
            <div className="flex gap-3 md:gap-6 overflow-x-auto no-scrollbar pb-4 snap-x">
              <button onClick={() => setSearch('')} className="snap-start flex flex-col items-center gap-3 min-w-[80px] group cursor-pointer">
                <div className={`w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-3xl flex items-center justify-center border transition-all duration-300 ${search === '' ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30 transform scale-105' : 'bg-white border-gray-200 text-gray-400 hover:border-primary hover:text-primary'}`}>
                  <span className="font-bold text-xs md:text-sm">ALL</span>
                </div>
                <span className="text-xs md:text-sm font-semibold text-gray-600">Semua</span>
              </button>

              {brands?.map((brand) => (
                <button 
                  key={brand.id} 
                  onClick={() => setSearch(brand.name)}
                  className="snap-start flex flex-col items-center gap-3 min-w-[80px] group cursor-pointer"
                >
                  <div className={`w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-3xl bg-white border border-gray-200 flex items-center justify-center p-2 md:p-4 transition-all duration-300 group-hover:shadow-md group-hover:border-primary ${search === brand.name ? 'ring-2 ring-primary border-primary shadow-md' : ''}`}>
                    <img src={brand.logo_url} alt={brand.name} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition duration-300" />
                  </div>
                  <span className="text-xs md:text-sm font-semibold text-gray-600 group-hover:text-primary transition">{brand.name}</span>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* --- LISTING GRID --- */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <h2 className="font-heading font-bold text-xl md:text-2xl text-gray-900">Rekomendasi Terbaru</h2>
            <div className="h-px flex-1 bg-gray-200 ml-4 hidden md:block"></div>
          </div>
          
          {loadMotors ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1,2,3,4].map(i => <div key={i} className="h-80 bg-gray-200 rounded-2xl animate-pulse"></div>)}
             </div>
          ) : filteredMotors?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl mb-4">🔍</div>
              <p className="text-gray-500 font-medium">Tidak ada motor ditemukan.</p>
              <button onClick={() => setSearch('')} className="mt-4 text-primary font-bold hover:underline">Reset Pencarian</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMotors?.map((motor) => (
                <Link 
                  to={`/motor/${motor.id}`} 
                  key={motor.id} 
                  className="group bg-white rounded-2xl border border-gray-100 hover:border-primary/20 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full"
                >
                  {/* Image Container */}
                  <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                    <img 
                      src={motor.logo_url} 
                      alt={motor.model_name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-out"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image' }} 
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-widest text-gray-900 shadow-sm z-10">
                      {motor.brands?.name || 'Motor'}
                    </div>
                    {/* Overlay Gradient on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="mb-auto">
                      <h3 className="font-heading font-bold text-gray-900 text-lg leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {motor.model_name}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                         <span className="bg-blue-50 text-primary text-[10px] font-bold px-2 py-1 rounded">2023</span>
                         <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-1 rounded">5.000 KM</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-50">
                      <p className="text-primary font-bold text-xl mb-1">
                        Rp {Number(motor.price).toLocaleString('id-ID')}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <FaMapMarkerAlt className="text-gray-300" />
                        <span>Jakarta Selatan</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;