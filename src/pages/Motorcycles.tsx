import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMotorcycles, createMotorcycle, updateMotorcycle, deleteMotorcycle, getBrands } from '../services/apiServices';
import ActionModal, { type ModalType } from '../components/ActionModal';
import type { Motorcycle } from '../types';
import { FaTrash, FaEdit, FaPlus, FaMotorcycle, FaFileAlt, FaImage, FaUndo, FaSearch } from 'react-icons/fa';

const Motorcycles = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ model_name: '', specs: '', price: '', brand_id: '', logo_url: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // State Modal
  const [modal, setModal] = useState({
    isOpen: false, type: 'success' as ModalType, title: '', message: '', onConfirm: () => {}
  });
  const closeModal = () => setModal(prev => ({ ...prev, isOpen: false }));

  const { data: motors, isLoading: loadMotors } = useQuery({ queryKey: ['motorcycles'], queryFn: getMotorcycles });
  const { data: brands } = useQuery({ queryKey: ['brands'], queryFn: getBrands });

  const filteredMotors = motors?.filter(m => m.model_name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Mutation Create/Update
  const mutation = useMutation({
    mutationFn: (e: React.FormEvent) => {
      e.preventDefault();
      if (editingId) return updateMotorcycle(editingId, form);
      return createMotorcycle(form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motorcycles'] });
      resetForm();
      setModal({ isOpen: true, type: 'success', title: 'Berhasil', message: editingId ? "Data motor berhasil diperbarui!" : "Listing motor berhasil ditambahkan!", onConfirm: closeModal });
    },
    onError: () => setModal({ isOpen: true, type: 'error', title: 'Gagal', message: 'Gagal menyimpan data motor.', onConfirm: closeModal })
  });

  // Mutation Delete
  const handleDelete = useMutation({
    mutationFn: deleteMotorcycle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['motorcycles'] });
      setModal({ isOpen: true, type: 'success', title: 'Terhapus', message: 'Listing motor telah dihapus.', onConfirm: closeModal });
    },
    onError: () => setModal({ isOpen: true, type: 'error', title: 'Gagal', message: 'Gagal menghapus motor.', onConfirm: closeModal })
  });

  const confirmDelete = (id: string) => {
    setModal({
      isOpen: true,
      type: 'delete',
      title: 'Hapus Listing?',
      message: 'Apakah Anda yakin ingin menghapus motor ini dari daftar jual?',
      onConfirm: () => handleDelete.mutate(id),
    });
  };

  const resetForm = () => {
    setForm({ model_name: '', specs: '', price: '', brand_id: '', logo_url: '' });
    setEditingId(null);
  };

  const handleEdit = (motor: Motorcycle) => {
    setEditingId(motor.id);
    setForm({ model_name: motor.model_name, specs: motor.specs, price: motor.price.toString(), brand_id: motor.brand_id, logo_url: motor.logo_url });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 min-h-screen pb-24">
      <ActionModal onClose={closeModal} {...modal} isLoading={mutation.isPending || handleDelete.isPending} />

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
         <div>
           <h1 className="font-heading font-extrabold text-3xl text-gray-900">Manajemen Stok</h1>
           <p className="text-gray-500 text-sm mt-1">Kelola listing, update harga, atau hapus stok.</p>
         </div>
         <div className="relative">
            <input type="text" placeholder="Cari stok..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 rounded-full bg-white border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 outline-none shadow-sm w-full md:w-64" />
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs"/>
         </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl shadow-soft border border-gray-100 sticky top-24">
            <h2 className={`font-bold text-lg mb-6 flex items-center gap-2 pb-4 border-b border-gray-50 ${editingId ? 'text-orange-500' : 'text-primary'}`}>
               {editingId ? <><FaEdit/> Mode Edit Data</> : <><FaPlus/> Tambah Stok Baru</>}
            </h2>
            <form onSubmit={mutation.mutate} className="space-y-4">
              {/* Form inputs sama seperti sebelumnya */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 ml-1 mb-1 block tracking-wider">NAMA MODEL</label>
                <div className="relative group">
                  <FaMotorcycle className="absolute left-4 top-3.5 text-gray-400"/>
                  <input placeholder="Contoh: Honda PCX 160" value={form.model_name} onChange={e => setForm({...form, model_name: e.target.value})} className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-primary rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-gray-700 focus:ring-4 focus:ring-primary/10 transition outline-none" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 ml-1 mb-1 block tracking-wider">HARGA (Rp)</label>
                  <input type="number" placeholder="0" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-primary rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-4 focus:ring-primary/10 transition outline-none" required />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 ml-1 mb-1 block tracking-wider">BRAND</label>
                  <select value={form.brand_id} onChange={e => setForm({...form, brand_id: e.target.value})} className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-primary rounded-xl px-3 py-3 text-sm font-bold text-gray-700 focus:ring-4 focus:ring-primary/10 transition outline-none" required>
                    <option value="">Pilih...</option>
                    {brands?.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 ml-1 mb-1 block tracking-wider">SPESIFIKASI</label>
                <div className="relative group">
                  <FaFileAlt className="absolute left-4 top-3.5 text-gray-400"/>
                  <input placeholder="Contoh: 160cc, ABS, Keyless" value={form.specs} onChange={e => setForm({...form, specs: e.target.value})} className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-primary rounded-xl pl-10 pr-4 py-3 text-sm font-medium text-gray-600 focus:ring-4 focus:ring-primary/10 transition outline-none" required />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 ml-1 mb-1 block tracking-wider">FOTO URL</label>
                <div className="relative group">
                  <FaImage className="absolute left-4 top-3.5 text-gray-400"/>
                  <input placeholder="https://..." value={form.logo_url} onChange={e => setForm({...form, logo_url: e.target.value})} className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-primary rounded-xl pl-10 pr-4 py-3 text-xs font-medium text-blue-600 truncate focus:ring-4 focus:ring-primary/10 transition outline-none" required />
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <button type="submit" disabled={mutation.isPending} className={`flex-1 text-white font-bold py-3.5 rounded-xl transition shadow-lg flex items-center justify-center gap-2 ${editingId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-primary hover:bg-blue-700'}`}>
                   {mutation.isPending ? 'Processing...' : (editingId ? 'Update Data' : 'Simpan Listing')}
                </button>
                {editingId && (
                  <button type="button" onClick={resetForm} className="px-4 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition flex items-center justify-center"><FaUndo/></button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2">
          {loadMotors ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">{[1,2,3,4].map(i => <div key={i} className="h-64 bg-gray-100 rounded-3xl animate-pulse"></div>)}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredMotors?.map((motor) => (
                <div key={motor.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col relative h-full">
                   <div className="relative h-56 bg-gray-100 overflow-hidden">
                      <img src={motor.logo_url} alt={motor.model_name} className="w-full h-full object-cover transition duration-700 ease-out" onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image' }} />
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-widest text-gray-800 shadow-sm z-10 pointer-events-none">{motor.brands?.name || 'Motor'}</div>
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4 z-20 backdrop-blur-[2px]">
                         <button onClick={() => handleEdit(motor)} className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-xl transform hover:scale-110 active:scale-95"><FaEdit size={20}/></button>
                         <button onClick={() => confirmDelete(motor.id)} className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xl transform hover:scale-110 active:scale-95"><FaTrash size={20}/></button>
                      </div>
                   </div>
                   <div className="p-5 flex-1 flex flex-col justify-between">
                     <div><h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{motor.model_name}</h3><p className="text-gray-500 text-xs line-clamp-2 h-8">{motor.specs}</p></div>
                     <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-end">
                        <div><p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Harga Jual</p><span className="text-primary font-extrabold text-xl">Rp {Number(motor.price).toLocaleString('id-ID')}</span></div>
                        <button onClick={() => handleEdit(motor)} className="lg:hidden text-xs font-bold text-blue-500 bg-blue-50 px-3 py-1.5 rounded-lg">Edit</button>
                     </div>
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

export default Motorcycles;