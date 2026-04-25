/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShoppingBag, X, ChevronRight, ArrowLeft, Menu, Instagram, Mail, ArrowUpRight } from 'lucide-react';
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
  status: string;
}

interface CartItem extends Product {
  quantity: number;
}

type Page = 'home' | 'shop' | 'product' | 'checkout' | 'success';

type GalleryKind = 'deck' | 'person' | 'mood';

interface GalleryTile {
  file: string;
  title: string;
  kind: GalleryKind;
  size: 'tall' | 'wide' | 'square' | 'feature';
}

const homeAssetModules = import.meta.glob('/assets/home/*', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const homeAsset = (file: string) => homeAssetModules[`/assets/home/${file}`];

const HOME_GALLERY: GalleryTile[] = [
  {
    file: 'mood-side-profile-girl.jpg',
    title: 'side profile study',
    kind: 'mood',
    size: 'wide',
  },
  {
    file: 'person-deck-front-01.jpg',
    title: 'styled preview',
    kind: 'person',
    size: 'tall',
  },
  {
    file: 'deck-wall-three-boards-03.jpg',
    title: 'wall trio',
    kind: 'deck',
    size: 'feature',
  },
  {
    file: 'mood-phone-purse-girl.jpg',
    title: 'mirror note',
    kind: 'mood',
    size: 'tall',
  },
  {
    file: 'deck-wall-two-boards.jpg',
    title: 'two-piece wall',
    kind: 'deck',
    size: 'wide',
  },
  {
    file: 'person-deck-back-01.jpg',
    title: 'over the shoulder',
    kind: 'person',
    size: 'tall',
  },
  {
    file: 'mood-phone-aesthetic.jpg',
    title: 'camera roll',
    kind: 'mood',
    size: 'wide',
  },
  {
    file: 'mood-matcha-girl.jpg',
    title: 'matcha break',
    kind: 'mood',
    size: 'square',
  },
  {
    file: 'unclassified-img-5438.jpg',
    title: 'studio table',
    kind: 'mood',
    size: 'wide',
  },
  {
    file: 'unclassified-img-6825.jpg',
    title: 'small detail',
    kind: 'mood',
    size: 'tall',
  },
  {
    file: 'unclassified-instagram-square-01.jpg',
    title: 'square study',
    kind: 'mood',
    size: 'square',
  },
  {
    file: 'deck-wall-four-boards.jpg',
    title: 'four boards',
    kind: 'deck',
    size: 'feature',
  },
  {
    file: 'deck-wall-single-board.jpg',
    title: 'single statement',
    kind: 'deck',
    size: 'wide',
  },
  {
    file: 'deck-wall-three-boards-tezza.jpg',
    title: 'gallery wall',
    kind: 'deck',
    size: 'feature',
  },
];

const PRODUCTS: Product[] = [
  {
    id: 'wall-trio',
    name: 'placeholder product',
    price: 128,
    description: 'Placeholder product description for the debut collection. Replace this with final product copy once the launch designs are selected.',
    image: homeAsset('deck-wall-three-boards-03.jpg'),
    collection: 'debut',
    status: 'limited time'
  },
  {
    id: 'single-statement',
    name: 'placeholder product',
    price: 118,
    description: 'Placeholder product description for a core item. This can describe size, finish, materials, and display details later.',
    image: homeAsset('deck-wall-purses-board.jpg'),
    collection: 'core',
    status: 'core'
  },
  {
    id: 'table-edit',
    name: 'placeholder product',
    price: 136,
    description: 'Placeholder product description for a second core item. Keep this flexible until real photography and specs are ready.',
    image: homeAsset('deck-table-deckedbyemi-board.jpg'),
    collection: 'core',
    status: 'core'
  }
];

const COLLECTIONS = [
  {
    id: 'debut',
    name: 'debut',
    label: 'limited time',
    description: 'The first limited collection from Decked by Emi.',
    image: homeAsset('deck-wall-three-boards-tezza.jpg'),
  },
  {
    id: 'core',
    name: 'core',
    label: 'always around',
    description: 'Signature designs that stay in the shop while seasonal drops move in and out.',
    image: homeAsset('deck-wall-purses-board.jpg'),
  }
];

const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/deckedbyemi/',
  tiktok: 'https://www.tiktok.com/@deckedbyemi',
};

