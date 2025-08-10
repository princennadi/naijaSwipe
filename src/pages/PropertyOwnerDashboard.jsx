import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Home,
  Calendar,
  MessageSquare,
  DollarSign,
  Eye,
  Edit2,
  Trash2,
  MapPin,
  Bath,
  Bed,
  Square,
  Star,
  TrendingUp,
  X
} from 'lucide-react';

/* ---------- Reusable Add/Edit Modal ---------- */
const PropertyFormModal = ({ open, mode, initialData, amenities, onClose, onSave }) => {
  const [form, setForm] = useState({
    title: '',
    location: '',
    price: '',
    bedrooms: 1,
    bathrooms: 1,
    sqft: '',
    description: '',
    amenities: [],
    imageUrl: ''
  });

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
        imageUrl: f.images && f.images[0] ? f.images[0] : ''
      });
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

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!form.title || !form.location || !form.price) {
      alert('Please fill in all required fields');
      return;
    }
    onSave({
      title: form.title.trim(),
      location: form.location.trim(),
      price: parseInt(form.price, 10),
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      sqft: parseInt(form.sqft || 0, 10),
      description: form.description.trim(),
      amenities: form.amenities,
      images: form.imageUrl ? [form.imageUrl.trim()] : []
    });
  };

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-xl border"
      >
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
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Bathrooms</label>
              <select
                value={form.bathrooms}
                onChange={(e) => setForm({ ...form, bathrooms: parseInt(e.target.value) })}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
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
            <label className="block text-sm font-medium mb-1">Main Image URL</label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="https://..."
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

/* ---------- Main Dashboard ---------- */
const PropertyOwnerDashboard = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [properties, setProperties] = useState([
    {
      id: 1,
      title: 'Luxury Duplex',
      location: 'Lekki, Lagos',
      price: 250000,
      status: 'active',
      bedrooms: 3,
      bathrooms: 2,
      sqft: 3200,
      images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'],
      bookings: 12,
      revenue: 3000000,
      rating: 4.8,
      views: 245,
      likes: 67,
      description: 'Bright duplex in the heart of Lekki.',
      amenities: ['WiFi', 'Air Conditioning', 'Security', 'Generator']
    },
    {
      id: 2,
      title: 'Modern Apartment',
      location: 'Ikoyi, Lagos',
      price: 180000,
      status: 'active',
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1800,
      images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80'],
      bookings: 8,
      revenue: 1440000,
      rating: 4.6,
      views: 189,
      likes: 43,
      description: 'Cozy modern apartment with city views.',
      amenities: ['WiFi', 'Kitchen', 'Parking']
    }
  ]);

  const amenitiesList = useMemo(
    () => ['WiFi', 'Air Conditioning', 'Kitchen', 'Parking', 'Swimming Pool', 'Gym', 'Security', 'Generator', 'Balcony', 'Garden', 'Driver', 'Chef'],
    []
  );

  // Shared modal state for Add/Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [editingId, setEditingId] = useState(null);
  const [initialFormData, setInitialFormData] = useState(null);

  const openAdd = () => {
    setModalMode('add');
    setInitialFormData(null);
    setEditingId(null);
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setModalMode('edit');
    setInitialFormData(p);
    setEditingId(p.id);
    setModalOpen(true);
  };

  const handleModalSave = (data) => {
    if (modalMode === 'add') {
      const property = {
        id: Date.now(),
        ...data,
        status: 'active',
        bookings: 0,
        revenue: 0,
        rating: 0,
        views: 0,
        likes: 0,
        images:
          data.images && data.images.length
            ? data.images
            : ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80']
      };
      setProperties((prev) => [...prev, property]);
    } else {
      setProperties((prev) => prev.map((p) => (p.id === editingId ? { ...p, ...data } : p)));
    }
    setModalOpen(false);
    setEditingId(null);
  };

  const handleDeleteProperty = (id) => {
    if (confirm('Are you sure you want to delete this property?')) {
      setProperties((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const totalRevenue = properties.reduce((sum, p) => sum + (p.revenue || 0), 0);
  const totalBookings = properties.reduce((sum, p) => sum + (p.bookings || 0), 0);
  const avgRating = properties.length > 0 ? properties.reduce((sum, p) => sum + (p.rating || 0), 0) / properties.length : 0;
  const totalViews = properties.reduce((sum, p) => sum + (p.views || 0), 0);

  /* ---------- Sections ---------- */
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
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

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <p className="text-sm">New booking for Luxury Duplex - ₦250,000</p>
            <span className="text-xs text-gray-500 ml-auto">2 hours ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <p className="text-sm">Modern Apartment received a 5-star review</p>
            <span className="text-xs text-gray-500 ml-auto">5 hours ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <p className="text-sm">Luxury Duplex was viewed 23 times today</p>
            <span className="text-xs text-gray-500 ml-auto">1 day ago</span>
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
        {properties.map((property) => (
          <div key={property.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <img
              src={property.images?.[0]}
              alt={property.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{property.title}</h3>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    property.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {property.status}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-2 flex items-center">
                <MapPin size={14} className="mr-1" />
                {property.location}
              </p>

              <p className="text-blue-600 font-bold text-lg mb-3">
                ₦{property.price.toLocaleString()}/night
              </p>

              <div className="flex justify-between text-sm text-gray-600 mb-3">
                <span className="flex items-center">
                  <Bed size={14} className="mr-1" />
                  {property.bedrooms}
                </span>
                <span className="flex items-center">
                  <Bath size={14} className="mr-1" />
                  {property.bathrooms}
                </span>
                <span className="flex items-center">
                  <Square size={14} className="mr-1" />
                  {property.sqft} sqft
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 mb-4">
                <div className="text-center">
                  <p className="font-semibold text-green-600">{property.bookings}</p>
                  <p>Bookings</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-blue-600">{property.views}</p>
                  <p>Views</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-purple-600">{property.likes}</p>
                  <p>Likes</p>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => openEdit(property)}
                  className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-200 flex items-center justify-center"
                >
                  <Edit2 size={14} className="mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProperty(property.id)}
                  className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded text-sm hover:bg-red-200 flex items-center justify-center"
                >
                  <Trash2 size={14} className="mr-1" />
                  Delete
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
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 onClick={() => navigate('/')} className="cursor-pointer text-xl font-bold text-blue-700 dark:text-blue-3000">
                🏡 ShortLet
              </h1>
              <span className="text-gray-500">|</span>
              <span className="text-gray-600">Property Owner Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                View My Profile
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { key: 'overview', label: 'Overview', icon: TrendingUp },
              { key: 'properties', label: 'Properties', icon: Home },
              { key: 'bookings', label: 'Bookings', icon: Calendar },
              { key: 'messages', label: 'Messages', icon: MessageSquare }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={16} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'properties' && renderProperties()}

        {activeTab === 'bookings' && (
          <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
            <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Bookings Management</h3>
            <p className="text-gray-600">View and manage your property bookings here.</p>
            <p className="text-sm text-gray-500 mt-2">Coming soon...</p>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
            <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Messages</h3>
            <p className="text-gray-600">Respond to guest inquiries and manage conversations.</p>
            <p className="text-sm text-gray-500 mt-2">Coming soon...</p>
          </div>
        )}
      </main>

      {/* Shared Add/Edit Modal */}
      <PropertyFormModal
        open={modalOpen}
        mode={modalMode}
        initialData={initialFormData}
        amenities={amenitiesList}
        onClose={() => setModalOpen(false)}
        onSave={handleModalSave}
      />
    </div>
  );
};

export default PropertyOwnerDashboard;
