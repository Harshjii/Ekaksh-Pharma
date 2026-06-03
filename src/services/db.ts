import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  getDoc
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged
} from 'firebase/auth';
import {
  auth as firebaseAuth,
  db as firestoreDb,
  isFirebaseConfigured as useFirebase
} from '../lib/firebase';
import { 
  getOptimizedUrl, 
  deleteFromCloudinary, 
  isCloudinaryConfigured 
} from '../lib/cloudinary';

// Expose TypeScript interfaces
export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string; // Expose image to UI (acts as the imageUrl in UI)
  imageUrl?: string; // Save to Firestore
  publicId?: string; // Save Cloudinary Public ID to Firestore
  status: 'active' | 'inactive';
  pdfUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'read' | 'unread';
}

export interface WebsiteSettings {
  companyName: string;
  division: string;
  established: string;
  tagline: string;
  subheading: string;
  phone: string;
  address: string;
  gstNumber: string;
  workingDays: string;
  workingHours: string;
}

// -------------------------------------------------------------
// Default Mock Seed Data
// -------------------------------------------------------------
const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Tablets', slug: 'tablets' },
  { id: '2', name: 'Capsules', slug: 'capsules' },
  { id: '3', name: 'Syrups', slug: 'syrups' },
  { id: '4', name: 'Injections', slug: 'injections' },
  { id: '5', name: 'Nutraceuticals', slug: 'nutraceuticals' },
  { id: '6', name: 'Neurology Products', slug: 'neurology' },
  { id: '7', name: 'Gastrointestinal Products', slug: 'gastro' },
  { id: '8', name: 'Specialty Healthcare Products', slug: 'specialty' }
];

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Muconib Tablets',
    category: 'Nutraceuticals',
    description: 'Advanced nutritional & neuropathy support formula designed to promote cellular energy, nerve health, and overall vitality.',
    image: '/muconib_tablets.png',
    status: 'active',
    pdfUrl: '#'
  },
  {
    id: 'p2',
    name: 'Calmeal Plus',
    category: 'Nutraceuticals',
    description: 'Premium Calcium & Bone Health supplement enriched with essential minerals and Vitamin D3 to strengthen joints and enhance skeletal health.',
    image: '/calmeal_plus.png',
    status: 'active',
    pdfUrl: '#'
  },
  {
    id: 'p3',
    name: 'Florek Capsules',
    category: 'Capsules',
    description: 'High-potency Probiotic Supplement formulated with multiple active strains to restore gut microflora and boost digestive wellness.',
    image: '/florek_capsules.png',
    status: 'active',
    pdfUrl: '#'
  },
  {
    id: 'p4',
    name: 'Esperto-Q',
    category: 'Nutraceuticals',
    description: 'Elite Antioxidant & Cardiac Wellness supplement supporting heart function, boosting blood circulation, and fighting oxidative stress.',
    image: '/esperto_q.png',
    status: 'active',
    pdfUrl: '#'
  },
  {
    id: 'p5',
    name: 'Eknuron-PN',
    category: 'Neurology Products',
    description: 'Specialized Neuropathy Management tablets targeting nerve regeneration, tingling relief, and central nervous system support.',
    image: '/eknuron_pn.png',
    status: 'active',
    pdfUrl: '#'
  }
];

const DEFAULT_SETTINGS: WebsiteSettings = {
  companyName: 'EKAKSH PHARMA',
  division: 'Dionysus Pharma',
  established: '1 January 2025',
  tagline: 'Delivering Health, Trust & Innovation',
  subheading: 'Providing high-quality pharmaceutical solutions with a strong focus on healthcare excellence, innovation, and customer satisfaction.',
  phone: '+91 93890 49159, +91 96508 57719',
  address: 'Gadda Colony Road, Kashipur, Udham Singh Nagar, Uttarakhand – 244713, India',
  gstNumber: '05CNLPC4830L1ZY',
  workingDays: 'Monday - Saturday',
  workingHours: '9:00 AM - 6:00 PM'
};

