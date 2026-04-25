/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShoppingBag, X, ChevronRight, ArrowLeft, Menu, Instagram, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useMemo } from 'react';

// --- Types ---

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  collection: string;
}

interface CartItem extends Product {
  quantity: number;
}

type Page = 'home' | 'shop' | 'checkout' | 'success';

// --- Mock Data ---

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'the archive no. 01',
    price: 120,
    description: 'minimalist typography on a pristine white deck. designed for visual stillness.',
    image: 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?auto=format&fit=crop&q=80&w=800',
    collection: 'archive'
  },
  {
    id: '2',
    name: 'city studies: london',
    price: 145,
    description: 'abstract line work mapping the heartbeat of the city.',
    image: 'https://images.unsplash.com/photo-1520106212299-d99c443e4568?auto=format&fit=crop&q=80&w=800',
    collection: 'city studies'
  },
  {
    id: '3',
    name: 'moodboard zero',
    price: 110,
    description: 'a collage of curated moments. grain, roses, and vintage echoes.',
    image: 'https://images.unsplash.com/photo-1531565637446-32307b194362?auto=format&fit=crop&q=80&w=800',
    collection: 'moodboard'
  },
  {
    id: '4',
    name: 'the archive no. 02',
    price: 120,
    description: 'the inverse of stillness. deep black with subtle matte details.',
    image: 'https://images.unsplash.com/photo-1564982024202-9ca94af46124?auto=format&fit=crop&q=80&w=800',
    collection: 'archive'
  },
  {
    id: '5',
    name: 'minimalist flora',
    price: 130,
    description: 'single line botanical drawing on natural maple wood.',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce33e?auto=format&fit=crop&q=80&w=800',
    collection: 'moodboard'
  },
  {
    id: '6',
    name: 'city studies: paris',
    price: 145,
    description: 'lines that tell the story of the seine and the streets that follow it.',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800',
    collection: 'city studies'
  }
];

// --- Components ---

const Navbar = ({ 
  cartCount, 
  onOpenCart, 
  onNavigate 
}: { 
  cartCount: number; 
  onOpenCart: () => void; 
  onNavigate: (page: Page) => void;
}) => (
  <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-brand-accent px-6 py-4 flex justify-between items-center">
    <div className="flex items-center gap-6">
      <button className="lg:hidden p-1">
        <Menu size={20} strokeWidth={1.5} />
      </button>
      <button 
        onClick={() => onNavigate('home')}
        className="font-serif italic text-xl tracking-tight lowercase cursor-pointer"
      >
        decked by emi
      </button>
    </div>
    
    <div className="hidden lg:flex items-center gap-10 text-xs uppercase tracking-[0.2em] font-medium">
      <button onClick={() => onNavigate('shop')} className="hover:opacity-50 transition-opacity">shop</button>
      <button className="hover:opacity-50 transition-opacity">collections</button>
      <button className="hover:opacity-50 transition-opacity">about</button>
    </div>

    <button 
      onClick={onOpenCart}
      className="flex items-center gap-2 hover:opacity-50 transition-opacity"
    >
      <span className="text-[10px] font-mono mt-1">({cartCount})</span>
      <ShoppingBag size={20} strokeWidth={1.5} />
    </button>
  </nav>
);

const Footer = () => (
  <footer className="bg-brand-muted px-6 py-20 mt-20 border-t border-brand-accent">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
      <div className="space-y-6">
        <h3 className="font-serif italic text-2xl lowercase">decked by emi</h3>
        <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
          turning inspiration into something tangible. visual storytelling through custom deck art.
        </p>
        <div className="flex gap-4">
          <Instagram size={18} strokeWidth={1.5} className="cursor-pointer hover:opacity-50" />
          <Mail size={18} strokeWidth={1.5} className="cursor-pointer hover:opacity-50" />
        </div>
      </div>
      
      <div className="space-y-4">
        <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold">explore</h4>
        <ul className="text-xs space-y-3 uppercase tracking-widest text-gray-500">
          <li className="hover:text-black cursor-pointer">all shops</li>
          <li className="hover:text-black cursor-pointer">the archive</li>
          <li className="hover:text-black cursor-pointer">city studies</li>
          <li className="hover:text-black cursor-pointer">custom commissions</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold">newsletter</h4>
        <p className="text-xs text-gray-500">be the first to know about new drops.</p>
        <div className="flex border-b border-black py-2">
          <input 
            type="email" 
            placeholder="EMAIL ADDRESS" 
            className="bg-transparent border-none outline-none text-[10px] w-full tracking-widest"
          />
          <ChevronRight size={14} />
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-gray-200 flex justify-between items-center text-[10px] text-gray-400 tracking-widest uppercase">
      <p>© 2025 decked by emi. all rights reserved.</p>
      <div className="flex gap-6">
        <span>privacy</span>
        <span>terms</span>
      </div>
    </div>
  </footer>
);

