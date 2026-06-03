import React, { useState, useEffect } from 'react';
import { Phone, MapPin, Percent, Calendar, Clock, Send, MessageSquareCheck } from 'lucide-react';
import { addMessage, getSettings, type WebsiteSettings } from '../services/db';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);

  useEffect(() => {
    getSettings().then(setSettings).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      await addMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject || 'General Inquiry',
        message: formData.message
      });
      setIsSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      
      // Dispatch custom event to notify listeners (e.g. Admin Analytics)
      window.dispatchEvent(new Event('ekaksh_messages_updated'));
      
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase font-extrabold tracking-widest text-teal-600 mb-3">Connect With Us</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Get In Touch
          </p>
          <div className="w-16 h-1 bg-teal-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* Form and Info Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Contact Cards & Map (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Info Cards Container */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/60 shadow-sm space-y-6">
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">Our Address</h4>
                  <p className="text-slate-600 text-sm mt-1 leading-relaxed whitespace-pre-line font-light">
                    {settings?.address || 'Gadda Colony Road, Kashipur,\nUdham Singh Nagar, Uttarakhand – 244713,\nIndia'}
                  </p>
                </div>
              </div>
              {/* Contact Cards for each phone number */}
              {(settings?.phone || '+91 93890 49159, +91 96508 57719')
                .split(',')
                .map((numStr) => numStr.trim())
                .filter(Boolean)
                .map((phoneNum, idx) => {
                  const labels = ['Sales Inquiry', 'Support & General'];
                  return (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shrink-0">
                        <Phone size={20} />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">
                          {labels[idx] || `Phone ${idx + 1}`}
                        </h4>
                        <p className="text-slate-600 text-sm mt-1 font-light leading-none">
                          {phoneNum}
                        </p>
                        <div className="flex gap-3 mt-3">
                          <a
                            href={`tel:${phoneNum.replace(/\s+/g, '')}`}
                            className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer inline-block"
                          >
                            Call Now
                          </a>
                          <a
                            href={`https://wa.me/${phoneNum.replace(/[^0-9]/g, '')}?text=Hello%20Ekaksh%20Pharma`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer inline-block"
                          >
                            WhatsApp
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shrink-0">
                  <Percent size={20} />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">GST Registration</h4>
                  <p className="text-slate-600 text-sm mt-1 font-mono font-medium">
                    {settings?.gstNumber || '05CNLPC4830L1ZY'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div className="flex gap-2.5">
                  <Calendar size={16} className="text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Working Days</span>
                    <p className="text-slate-600 text-xs font-semibold mt-0.5">{settings?.workingDays || 'Monday - Saturday'}</p>
                  </div>
                </div>
                <div className="flex gap-2.5">
                  <Clock size={16} className="text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Working Hours</span>
                    <p className="text-slate-600 text-xs font-semibold mt-0.5">{settings?.workingHours || '9:00 AM - 6:00 PM'}</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Google Map Frame */}
            <div className="h-60 rounded-3xl overflow-hidden border border-slate-200/60 shadow-sm bg-white p-2">
              <iframe
                title="Ekaksh Pharma Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3488.583344605151!2d78.9616089!3d29.1179612!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390a43d99435b0d7%3A0xe54d90e0c05952f4!2sKashipur%2C%20Uttarakhand%20244713!5e0!3m2!1sen!2sin!4v1717336789012!5m2!1sen!2sin"
                className="w-full h-full rounded-2xl border-none"
                allowFullScreen={false}
                loading="lazy"
              />
            </div>

          </div>

          {/* Right Column: Contact Feedback Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded-3xl bg-white border border-slate-200/60 shadow-sm">
              <h3 className="font-extrabold text-slate-900 text-xl tracking-tight mb-2">
                Send Us a Message
              </h3>
              <p className="text-slate-500 text-xs mb-8">
                Fill out the form below, and our business development department will contact you within 24 hours.
              </p>

              {isSuccess ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-100 text-center animate-pulse-glow">
                  <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center text-white mx-auto mb-4">
                    <MessageSquareCheck size={28} />
                  </div>
                  <h4 className="font-extrabold text-emerald-950 text-lg">Thank You!</h4>
                  <p className="text-emerald-700 text-sm mt-1 max-w-sm mx-auto leading-relaxed">
                    Your message has been submitted. Our team will review and get in touch with you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-slate-600 text-xs font-semibold uppercase tracking-wider mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all shadow-inner"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 text-xs font-semibold uppercase tracking-wider mb-1.5">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 XXXXX XXXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 text-xs font-semibold uppercase tracking-wider mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="john@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all shadow-inner"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 text-xs font-semibold uppercase tracking-wider mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="Product Distribution / General Enquiry"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all shadow-inner"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 text-xs font-semibold uppercase tracking-wider mb-1.5">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Explain your request in detail..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all shadow-inner"
                    />
                  </div>

                  {errorMessage && (
                    <div className="text-red-500 text-xs font-semibold">{errorMessage}</div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl tracking-wider uppercase transition-all duration-200 shadow-md shadow-teal-600/10 hover:shadow-teal-600/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-55"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                    <Send size={14} />
                  </button>

                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
