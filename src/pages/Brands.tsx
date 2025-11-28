import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBrands, createBrand, deleteBrand, updateBrand } from '../services/apiServices';
import ActionModal, { type ModalType } from '../components/ActionModal';
import type { Brand } from '../types';
import { FaTrash, FaEdit, FaPlus, FaImage } from 'react-icons/fa';

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
    <div className="max-w-6xl mx-auto p-6 min-h-screen pb-24">
      <ActionModal onClose={closeModal} {...modal} isLoading={mutation.isPending || handleDeleteMutation.isPending} />
      
      <div className="flex items-center justify-between mb-8">
         <h1 className="font-heading font-extrabold text-3xl text-gray-900">Manajemen Brand</h1>
         <span className="bg-blue-50 text-primary px-4 py-2 rounded-full text-sm font-bold">{brands?.length || 0} Brands</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl shadow-soft border border-gray-100 sticky top-24">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
               {editingId ? <><FaEdit className="text-orange-500"/> Edit Brand</> : <><FaPlus className="text-primary"/> Tambah Brand</>}
            </h2>
            <form onSubmit={mutation.mutate} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 ml-1 mb-1 block">NAMA BRAND</label>
                <input placeholder="Contoh: Yamaha" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20" required />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 ml-1 mb-1 block">NEGARA ASAL</label>
                <input placeholder="Contoh: Jepang" value={form.country} onChange={e => setForm({...form, country: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20" required />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 ml-1 mb-1 block">URL LOGO</label>
                <div className="flex gap-2">
                   <div className="flex-1 relative">
                     <FaImage className="absolute left-3 top-3.5 text-gray-400"/>
                     <input placeholder="https://..." value={form.logo_url} onChange={e => setForm({...form, logo_url: e.target.value})} className="w-full bg-gray-50 border-none rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary/20" required />
                   </div>
                </div>
              </div>
              <button type="submit" className={`w-full text-white font-bold py-3 rounded-xl transition ${editingId ? 'bg-orange-500' : 'bg-primary shadow-lg shadow-primary/30 hover:bg-blue-700'}`}>
                 {editingId ? 'Update' : 'Simpan'}
              </button>
              {editingId && (
                  <button type="button" onClick={() => { setEditingId(null); setForm({name:'', country:'', logo_url:''}) }} className="w-full bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200">Batal</button>
              )}
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="text-center py-10">Loading data...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {brands?.map((brand) => (
                <div key={brand.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition group flex flex-col items-center text-center relative">
                   <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center p-3 mb-3 group-hover:scale-110 transition duration-300 border border-gray-100">
                      <img src={brand.logo_url} alt={brand.name} className="w-full h-full object-contain" />
                   </div>
                   <h3 className="font-bold text-gray-900">{brand.name}</h3>
                   <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded mt-1">{brand.country}</span>
                   
                   <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button onClick={() => handleEdit(brand)} className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-100"><FaEdit size={12}/></button>
                      <button onClick={() => confirmDelete(brand.id)} className="w-8 h-8 bg-red-50 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-100"><FaTrash size={12}/></button>
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Brands;