const ProductCard = ({ product, onAddToCart }: { product: Product; onAddToCart: (p: Product) => void }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="group"
  >
    <div className="relative aspect-[2/5] overflow-hidden bg-brand-muted mb-4 cursor-pointer">
      <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      <button 
        onClick={() => onAddToCart(product)}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] uppercase tracking-[0.2em] px-8 py-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 shadow-sm"
      >
        quick add
      </button>
    </div>
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-xs uppercase tracking-widest mb-1 group-hover:underline">{product.name}</h3>
        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium italic">{product.collection}</p>
      </div>
      <span className="text-[10px] font-mono">${product.price}</span>
    </div>
  </motion.div>
);

const CartDrawer = ({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQty, 
  onNavigate 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  items: CartItem[]; 
  onUpdateQty: (id: string, delta: number) => void;
  onNavigate: (p: Page) => void;
}) => {
  const total = useMemo(() => items.reduce((sum, item) => sum + (item.price * item.quantity), 0), [items]);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[60] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-brand-accent flex justify-between items-center">
              <h2 className="text-sm uppercase tracking-[0.2em] font-bold">your bag ({items.length})</h2>
              <button onClick={onClose} className="p-2 hover:bg-brand-muted rounded-full transition-colors">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <p className="text-xs uppercase tracking-widest text-gray-400">your bag is empty</p>
                  <button 
                    onClick={() => { onClose(); onNavigate('shop'); }}
                    className="text-[10px] uppercase tracking-[0.2em] underline"
                  >
                    continue shopping
                  </button>
                </div>
              ) : (
                items.map(item => (
                  <div key={item.id} className="flex gap-6">
                    <div className="w-20 aspect-[1/2] bg-brand-muted overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xs uppercase tracking-widest">{item.name}</h3>
                        <span className="text-[10px] font-mono">${item.price}</span>
                      </div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 italic">{item.collection}</p>
                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center border border-brand-accent px-2 py-1 gap-4">
                          <button onClick={() => onUpdateQty(item.id, -1)} className="text-xs">-</button>
                          <span className="text-[10px] font-mono">{item.quantity}</span>
                          <button onClick={() => onUpdateQty(item.id, 1)} className="text-xs">+</button>
                        </div>
                        <button 
                          onClick={() => onUpdateQty(item.id, -item.quantity)}
                          className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-black"
                        >
                          remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-brand-accent space-y-4 bg-brand-muted/30">
                <div className="flex justify-between items-center text-sm uppercase tracking-widest font-bold">
                  <span>subtotal</span>
                  <span className="font-mono">${total}</span>
                </div>
                <p className="text-[10px] text-gray-400 text-center tracking-widest uppercase">
                  shipping and taxes calculated at checkout
                </p>
                <button 
                  onClick={() => { onClose(); onNavigate('checkout'); }}
                  className="w-full bg-black text-white text-[10px] uppercase tracking-[0.3em] font-bold py-5 hover:opacity-80 transition-opacity"
                >
                  checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- Main App ---

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const cartCount = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQty = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const renderHome = () => (
    <div className="space-y-20 pt-24">
      {/* Hero */}
      <section className="px-6 mb-32">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-400">first drop coming soon</h2>
            <h1 className="text-6xl md:text-8xl font-serif italic tracking-tighter leading-none mb-8">
              visual storytelling <br /> for your walls.
            </h1>
            <p className="max-w-lg mx-auto text-sm text-gray-500 leading-relaxed uppercase tracking-widest px-4">
              decked by emi started as a way to bring pinterest boards and personal style out of screens and into spaces.
            </p>
            <div className="flex gap-4 justify-center pt-8 text-[10px]">
              <button 
                onClick={() => setPage('shop')}
                className="bg-black text-white uppercase tracking-[0.2em] font-bold px-10 py-5 hover:opacity-80 transition-all shadow-sm"
              >
                shop all designs
              </button>
              <button className="border border-black uppercase tracking-[0.2em] font-bold px-10 py-5 hover:bg-brand-muted transition-all">
                the archive
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Grid */}
      <section className="px-6 max-w-7xl mx-auto">
        <div className="mb-12 flex justify-between items-end">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">featured</span>
            <h2 className="text-3xl font-serif italic lowercase mt-2">the latest drops</h2>
          </div>
          <button 
            onClick={() => setPage('shop')}
            className="text-[10px] uppercase tracking-[0.2em] border-b border-black pb-1 hover:opacity-50"
          >
            view all
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-12">
          {PRODUCTS.slice(0, 3).map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
          ))}
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-brand-muted px-6 py-32 flex flex-col items-center">
        <div className="max-w-2xl text-center space-y-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-serif italic text-4xl leading-tight"
          >
            "decked by emi is for anyone who wants their space to feel like their own world."
          </motion.div>
          <button className="text-[10px] uppercase tracking-[0.3em] font-bold underline decoration-black/20 underline-offset-8 hover:decoration-black">
            read the story
          </button>
        </div>
      </section>

      {/* Collection Showcase */}
      <section className="px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-px bg-brand-accent">
        <div className="bg-white p-12 flex flex-col justify-between aspect-square">
          <h3 className="text-4xl font-serif italic lowercase max-w-[200px]">the archive series.</h3>
          <div className="space-y-4">
            <p className="text-xs text-gray-500 uppercase tracking-widest leading-relaxed">pristine. minimalist. quiet.</p>
            <button className="text-[10px] uppercase tracking-[0.3em] font-bold border-b border-black pb-2">shop now</button>
          </div>
        </div>
        <div className="bg-black text-white p-12 flex flex-col justify-between aspect-square relative overflow-hidden group">
          <h3 className="text-4xl font-serif italic lowercase max-w-[200px] relative z-10">city studies.</h3>
          <div className="space-y-4 relative z-10">
            <p className="text-xs text-brand-accent uppercase tracking-widest leading-relaxed">architectural echoes in line.</p>
            <button className="text-[10px] uppercase tracking-[0.3em] font-bold border-b border-white pb-2 hover:opacity-50">shop now</button>
          </div>
          <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700">
             <img src="https://images.unsplash.com/photo-1549492423-4002e99738bd?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="City" />
          </div>
        </div>
      </section>
    </div>
  );

  const renderShop = () => (
    <div className="pt-32 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">collection</span>
          <h1 className="text-5xl font-serif italic lowercase mt-2">all shop</h1>
        </div>
        <div className="flex gap-10 text-[10px] uppercase tracking-widest font-bold border-b border-brand-accent pb-4 overflow-x-auto no-scrollbar">
          <button className="text-black border-b border-black pb-4 -mb-4 whitespace-nowrap">view all designs</button>
          <button className="text-gray-400 hover:text-black transition-colors whitespace-nowrap">the archive</button>
          <button className="text-gray-400 hover:text-black transition-colors whitespace-nowrap">city studies</button>
          <button className="text-gray-400 hover:text-black transition-colors whitespace-nowrap">moodboard</button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24 mb-32">
        {PRODUCTS.map(product => (
          <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
        ))}
      </div>
    </div>
  );

  const renderCheckout = () => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return (
      <div className="pt-32 px-6 pb-20 max-w-5xl mx-auto">
        <button 
          onClick={() => setPage('shop')}
          className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-400 hover:text-black mb-12"
        >
          <ArrowLeft size={14} /> back to shop
        </button>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="space-y-12">
            <div>
              <h2 className="text-xs uppercase tracking-[0.2em] font-bold mb-8">1. shipping information</h2>
              <div className="space-y-4">
                <input placeholder="EMAIL" className="checkout-input" />
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="FIRST NAME" className="checkout-input" />
                  <input placeholder="LAST NAME" className="checkout-input" />
                </div>
                <input placeholder="ADDRESS" className="checkout-input" />
                <div className="grid grid-cols-3 gap-4">
                  <input placeholder="CITY" className="checkout-input" />
                  <input placeholder="STATE" className="checkout-input" />
                  <input placeholder="ZIP CODE" className="checkout-input" />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xs uppercase tracking-[0.2em] font-bold mb-8">2. payment method</h2>
              <div className="border border-brand-accent p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-brand-accent pb-4">
                  <span className="text-[10px] uppercase tracking-widest font-bold">credit card</span>
                  <div className="flex gap-2">
                    <div className="w-8 h-5 bg-gray-200 rounded" />
                    <div className="w-8 h-5 bg-gray-200 rounded" />
                  </div>
                </div>
                <input placeholder="CARD NUMBER" className="checkout-input border-none px-0" />
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="MM / YY" className="checkout-input border-none px-0" />
                  <input placeholder="CVC" className="checkout-input border-none px-0" />
                </div>
              </div>
            </div>

            <button 
              onClick={() => setPage('success')}
              className="w-full bg-black text-white text-[10px] uppercase tracking-[0.3em] font-bold py-6 hover:opacity-80 transition-opacity shadow-sm"
            >
              place order — ${total + 20}
            </button>
          </div>

          <div className="bg-brand-muted p-10 h-fit space-y-8 sticky top-32">
            <h2 className="text-xs uppercase tracking-[0.2em] font-bold">order summary</h2>
            <div className="space-y-6">
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative">
                    <div className="w-16 h-20 bg-white p-1">
                      <img src={item.image} className="w-full h-full object-cover" alt="" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-black text-white text-[8px] flex items-center justify-center rounded-full font-bold">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[10px] uppercase tracking-widest font-bold">{item.name}</h3>
                    <p className="text-[8px] uppercase tracking-widest text-gray-400 italic">deck x 1</p>
                  </div>
                  <span className="text-[10px] font-mono">${item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-brand-accent pt-6 space-y-4">
              <div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
                <span className="text-gray-400">subtotal</span>
                <span className="font-mono">${total}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
                <span className="text-gray-400">shipping</span>
                <span className="font-mono text-green-600">+$20.00</span>
              </div>
              <div className="flex justify-between items-center text-xs uppercase tracking-[0.2em] font-bold pt-4 text-black">
                <span>total</span>
                <span className="font-mono">${total + 20}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSuccess = () => (
    <div className="h-screen flex items-center justify-center text-center px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md space-y-8"
      >
        <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-10 shadow-lg">
          <ChevronRight className="text-white" size={32} />
        </div>
        <h1 className="text-4xl font-serif italic lowercase">order received.</h1>
        <p className="text-xs uppercase tracking-widest text-gray-500 leading-relaxed">
          thank you for bringing decked by emi into your world. you'll receive a confirmation email shortly.
        </p>
        <button 
          onClick={() => { setCartItems([]); setPage('home'); }}
          className="text-[10px] uppercase tracking-[0.3em] font-bold border-b border-black pb-2 pt-10"
        >
          back to beginning
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar 
        cartCount={cartCount} 
        onOpenCart={() => setIsCartOpen(true)} 
        onNavigate={(p) => { setPage(p); window.scrollTo(0, 0); }} 
      />
      
      <main>
        {page === 'home' && renderHome()}
        {page === 'shop' && renderShop()}
        {page === 'checkout' && renderCheckout()}
        {page === 'success' && renderSuccess()}
      </main>

      {page !== 'success' && <Footer />}

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems}
        onUpdateQty={updateQty}
        onNavigate={(p) => { setPage(p); window.scrollTo(0, 0); }}
      />
      
      <style>{`
        .checkout-input {
          @apply w-full border border-brand-accent p-4 text-[10px] tracking-widest focus:border-black outline-none transition-colors uppercase font-medium;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
