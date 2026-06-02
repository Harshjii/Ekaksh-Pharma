import { useState, useEffect } from 'react';
import { getProducts, getCategories, addMessage, type Product, type Category } from '../services/db';

export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Quick Enquiry Form state inside the detail modal
  const [enquirySent, setEnquirySent] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  const loadProductsData = async () => {
    try {
      const pList = await getProducts();
      setProducts(pList);
      
      const cList = await getCategories();
      setCategories(cList);
    } catch (err) {
      console.error("Error loading products/categories:", err);
    }
  };

  useEffect(() => {
    loadProductsData();
    
    // Listen for custom event indicating product updates in admin
    const handleProductsUpdate = () => {
      loadProductsData();
    };
    
    const handleFilterCategory = (e: Event) => {
      const catName = (e as CustomEvent).detail;
      if (catName) {
        setSelectedCategory(catName);
      }
    };

    window.addEventListener('ekaksh_products_updated', handleProductsUpdate);
    window.addEventListener('ekaksh_filter_category', handleFilterCategory as EventListener);
    
    return () => {
      window.removeEventListener('ekaksh_products_updated', handleProductsUpdate);
      window.removeEventListener('ekaksh_filter_category', handleFilterCategory as EventListener);
    };
  }, []);

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    try {
      await addMessage({
        name: enquiryForm.name,
        email: enquiryForm.email,
        phone: enquiryForm.phone,
        subject: `Product Enquiry: ${selectedProduct.name}`,
        message: enquiryForm.message || `I am interested in learning more about ${selectedProduct.name}. Please contact me.`
      });
      setEnquirySent(true);
      setEnquiryForm({ name: '', phone: '', email: '', message: '' });
      setTimeout(() => {
        setEnquirySent(false);
      }, 3500);
    } catch (err) {
      console.error("Failed to send enquiry message:", err);
    }
  };

  // Filter products based on search and category
  const filteredProducts = products.filter((prod) => {
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.category.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = selectedCategory === 'All' || 
      prod.category.toLowerCase() === selectedCategory.toLowerCase();
      
    const isActive = prod.status === 'active';
    
    return matchesSearch && matchesCategory && isActive;
  });

  return (
    <section id="products" className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase font-extrabold tracking-widest text-teal-600 mb-3">Our Offerings</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            High-Quality Pharmaceutical Products
          </p>
          <div className="w-16 h-1 bg-teal-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Search & Category Filter Controls */}
        <div className="mb-12 space-y-6">
          <div className="max-w-md mx-auto relative">
            <input
              type="text"
              placeholder="Search products by name, category, composition..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3.5 pl-12 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all shadow-inner text-sm"
            />
            <svg
              className="absolute left-4 top-4 w-5 h-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Categories Tab Row */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/10'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              All Products
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  selectedCategory.toLowerCase() === cat.name.toLowerCase()
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/10'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((prod) => (
              <div
                key={prod.id}
                className="flex flex-col justify-between bg-slate-50 border border-slate-200/60 rounded-3xl overflow-hidden hover:shadow-xl hover:scale-101 hover:border-teal-500/20 transition-all duration-300 group"
              >
                {/* Product Image Frame */}
                <div className="h-60 bg-white flex items-center justify-center p-6 relative border-b border-slate-100">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-600 text-[10px] font-bold uppercase tracking-wider">
                    {prod.category}
                  </div>
                </div>

                {/* Product Meta */}
                <div className="p-6 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-xl tracking-tight mb-2 group-hover:text-teal-600 transition-colors duration-200">
                      {prod.name}
                    </h3>
                    <p className="text-slate-500 text-xs line-clamp-3 mb-6 leading-relaxed">
                      {prod.description}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedProduct(prod)}
                    className="w-full py-3 bg-teal-900/10 hover:bg-teal-600 hover:text-white text-teal-950 font-bold text-xs rounded-xl tracking-wider uppercase transition-all duration-200 cursor-pointer"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-50 border border-dashed border-slate-200 rounded-3xl max-w-xl mx-auto">
            <svg
              className="w-12 h-12 text-slate-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-slate-500 font-medium">No products match your criteria.</p>
          </div>
        )}

      </div>

      {/* Product Details Modal (Glassmorphism Overlay) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl overflow-y-auto md:overflow-hidden shadow-2xl border border-slate-100 flex flex-col md:flex-row max-h-[95vh] md:max-h-[85vh]">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
              aria-label="Close Modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Left side: Image and details */}
            <div className="w-full md:w-1/2 bg-slate-50 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-100 md:overflow-y-auto shrink-0">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="max-h-60 sm:max-h-72 object-contain filter drop-shadow-lg mb-6"
              />
              <span className="px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-600 text-xs font-bold uppercase tracking-wider mb-2">
                {selectedProduct.category}
              </span>
              <h3 className="font-extrabold text-slate-900 text-2xl tracking-tight text-center mb-4">
                {selectedProduct.name}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed text-center max-w-sm">
                {selectedProduct.description}
              </p>
            </div>

            {/* Right side: Quick enquiry form */}
            <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between md:overflow-y-auto bg-white">
              <div>
                <h4 className="font-extrabold text-slate-900 text-lg mb-1">Quick Product Enquiry</h4>
                <p className="text-slate-400 text-xs mb-6">Have questions? Send an enquiry directly to our division staff.</p>

                {enquirySent ? (
                  <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
                    <svg className="w-10 h-10 text-emerald-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h5 className="font-bold text-emerald-950 text-sm">Enquiry Sent Successfully</h5>
                    <p className="text-emerald-700 text-xs mt-1">Our sales team will contact you shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleEnquirySubmit} className="space-y-4">
                    <div>
                      <label className="block text-slate-600 text-xs font-semibold uppercase tracking-wider mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={enquiryForm.name}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-600 text-xs font-semibold uppercase tracking-wider mb-1">Phone Number</label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 XXXXX XXXXX"
                          value={enquiryForm.phone}
                          onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 text-xs font-semibold uppercase tracking-wider mb-1">Email Address</label>
                        <input
                          type="email"
                          required
                          placeholder="name@company.com"
                          value={enquiryForm.email}
                          onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-600 text-xs font-semibold uppercase tracking-wider mb-1">Enquiry Details (Optional)</label>
                      <textarea
                        rows={3}
                        placeholder={`I want pricing and packaging options for ${selectedProduct.name}...`}
                        value={enquiryForm.message}
                        onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl tracking-wider uppercase transition-all duration-200 shadow-md shadow-teal-600/10 hover:shadow-teal-600/25 cursor-pointer"
                    >
                      Submit Enquiry
                    </button>
                  </form>
                )}
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Product Code: {selectedProduct.id}</span>
                <span>GST: 05CNLPC4830L1ZY</span>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
