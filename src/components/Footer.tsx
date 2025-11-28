import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8 hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">M</div>
              <span className="font-heading font-bold text-xl text-textPrimary">MotoMarket</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Platform jual beli motor terpercaya dengan ribuan pilihan motor berkualitas. 
              Temukan motor impianmu atau jual motor lamamu dengan mudah.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<FaFacebook />} />
              <SocialIcon icon={<FaInstagram />} />
              <SocialIcon icon={<FaTwitter />} />
              <SocialIcon icon={<FaYoutube />} />
            </div>
          </div>

          {/* Links Column */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Jelajahi</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><Link to="/" className="hover:text-primary transition">Motor Baru</Link></li>
              <li><Link to="/" className="hover:text-primary transition">Motor Bekas</Link></li>
              <li><Link to="/manage/brands" className="hover:text-primary transition">Daftar Brand</Link></li>
              <li><Link to="/manage/reviews" className="hover:text-primary transition">Review Pembeli</Link></li>
            </ul>
          </div>

          {/* Links Column */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Layanan</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href="#" className="hover:text-primary transition">Cara Jual</a></li>
              <li><a href="#" className="hover:text-primary transition">Cara Beli</a></li>
              <li><a href="#" className="hover:text-primary transition">Cek Fisik</a></li>
              <li><a href="#" className="hover:text-primary transition">Pengiriman</a></li>
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Berlangganan</h4>
            <p className="text-gray-500 text-sm mb-4">Dapatkan info motor terbaru via email.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email anda" 
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:border-primary"
              />
              <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition">
                Ok
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; 2024 MotoMarket Indonesia. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-2 md:mt-0">
            Made with <FaHeart className="text-red-400" /> by You
          </p>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon }: { icon: React.ReactNode }) => (
  <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-all duration-300">
    {icon}
  </a>
);

export default Footer;