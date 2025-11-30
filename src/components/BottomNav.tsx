import { FaHome, FaPlus, FaList, FaTags, FaUser } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-white/20 pb-safe h-[80px] z-50 flex items-center justify-around px-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] rounded-t-3xl">
      <Link to="/" className={`flex flex-col items-center gap-1.5 p-2 transition-all duration-300 ${isActive('/') ? 'text-primary -translate-y-1' : 'text-textSecondary hover:text-primary'}`}>
        <FaHome size={22} className={isActive('/') ? 'drop-shadow-md' : ''} />
        <span className={`text-[10px] font-bold ${isActive('/') ? 'opacity-100' : 'opacity-70'}`}>Home</span>
      </Link>
      
      <Link to="/manage/brands" className={`flex flex-col items-center gap-1.5 p-2 transition-all duration-300 ${isActive('/manage/brands') ? 'text-primary -translate-y-1' : 'text-textSecondary hover:text-primary'}`}>
        <FaTags size={20} className={isActive('/manage/brands') ? 'drop-shadow-md' : ''} />
        <span className={`text-[10px] font-bold ${isActive('/manage/brands') ? 'opacity-100' : 'opacity-70'}`}>Brands</span>
      </Link>

      {/* Floating Action Button untuk 'Jual' */}
      <Link to="/manage/motorcycles" className="relative -top-8 group">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white shadow-glow border-[6px] border-white transform group-active:scale-95 transition-all duration-300 group-hover:bg-accent group-hover:-translate-y-1">
          <FaPlus size={24} />
        </div>
      </Link>

      <Link to="/manage/reviews" className={`flex flex-col items-center gap-1.5 p-2 transition-all duration-300 ${isActive('/manage/reviews') ? 'text-primary -translate-y-1' : 'text-textSecondary hover:text-primary'}`}>
        <FaList size={20} className={isActive('/manage/reviews') ? 'drop-shadow-md' : ''} />
        <span className={`text-[10px] font-bold ${isActive('/manage/reviews') ? 'opacity-100' : 'opacity-70'}`}>Ulasan</span>
      </Link>

      <Link to="/profile" className={`flex flex-col items-center gap-1.5 p-2 transition-all duration-300 ${isActive('/profile') ? 'text-primary -translate-y-1' : 'text-textSecondary hover:text-primary'}`}>
        <FaUser size={20} className={isActive('/profile') ? 'drop-shadow-md' : ''} />
        <span className={`text-[10px] font-bold ${isActive('/profile') ? 'opacity-100' : 'opacity-70'}`}>Profile</span>
      </Link>
    </nav>
  );
};

export default BottomNav;