// Seed LocalStorage helper for fallback
const initLocalStorage = () => {
  if (!localStorage.getItem('ekaksh_products')) {
    localStorage.setItem('ekaksh_products', JSON.stringify(DEFAULT_PRODUCTS));
  }
  if (!localStorage.getItem('ekaksh_categories')) {
    localStorage.setItem('ekaksh_categories', JSON.stringify(DEFAULT_CATEGORIES));
  }
  if (!localStorage.getItem('ekaksh_settings')) {
    localStorage.setItem('ekaksh_settings', JSON.stringify(DEFAULT_SETTINGS));
  } else {
    try {
      const stored = localStorage.getItem('ekaksh_settings');
      if (stored) {
        const settings = JSON.parse(stored);
        if (settings.phone === '+91 9389049159' || settings.phone === '+91 93890 49159') {
          settings.phone = '+91 93890 49159, +91 96508 57719';
          localStorage.setItem('ekaksh_settings', JSON.stringify(settings));
        }
      }
    } catch (e) {
      console.error("Failed to migrate settings:", e);
    }
  }
  if (!localStorage.getItem('ekaksh_messages')) {
    localStorage.setItem('ekaksh_messages', JSON.stringify([]));
  }
  if (!localStorage.getItem('ekaksh_session')) {
    localStorage.setItem('ekaksh_session', 'null');
  }
};
initLocalStorage();

// Expose modes
export { useFirebase, isCloudinaryConfigured };

// -------------------------------------------------------------
// Database Operations (Products)
// -------------------------------------------------------------
export const getProducts = async (): Promise<Product[]> => {
  if (useFirebase && firestoreDb) {
    try {
      const querySnapshot = await getDocs(collection(firestoreDb, 'products'));
      const list: Product[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        list.push({ 
          id: doc.id, 
          ...data,
          // Wrap with Cloudinary dynamic optimization transformations
          image: getOptimizedUrl(data.imageUrl || data.image || '/muconib_tablets.png'),
          publicId: data.publicId || ""
        } as Product);
      });
      return list;
    } catch (err) {
      console.error("Firebase getProducts error, loading from local:", err);
    }
  }
  
  return JSON.parse(localStorage.getItem('ekaksh_products') || '[]');
};

export const addProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  const newId = 'prod_' + Math.random().toString(36).substr(2, 9);
  const timestamp = new Date().toISOString();
  const newProduct: Product = { ...product, id: newId, createdAt: timestamp, updatedAt: timestamp };

  if (useFirebase && firestoreDb) {
    try {
      const docRef = await addDoc(collection(firestoreDb, 'products'), {
        name: product.name,
        category: product.category,
        description: product.description,
        imageUrl: product.image, // store public URL
        image: product.image,
        publicId: product.publicId || "", // Save Cloudinary Public ID
        status: product.status,
        pdfUrl: product.pdfUrl || '#',
        createdAt: timestamp,
        updatedAt: timestamp
      });
      return { ...product, id: docRef.id, createdAt: timestamp, updatedAt: timestamp };
    } catch (err) {
      console.error("Firebase addProduct error, saving to local:", err);
    }
  }

  const products = await getProducts();
  products.push(newProduct);
  localStorage.setItem('ekaksh_products', JSON.stringify(products));
  return newProduct;
};

export const updateProduct = async (id: string, updatedFields: Partial<Product>): Promise<void> => {
  const timestamp = new Date().toISOString();
  const docFields: any = { 
    ...updatedFields, 
    updatedAt: timestamp 
  };
  // Maintain sync between backend field imageUrl and frontend field image
  if (updatedFields.image !== undefined) {
    docFields.imageUrl = updatedFields.image;
  }

  if (useFirebase && firestoreDb) {
    try {
      const docRef = doc(firestoreDb, 'products', id);
      await updateDoc(docRef, docFields);
      return;
    } catch (err) {
      console.error("Firebase updateProduct error, updating local:", err);
    }
  }

  const products = await getProducts();
  const idx = products.findIndex(p => p.id === id);
  if (idx > -1) {
    products[idx] = { ...products[idx], ...updatedFields };
    localStorage.setItem('ekaksh_products', JSON.stringify(products));
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  if (useFirebase && firestoreDb) {
    try {
      const docRef = doc(firestoreDb, 'products', id);
      await deleteDoc(docRef);
      return;
    } catch (err) {
      console.error("Firebase deleteProduct error, deleting local:", err);
    }
  }

  const products = await getProducts();
  const filtered = products.filter(p => p.id !== id);
  localStorage.setItem('ekaksh_products', JSON.stringify(filtered));
};

// -------------------------------------------------------------
// Database Operations (Categories)
// -------------------------------------------------------------
export const getCategories = async (): Promise<Category[]> => {
  if (useFirebase && firestoreDb) {
    try {
      const querySnapshot = await getDocs(collection(firestoreDb, 'categories'));
      const list: Category[] = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as Category);
      });
      return list;
    } catch (err) {
      console.error("Firebase getCategories error:", err);
    }
  }

  return JSON.parse(localStorage.getItem('ekaksh_categories') || '[]');
};

