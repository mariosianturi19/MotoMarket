import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMotorcycles, getBrands } from '../services/apiServices';
import { FaSearch, FaFilter, FaArrowRight, FaStar } from 'react-icons/fa';
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
    <div className="min-h-screen pb-24 md:pb-12">
      {/* --- HERO SECTION (Desktop Only) --- */}
      <div className="hidden md:block relative bg-white border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-white -z-10 parallax-bg"></div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-50 to-transparent opacity-50 parallax-bg"></div>
        
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col items-center text-center relative z-10" data-aos="fade-in">
          <span className="text-accent font-bold tracking-widest text-xs mb-4 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100 uppercase" data-aos="fade-up">Marketplace Motor No. #1</span>
          <h1 className="font-heading font-extrabold text-5xl md:text-6xl text-textPrimary mb-4 leading-tight tracking-tight" data-aos="fade-up" data-aos-delay="100">
            Jual Beli Motor <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Lebih Mudah & Aman</span>
          </h1>
          <p className="text-textSecondary text-lg max-w-2xl mb-8 leading-relaxed" data-aos="fade-up" data-aos-delay="200">
            Temukan ribuan motor berkualitas dengan harga terbaik. Transaksi aman, cepat, dan terpercaya.
          </p>
          
          {/* Main Search Bar Desktop */}
          <div className="relative w-full max-w-3xl group" data-aos="zoom-in" data-aos-delay="300">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
            <div className="relative flex items-center bg-white rounded-2xl shadow-card p-2 border border-border">
              <FaSearch className="text-textSecondary ml-5 text-xl" />
              <input 
                type="text" 
                placeholder="Cari motor impianmu (contoh: Yamaha NMAX)..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-5 py-4 bg-transparent outline-none text-textPrimary placeholder-textSecondary text-lg font-medium"
              />
              <button className="bg-primary hover:bg-accent text-white px-10 py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 hover:shadow-accent/30 text-lg">
                Cari
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- MOBILE SEARCH HEADER (Mobile Only) --- */}
      <div className="md:hidden sticky top-0 z-40 glass border-b border-border px-4 py-3 shadow-sm">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Cari motor..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-background border-none focus:ring-2 focus:ring-accent/20 transition text-sm font-medium text-textPrimary"
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-textSecondary" />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-textSecondary p-2 bg-white rounded-lg shadow-sm">
            <FaFilter size={14} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 md:mt-16">
        
        {/* --- CATEGORIES / BRANDS --- */}
        <section className="mb-16" data-aos="fade-up" data-aos-delay="400">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="font-heading font-bold text-2xl md:text-3xl text-textPrimary">Brand Populer</h2>
              <p className="text-textSecondary text-sm mt-2 hidden md:block">Pilih motor berdasarkan pabrikan favoritmu</p>
            </div>
            <button className="text-accent text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all group">
              Lihat Semua <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          {loadBrands ? (
             <div className="flex gap-4 overflow-hidden">
               {[1,2,3,4,5,6].map(i => <div key={i} className="w-24 h-32 bg-gray-100 rounded-2xl animate-pulse"></div>)}
             </div>
          ) : (
            <div className="flex gap-4 md:gap-8 overflow-x-auto no-scrollbar pb-6 snap-x">
              <button onClick={() => setSearch('')} className="snap-start flex flex-col items-center gap-3 min-w-[90px] group cursor-pointer">
                <div className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl md:rounded-3xl flex items-center justify-center border transition-all duration-300 ${search === '' ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30 transform scale-105' : 'bg-white border-border text-textSecondary hover:border-accent hover:text-accent hover:shadow-md'}`}>
                  <span className="font-bold text-xs md:text-sm">ALL</span>
                </div>
                <span className="text-xs md:text-sm font-bold text-textSecondary group-hover:text-primary transition-colors">Semua</span>
              </button>

              {brands?.map((brand) => (
                <button 
                  key={brand.id} 
                  onClick={() => setSearch(brand.name)}
                  className="snap-start flex flex-col items-center gap-3 min-w-[90px] group cursor-pointer"
                >
                  <div className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl md:rounded-3xl bg-white border border-border flex items-center justify-center p-3 md:p-5 transition-all duration-300 group-hover:shadow-lg group-hover:border-accent group-hover:-translate-y-1 ${search === brand.name ? 'ring-2 ring-accent border-accent shadow-lg' : ''}`}>
                    <img src={brand.logo_url} alt={brand.name} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition duration-300" />
                  </div>
                  <span className={`text-xs md:text-sm font-bold transition-colors ${search === brand.name ? 'text-accent' : 'text-textSecondary group-hover:text-primary'}`}>
                    {brand.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* --- LISTING MOTOR --- */}
        <section data-aos="fade-up" data-aos-delay="500">
          <div className="flex justify-between items-center mb-8">
             <h2 className="font-heading font-bold text-2xl md:text-3xl text-textPrimary">Rekomendasi Pilihan</h2>
             <div className="hidden md:flex gap-2">
                <button className="px-4 py-2 rounded-lg border border-border text-sm font-bold text-textSecondary hover:bg-background transition">Terbaru</button>
                <button className="px-4 py-2 rounded-lg border border-border text-sm font-bold text-textSecondary hover:bg-background transition">Termurah</button>
             </div>
          </div>

          {loadMotors ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} className="bg-white rounded-3xl h-80 animate-pulse border border-gray-100"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {filteredMotors?.map((motor) => (
                <Link to={`/motor/${motor.id}`} key={motor.id} className="group bg-white rounded-3xl border border-border overflow-hidden hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 flex flex-col">
                  <div className="relative aspect-[4/3] bg-gray-50 p-6 flex items-center justify-center overflow-hidden">
                    <img 
                      src={motor.logo_url} 
                      alt={motor.model_name} 
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition duration-500" 
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-textPrimary shadow-sm border border-white/50">
                      {motor.brands?.name}
                    </div>
                    {/* Badge Stok Terbatas (Dummy) */}
                    {Math.random() > 0.7 && (
                      <div className="absolute top-3 left-3 bg-danger text-white px-2 py-1 rounded-lg text-[10px] font-bold shadow-sm">
                        Hot Deal
                      </div>
                    )}
                  </div>
                  
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-heading font-bold text-textPrimary text-lg leading-tight line-clamp-2 group-hover:text-accent transition-colors">
                        {motor.model_name}
                      </h3>
                    </div>
                    
                    <div className="flex items-center gap-1 mb-4">
                       <FaStar className="text-warning text-xs" />
                       <span className="text-xs font-bold text-textPrimary">4.8</span>
                       <span className="text-xs text-textSecondary">(12 Review)</span>
                    </div>

                    <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-textSecondary font-semibold uppercase tracking-wider">Harga Mulai</span>
                        <span className="font-heading font-extrabold text-primary text-lg">
                          Rp {Number(motor.price).toLocaleString('id-ID')}
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-textSecondary group-hover:bg-accent group-hover:text-white transition-colors">
                        <FaArrowRight size={12} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!loadMotors && filteredMotors?.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-border">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="font-heading font-bold text-xl text-textPrimary mb-2">Motor tidak ditemukan</h3>
              <p className="text-textSecondary">Coba cari dengan kata kunci lain atau cek ejaanmu.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
