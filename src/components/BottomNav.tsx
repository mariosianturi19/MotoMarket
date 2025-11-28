import { FaHome, FaPlus, FaList, FaTags } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 pb-safe h-[70px] z-50 flex items-center justify-around px-4 shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
      <Link to="/" className={`flex flex-col items-center gap-1 p-2 transition duration-300 ${isActive('/') ? 'text-primary scale-105' : 'text-gray-400'}`}>
        <FaHome size={22} />
        <span className="text-[10px] font-semibold">Home</span>
      </Link>
      
      <Link to="/manage/brands" className={`flex flex-col items-center gap-1 p-2 transition duration-300 ${isActive('/manage/brands') ? 'text-primary scale-105' : 'text-gray-400'}`}>
        <FaTags size={20} />
        <span className="text-[10px] font-semibold">Brands</span>
      </Link>

      {/* Floating Action Button untuk 'Jual' */}
      <Link to="/manage/motorcycles" className="relative -top-6">
        <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/40 border-[4px] border-white transform active:scale-90 transition duration-300">
          <FaPlus size={24} />
        </div>
      </Link>

      <Link to="/manage/reviews" className={`flex flex-col items-center gap-1 p-2 transition duration-300 ${isActive('/manage/reviews') ? 'text-primary scale-105' : 'text-gray-400'}`}>
        <FaList size={20} />
        <span className="text-[10px] font-semibold">Ulasan</span>
      </Link>
    </nav>
  );
};

export default BottomNav;