export const addCategory = async (category: Omit<Category, 'id'>): Promise<Category> => {
  const newId = 'cat_' + Math.random().toString(36).substr(2, 9);
  const newCat: Category = { ...category, id: newId };

  if (useFirebase && firestoreDb) {
    try {
      const docRef = await addDoc(collection(firestoreDb, 'categories'), category);
      return { ...category, id: docRef.id };
    } catch (err) {
      console.error("Firebase addCategory error:", err);
    }
  }

  const categories = await getCategories();
  categories.push(newCat);
  localStorage.setItem('ekaksh_categories', JSON.stringify(categories));
  return newCat;
};

export const deleteCategory = async (id: string): Promise<void> => {
  if (useFirebase && firestoreDb) {
    try {
      const docRef = doc(firestoreDb, 'categories', id);
      await deleteDoc(docRef);
      return;
    } catch (err) {
      console.error("Firebase deleteCategory error:", err);
    }
  }

  const categories = await getCategories();
  const filtered = categories.filter(c => c.id !== id);
  localStorage.setItem('ekaksh_categories', JSON.stringify(filtered));
};

// -------------------------------------------------------------
// Database Operations (Settings)
// -------------------------------------------------------------
export const getSettings = async (): Promise<WebsiteSettings> => {
  if (useFirebase && firestoreDb) {
    try {
      const docRef = doc(firestoreDb, 'websiteSettings', 'main');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as WebsiteSettings;
        if (data.phone === '+91 9389049159' || data.phone === '+91 93890 49159') {
          const updated = { ...data, phone: '+91 93890 49159, +91 96508 57719' };
          try {
            await setDoc(docRef, updated);
            console.log("Migrated Firestore settings phone numbers.");
          } catch (e) {
            console.error("Failed to update Firestore settings during migration:", e);
          }
          return updated;
        }
        return data;
      }
    } catch (err) {
      console.error("Firebase getSettings error:", err);
    }
  }

  const localSettings = JSON.parse(localStorage.getItem('ekaksh_settings') || JSON.stringify(DEFAULT_SETTINGS));
  if (localSettings.phone === '+91 9389049159' || localSettings.phone === '+91 93890 49159') {
    localSettings.phone = '+91 93890 49159, +91 96508 57719';
    localStorage.setItem('ekaksh_settings', JSON.stringify(localSettings));
  }
  return localSettings;
};

export const updateSettings = async (settings: WebsiteSettings): Promise<void> => {
  if (useFirebase && firestoreDb) {
    try {
      const docRef = doc(firestoreDb, 'websiteSettings', 'main');
      await setDoc(docRef, settings);
      return;
    } catch (err) {
      console.error("Firebase updateSettings error:", err);
    }
  }

  localStorage.setItem('ekaksh_settings', JSON.stringify(settings));
};

// -------------------------------------------------------------
// Database Operations (Contact Messages)
// -------------------------------------------------------------
export const getMessages = async (): Promise<ContactMessage[]> => {
  if (useFirebase && firestoreDb) {
    try {
      const querySnapshot = await getDocs(collection(firestoreDb, 'contactMessages'));
      const list: ContactMessage[] = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as ContactMessage);
      });
      return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    } catch (err) {
      console.error("Firebase getMessages error:", err);
    }
  }

  const msgs = JSON.parse(localStorage.getItem('ekaksh_messages') || '[]');
  return msgs.sort((a: ContactMessage, b: ContactMessage) => b.createdAt.localeCompare(a.createdAt));
};

