import React from 'react';
import { FaInstagram, FaGithub, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-border pt-20 pb-10 hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-glow">M</div>
              <span className="font-heading font-bold text-2xl text-textPrimary">MotoMarket</span>
            </div>
            <p className="text-textSecondary text-sm leading-relaxed mb-8 max-w-md">
              Platform jual beli motor terpercaya dengan ribuan pilihan motor berkualitas. 
              Temukan motor impianmu atau jual motor lamamu dengan mudah dan aman.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<FaGithub />} href="https://github.com" />
              <SocialIcon icon={<FaInstagram />} href="https://instagram.com" />
              <SocialIcon icon={<FaLinkedin />} href="https://linkedin.com" />
            </div>
          </div>

          {/* Links Column */}
          <div className="md:pl-20">
            <h4 className="font-heading font-bold text-textPrimary text-lg mb-6">Jelajahi</h4>
            <ul className="space-y-4 text-sm text-textSecondary">
              <li><Link to="/" className="hover:text-accent transition-colors">Motor Baru</Link></li>
              <li><Link to="/manage/brands" className="hover:text-accent transition-colors">Daftar Brand</Link></li>
              <li><Link to="/manage/reviews" className="hover:text-accent transition-colors">Review Pembeli</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-center items-center text-sm text-textSecondary">
          <p>&copy; 2025 MotoMarket Indonesia. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ icon, href }: { icon: React.ReactNode, href: string }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-textSecondary hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 hover:-translate-y-1">
    {icon}
  </a>
);

export default Footer;
