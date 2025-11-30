import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBrands, createBrand, deleteBrand, updateBrand } from '../services/apiServices';
import ActionModal, { type ModalType } from '../components/ActionModal';
import type { Brand } from '../types';
import { FaEdit, FaPlus, FaImage, FaGlobe } from 'react-icons/fa';

const Brands = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: '', country: '', logo_url: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // State Modal
  const [modal, setModal] = useState({
    isOpen: false, type: 'success' as ModalType, title: '', message: '', onConfirm: () => {}
  });
  const closeModal = () => setModal(prev => ({ ...prev, isOpen: false }));

  const { data: brands, isLoading } = useQuery({ queryKey: ['brands'], queryFn: getBrands });

  // Create/Update
  const mutation = useMutation({
    mutationFn: (e: React.FormEvent) => {
      e.preventDefault();
      if (editingId) return updateBrand(editingId, form);
      return createBrand(form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      setForm({ name: '', country: '', logo_url: '' });
      setEditingId(null);
      setModal({ isOpen: true, type: 'success', title: 'Berhasil!', message: 'Data Brand berhasil disimpan.', onConfirm: closeModal });
    },
    onError: () => setModal({ isOpen: true, type: 'error', title: 'Gagal', message: 'Terjadi kesalahan saat menyimpan.', onConfirm: closeModal })
  });

  // Delete
  const handleDeleteMutation = useMutation({
    mutationFn: deleteBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      setModal({ isOpen: true, type: 'success', title: 'Terhapus', message: 'Brand berhasil dihapus dari sistem.', onConfirm: closeModal });
    },
    onError: () => setModal({ isOpen: true, type: 'error', title: 'Gagal Hapus', message: 'Brand mungkin sedang digunakan oleh data motor.', onConfirm: closeModal })
  });

  // Trigger Modal Hapus
  const confirmDelete = (id: string) => {
    setModal({
      isOpen: true,
      type: 'delete',
      title: 'Hapus Brand?',
      message: 'Tindakan ini tidak dapat dibatalkan. Pastikan tidak ada motor yang menggunakan brand ini.',
      onConfirm: () => handleDeleteMutation.mutate(id),
    });
  };

  const handleEdit = (brand: Brand) => {
    setEditingId(brand.id);
    setForm({ name: brand.name, country: brand.country, logo_url: brand.logo_url });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <ActionModal onClose={closeModal} {...modal} isLoading={mutation.isPending || handleDeleteMutation.isPending} />
      
      <div className="max-w-6xl mx-auto p-6 min-h-screen pb-24" data-aos="fade-in">
        <div className="flex items-center justify-between mb-10" data-aos="fade-up">
         <div>
            <h1 className="font-heading font-extrabold text-3xl text-textPrimary">Manajemen Brand</h1>
            <p className="text-textSecondary text-sm mt-2">Atur daftar pabrikan motor yang tersedia.</p>
         </div>
         <span className="bg-blue-50 text-accent px-5 py-2 rounded-full text-sm font-bold border border-blue-100 shadow-sm">{brands?.length || 0} Brands</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1" data-aos="fade-up" data-aos-delay="100">
          <div className="bg-white p-8 rounded-[2rem] shadow-card border border-border sticky top-24">
            <h2 className="font-heading font-bold text-xl mb-6 flex items-center gap-3 pb-4 border-b border-border">
               {editingId ? <><FaEdit className="text-warning"/> Edit Brand</> : <><FaPlus className="text-primary"/> Tambah Brand</>}
            </h2>
            <form onSubmit={mutation.mutate} className="space-y-5">
              <div>
                <label className="text-[10px] font-bold text-textSecondary ml-1 mb-1.5 block tracking-wider uppercase">Nama Brand</label>
                <input placeholder="Contoh: Yamaha" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-background border border-transparent focus:bg-white focus:border-accent rounded-xl px-4 py-3 text-sm font-bold text-textPrimary focus:ring-4 focus:ring-accent/10 transition outline-none" required />
              </div>
              <div>
                <label className="text-[10px] font-bold text-textSecondary ml-1 mb-1.5 block tracking-wider uppercase">Negara Asal</label>
                <div className="relative group">
                   <FaGlobe className="absolute left-4 top-3.5 text-textSecondary group-focus-within:text-accent transition-colors"/>
                   <input placeholder="Contoh: Jepang" value={form.country} onChange={e => setForm({...form, country: e.target.value})} className="w-full bg-background border border-transparent focus:bg-white focus:border-accent rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-textPrimary focus:ring-4 focus:ring-accent/10 transition outline-none" required />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-textSecondary ml-1 mb-1.5 block tracking-wider uppercase">URL Logo</label>
                <div className="relative group">
                   <FaImage className="absolute left-4 top-3.5 text-textSecondary group-focus-within:text-accent transition-colors"/>
                   <input placeholder="https://..." value={form.logo_url} onChange={e => setForm({...form, logo_url: e.target.value})} className="w-full bg-background border border-transparent focus:bg-white focus:border-accent rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-textPrimary focus:ring-4 focus:ring-accent/10 transition outline-none" required />
                </div>
              </div>
              <button type="submit" className={`w-full text-white font-bold py-3.5 rounded-xl transition shadow-lg transform active:scale-95 ${editingId ? 'bg-warning hover:bg-yellow-600 shadow-warning/30' : 'bg-primary shadow-primary/30 hover:bg-accent'}`}>
                 {editingId ? 'Update Brand' : 'Simpan Brand'}
              </button>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2" data-aos="fade-up" data-aos-delay="200">
          {isLoading ? (
             <div className="grid grid-cols-2 gap-4">{[1,2,3,4].map(i => <div key={i} className="h-40 bg-gray-100 rounded-3xl animate-pulse"></div>)}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {brands?.map((brand) => (
                <div key={brand.id} className="bg-white p-6 rounded-[2rem] border border-border shadow-sm hover:shadow-card-hover transition-all duration-300 group flex items-center gap-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-[3rem] -z-0 opacity-50 group-hover:opacity-100 transition"></div>
                  
                  <div className="w-20 h-20 bg-white rounded-2xl border border-border p-3 flex items-center justify-center shadow-sm z-10">
                    <img src={brand.logo_url} alt={brand.name} className="w-full h-full object-contain" />
                  </div>
                  
                  <div className="flex-1 z-10">
                    <h3 className="font-heading font-bold text-lg text-textPrimary">{brand.name}</h3>
                    <p className="text-textSecondary text-xs mb-3 flex items-center gap-1"><FaGlobe size={10}/> {brand.country}</p>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(brand)} className="px-3 py-1.5 rounded-lg bg-blue-50 text-accent text-xs font-bold hover:bg-accent hover:text-white transition">Edit</button>
                      <button onClick={() => confirmDelete(brand.id)} className="px-3 py-1.5 rounded-lg bg-red-50 text-danger text-xs font-bold hover:bg-danger hover:text-white transition">Hapus</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
};

export default Brands;