export const addMessage = async (msg: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>): Promise<ContactMessage> => {
  const timestamp = new Date().toISOString();
  const newMsg: ContactMessage = {
    ...msg,
    id: 'msg_' + Math.random().toString(36).substr(2, 9),
    createdAt: timestamp,
    status: 'unread'
  };

  if (useFirebase && firestoreDb) {
    try {
      const docRef = await addDoc(collection(firestoreDb, 'contactMessages'), {
        name: newMsg.name,
        email: newMsg.email,
        phone: newMsg.phone,
        subject: newMsg.subject || 'General Inquiry',
        message: newMsg.message,
        createdAt: newMsg.createdAt,
        status: newMsg.status
      });
      return { ...newMsg, id: docRef.id };
    } catch (err) {
      console.error("Firebase addMessage error:", err);
    }
  }

  const msgs = await getMessages();
  msgs.push(newMsg);
  localStorage.setItem('ekaksh_messages', JSON.stringify(msgs));
  return newMsg;
};

export const updateMessageStatus = async (id: string, status: 'read' | 'unread'): Promise<void> => {
  if (useFirebase && firestoreDb) {
    try {
      const docRef = doc(firestoreDb, 'contactMessages', id);
      await updateDoc(docRef, { status });
      return;
    } catch (err) {
      console.error("Firebase updateMessageStatus error:", err);
    }
  }

  const msgs = await getMessages();
  const idx = msgs.findIndex(m => m.id === id);
  if (idx > -1) {
    msgs[idx].status = status;
    localStorage.setItem('ekaksh_messages', JSON.stringify(msgs));
  }
};

export const deleteMessage = async (id: string): Promise<void> => {
  if (useFirebase && firestoreDb) {
    try {
      const docRef = doc(firestoreDb, 'contactMessages', id);
      await deleteDoc(docRef);
      return;
    } catch (err) {
      console.error("Firebase deleteMessage error:", err);
    }
  }

  const msgs = await getMessages();
  const filtered = msgs.filter(m => m.id !== id);
  localStorage.setItem('ekaksh_messages', JSON.stringify(filtered));
};

// -------------------------------------------------------------
// Authentication
// -------------------------------------------------------------
export const loginAdmin = async (email: string, password: string): Promise<boolean> => {
  if (useFirebase && firebaseAuth) {
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      return true;
    } catch (err) {
      console.error("Firebase auth error:", err);
      throw err;
    }
  }

  // Local Authentication Fallback
  if (email === "admin@ekakshpharma.com" && password === "admin123") {
    localStorage.setItem('ekaksh_session', JSON.stringify({ email, role: 'admin', ts: Date.now() }));
    return true;
  }
  
  throw new Error("Invalid username or password.");
};

export const logoutAdmin = async (): Promise<void> => {
  if (useFirebase && firebaseAuth) {
    try {
      await signOut(firebaseAuth);
      return;
    } catch (err) {
      console.error("Firebase logout error:", err);
    }
  }

  localStorage.setItem('ekaksh_session', 'null');
};

export const checkAdminAuth = (callback: (user: { email: string } | null) => void) => {
  if (useFirebase && firebaseAuth) {
    return onAuthStateChanged(firebaseAuth, (user) => {
      if (user && user.email) {
        callback({ email: user.email });
      } else {
        callback(null);
      }
    });
  }

  // Local storage check
  const checkSession = () => {
    const sessionStr = localStorage.getItem('ekaksh_session');
    if (sessionStr && sessionStr !== 'null') {
      const session = JSON.parse(sessionStr);
      // Expire session after 2 hours
      if (Date.now() - session.ts < 2 * 60 * 60 * 1000) {
        return { email: session.email };
      } else {
        localStorage.setItem('ekaksh_session', 'null');
      }
    }
    return null;
  };

  callback(checkSession());
  
  // Return a dummy unsubscribe function
  return () => {};
};

// -------------------------------------------------------------
// Analytics
// -------------------------------------------------------------
export const getAnalytics = async () => {
  const products = await getProducts();
  const categories = await getCategories();
  const messages = await getMessages();
  
  // Track page visits in LocalStorage
  let visits = parseInt(localStorage.getItem('ekaksh_visits') || '0', 10);
  if (visits === 0) {
    visits = 1284; // Seed with a professional start number
    localStorage.setItem('ekaksh_visits', visits.toString());
  }

  return {
    totalProducts: products.length,
    totalCategories: categories.length,
    totalLeads: messages.length,
    websiteVisits: visits
  };
};

export const incrementVisits = () => {
  let visits = parseInt(localStorage.getItem('ekaksh_visits') || '1284', 10);
  visits += 1;
  localStorage.setItem('ekaksh_visits', visits.toString());
};
export { deleteFromCloudinary };
