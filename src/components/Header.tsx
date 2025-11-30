import { FaSearch, FaBell, FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className='sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border shadow-sm'>
      {/* Mobile Header */}
      <div className='md:hidden flex items-center justify-between p-4'>
        <div className='font-heading font-bold text-xl text-primary flex items-center gap-2'>
           MotoMarket
        </div>
        <button className='text-textPrimary p-2 hover:bg-gray-100 rounded-full transition'>
          <FaBell size={20} />
        </button>
      </div>

      {/* Desktop Header */}
      <div className='hidden md:flex container mx-auto px-6 py-4 items-center justify-between'>
        <Link to='/' className='font-heading font-bold text-2xl text-primary'>MotoMarket</Link>
        
        {/* Desktop Search */}
        <div className='flex-1 max-w-xl mx-8 relative'>
          <input 
            type='text' 
            placeholder='Cari motor impianmu...' 
            className='w-full pl-12 pr-4 py-3 rounded-full bg-background border border-border focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition'
          />
          <FaSearch className='absolute left-4 top-1/2 -translate-y-1/2 text-textSecondary' />
        </div>

        <div className='flex items-center gap-6'>
          <Link to='/manage/motorcycles' className='font-medium text-textSecondary hover:text-primary transition'>Jual Motor</Link>
          <div className='w-px h-6 bg-border'></div>
          <button className='flex items-center gap-2 font-medium text-textPrimary hover:text-primary'>
            <FaUserCircle size={24} />
            <span>Masuk</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