const TikTokIcon = ({ className = '' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 4v10.2a4.2 4.2 0 1 1-4.2-4.2" />
    <path d="M14 4c.7 3 2.6 4.8 5.4 5.2" />
  </svg>
);

// --- Components ---

const Navbar = ({ 
  cartCount, 
  onOpenCart, 
  onNavigate,
  onAbout,
}: { 
  cartCount: number; 
  onOpenCart: () => void; 
  onNavigate: (page: Page) => void;
  onAbout: () => void;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleNavigate = (page: Page) => {
    setIsMenuOpen(false);
    onNavigate(page);
  };
  const handleAbout = () => {
    setIsMenuOpen(false);
    onAbout();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-b border-brand-accent">
      <nav className="px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setIsMenuOpen(open => !open)}
            className="lg:hidden p-1"
            aria-label="Menu"
            aria-expanded={isMenuOpen}
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>
          <button 
            onClick={() => handleNavigate('home')}
            className="cursor-pointer"
            aria-label="Decked by Emi home"
          >
            <img src={homeAsset('logo-primary.png')} alt="Decked by Emi" className="h-16 w-auto sm:h-20" />
          </button>
        </div>
        
        <div className="hidden lg:flex items-center gap-10 text-xs uppercase tracking-[0.2em] font-medium">
          <button onClick={() => handleNavigate('shop')} className="hover:opacity-50 transition-opacity">collections</button>
          <button onClick={handleAbout} className="hover:opacity-50 transition-opacity">about</button>
        </div>

        <button 
          onClick={onOpenCart}
          className="flex items-center gap-2 hover:opacity-50 transition-opacity"
        >
          <span className="text-[10px] font-mono mt-1">({cartCount})</span>
          <ShoppingBag size={20} strokeWidth={1.5} />
        </button>
      </nav>

      {isMenuOpen && (
        <div className="lg:hidden border-t border-brand-accent bg-white px-6 py-5 flex flex-col gap-5 text-xs uppercase tracking-[0.24em] font-bold">
          <button onClick={() => handleNavigate('shop')} className="text-left">collections</button>
          <button onClick={handleAbout} className="text-left">about</button>
        </div>
      )}
    </header>
  );
};

const Footer = ({ onOpenCollections }: { onOpenCollections: (collection?: string) => void }) => (
  <footer className="bg-brand-muted px-6 py-20 mt-20 border-t border-brand-accent">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
      <div className="space-y-6">
        <h3 className="font-serif italic text-2xl lowercase">decked by emi</h3>
        <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
          visual storytelling through skateboard decks made for your room, your wall, and your world.
        </p>
        <div className="flex gap-4">
          <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noreferrer" aria-label="Decked by Emi on Instagram">
            <Instagram size={18} strokeWidth={1.5} className="hover:opacity-50" />
          </a>
          <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noreferrer" aria-label="Decked by Emi on TikTok">
            <TikTokIcon className="w-[18px] h-[18px] hover:opacity-50" />
          </a>
          <a href="mailto:deckedbyemi@gmail.com" aria-label="Email Decked by Emi">
            <Mail size={18} strokeWidth={1.5} className="hover:opacity-50" />
          </a>
        </div>
      </div>
      
      <div className="space-y-4">
        <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold">explore</h4>
        <ul className="text-xs space-y-3 uppercase tracking-widest text-gray-500">
          <li>
            <button onClick={() => onOpenCollections()} className="hover:text-black">collections</button>
          </li>
          <li>
            <button onClick={() => onOpenCollections('debut')} className="hover:text-black">debut</button>
          </li>
          <li>
            <button onClick={() => onOpenCollections('core')} className="hover:text-black">core</button>
          </li>
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

const ProductCard = ({ product, onAddToCart, onOpenProduct }: { product: Product; onAddToCart: (p: Product) => void; onOpenProduct: (p: Product) => void }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="group"
  >
    <button
      type="button"
      onClick={() => onOpenProduct(product)}
      className="relative aspect-[3/4] w-full overflow-hidden bg-brand-muted mb-4 cursor-pointer text-left"
    >
      <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      <span className="absolute top-4 left-4 bg-white/90 text-black text-[9px] uppercase tracking-[0.22em] font-bold px-3 py-2">
        {product.status}
      </span>
      <button 
        onClick={(event) => { event.stopPropagation(); onAddToCart(product); }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] uppercase tracking-[0.2em] px-8 py-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 shadow-sm"
      >
        quick add
      </button>
    </button>
    <div className="flex justify-between items-start">
      <div>
        <button
          type="button"
          onClick={() => onOpenProduct(product)}
          className="text-left text-xs uppercase tracking-widest mb-1 group-hover:underline"
        >
          {product.name}
        </button>
        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium italic">{product.collection}</p>
        <p className="text-xs text-gray-500 leading-5 mt-3 max-w-xs">{product.description}</p>
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
  const [selectedCollection, setSelectedCollection] = useState('all');
  const [selectedProductId, setSelectedProductId] = useState(PRODUCTS[0].id);

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

  const scrollToAbout = () => {
    setPage('home');
    window.setTimeout(() => {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  const openCollections = (collection = 'all') => {
    setSelectedCollection(collection);
    setPage('shop');
    window.scrollTo(0, 0);
  };

  const openProduct = (product: Product) => {
    setSelectedProductId(product.id);
    setPage('product');
    window.scrollTo(0, 0);
  };

  const renderHome = () => {
    const tileSizeClasses: Record<GalleryTile['size'], string> = {
      tall: 'aspect-[4/5]',
      wide: 'aspect-[5/4]',
      square: 'aspect-square',
      feature: 'aspect-[3/4]',
    };

    return (
      <div className="pt-20">
        <section className="px-4 sm:px-6 pt-8 pb-16 md:pt-14 md:pb-24">
          <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-[340px_minmax(0,1fr)] gap-8 lg:gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:sticky lg:top-28 space-y-8"
            >
              <div className="space-y-6">
                <img
                  src={homeAsset('logo-primary.png')}
                  alt="Decked by Emi"
                  className="w-40 sm:w-48 h-auto"
                />
                <div className="space-y-4">
                  <p className="text-[10px] uppercase tracking-[0.38em] font-bold text-gray-400">
                    online store
                  </p>
                  <h1 className="font-serif italic text-5xl sm:text-6xl lg:text-7xl leading-[0.9] tracking-tight">
                    visual storytelling for skateboard decks.
                  </h1>
                  <p className="text-sm leading-7 text-gray-500 max-w-sm">
                    A student-founded creative brand focused on visual storytelling and custom design.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
                <button
                  onClick={() => openCollections()}
                  className="inline-flex items-center justify-center gap-3 bg-black text-white text-[10px] uppercase tracking-[0.24em] font-bold px-7 py-4 hover:opacity-80 transition-opacity"
                >
                  shop the collection <ArrowUpRight size={14} strokeWidth={1.6} />
                </button>
                <button
                  onClick={scrollToAbout}
                  className="inline-flex items-center justify-center gap-3 border border-black text-[10px] uppercase tracking-[0.24em] font-bold px-7 py-4 hover:bg-brand-muted transition-colors"
                >
                  about the brand <ArrowUpRight size={14} strokeWidth={1.6} />
                </button>
              </div>

              <div className="border-y border-brand-accent py-5">
                <p className="text-[10px] uppercase tracking-[0.28em] font-bold text-gray-400">
                  new drops
                </p>
                <p className="mt-3 text-xs leading-6 text-gray-500">
                  Browse the current collection and follow along as new deck designs go live.
                </p>
              </div>
            </motion.div>

            <div className="columns-1 sm:columns-2 xl:columns-3 gap-4 [column-fill:_balance]">
              {HOME_GALLERY.map((tile, index) => {
                const isShopTile = tile.kind !== 'mood';
                return (
                  <motion.button
                    key={tile.file}
                    type="button"
                    aria-label={isShopTile ? `Shop ${tile.title}` : tile.title}
                    onClick={() => isShopTile && openCollections()}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ delay: Math.min(index * 0.025, 0.18) }}
                    className={`group relative mb-4 block w-full break-inside-avoid overflow-hidden bg-brand-muted text-left ${isShopTile ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    <span className={`block overflow-hidden bg-brand-muted ${tileSizeClasses[tile.size]}`}>
                      <img
                        src={homeAsset(tile.file)}
                        alt={tile.title}
                        loading={index < 4 ? 'eager' : 'lazy'}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    </span>
                    {isShopTile && (
                      <span className="absolute right-3 top-3 w-9 h-9 rounded-full bg-white/90 text-black flex items-center justify-center opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                        <ArrowUpRight size={16} strokeWidth={1.7} />
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </section>

        <section id="about" className="scroll-mt-28 border-y border-brand-accent bg-brand-muted/70 px-6 py-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[0.75fr_1.25fr] gap-12 items-start">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] font-bold text-gray-400">about decked by emi</p>
              <h2 className="mt-4 font-serif italic text-4xl md:text-6xl leading-none tracking-tight">
                turning inspiration into something tangible, expressive, and personal.
              </h2>
            </div>
            <div className="bg-white p-8 md:p-12 text-sm md:text-base leading-8 text-gray-600 space-y-6">
              <p>
                decked by emi started as a way to bring the things i love - pinterest boards, pop culture, and personal style - out of my phone and into my space. i wanted to create something i could see every day that actually felt like me.
              </p>
              <p>
                each piece is designed as a form of visual storytelling, turning inspiration into something tangible, expressive, and personal.
              </p>
              <p>
                decked by emi is for anyone who wants their space to feel like their own world. my goal is for you to have the same experience, bringing what you love to life.
              </p>
            </div>
          </div>
        </section>

        <section className="px-6 py-24">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
            <div className="relative min-h-[520px] overflow-hidden bg-brand-muted">
              <img
                src={homeAsset('deck-table-deckedbyemi-board.jpg')}
                alt="Decked by Emi board on a studio table"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-between border border-brand-accent p-8 md:p-12">
              <div className="space-y-6">
                <p className="text-[10px] uppercase tracking-[0.35em] font-bold text-gray-400">the edit</p>
                <h2 className="font-serif italic text-5xl md:text-7xl leading-none tracking-tight">
                  made for walls, shelves, and rooms with a point of view.
                </h2>
                <p className="text-sm leading-7 text-gray-500 max-w-xl">
                  Skateboard decks treated like art pieces: collectible, display-ready, and released through focused drops.
                </p>
              </div>
              <div className="mt-12 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => openCollections()}
                  className="inline-flex items-center justify-center gap-3 bg-black text-white text-[10px] uppercase tracking-[0.24em] font-bold px-7 py-4 hover:opacity-80 transition-opacity"
                >
                  shop collection <ShoppingBag size={14} strokeWidth={1.6} />
                </button>
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-3 border border-black text-[10px] uppercase tracking-[0.24em] font-bold px-7 py-4 hover:bg-brand-muted transition-colors"
                >
                  instagram <Instagram size={14} strokeWidth={1.6} />
                </a>
                <a
                  href={SOCIAL_LINKS.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-3 border border-black text-[10px] uppercase tracking-[0.24em] font-bold px-7 py-4 hover:bg-brand-muted transition-colors"
                >
                  tiktok <TikTokIcon className="w-[14px] h-[14px]" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  };

  const renderShop = () => {
    const visibleProducts = selectedCollection === 'all'
      ? PRODUCTS
      : PRODUCTS.filter(product => product.collection === selectedCollection);
    const activeCollection = COLLECTIONS.find(collection => collection.id === selectedCollection);

    return (
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="pt-32 px-6 max-w-7xl mx-auto min-h-screen"
      >
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mb-16 grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-10 items-end"
        >
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">collections</span>
            <h1 className="text-5xl md:text-7xl font-serif italic lowercase mt-3 leading-none">
              collections
            </h1>
          </div>
          <p className="text-sm leading-7 text-gray-500 max-w-2xl lg:justify-self-end">
            Limited releases alongside core designs that stay available between drops.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-20"
        >
          {COLLECTIONS.map(collection => {
            const isActive = selectedCollection === collection.id;
            const productCount = PRODUCTS.filter(product => product.collection === collection.id).length;
            return (
              <motion.button
                key={collection.id}
                layout
                variants={{
                  hidden: { opacity: 0, y: 18 },
                  show: { opacity: 1, y: 0 },
                }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setSelectedCollection(collection.id)}
                className={`group relative min-h-[460px] overflow-hidden bg-black text-left transition-shadow duration-300 ${isActive ? 'shadow-2xl' : 'shadow-none'}`}
              >
                <img
                  src={collection.image}
                  alt={collection.name}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${isActive ? 'opacity-90 scale-[1.02]' : 'opacity-72'}`}
                />
                <span className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-300 ${isActive ? 'from-black/85 via-black/15 to-transparent opacity-100' : 'from-black/75 via-black/20 to-transparent opacity-95'}`} />
                {isActive && (
                  <motion.span
                    layoutId="collection-active-frame"
                    className="absolute inset-3 border border-white/80"
                  />
                )}
                <span className="absolute inset-x-0 bottom-0 p-7 text-white">
                  <span className="text-[9px] uppercase tracking-[0.28em] font-bold opacity-80">{collection.label}</span>
                  <span className="mt-3 block font-serif italic text-4xl leading-none">{collection.name}</span>
                  <span className="mt-4 block text-xs leading-6 text-white/80">{collection.description}</span>
                  <span className="mt-6 inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] font-bold">
                    {isActive ? 'viewing' : `${productCount} design${productCount === 1 ? '' : 's'}`} <ArrowUpRight size={14} strokeWidth={1.7} />
                  </span>
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-brand-accent pb-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">
              {activeCollection ? activeCollection.label : 'all designs'}
            </span>
            <h2 className="mt-2 text-4xl font-serif italic lowercase">
              {activeCollection ? activeCollection.name : 'all collections'}
            </h2>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar text-[10px] uppercase tracking-[0.22em] font-bold">
            <button
              onClick={() => setSelectedCollection('all')}
              className={`whitespace-nowrap border-b pb-2 ${selectedCollection === 'all' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'}`}
            >
              all
            </button>
            {COLLECTIONS.map(collection => (
              <button
                key={collection.id}
                onClick={() => setSelectedCollection(collection.id)}
                className={`whitespace-nowrap border-b pb-2 ${selectedCollection === collection.id ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-black'}`}
              >
                {collection.name}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          key={selectedCollection}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className={`grid grid-cols-1 gap-12 mb-32 ${visibleProducts.length > 1 ? 'md:grid-cols-2 lg:grid-cols-3' : 'lg:grid-cols-[0.72fr_1fr] items-start'}`}
        >
          <div className={visibleProducts.length === 1 ? 'max-w-md' : ''}>
            {visibleProducts[0] && (
              <ProductCard product={visibleProducts[0]} onAddToCart={addToCart} onOpenProduct={openProduct} />
            )}
          </div>
          {visibleProducts.length === 1 && (
            <div className="border border-brand-accent p-8 md:p-12 min-h-[420px] flex flex-col justify-between">
              <div className="space-y-6">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">drop note</span>
                <h3 className="font-serif italic text-5xl leading-none">
                  limited time
                </h3>
                <p className="text-sm leading-7 text-gray-500 max-w-xl">
                  A limited release for the first drop, available for a set window or while inventory lasts.
                </p>
              </div>
              <button
                onClick={() => setSelectedCollection('all')}
                className="mt-10 inline-flex w-fit items-center gap-3 border-b border-black pb-2 text-[10px] uppercase tracking-[0.24em] font-bold"
              >
                view the full edit <ArrowUpRight size={14} strokeWidth={1.7} />
              </button>
            </div>
          )}
          {visibleProducts.slice(1).map(product => (
            <div key={product.id}>
              <ProductCard product={product} onAddToCart={addToCart} onOpenProduct={openProduct} />
            </div>
          ))}
        </motion.div>
      </motion.div>
    );
  };

  const renderProduct = () => {
    const product = PRODUCTS.find(item => item.id === selectedProductId) ?? PRODUCTS[0];
    const relatedProducts = PRODUCTS.filter(item => item.id !== product.id);
    const detailImages = product.collection === 'debut'
      ? [
          product.image,
          homeAsset('deck-wall-three-boards-tezza.jpg'),
          homeAsset('person-deck-front-01.jpg'),
        ]
      : [
          product.image,
          product.id === 'single-statement' ? homeAsset('deck-wall-two-boards.jpg') : homeAsset('deck-wall-purses-board.jpg'),
          product.id === 'single-statement' ? homeAsset('person-deck-back-01.jpg') : homeAsset('deck-wall-two-boards.jpg'),
        ];

    return (
      <div className="pt-28 px-6 pb-24 max-w-7xl mx-auto min-h-screen">
        <button
          onClick={() => openCollections(product.collection)}
          className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-400 hover:text-black mb-10"
        >
          <ArrowLeft size={14} /> back to {product.collection}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16 items-start">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 aspect-[4/5] bg-brand-muted overflow-hidden">
              <img src={detailImages[0]} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {detailImages.slice(1).map((image, index) => (
              <div key={image} className="aspect-square bg-brand-muted overflow-hidden">
                <img src={image} alt={`${product.name} detail ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          <div className="lg:sticky lg:top-28 space-y-10">
            <div className="space-y-5">
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">{product.status}</p>
              <div className="flex items-start justify-between gap-6">
                <h1 className="font-serif italic text-5xl md:text-7xl leading-none lowercase">{product.name}</h1>
                <span className="text-sm font-mono pt-2">${product.price}</span>
              </div>
              <p className="text-sm leading-7 text-gray-500">{product.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-px bg-brand-accent text-center">
              <div className="bg-white p-5">
                <p className="text-[9px] uppercase tracking-[0.24em] text-gray-400 font-bold">collection</p>
                <p className="mt-2 font-serif italic text-2xl lowercase">{product.collection}</p>
              </div>
              <div className="bg-white p-5">
                <p className="text-[9px] uppercase tracking-[0.24em] text-gray-400 font-bold">format</p>
                <p className="mt-2 font-serif italic text-2xl lowercase">wall deck</p>
              </div>
            </div>

            <button
              onClick={() => addToCart(product)}
              className="w-full bg-black text-white text-[10px] uppercase tracking-[0.3em] font-bold py-5 hover:opacity-80 transition-opacity"
            >
              add to bag
            </button>

            <div className="border-y border-brand-accent divide-y divide-brand-accent text-sm text-gray-500">
              <div className="py-5">
                <h2 className="text-[10px] uppercase tracking-[0.24em] font-bold text-black mb-2">details</h2>
                <p>Placeholder details for size, materials, finish, and what comes in the box.</p>
              </div>
              <div className="py-5">
                <h2 className="text-[10px] uppercase tracking-[0.24em] font-bold text-black mb-2">shipping</h2>
                <p>Shipping, packaging, and processing copy can go here once fulfillment is decided.</p>
              </div>
              <div className="py-5">
                <h2 className="text-[10px] uppercase tracking-[0.24em] font-bold text-black mb-2">returns</h2>
                <p>Return or final-sale language can be added here before launch.</p>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-24">
          <div className="mb-10 flex items-end justify-between border-b border-brand-accent pb-5">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">more designs</p>
              <h2 className="mt-2 font-serif italic text-4xl lowercase">related products</h2>
            </div>
            <button
              onClick={() => openCollections()}
              className="hidden md:inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] font-bold border-b border-black pb-2"
            >
              view all <ArrowUpRight size={14} strokeWidth={1.7} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {relatedProducts.slice(0, 2).map(item => (
              <div key={item.id}>
                <ProductCard product={item} onAddToCart={addToCart} onOpenProduct={openProduct} />
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  };

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
        onNavigate={(p) => {
          if (p === 'shop') setSelectedCollection('all');
          setPage(p);
          window.scrollTo(0, 0);
        }} 
        onAbout={scrollToAbout}
      />
      
      <main>
        {page === 'home' && renderHome()}
        {page === 'shop' && renderShop()}
        {page === 'product' && renderProduct()}
        {page === 'checkout' && renderCheckout()}
        {page === 'success' && renderSuccess()}
      </main>

      {page !== 'success' && <Footer onOpenCollections={openCollections} />}

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
