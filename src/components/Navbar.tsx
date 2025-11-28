import { Link, useLocation } from 'react-router-dom';
import { FaSearch, FaPlus, FaBell, FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          
          {/* 1. Logo Section */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-lg shadow-primary/30">
                M
              </div>
              <span className="font-heading font-extrabold text-xl md:text-2xl text-textPrimary tracking-tight">
                MotoMarket
              </span>
            </Link>
          </div>

          {/* 2. Search Bar (Hidden on Mobile, Visible on Desktop) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8 relative group">
            <input 
              type="text" 
              placeholder="Cari motor impianmu di sini..." 
              className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 outline-none text-sm font-medium"
            />
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
          </div>

          {/* 3. Desktop Menu (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className={`text-sm font-semibold transition-colors ${isActive('/') ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}
            >
              Home
            </Link>
            <Link 
              to="/manage/brands" 
              className={`text-sm font-semibold transition-colors ${isActive('/manage/brands') ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}
            >
              Brands
            </Link>
            <Link 
              to="/manage/reviews" 
              className={`text-sm font-semibold transition-colors ${isActive('/manage/reviews') ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}
            >
              Reviews
            </Link>
            
            <div className="h-6 w-px bg-gray-200 mx-2"></div>

            <button className="text-gray-500 hover:text-primary transition">
              <FaBell size={20} />
            </button>
            
            {/* Tombol Jual */}
            <Link 
              to="/manage/motorcycles" 
              className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-primary/30 hover:bg-blue-700 hover:scale-105 transition-all duration-300"
            >
              <FaPlus size={14} /> Jual Motor
            </Link>

            {/* Profile Avatar */}
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200 cursor-pointer hover:border-primary transition">
              <FaUserCircle size={24} />
            </div>
          </div>

          {/* 4. Mobile Menu Button (Only Notification & Logo visible on mobile navbar) */}
          <div className="flex md:hidden items-center gap-4">
            <button className="text-gray-500 p-2">
              <FaBell size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;