import { Link, useLocation } from 'react-router-dom';
import { FaPlus, FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          
          {/* 1. Logo Section */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-lg md:text-xl shadow-glow transition-transform group-hover:scale-105">
                M
              </div>
              <span className="font-heading font-extrabold text-xl md:text-2xl text-textPrimary tracking-tight group-hover:text-primary transition-colors">
                MotoMarket
              </span>
            </Link>
          </div>

          {/* 3. Desktop Menu (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-6 ml-auto">
            <Link 
              to="/" 
              className={`text-sm font-semibold transition-colors ${isActive('/') ? 'text-primary' : 'text-textSecondary hover:text-primary'}`}
            >
              Home
            </Link>
            <Link 
              to="/manage/brands" 
              className={`text-sm font-semibold transition-colors ${isActive('/manage/brands') ? 'text-primary' : 'text-textSecondary hover:text-primary'}`}
            >
              Brands
            </Link>
            <Link 
              to="/manage/reviews" 
              className={`text-sm font-semibold transition-colors ${isActive('/manage/reviews') ? 'text-primary' : 'text-textSecondary hover:text-primary'}`}
            >
              Reviews
            </Link>
            
            <div className="h-6 w-px bg-border mx-2"></div>
            
            {/* Tombol Jual */}
            <Link 
              to="/manage/motorcycles" 
              className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-primary/20 hover:bg-accent hover:shadow-accent/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              <FaPlus size={14} /> Jual Motor
            </Link>

            {/* Profile Avatar */}
            <Link 
              to="/profile" 
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${isActive('/profile') ? 'bg-primary text-white border-primary shadow-glow' : 'bg-background text-textSecondary border-border hover:border-primary hover:text-primary'}`}
            >
              <FaUserCircle size={24} />
            </Link>
          </div>

          {/* 4. Mobile Menu Button (Only Notification & Logo visible on mobile navbar) */}
          <div className="flex md:hidden items-center gap-4">
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
