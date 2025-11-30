import React from 'react';
import { FaUser, FaCode, FaInfoCircle, FaGithub, FaLinkedin, FaEnvelope, FaReact, FaNodeJs } from 'react-icons/fa';
import { SiTypescript, SiTailwindcss, SiVite, SiReactquery } from 'react-icons/si';

const Profile = () => {
  return (
    <div className="min-h-screen pb-24" data-aos="fade-in">
      {/* Hero Section */}
      <div className="relative bg-white border-b border-border overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-white -z-10 parallax-bg"></div>
        <div className="max-w-5xl mx-auto px-6 py-20 text-center" data-aos="fade-up">
          <span className="text-accent font-bold tracking-widest text-xs mb-4 bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100 uppercase">
            Developer Profile
          </span>
          <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-textPrimary mb-6 leading-tight">
            Meet the Creator & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Explore the Project
            </span>
          </h1>
          <p className="text-textSecondary text-lg max-w-2xl mx-auto leading-relaxed">
            Mengenal lebih dekat pembuat MotoMarket dan teknologi modern yang digunakan di balik layar.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Creator Card */}
          <div className="md:col-span-1" data-aos="fade-up" data-aos-delay="200">
            <div className="bg-white rounded-[2rem] p-8 shadow-card border border-border sticky top-24 text-center">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary to-accent rounded-full p-1 mb-6 shadow-glow">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
                   <FaUser className="text-6xl text-gray-300" />
                   {/* Jika ada foto profil asli, ganti FaUser dengan <img> */}
                   {/* <img src="/path/to/photo.jpg" alt="Mario Sianturi" className="w-full h-full object-cover" /> */}
                </div>
              </div>
              
              <h2 className="font-heading font-bold text-2xl text-textPrimary mb-1">Mario Sianturi</h2>
              <p className="text-accent font-medium text-sm mb-6">Fullstack Developer</p>
              
              <div className="flex justify-center gap-4 mb-8">
                <SocialLink href="https://github.com/mariosianturi19" icon={<FaGithub />} />
                <SocialLink href="#" icon={<FaLinkedin />} />
                <SocialLink href="mailto:email@example.com" icon={<FaEnvelope />} />
              </div>

              <div className="text-left space-y-4">
                <InfoItem label="NIM" value="22000000" />
                <InfoItem label="Jurusan" value="Teknik Informatika" />
                <InfoItem label="Universitas" value="Universitas Mikroskil" />
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="md:col-span-2 space-y-8" data-aos="fade-up" data-aos-delay="300">
            
            {/* About Project */}
            <section className="bg-white rounded-[2rem] p-8 shadow-card border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-accent">
                  <FaInfoCircle size={20} />
                </div>
                <h3 className="font-heading font-bold text-xl text-textPrimary">Tentang Project</h3>
              </div>
              <p className="text-textSecondary leading-relaxed mb-4">
                <strong className="text-textPrimary">MotoMarket</strong> adalah platform marketplace modern yang dirancang khusus untuk jual beli sepeda motor. 
                Project ini dibuat untuk memenuhi tugas mata kuliah Pemrograman Web Lanjut, sekaligus mendemonstrasikan kemampuan dalam membangun aplikasi web yang responsif, interaktif, dan user-friendly.
              </p>
              <p className="text-textSecondary leading-relaxed">
                Fitur utama mencakup manajemen stok motor (CRUD), manajemen brand, sistem ulasan pengguna, dan tampilan detail produk yang komprehensif.
              </p>
            </section>

            {/* Tech Stack */}
            <section className="bg-white rounded-[2rem] p-8 shadow-card border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                  <FaCode size={20} />
                </div>
                <h3 className="font-heading font-bold text-xl text-textPrimary">Tech Stack</h3>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <TechCard icon={<FaReact className="text-[#61DAFB]" />} name="React" desc="Frontend Library" />
                <TechCard icon={<SiTypescript className="text-[#3178C6]" />} name="TypeScript" desc="Type Safety" />
                <TechCard icon={<SiTailwindcss className="text-[#06B6D4]" />} name="Tailwind CSS" desc="Styling Engine" />
                <TechCard icon={<SiVite className="text-[#646CFF]" />} name="Vite" desc="Build Tool" />
                <TechCard icon={<SiReactquery className="text-[#FF4154]" />} name="TanStack Query" desc="Data Fetching" />
                <TechCard icon={<FaNodeJs className="text-[#339933]" />} name="Node.js" desc="Backend Runtime" />
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

const SocialLink = ({ href, icon }: { href: string; icon: React.ReactNode }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
    className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-textSecondary hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 hover:-translate-y-1"
  >
    {icon}
  </a>
);

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center py-3 border-b border-border last:border-0">
    <span className="text-xs font-bold text-textSecondary uppercase tracking-wider">{label}</span>
    <span className="text-sm font-bold text-textPrimary">{value}</span>
  </div>
);

const TechCard = ({ icon, name, desc }: { icon: React.ReactNode; name: string; desc: string }) => (
  <div className="p-4 rounded-2xl bg-background border border-border flex flex-col items-center text-center hover:border-accent hover:shadow-sm transition-all duration-300 group">
    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">{icon}</div>
    <h4 className="font-bold text-textPrimary text-sm">{name}</h4>
    <p className="text-xs text-textSecondary">{desc}</p>
  </div>
);

export default Profile;
