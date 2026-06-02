import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Pill, FolderLock, Settings, Mail, LogOut,
  Sun, Moon, Plus, Edit2, Trash2, Search, Filter,
  Eye, X, Menu
} from 'lucide-react';
import CloudinaryUploader from '../components/CloudinaryUploader';
import { 
  checkAdminAuth, logoutAdmin, getProducts, addProduct, updateProduct, deleteProduct,
  getCategories, addCategory, deleteCategory, getSettings, updateSettings,
  getMessages, updateMessageStatus, deleteMessage,
  deleteFromCloudinary,
  type Product, type Category, type ContactMessage, type WebsiteSettings
} from '../services/db';

type PanelType = 'products' | 'categories' | 'homepage' | 'contacts';

export default function AdminDashboard() {
  const [adminUser, setAdminUser] = useState<{ email: string } | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('ekaksh_admin_theme') as 'light' | 'dark') || 'dark';
  });
  const [activePanel, setActivePanel] = useState<PanelType>('products');
  const navigate = useNavigate();

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Search & Filter states
  const [prodSearch, setProdSearch] = useState('');
  const [prodFilter, setProdFilter] = useState('All');
  const [msgSearch, setMsgSearch] = useState('');

  // Modals / Form states
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Tablets',
    description: '',
    image: '/muconib_tablets.png',
    publicId: '',
    status: 'active' as 'active' | 'inactive',
    pdfUrl: '#'
  });

  const [newCategoryName, setNewCategoryName] = useState('');
  const [showMsgModal, setShowMsgModal] = useState<ContactMessage | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [imageSource, setImageSource] = useState<'preset' | 'upload'>('preset');

  // Auth Protection Guard
  useEffect(() => {
    const unsub = checkAdminAuth((user) => {
      if (!user) {
        navigate('/admin/login');
      } else {
        setAdminUser(user);
      }
    });
    return () => unsub();
  }, [navigate]);

  // Load Dashboard Data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const prods = await getProducts();
      setProducts(prods);

      const cats = await getCategories();
      setCategories(cats);

      const msgs = await getMessages();
      setMessages(msgs);

      const sett = await getSettings();
      setSettings(sett);

    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminUser) {
      loadDashboardData();
    }
  }, [adminUser]);

  // Sync theme class
  useEffect(() => {
    localStorage.setItem('ekaksh_admin_theme', theme);
  }, [theme]);

  const handleLogout = async () => {
    await logoutAdmin();
    navigate('/admin/login');
  };

  // -------------------------------------------------------------
  // CRUD Handlers
  // -------------------------------------------------------------

  // Products
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productForm);
      } else {
        await addProduct(productForm);
      }
      setShowProductModal(false);
      setEditingProduct(null);
      setProductForm({
        name: '',
        category: categories[0]?.name || 'Tablets',
        description: '',
        image: '/muconib_tablets.png',
        publicId: '',
        status: 'active',
        pdfUrl: '#'
      });
      await loadDashboardData();
      
      // Dispatch custom event to notify landing page
      window.dispatchEvent(new Event('ekaksh_products_updated'));
    } catch (err) {
      console.error(err);
      alert('Error saving product.');
    }
  };

  const startEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      category: prod.category,
      description: prod.description,
      image: prod.image,
      publicId: prod.publicId || '',
      status: prod.status,
      pdfUrl: prod.pdfUrl || '#'
    });
    const isPreset = availableImages.some(img => img.path === prod.image);
    setImageSource(isPreset ? 'preset' : 'upload');
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const prod = products.find(p => p.id === id);
        if (prod && prod.publicId) {
          await deleteFromCloudinary(prod.publicId);
        }
        await deleteProduct(id);
        await loadDashboardData();
        window.dispatchEvent(new Event('ekaksh_products_updated'));
      } catch (err) {
        console.error(err);
        alert('Error deleting product.');
      }
    }
  };

  const handleToggleProductStatus = async (prod: Product) => {
    const nextStatus = prod.status === 'active' ? 'inactive' : 'active';
    try {
      await updateProduct(prod.id, { status: nextStatus });
      await loadDashboardData();
      window.dispatchEvent(new Event('ekaksh_products_updated'));
    } catch (err) {
      console.error(err);
    }
  };

  // Categories
  const handleAddCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      await addCategory({
        name: newCategoryName.trim(),
        slug: newCategoryName.toLowerCase().replace(/\s+/g, '-')
      });
      setNewCategoryName('');
      await loadDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id);
        await loadDashboardData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Homepage Settings
  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      await updateSettings(settings);
      alert('Settings updated successfully.');
      await loadDashboardData();
      window.dispatchEvent(new Event('ekaksh_products_updated')); // refresh carousel values
    } catch (err) {
      console.error(err);
      alert('Error updating settings.');
    }
  };

  // Contact Messages
  const handleToggleMessageRead = async (msg: ContactMessage) => {
    const nextStatus = msg.status === 'read' ? 'unread' : 'read';
    try {
      await updateMessageStatus(msg.id, nextStatus);
      await loadDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await deleteMessage(id);
        if (showMsgModal?.id === id) setShowMsgModal(null);
        await loadDashboardData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // -------------------------------------------------------------
  // Filter Mappings
  // -------------------------------------------------------------
  const filteredProducts = products.filter(p => {
    const matchQuery = p.name.toLowerCase().includes(prodSearch.toLowerCase()) || 
      p.category.toLowerCase().includes(prodSearch.toLowerCase());
    const matchCat = prodFilter === 'All' || p.category.toLowerCase() === prodFilter.toLowerCase();
    return matchQuery && matchCat;
  });

  const filteredMessages = messages.filter(m => {
    return m.name.toLowerCase().includes(msgSearch.toLowerCase()) || 
      m.subject.toLowerCase().includes(msgSearch.toLowerCase()) ||
      m.email.toLowerCase().includes(msgSearch.toLowerCase());
  });

  // Predefined lists of pharmaceutical images to pick in admin form
  const availableImages = [
    { label: 'Muconib Container', path: '/muconib_tablets.png' },
    { label: 'Calmeal Plus Bottle', path: '/calmeal_plus.png' },
    { label: 'Florek Capsules Pack', path: '/florek_capsules.png' },
    { label: 'Esperto-Q Bottle', path: '/esperto_q.png' },
    { label: 'Eknuron-PN Box', path: '/eknuron_pn.png' }
  ];

  // Theme variable toggles
  const bgClass = theme === 'dark' ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900';
  const cardClass = theme === 'dark' ? 'bg-slate-800 border-slate-700/60' : 'bg-white border-slate-200/60';
  const tableHeaderClass = theme === 'dark' ? 'bg-slate-900/60 text-slate-400' : 'bg-slate-100 text-slate-500';
  const inputClass = theme === 'dark' 
    ? 'bg-slate-900 border-slate-700 text-slate-100 focus:ring-teal-500 focus:border-teal-500' 
    : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-teal-600 focus:border-teal-600';

  if (!adminUser) return null; // let Auth guard execute

  return (
    <div className={`min-h-screen flex font-sans ${bgClass} transition-colors duration-250`}>
      
      {/* 1. Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 shrink-0 border-r ${theme === 'dark' ? 'bg-slate-955 border-slate-800' : 'bg-teal-955 border-teal-900'} p-5 flex flex-col justify-between transition-transform duration-300 z-50 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="space-y-8">
          
          {/* Logo brand */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <img 
                src="/logo.jpg" 
                alt="EKAKSH Logo" 
                className="w-9 h-9 rounded-lg object-cover border border-white/20" 
              />
              <div>
                <div className="text-white font-extrabold text-sm tracking-wide">EKAKSH ADMIN</div>
                <div className="text-teal-400 font-medium text-[8px] uppercase tracking-[0.2em] mt-0.5">Control Terminal</div>
              </div>
            </div>
            {/* Mobile Close Button */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 text-slate-400 hover:text-white lg:hidden cursor-pointer hover:bg-white/5 rounded-lg"
              aria-label="Close Sidebar"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">

            <button
              onClick={() => { setActivePanel('products'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activePanel === 'products' 
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-500/10' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Pill size={16} />
              Products CRUD
            </button>

            <button
              onClick={() => { setActivePanel('categories'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activePanel === 'categories' 
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-500/10' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FolderLock size={16} />
              Categories
            </button>

            <button
              onClick={() => { setActivePanel('homepage'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activePanel === 'homepage' 
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-500/10' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Settings size={16} />
              Homepage CMS
            </button>

            <button
              onClick={() => { setActivePanel('contacts'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activePanel === 'contacts' 
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-500/10' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Mail size={16} />
                Contact Inbox
              </div>
              {messages.filter(m => m.status === 'unread').length > 0 && (
                <span className="bg-red-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
                  {messages.filter(m => m.status === 'unread').length}
                </span>
              )}
            </button>
          </nav>

        </div>

        {/* Sidebar Footer */}
        <div className="space-y-4 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Interface Color</span>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-teal-400 hover:text-teal-300 transition-colors cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-900/60 border border-teal-800/40 text-teal-400 flex items-center justify-center font-bold text-xs">
              AD
            </div>
            <div className="truncate flex-grow">
              <div className="text-white text-[11px] font-bold truncate">{adminUser.email}</div>
              <div className="text-slate-500 text-[9px] uppercase tracking-wider">Super Administrator</div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/5 transition-colors cursor-pointer"
              aria-label="Log Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Frame */}
      <main className="flex-grow p-4 sm:p-8 overflow-y-auto max-h-screen w-full">
        
        {/* Mobile Header Bar */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200/60 dark:border-slate-800 lg:hidden">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className={`p-2.5 rounded-xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-teal-400' : 'bg-white border-slate-200 text-teal-600'} shadow-sm cursor-pointer hover:scale-102 transition-transform`}
            aria-label="Open Sidebar"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <img src="/logo.jpg" alt="Ekaksh Logo" className="w-8 h-8 rounded-lg object-cover" />
            <span className="font-extrabold text-sm tracking-wide">EKAKSH ADMIN</span>
          </div>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`p-2.5 rounded-xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-teal-400' : 'bg-white border-slate-200 text-teal-600'} cursor-pointer`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
        
        {loading ? (
          /* Loading Skeleton */
          <div className="space-y-6 animate-pulse">
            <div className="h-8 bg-slate-300/20 dark:bg-slate-700/20 w-48 rounded-lg" />
            <div className="grid grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-28 bg-slate-300/20 dark:bg-slate-700/20 rounded-2xl" />
              ))}
            </div>
            <div className="h-96 bg-slate-300/20 dark:bg-slate-700/20 rounded-2xl" />
          </div>
        ) : (
          <>


            {/* PANEL: Products Management (CRUD) */}
            {activePanel === 'products' && (
              <div className="space-y-6">
                
                {/* Panel Header & CTA */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-extrabold tracking-tight">Pharmaceutical Catalog</h2>
                    <p className="text-slate-400 text-xs mt-1">Manage active compounds, descriptions, division listings, and status.</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setProductForm({
                        name: '',
                        category: categories[0]?.name || 'Tablets',
                        description: '',
                        image: '/muconib_tablets.png',
                        publicId: '',
                        status: 'active',
                        pdfUrl: '#'
                      });
                      setImageSource('preset');
                      setShowProductModal(true);
                    }}
                    className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={14} />
                    Add Product
                  </button>
                </div>

                {/* Filter & Search Bar */}
                <div className={`p-4 rounded-xl border ${cardClass} shadow-sm flex flex-col sm:flex-row items-center gap-4`}>
                  <div className="relative flex-grow w-full">
                    <input
                      type="text"
                      placeholder="Search catalog by name or composition..."
                      value={prodSearch}
                      onChange={(e) => setProdSearch(e.target.value)}
                      className={`w-full py-2 pl-9 pr-4 rounded-lg border text-xs focus:outline-none ${inputClass}`}
                    />
                    <Search size={14} className="absolute left-3 top-3 text-slate-500" />
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Filter size={14} className="text-slate-500 shrink-0" />
                    <select
                      value={prodFilter}
                      onChange={(e) => setProdFilter(e.target.value)}
                      className={`py-2 px-3 rounded-lg border text-xs focus:outline-none w-full sm:w-36 ${inputClass}`}
                    >
                      <option value="All">All Categories</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Product Data Table / Cards */}
                <div className={`rounded-xl border ${cardClass} shadow-sm overflow-hidden`}>
                  
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className={`border-b ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'} ${tableHeaderClass}`}>
                          <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[9px] w-16">Preview</th>
                          <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[9px]">Product Details</th>
                          <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[9px]">Category</th>
                          <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[9px] w-24 text-center">Status</th>
                          <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[9px] w-24 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.length > 0 ? (
                          filteredProducts.map(p => (
                            <tr key={p.id} className={`border-b ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'} hover:bg-slate-500/5 transition-colors`}>
                              <td className="py-3.5 px-4">
                                <div className="w-10 h-10 rounded-lg bg-white border border-slate-100 flex items-center justify-center p-1">
                                  <img src={p.image} alt={p.name} className="max-h-full object-contain" />
                                </div>
                              </td>
                              <td className="py-3.5 px-4">
                                <span className="font-extrabold text-sm block tracking-wide">{p.name}</span>
                                <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 font-light">{p.description}</span>
                              </td>
                              <td className="py-3.5 px-4 font-medium">{p.category}</td>
                              <td className="py-3.5 px-4 text-center">
                                <button
                                  onClick={() => handleToggleProductStatus(p)}
                                  className={`px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider transition-colors cursor-pointer ${
                                    p.status === 'active' 
                                      ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                                      : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                                  }`}
                                >
                                  {p.status}
                                </button>
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => startEditProduct(p)}
                                    className="p-1.5 rounded-lg hover:bg-teal-500/10 text-teal-400 hover:text-teal-300 transition-colors cursor-pointer"
                                    aria-label="Edit"
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(p.id)}
                                    className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                                    aria-label="Delete"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="text-center py-10 text-slate-500 font-medium">No products found in the catalog.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Mobile Card View */}
                  <div className="block md:hidden divide-y divide-slate-200 dark:divide-slate-800/40">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map(p => (
                        <div key={p.id} className="p-4 space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-white border border-slate-100 dark:border-slate-700/60 flex items-center justify-center p-1 overflow-hidden shrink-0">
                              <img src={p.image} alt={p.name} className="max-h-full object-contain" />
                            </div>
                            <div className="truncate flex-grow">
                              <span className="font-extrabold text-sm block tracking-wide truncate">{p.name}</span>
                              <span className="text-[10px] text-teal-500 font-bold uppercase tracking-wider">{p.category}</span>
                            </div>
                            <button
                              onClick={() => handleToggleProductStatus(p)}
                              className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider transition-colors cursor-pointer shrink-0 ${
                                p.status === 'active' 
                                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                                  : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                              }`}
                            >
                              {p.status}
                            </button>
                          </div>
                          
                          <p className="text-slate-400 text-xs font-light line-clamp-2 leading-relaxed">
                            {p.description}
                          </p>

                          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/40">
                            <button
                              onClick={() => startEditProduct(p)}
                              className="px-3 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <Edit2 size={12} />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <Trash2 size={12} />
                              Delete
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-slate-500 font-medium text-xs">No products found in the catalog.</div>
                    )}
                  </div>

                </div>

              </div>
            )}

            {/* PANEL: Categories Management */}
            {activePanel === 'categories' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left side: Create form (4 cols) */}
                <div className="lg:col-span-5 space-y-6">
                  <div>
                    <h2 className="text-2xl font-extrabold tracking-tight">Product Categories</h2>
                    <p className="text-slate-400 text-xs mt-1">Add or remove pharmaceutical division groupings.</p>
                  </div>
                  
                  <div className={`p-6 rounded-2xl border ${cardClass} shadow-sm`}>
                    <h3 className="font-bold text-sm uppercase tracking-wider mb-4">Add Division Category</h3>
                    <form onSubmit={handleAddCategorySubmit} className="space-y-4">
                      <div>
                        <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Category Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Nutraceuticals, Neurology"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none ${inputClass}`}
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus size={14} />
                        Create Category
                      </button>
                    </form>
                  </div>
                </div>

                {/* Right side: Categories List (7 cols) */}
                <div className="lg:col-span-7">
                  <div className={`rounded-xl border ${cardClass} shadow-sm overflow-hidden`}>
                    
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className={`border-b ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'} ${tableHeaderClass}`}>
                            <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[9px]">Category Name</th>
                            <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[9px]">URL Slug</th>
                            <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[9px] w-20 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {categories.map(c => (
                            <tr key={c.id} className={`border-b ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'} hover:bg-slate-500/5`}>
                              <td className="py-3.5 px-4 font-bold">{c.name}</td>
                              <td className="py-3.5 px-4 text-slate-400 font-mono font-light">{c.slug}</td>
                              <td className="py-3.5 px-4 text-center">
                                {/* Prevent deleting seed categories if needed, or allow all */}
                                <button
                                  onClick={() => handleDeleteCategory(c.id)}
                                  className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                                  aria-label="Delete Category"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="block md:hidden divide-y divide-slate-200 dark:divide-slate-800/40">
                      {categories.map(c => (
                        <div key={c.id} className="p-4 flex items-center justify-between gap-4">
                          <div>
                            <span className="font-extrabold text-sm block">{c.name}</span>
                            <span className="text-[10px] text-slate-500 font-mono block mt-0.5">{c.slug}</span>
                          </div>
                          <button
                            onClick={() => handleDeleteCategory(c.id)}
                            className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                            aria-label="Delete Category"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>

              </div>
            )}

            {/* PANEL: Homepage CMS Management */}
            {activePanel === 'homepage' && settings && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight">Homepage Settings</h2>
                  <p className="text-slate-400 text-xs mt-1">Configure layout, contact details, headings, and branding fields.</p>
                </div>

                <div className={`p-8 rounded-3xl border ${cardClass} shadow-sm`}>
                  <form onSubmit={handleSettingsSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      <div>
                        <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Company Name</label>
                        <input
                          type="text"
                          required
                          value={settings.companyName}
                          onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none ${inputClass}`}
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Division Name</label>
                        <input
                          type="text"
                          required
                          value={settings.division}
                          onChange={(e) => setSettings({ ...settings, division: e.target.value })}
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none ${inputClass}`}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Hero Tagline / Heading</label>
                        <input
                          type="text"
                          required
                          value={settings.tagline}
                          onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none ${inputClass}`}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Hero Subheading</label>
                        <textarea
                          rows={3}
                          required
                          value={settings.subheading}
                          onChange={(e) => setSettings({ ...settings, subheading: e.target.value })}
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none ${inputClass}`}
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">GST Registration Number</label>
                        <input
                          type="text"
                          required
                          value={settings.gstNumber}
                          onChange={(e) => setSettings({ ...settings, gstNumber: e.target.value })}
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none ${inputClass}`}
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Corporate Phone Number</label>
                        <input
                          type="text"
                          required
                          value={settings.phone}
                          onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none ${inputClass}`}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Corporate Address</label>
                        <textarea
                          rows={2}
                          required
                          value={settings.address}
                          onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none ${inputClass}`}
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Working Days</label>
                        <input
                          type="text"
                          required
                          value={settings.workingDays}
                          onChange={(e) => setSettings({ ...settings, workingDays: e.target.value })}
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none ${inputClass}`}
                        />
                      </div>

                      <div>
                        <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Working Hours</label>
                        <input
                          type="text"
                          required
                          value={settings.workingHours}
                          onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
                          className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none ${inputClass}`}
                        />
                      </div>

                    </div>

                    <div className="pt-4 border-t border-slate-700/40">
                      <button
                        type="submit"
                        className="px-6 py-3.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md cursor-pointer"
                      >
                        Save Settings
                      </button>
                    </div>

                  </form>
                </div>
              </div>
            )}

            {/* PANEL: Contact Inbox (Messages leads) */}
            {activePanel === 'contacts' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight">Contact Messages Inbox</h2>
                  <p className="text-slate-400 text-xs mt-1">Review inquiries and product detailing leads sent via the platform forms.</p>
                </div>

                {/* Search Bar */}
                <div className={`p-4 rounded-xl border ${cardClass} shadow-sm`}>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search messages by sender name, subject, or email..."
                      value={msgSearch}
                      onChange={(e) => setMsgSearch(e.target.value)}
                      className={`w-full py-2 pl-9 pr-4 rounded-lg border text-xs focus:outline-none ${inputClass}`}
                    />
                    <Search size={14} className="absolute left-3 top-3 text-slate-500" />
                  </div>
                </div>

                {/* Messages Table / Cards */}
                <div className={`rounded-xl border ${cardClass} shadow-sm overflow-hidden`}>
                  
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className={`border-b ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'} ${tableHeaderClass}`}>
                          <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[9px] w-20 text-center">Status</th>
                          <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[9px]">Sender Details</th>
                          <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[9px]">Subject</th>
                          <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[9px]">Received Date</th>
                          <th className="py-3.5 px-4 font-bold uppercase tracking-wider text-[9px] w-24 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMessages.length > 0 ? (
                          filteredMessages.map(m => (
                            <tr key={m.id} className={`border-b ${theme === 'dark' ? 'border-slate-800' : 'border-slate-100'} hover:bg-slate-500/5`}>
                              <td className="py-3.5 px-4 text-center">
                                <button
                                  onClick={() => handleToggleMessageRead(m)}
                                  className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider cursor-pointer ${
                                    m.status === 'read'
                                      ? 'bg-slate-500/10 text-slate-400'
                                      : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                  }`}
                                >
                                  {m.status}
                                </button>
                              </td>
                              <td className="py-3.5 px-4">
                                <span className="font-bold text-sm block">{m.name}</span>
                                <span className="text-[10px] text-slate-400 font-light mt-0.5 block">{m.email} | {m.phone}</span>
                              </td>
                              <td className="py-3.5 px-4 font-medium truncate max-w-xs">{m.subject}</td>
                              <td className="py-3.5 px-4 text-slate-400 font-light">{new Date(m.createdAt).toLocaleString()}</td>
                              <td className="py-3.5 px-4">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => setShowMsgModal(m)}
                                    className="p-1.5 rounded-lg hover:bg-teal-500/10 text-teal-400 hover:text-teal-300 transition-colors cursor-pointer"
                                    aria-label="View Message"
                                  >
                                    <Eye size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteMessage(m.id)}
                                    className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                                    aria-label="Delete Message"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="text-center py-10 text-slate-500 font-medium">Inbox is empty.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="block md:hidden divide-y divide-slate-200 dark:divide-slate-800/40">
                    {filteredMessages.length > 0 ? (
                      filteredMessages.map(m => (
                        <div key={m.id} className="p-4 space-y-3">
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <span className="font-extrabold text-sm block">{m.name}</span>
                              <span className="text-[10px] text-slate-400 block mt-0.5">{new Date(m.createdAt).toLocaleString()}</span>
                            </div>
                            <button
                              onClick={() => handleToggleMessageRead(m)}
                              className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider cursor-pointer shrink-0 ${
                                m.status === 'read'
                                  ? 'bg-slate-500/10 text-slate-400'
                                  : 'bg-red-500/10 text-red-500 border border-red-500/20'
                              }`}
                            >
                              {m.status}
                            </button>
                          </div>

                          <div className="text-xs">
                            <span className="font-bold text-slate-400 block uppercase tracking-wider text-[9px]">Subject</span>
                            <p className="text-slate-800 dark:text-slate-200 font-semibold mt-0.5">{m.subject}</p>
                          </div>

                          <div className="text-[11px] text-slate-400 font-light">
                            {m.email} | {m.phone}
                          </div>

                          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/40">
                            <button
                              onClick={() => setShowMsgModal(m)}
                              className="px-3 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <Eye size={12} />
                              Open
                            </button>
                            <button
                              onClick={() => handleDeleteMessage(m.id)}
                              className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <Trash2 size={12} />
                              Delete
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-slate-500 font-medium text-xs">Inbox is empty.</div>
                    )}
                  </div>

                </div>

              </div>
            )}
          </>
        )}

      </main>

      {/* 3. MODAL: Add/Edit Product */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className={`relative w-full max-w-2xl rounded-3xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto`}>
            
            <button
              onClick={() => setShowProductModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-500/10 text-slate-400 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <h3 className="font-extrabold text-xl mb-1 flex items-center gap-2">
              <Pill className="text-teal-500" />
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>
            <p className="text-slate-400 text-xs mb-6">Specify pharmaceutical contents and status flags below.</p>

            <form onSubmit={handleProductSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Product Name</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none ${inputClass}`}
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none ${inputClass}`}
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Composition / Description</label>
                  <textarea
                    rows={3}
                    required
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none ${inputClass}`}
                  />
                </div>

                <div className="sm:col-span-2 space-y-4">
                  <div>
                    <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Product Image Source</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input 
                          type="radio" 
                          name="imageSource" 
                          checked={imageSource === 'preset'} 
                          onChange={() => {
                            setImageSource('preset');
                            if (productForm.image.startsWith('http') || productForm.image.startsWith('data:')) {
                              setProductForm(prev => ({ ...prev, image: '/muconib_tablets.png', publicId: '' }));
                            }
                          }}
                          className="text-teal-600 focus:ring-teal-500 bg-slate-900 border-slate-700" 
                        />
                        <span>Library Presets</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input 
                          type="radio" 
                          name="imageSource" 
                          checked={imageSource === 'upload'} 
                          onChange={() => setImageSource('upload')}
                          className="text-teal-600 focus:ring-teal-500 bg-slate-900 border-slate-700" 
                        />
                        <span>Upload from Device</span>
                      </label>
                    </div>
                  </div>

                  {imageSource === 'preset' ? (
                    <div>
                      <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Select Image Preset</label>
                      <select
                        value={availableImages.some(img => img.path === productForm.image) ? productForm.image : '/muconib_tablets.png'}
                        onChange={(e) => setProductForm({ ...productForm, image: e.target.value, publicId: '' })}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none ${inputClass}`}
                      >
                        {availableImages.map((img, i) => (
                          <option key={i} value={img.path}>{img.label}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Upload Custom Image</label>
                      <CloudinaryUploader
                        currentImage={productForm.image.startsWith('/') || productForm.image.startsWith('data:') ? '' : productForm.image}
                        currentPublicId={productForm.publicId}
                        folder="ekaksh-pharma/products"
                        theme={theme}
                        onUploadSuccess={(url, publicId) => {
                          setProductForm(prev => ({
                            ...prev,
                            image: url,
                            publicId: publicId
                          }));
                        }}
                        onClearImage={() => {
                          setProductForm(prev => ({
                            ...prev,
                            image: '',
                            publicId: ''
                          }));
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">PDF Brochure URL / Path</label>
                  <input
                    type="text"
                    value={productForm.pdfUrl}
                    onChange={(e) => setProductForm({ ...productForm, pdfUrl: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none ${inputClass}`}
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Default Status</label>
                  <select
                    value={productForm.status}
                    onChange={(e) => setProductForm({ ...productForm, status: e.target.value as 'active' | 'inactive' })}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none ${inputClass}`}
                  >
                    <option value="active">Active (Visible)</option>
                    <option value="inactive">Inactive (Hidden)</option>
                  </select>
                </div>

                {/* Image Preview Box */}
                <div className="flex flex-col justify-end">
                  <span className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Image Preview</span>
                  <div className="h-16 w-16 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center p-2">
                    <img src={productForm.image} alt="Pre-render" className="max-h-full object-contain" />
                  </div>
                </div>

              </div>

              <div className="pt-6 border-t border-slate-700/30 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2.5 bg-slate-500/10 hover:bg-slate-500/20 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md cursor-pointer"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 4. MODAL: View Contact Lead */}
      {showMsgModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className={`relative w-full max-w-xl rounded-3xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} p-6 sm:p-8 shadow-2xl`}>
            
            <button
              onClick={() => {
                if (showMsgModal.status === 'unread') {
                  handleToggleMessageRead(showMsgModal);
                }
                setShowMsgModal(null);
              }}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-500/10 text-slate-400 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider flex items-center gap-1.5 mb-2">
              <Mail size={12} />
              Lead Message Details
            </span>

            <h3 className="font-extrabold text-xl mb-4 leading-tight">
              {showMsgModal.subject}
            </h3>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-900/40 border border-white/5 mb-6 text-xs leading-relaxed font-light">
              <div>
                <span className="text-slate-500 block uppercase font-bold text-[9px]">Sender Name</span>
                <span className="font-semibold text-slate-200 mt-0.5 block">{showMsgModal.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block uppercase font-bold text-[9px]">Received Date</span>
                <span className="font-semibold text-slate-200 mt-0.5 block">{new Date(showMsgModal.createdAt).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-500 block uppercase font-bold text-[9px]">Email Address</span>
                <a href={`mailto:${showMsgModal.email}`} className="font-semibold text-teal-400 hover:underline mt-0.5 block">{showMsgModal.email}</a>
              </div>
              <div>
                <span className="text-slate-500 block uppercase font-bold text-[9px]">Phone Number</span>
                <a href={`tel:${showMsgModal.phone}`} className="font-semibold text-teal-400 hover:underline mt-0.5 block">{showMsgModal.phone}</a>
              </div>
            </div>

            {/* Message Body */}
            <div className="space-y-2">
              <span className="text-slate-500 uppercase font-bold text-[9px] tracking-wider block">Message Content</span>
              <div className={`p-5 rounded-2xl border text-sm leading-relaxed whitespace-pre-line font-light max-h-48 overflow-y-auto ${
                theme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                {showMsgModal.message}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 mt-6 border-t border-slate-700/30 flex justify-between items-center">
              <button
                onClick={() => handleDeleteMessage(showMsgModal.id)}
                className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 size={13} />
                Delete Message
              </button>
              <button
                onClick={() => {
                  if (showMsgModal.status === 'unread') {
                    handleToggleMessageRead(showMsgModal);
                  }
                  setShowMsgModal(null);
                }}
                className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Backdrop overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}

    </div>
  );
}
