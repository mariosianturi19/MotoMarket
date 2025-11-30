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
    <>
      <ActionModal onClose={closeModal} {...modal} isLoading={mutation.isPending || handleDelete.isPending} />
      
      <div className="max-w-7xl mx-auto p-4 md:p-8 min-h-screen pb-24" data-aos="fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6" data-aos="fade-up">
         <div>
           <h1 className="font-heading font-extrabold text-3xl text-textPrimary">Manajemen Stok</h1>
           <p className="text-textSecondary text-sm mt-2">Kelola listing, update harga, atau hapus stok.</p>
         </div>
         <div className="relative w-full md:w-auto">
            <input type="text" placeholder="Cari stok..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-11 pr-4 py-3 rounded-xl bg-white border border-border text-sm focus:ring-2 focus:ring-accent/20 outline-none shadow-sm w-full md:w-72 transition-all" />
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-textSecondary text-xs"/>
         </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1" data-aos="fade-up" data-aos-delay="100">
          <div className="bg-white p-8 rounded-[2rem] shadow-card border border-border sticky top-24">
            <h2 className={`font-heading font-bold text-xl mb-6 flex items-center gap-3 pb-4 border-b border-border ${editingId ? 'text-warning' : 'text-primary'}`}>
               {editingId ? <><FaEdit/> Mode Edit Data</> : <><FaPlus/> Tambah Stok Baru</>}
            </h2>
            <form onSubmit={mutation.mutate} className="space-y-5">
              <div>
                <label className="text-[10px] font-bold text-textSecondary ml-1 mb-1.5 block tracking-wider uppercase">Nama Model</label>
                <div className="relative group">
                  <FaMotorcycle className="absolute left-4 top-3.5 text-textSecondary group-focus-within:text-accent transition-colors"/>
                  <input placeholder="Contoh: Honda PCX 160" value={form.model_name} onChange={e => setForm({...form, model_name: e.target.value})} className="w-full bg-background border border-transparent focus:bg-white focus:border-accent rounded-xl pl-11 pr-4 py-3 text-sm font-bold text-textPrimary focus:ring-4 focus:ring-accent/10 transition outline-none" required />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-textSecondary ml-1 mb-1.5 block tracking-wider uppercase">Spesifikasi</label>
                <div className="relative group">
                  <FaFileAlt className="absolute left-4 top-3.5 text-textSecondary group-focus-within:text-accent transition-colors"/>
                  <textarea placeholder="Jelaskan kondisi mesin, kilometer, dll..." value={form.specs} onChange={e => setForm({...form, specs: e.target.value})} className="w-full bg-background border border-transparent focus:bg-white focus:border-accent rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-textPrimary focus:ring-4 focus:ring-accent/10 transition outline-none min-h-[100px]" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-textSecondary ml-1 mb-1.5 block tracking-wider uppercase">Harga (Rp)</label>
                  <input type="number" placeholder="0" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full bg-background border border-transparent focus:bg-white focus:border-accent rounded-xl px-4 py-3 text-sm font-bold text-textPrimary focus:ring-4 focus:ring-accent/10 transition outline-none" required />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-textSecondary ml-1 mb-1.5 block tracking-wider uppercase">Brand</label>
                  <select value={form.brand_id} onChange={e => setForm({...form, brand_id: e.target.value})} className="w-full bg-background border border-transparent focus:bg-white focus:border-accent rounded-xl px-4 py-3 text-sm font-bold text-textPrimary focus:ring-4 focus:ring-accent/10 transition outline-none appearance-none" required>
                    <option value="">Pilih Brand</option>
                    {brands?.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-textSecondary ml-1 mb-1.5 block tracking-wider uppercase">URL Gambar</label>
                <div className="relative group">
                  <FaImage className="absolute left-4 top-3.5 text-textSecondary group-focus-within:text-accent transition-colors"/>
                  <input placeholder="https://..." value={form.logo_url} onChange={e => setForm({...form, logo_url: e.target.value})} className="w-full bg-background border border-transparent focus:bg-white focus:border-accent rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-textPrimary focus:ring-4 focus:ring-accent/10 transition outline-none" required />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                {editingId && (
                  <button type="button" onClick={resetForm} className="px-4 py-3 rounded-xl bg-gray-100 text-textSecondary font-bold hover:bg-gray-200 transition">
                    <FaUndo/>
                  </button>
                )}
                <button type="submit" className={`flex-1 text-white font-bold py-3.5 rounded-xl transition shadow-lg transform active:scale-95 ${editingId ? 'bg-warning hover:bg-yellow-600 shadow-warning/30' : 'bg-primary hover:bg-accent shadow-primary/30'}`}>
                   {editingId ? 'Update Data' : 'Simpan Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2 space-y-4" data-aos="fade-up" data-aos-delay="200">
          {loadMotors ? (
            [1,2,3].map(i => <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse"></div>)
          ) : filteredMotors?.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-border">
               <p className="text-textSecondary font-medium">Belum ada data motor.</p>
            </div>
          ) : (
            filteredMotors?.map((motor) => (
              <div key={motor.id} className="bg-white p-4 rounded-3xl border border-border shadow-sm hover:shadow-card-hover transition-all duration-300 flex gap-4 group">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-50 rounded-2xl flex-shrink-0 p-2 border border-border">
                  <img src={motor.logo_url} alt={motor.model_name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition duration-500" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-heading font-bold text-textPrimary text-lg">{motor.model_name}</h3>
                      <span className="text-[10px] font-bold bg-blue-50 text-accent px-2 py-1 rounded-lg border border-blue-100">{motor.brands?.name}</span>
                    </div>
                    <p className="text-textSecondary text-xs mt-1 line-clamp-2">{motor.specs}</p>
                  </div>
                  <div className="flex items-end justify-between mt-3">
                    <span className="font-heading font-extrabold text-primary text-lg">Rp {Number(motor.price).toLocaleString('id-ID')}</span>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(motor)} className="p-2 rounded-xl bg-blue-50 text-accent hover:bg-accent hover:text-white transition shadow-sm"><FaEdit size={14}/></button>
                      <button onClick={() => confirmDelete(motor.id)} className="p-2 rounded-xl bg-red-50 text-danger hover:bg-danger hover:text-white transition shadow-sm"><FaTrash size={14}/></button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        </div>
      </div>
    </>
  );
};export default Motorcycles;
