// src/pages/PropertyOwnerDashboard.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Calendar, DollarSign, Eye, Edit2, Trash2,
  MapPin, Bath, Bed, Square, Star, X
} from 'lucide-react';

import { auth, db, storage, serverTimestamp } from "../firebase";
import {
  addDoc, collection, doc, updateDoc, deleteDoc,
  onSnapshot, query, where, orderBy
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

/* ----------------------- helpers ----------------------- */
async function uploadPropertyImages(uid, propId, files, onProgress) {
  const urls = [];
  for (const file of files || []) {
    const path = `property_images/${uid}/${propId}/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, path);
    const task = uploadBytesResumable(storageRef, file);
    await new Promise((resolve, reject) => {
      task.on('state_changed', s => {
        const pct = Math.round((s.bytesTransferred / s.totalBytes) * 100);
        onProgress?.({ file: file.name, pct });
      }, reject, async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        urls.push(url);
        resolve();
      });
    });
  }
  return urls;
}

async function createProperty(data) {
  const uid = auth.currentUser.uid;
  // 1) create doc to get ID
  const docRef = await addDoc(collection(db, 'properties'), {
    ownerId: uid,
    title: data.title,
    location: data.location,
    price: data.price,
    bedrooms: data.bedrooms,
    bathrooms: data.bathrooms,
    sqft: data.sqft || 0,
    description: data.description || '',
    amenities: data.amenities || [],
    images: [],
    status: 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // 2) upload images
  let urls = [];
  if (data.files?.length) {
    urls = await uploadPropertyImages(uid, docRef.id, data.files, data.onProgress);
  } else if (data.imageUrl) {
    urls = [data.imageUrl];
  }

  // 3) patch URLs
  await updateDoc(docRef, { images: urls, updatedAt: serverTimestamp() });
  return docRef.id;
}

// [FIXED] Deleted the broken 'makeMeHost' function and <button> that was here

async function updateProperty(propId, data) {
  const uid = auth.currentUser.uid;

  let urls = data.existingImages || [];
  if (data.files?.length) {
    const more = await uploadPropertyImages(uid, propId, data.files, data.onProgress);
    urls = [...urls, ...more];
  } else if (data.imageUrl && !urls.length) {
    urls = [data.imageUrl];
  }

  await updateDoc(doc(db, 'properties', propId), {
    title: data.title,
    location: data.location,
    price: data.price,
    bedrooms: data.bedrooms,
    bathrooms: data.bathrooms,
    sqft: data.sqft || 0,
    description: data.description || '',
    amenities: data.amenities || [],
    images: urls,
    updatedAt: serverTimestamp(),
  });
}

/* ----------------------- modal ----------------------- */
const PropertyFormModal = ({ open, mode, initialData, amenities, onClose, onSave }) => {
  const [form, setForm] = useState({
    title: '', location: '', price: '', bedrooms: 1, bathrooms: 1,
    sqft: '', description: '', amenities: [], imageUrl: ''
  });
  const [files, setFiles] = useState([]);
  const firstFieldRef = useRef(null);

  useEffect(() => {
    if (open) {
      const f = initialData || {};
      setForm({
        title: f.title || '',
        location: f.location || '',
        price: f.price != null ? String(f.price) : '',
        bedrooms: f.bedrooms || 1,
        bathrooms: f.bathrooms || 1,
        sqft: f.sqft != null ? String(f.sqft) : '',
        description: f.description || '',
        amenities: Array.isArray(f.amenities) ? f.amenities : [],
        imageUrl: f.images?.[0] || ''
      });
      setFiles([]);
      setTimeout(() => firstFieldRef.current?.focus(), 0);
    }
  }, [open, initialData]);

  const toggleAmenity = (a) =>
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(a)
        ? prev.amenities.filter((x) => x !== a)
        : [...prev.amenities, a]
    }));

  const submit = (e) => {
    e?.preventDefault();
    if (!form.title || !form.location || !form.price) {
      alert('Please fill in title, location, and price.');
      return;
    }
    onSave({
      title: form.title.trim(),
      location: form.location.trim(),
      price: parseInt(form.price || 0, 10),
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      sqft: parseInt(form.sqft || 0, 10),
      description: form.description.trim(),
      amenities: form.amenities,
      imageUrl: form.imageUrl,
      files
    });
  };

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <form onSubmit={submit} className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-xl border">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">{mode === 'edit' ? 'Edit Property' : 'Add Property'}</h2>
          <button type="button" onClick={onClose} className="p-2 rounded hover:bg-gray-100" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium mb-1">Property Title *</label>
            <input
              ref={firstFieldRef}
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Luxury Duplex in Lekki"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Location *</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Lekki Phase 1, Lagos"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price per Night (₦) *</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="250000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Square Feet</label>
              <input
                type="number"
                value={form.sqft}
                onChange={(e) => setForm({ ...form, sqft: e.target.value })}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="3200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Bedrooms</label>
              <select
                value={form.bedrooms}
                onChange={(e) => setForm({ ...form, bedrooms: parseInt(e.target.value) })}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              >
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Bathrooms</label>
              <select
                value={form.bathrooms}
                onChange={(e) => setForm({ ...form, bathrooms: parseInt(e.target.value) })}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              >
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your property..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Amenities</label>
            <div className="grid grid-cols-3 gap-2">
              {amenities.map((a) => (
                <label key={a} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.amenities.includes(a)}
                    onChange={() => toggleAmenity(a)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">{a}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Main Image URL (optional)</label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Upload Photos (up to 10)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files).slice(0,10))}
              className="w-full p-3 border rounded-md"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-4 border-t">
          <button type="button" onClick={onClose} className="px-5 py-2 rounded-md bg-gray-100 hover:bg-gray-200">
            Cancel
          </button>
          <button type="submit" className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
            {mode === 'edit' ? 'Save Changes' : 'Add Property'}
          </button>
        </div>
      </form>
    </div>
  );
};

/* ----------------------- main dashboard ----------------------- */
const PropertyOwnerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [properties, setProperties] = useState([]);
  const [uploadPct, setUploadPct] = useState(null);

  const amenitiesList = useMemo(
    () => ['WiFi','Air Conditioning','Kitchen','Parking','Swimming Pool','Gym','Security','Generator','Balcony','Garden','Driver','Chef'],
    []
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [editingId, setEditingId] = useState(null);
  const [initialFormData, setInitialFormData] = useState(null);

  // realtime: only this user's properties
  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const q = query(
      collection(db, 'properties'),
      where('ownerId', '==', uid),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      setProperties(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const openAdd = () => {
    setModalMode('add'); setInitialFormData(null); setEditingId(null); setModalOpen(true);
  };
  const openEdit = (p) => {
    setModalMode('edit'); setInitialFormData(p); setEditingId(p.id); setModalOpen(true);
  };

  const handleModalSave = async (formData) => {
    try {
      if (modalMode === 'add') {
        await createProperty({ ...formData, onProgress: ({ pct }) => setUploadPct(pct) });
      } else {
        await updateProperty(editingId, {
          ...formData,
          existingImages: initialFormData?.images || [],
          onProgress: ({ pct }) => setUploadPct(pct)
        });
      }
      setModalOpen(false);
      setEditingId(null);
      setUploadPct(null);
    } catch (e) {
      console.error(e);
      alert('Failed to save property: ' + e.message);
    }
  };

  const handleDeleteProperty = async (id) => {
    if (confirm('Delete this property?')) {
      await deleteDoc(doc(db, 'properties', id));
      // (optional) also delete Storage images for the property folder
    }
  };

  const totalRevenue = properties.reduce((sum, p) => sum + (p.revenue || 0), 0);
  const totalBookings = properties.reduce((sum, p) => sum + (p.bookings || 0), 0);
  const avgRating = properties.length ? (properties.reduce((s, p) => s + (p.rating || 0), 0) / properties.length) : 0;
  const totalViews = properties.reduce((s, p) => s + (p.views || 0), 0);

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">₦{totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-blue-600">{totalBookings}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-yellow-600">{avgRating.toFixed(1)}</p>
            </div>
            <Star className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-purple-600">{totalViews}</p>
            </div>
            <Eye className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderProperties = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Properties</h2>
        <button
          onClick={openAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <Plus size={20} />
          <span>Add Property</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((p) => (
          <div key={p.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <img src={p.images?.[0]} alt={p.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{p.title}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  p.status === 'active' ? 'bg-green-100 text-green-800' :
                  p.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>{p.status || 'pending'}</span>
              </div>
              <p className="text-gray-600 text-sm mb-2 flex items-center"><MapPin size={14} className="mr-1" />{p.location}</p>
              <p className="text-blue-600 font-bold text-lg mb-3">₦{(p.price||0).toLocaleString()}/night</p>
              <div className="flex justify-between text-sm text-gray-600 mb-3">
                <span className="flex items-center"><Bed size={14} className="mr-1" />{p.bedrooms}</span>
                <span className="flex items-center"><Bath size={14} className="mr-1" />{p.bathrooms}</span>
                <span className="flex items-center"><Square size={14} className="mr-1" />{p.sqft} sqft</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => openEdit(p)}
                  className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200 flex items-center justify-center"
                >
                  <Edit2 size={14} className="mr-1" /> Edit
                </button>
                <button
                  onClick={() => handleDeleteProperty(p.id)}
                  className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded text-sm hover:bg-red-200 flex items-center justify-center"
                >
                  <Trash2 size={14} className="mr-1" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 onClick={() => navigate('/')} className="cursor-pointer text-xl font-bold text-blue-700">
                🏡 ShortLet
              </h1>
              <span className="text-gray-500">|</span>
              <button className={`px-3 py-1 rounded ${activeTab==='overview'?'bg-blue-600 text-white':'bg-gray-100'}`} onClick={()=>setActiveTab('overview')}>Overview</button>
              <button className={`px-3 py-1 rounded ${activeTab==='properties'?'bg-blue-600 text-white':'bg-gray-100'}`} onClick={()=>setActiveTab('properties')}>Properties</button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {activeTab === 'overview' ? renderOverview() : renderProperties()}
      </main>

      {modalOpen && (
        <PropertyFormModal
          open={modalOpen}
          mode={modalMode}
          initialData={initialFormData}
          amenities={amenitiesList}
          onClose={() => setModalOpen(false)}
          onSave={handleModalSave}
        />
      )}

      {uploadPct != null && (
        <div className="fixed bottom-4 right-4 bg-white border shadow rounded px-4 py-2">
          Uploading… {uploadPct}%
        </div>
      )}
    </div>
  );
};

export default PropertyOwnerDashboard;