import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, TrendingUp, ShieldCheck, BarChart3, Gem, Layers, User, Mail, Phone, DollarSign, Users, Send, Cpu, Network, Search, Database, Zap, Lock, Check, HelpCircle, X, Code2, Globe, Plug, Settings, PenTool, MessageSquarePlus, Building2 } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, onAuthStateChanged, signOut } from 'firebase/auth';

// --- Firebase Config ---
const firebaseConfig = {
  apiKey: "AIzaSyBj2ELfj1r063Faggz9klE4bhfwx18AyzA",
  authDomain: "lumina-8b690.firebaseapp.com",
  projectId: "lumina-8b690",
  storageBucket: "lumina-8b690.firebasestorage.app",
  messagingSenderId: "441009400032",
  appId: "1:441009400032:web:facd97bf7e6749a12f8885"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// --- Reusable Components ---

const Background = () => (
  <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
    {/* Base Mesh Gradient */}
    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gold-200/30 rounded-full blur-[120px] animate-blob mix-blend-multiply" />
    <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-100/30 rounded-full blur-[120px] animate-blob animation-delay-2000 mix-blend-multiply" />
    <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] bg-rose-100/30 rounded-full blur-[120px] animate-blob animation-delay-4000 mix-blend-multiply" />

    {/* Grid Overlay */}
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
  </div>
);

const Section = ({ children, className = "", id }: { children?: React.ReactNode; className?: string; id?: string }) => (
  <section id={id} className={`relative px-6 py-24 md:px-12 md:py-32 max-w-7xl mx-auto ${className}`}>
    {children}
  </section>
);

const FadeIn = ({ children, delay = 0, className = "" }: { children?: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    className={className}
  >
    {children}
  </motion.div>
);

const Button = ({ children, variant = 'primary', icon = false, onClick, className = '' }: { children?: React.ReactNode; variant?: 'primary' | 'outline' | 'ghost' | 'white' | 'gold'; icon?: boolean; onClick?: () => void; className?: string }) => {
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 text-sm font-medium transition-all duration-300 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 group";

  const variants = {
    primary: "bg-stone-900 text-white hover:bg-stone-800 shadow-lg hover:shadow-xl hover:-translate-y-0.5 border border-transparent",
    outline: "bg-transparent text-stone-900 border border-stone-300 hover:border-stone-900 hover:bg-stone-50",
    ghost: "bg-transparent text-stone-600 hover:text-stone-900 hover:bg-gold-50/50",
    white: "bg-white text-stone-900 hover:bg-stone-50 shadow-lg hover:shadow-xl hover:-translate-y-0.5 border border-transparent",
    gold: "bg-gold-500 text-white hover:bg-gold-600 shadow-lg hover:shadow-xl border border-transparent"
  };

  return (
    <button onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
      {icon && <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />}
    </button>
  );
};

const InputField = ({ icon: Icon, placeholder, name, value, onChange, type = "text", required = true, textarea = false }: any) => (
  <div className="relative group">
    <div className="absolute inset-y-0 left-0 pl-4 top-4 flex items-start pointer-events-none">
      {Icon && <Icon className="h-5 w-5 text-stone-500 group-focus-within:text-stone-900 transition-colors" />}
    </div>
    {textarea ? (
      <textarea
        name={name}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={4}
        className="w-full bg-white border border-stone-200 rounded-xl py-4 pl-12 pr-4 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/20 focus:border-stone-900/20 transition-all shadow-sm resize-none"
      />
    ) : (
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-white border border-stone-200 rounded-xl py-4 pl-12 pr-4 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/20 focus:border-stone-900/20 transition-all shadow-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
    )}
  </div>
);

// --- Navbar ---
const Navbar = ({ onNavigate, currentPage, user, onSignOut }: { onNavigate: (page: any, hash?: string) => void, currentPage: any, user: any, onSignOut: () => void }) => {
  const [scrolled, setScrolled] = useState(false);
  const isDark = currentPage === 'engine';
  const isAuthPage = currentPage === 'login' || currentPage === 'signup';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Theme-based styles
  const navBackground = scrolled
    ? (isDark ? 'bg-stone-900/90 backdrop-blur-md border-b border-stone-800 py-4' : 'bg-white/80 backdrop-blur-md border-b border-stone-100 py-4')
    : 'bg-transparent py-6';

  const textColor = isDark ? 'text-stone-300' : 'text-stone-600';
  const hoverColor = isDark ? 'hover:text-white' : 'hover:text-stone-900';
  const logoColor = isDark ? 'text-white' : 'text-stone-900';
  const loginColor = isDark ? 'text-stone-300 hover:text-white' : 'text-stone-900 hover:text-gold-600';

  if (isAuthPage) {
    return (
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-6`}>
        <div className="flex items-center justify-between max-w-7xl mx-auto px-6 md:px-12">
          <div className={`flex items-center gap-2 font-serif text-2xl font-semibold tracking-tight cursor-pointer transition-colors text-stone-900`} onClick={() => onNavigate('home')}>
            <Sparkles className="w-6 h-6 text-gold-500 fill-gold-500" />
            <span>Lumina</span>
          </div>
          <button onClick={() => onNavigate('home')} className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors">
            Back to Home
          </button>
        </div>
      </nav>
    )
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBackground}`}>
      <div className="flex items-center justify-between max-w-7xl mx-auto px-6 md:px-12">
        <div className={`flex items-center gap-2 font-serif text-2xl font-semibold tracking-tight cursor-pointer transition-colors ${logoColor}`} onClick={() => onNavigate('home')}>
          <Sparkles className="w-6 h-6 text-gold-500 fill-gold-500" />
          <span>Lumina</span>
        </div>
        <div className={`hidden md:flex items-center gap-8 text-sm font-medium ${textColor}`}>
          <button
            onClick={() => onNavigate('home', 'proof')}
            className={`transition-colors ${hoverColor}`}
          >
            Our Impact
          </button>
          <button
            onClick={() => onNavigate('engine')}
            className={`transition-colors ${hoverColor} ${currentPage === 'engine' ? 'text-gold-500 font-bold' : ''}`}
          >
            The AI Engine
          </button>
          <button
            onClick={() => onNavigate('pricing')}
            className={`transition-colors ${hoverColor} ${currentPage === 'pricing' ? 'text-gold-600 font-bold' : ''}`}
          >
            Pricing
          </button>
          <button
            onClick={() => onNavigate('about')}
            className={`transition-colors ${hoverColor} ${currentPage === 'about' ? 'text-gold-600 font-bold' : ''}`}
          >
            About
          </button>
        </div>
        <div className="flex items-center gap-8">
          {user ? (
            <div className="flex items-center gap-4">
              <span className={`text-sm font-medium ${textColor}`}>Hi, {user.displayName || 'Creator'}</span>
              <Button variant={isDark ? "white" : "outline"} className="py-2 px-4 text-xs" onClick={onSignOut}>Sign Out</Button>
            </div>
          ) : (
            <>
              <button onClick={() => onNavigate('login')} className={`hidden md:block text-sm font-medium transition-colors ${loginColor}`}>Log in</button>
              <Button variant={isDark ? "white" : "primary"} className="py-2 px-4 text-xs" onClick={() => onNavigate('signup')}>Get Started</Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

// --- Hero Section ---
const Hero = ({ onNavigate }: { onNavigate: (page: 'home' | 'engine') => void }) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Text Content */}
        <div className="relative z-10">
          <FadeIn delay={0.1}>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-xs font-medium tracking-wide uppercase rounded-full bg-gold-100 text-gold-800 border border-gold-200">
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex w-full h-full bg-gold-400 rounded-full opacity-75 animate-ping"></span>
                <span className="relative inline-flex w-2 h-2 bg-gold-500 rounded-full"></span>
              </span>
              The Future of Accessory Retail
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <h1 className="font-serif text-5xl md:text-7xl leading-[1.1] text-stone-900 mb-6">
              Scale your brand with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-600 to-amber-700 font-serif italic pr-2">Lumina</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p className="text-lg md:text-xl text-stone-600 mb-8 max-w-lg leading-relaxed">
              Don't just sell accessories—curate desire. Lumina’s AI engine analyzes market signals to help you stock the right pieces, style the perfect looks, and capture customers before your competitors even wake up.
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button icon>Start Growing Today</Button>
              <Button variant="outline" onClick={() => onNavigate('engine')}>See How It Works</Button>
            </div>
          </FadeIn>

          <FadeIn delay={0.5} className="mt-12 flex items-center gap-4 text-sm text-stone-500">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-stone-200">
                  <img src={`https://picsum.photos/100/100?random=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <p>Powering 500+ High-Growth Brands</p>
          </FadeIn>
        </div>

        {/* Visual Content - Parallax Composition */}
        <div className="relative h-[600px] hidden lg:block perspective-1000">
          {/* Main Card */}
          <motion.div style={{ y: y1 }} className="absolute top-0 right-0 w-[80%] h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-100 z-10 group">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-black/10 z-10 pointer-events-none" />
            {/* Updated with a high-quality fashion image - White/Gold Aesthetic */}
            <img src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2670&auto=format&fit=crop" alt="Luxury Gold Accessories" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />

            {/* Floating UI Elements on the image */}
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/90 backdrop-blur-md rounded-xl border border-white/50 shadow-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-stone-500 uppercase">Conversion Uplift</span>
                <span className="text-emerald-600 text-xs font-bold">+142%</span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '75%' }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  className="bg-gold-500 h-full rounded-full"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// --- Value Prop Section ---
const ValueProp = () => {
  const cards = [
    {
      title: "Hyper-Personalization",
      desc: "Our AI analyzes micro-trends and user behavior to present the perfect accessory to the right customer.",
      icon: <Gem className="w-6 h-6" />,
      stat: "3x",
      statLabel: "Engagement"
    },
    {
      title: "Predictive Inventory",
      desc: "Never overstock or sell out. We forecast demand with 98% accuracy based on social signals.",
      icon: <BarChart3 className="w-6 h-6" />,
      stat: "-40%",
      statLabel: "Waste"
    },
    {
      title: "Automated Styling",
      desc: "Virtual try-ons and automated bundling suggestions that increase average order value instantly.",
      icon: <Layers className="w-6 h-6" />,
      stat: "+65%",
      statLabel: "AOV"
    }
  ];

  return (
    <Section className="bg-white/50 backdrop-blur-sm rounded-[3rem] border border-white/50 my-10 shadow-sm">
      <div className="text-center max-w-3xl mx-auto mb-20">
        <FadeIn>
          <h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-6">The Intelligence Behind Beauty</h2>
          <p className="text-stone-600 text-lg">
            We don't just build websites; we build intelligent systems that learn from every interaction to grow your brand autonomously.
          </p>
        </FadeIn>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map((card, i) => (
          <React.Fragment key={i}>
            <FadeIn delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-2xl border border-stone-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 group h-full relative overflow-hidden"
              >
                {/* Top gradient line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-300 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

                <div className="w-12 h-12 bg-gold-50 rounded-xl flex items-center justify-center text-gold-600 mb-6 group-hover:bg-gold-500 group-hover:text-white transition-colors duration-300">
                  {card.icon}
                </div>

                <h3 className="font-serif text-2xl text-stone-900 mb-3">{card.title}</h3>
                <p className="text-stone-600 mb-8 leading-relaxed text-sm">{card.desc}</p>

                <div className="border-t border-stone-100 pt-6 flex items-center justify-between">
                  <div>
                    <span className="block text-3xl font-bold text-stone-900">{card.stat}</span>
                    <span className="text-xs text-stone-500 uppercase tracking-wider">{card.statLabel}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 group-hover:border-gold-500 group-hover:text-gold-500 transition-colors">
                    <ArrowRight size={14} />
                  </div>
                </div>
              </motion.div>
            </FadeIn>
          </React.Fragment>
        ))}
      </div>
    </Section>
  );
};

// --- Detailed Features ---
const DetailedFeatures = () => {
  return (
    <Section>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
        <FadeIn className="order-2 lg:order-1">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-gold-400 to-rose-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative bg-white rounded-xl shadow-xl overflow-hidden border border-stone-100 p-2">
              <img src="https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?q=80&w=2670&auto=format&fit=crop" alt="Detailed Jewelry Shot" className="rounded-lg w-full" />

              {/* Floating UI Analysis */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute top-10 left-10 bg-white/90 backdrop-blur shadow-lg p-4 rounded-lg border border-stone-200"
              >
                <p className="text-xs font-bold text-stone-400 uppercase mb-1">Material Analysis</p>
                <p className="text-sm font-serif text-stone-800">18k Gold Vermeil</p>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1"><ShieldCheck size={12} /> Authenticated</p>
              </motion.div>
            </div>
          </div>
        </FadeIn>

        <FadeIn className="order-1 lg:order-2">
          <h3 className="font-serif text-4xl mb-6">Curated by Algorithms, <br />Approved by Humans.</h3>
          <p className="text-stone-600 text-lg mb-6 leading-relaxed">
            Our proprietary "Velvet Logic" engine scans thousands of style combinations per second. It understands texture, weight, and occasion, curating collections that resonate deeply with your customer's aesthetic profile.
          </p>
          <ul className="space-y-4">
            {['Visual Search Integration', 'Trend Forecasting', 'Dynamic Pricing Models'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-stone-800 font-medium">
                <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <ShieldCheck size={14} />
                </div>
                {item}
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <FadeIn>
          <h3 className="font-serif text-4xl mb-6">Proof in the Numbers.</h3>
          <p className="text-stone-600 text-lg mb-8 leading-relaxed">
            Stop guessing what your customers want. Our dashboard provides real-time insights into which accessory styles are trending up, allowing you to pivot production instantly.
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-stone-50 p-6 rounded-xl border border-stone-100">
              <div className="text-4xl font-serif text-gold-600 mb-2">2.4x</div>
              <div className="text-sm text-stone-600 font-medium">ROI in 90 Days</div>
            </div>
            <div className="bg-stone-50 p-6 rounded-xl border border-stone-100">
              <div className="text-4xl font-serif text-gold-600 mb-2">85%</div>
              <div className="text-sm text-stone-600 font-medium">Retention Rate</div>
            </div>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="bg-stone-900 rounded-2xl p-8 shadow-2xl relative overflow-hidden border border-stone-800">
            {/* Dark UI Mockup */}
            <div className="flex items-center justify-between mb-8 border-b border-stone-800 pb-4">
              <span className="text-stone-400 text-sm">Dashboard</span>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
              </div>
            </div>

            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-stone-800/50 hover:bg-stone-800 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-stone-700 overflow-hidden">
                      <img src={`https://picsum.photos/100/100?random=${i + 50}`} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div>
                      <div className="w-32 h-2.5 bg-stone-600 rounded mb-1.5"></div>
                      <div className="w-20 h-2 bg-stone-700 rounded"></div>
                    </div>
                  </div>
                  <TrendingUp className="text-green-500 w-4 h-4" />
                </div>
              ))}
            </div>

            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-stone-900 to-transparent pointer-events-none"></div>
          </div>
        </FadeIn>
      </div>
    </Section>
  );
};

// --- Impact / Proof Section ---
const Impact = ({ user, onNavigate }: { user: any, onNavigate: (page: any) => void }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [reviews, setReviews] = useState([
    {
      quote: "Lumina transformed our supply chain. We reduced waste by 30% and saw our best quarter ever.",
      author: "Sarah Jenkins",
      role: "CEO, Gilded & Co.",
      img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop"
    },
    {
      quote: "The AI styling engine feels like magic. Our average order value jumped 65% in the first month.",
      author: "Marcus Thorne",
      role: "Creative Director, AURA",
      img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop"
    },
    {
      quote: "Finally, a tool that understands luxury. It's not just data; it's intuition at scale.",
      author: "Elena Vostrova",
      role: "Founder, VELVET",
      img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop"
    },
    {
      quote: "Inventory forecasting used to be a nightmare. Now it's our competitive advantage.",
      author: "David Chen",
      role: "COO, Prism",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
    },
    {
      quote: "We've scaled to 15 countries without adding headcount. Lumina does the heavy lifting.",
      author: "Sophie Al-Fayed",
      role: "VP Growth, NOIR",
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ quote: '', role: '' });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -420 : 420;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleOpenReview = () => {
    if (!user) {
      onNavigate('login');
      return;
    }
    setIsModalOpen(true);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const newReview = {
      quote: formData.quote,
      author: user.displayName || "Lumina Partner",
      role: formData.role || "Partner",
      img: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || "User")}&background=random&color=fff`
    };

    setReviews([newReview, ...reviews]);
    setIsModalOpen(false);
    setFormData({ quote: '', role: '' });

    // Scroll to start to see new review
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  const brands = ["VOGUE", "ELLE", "Gilded & Co.", "VELVET", "AURA", "NOIR", "PRISM", "L'OFFICIEL"];

  return (
    <section className="bg-stone-50 overflow-hidden relative">
      {/* 1. Logos Section */}
      <div className="py-12 border-b border-stone-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-medium text-stone-500 uppercase tracking-widest mb-8">Trusted by 500+ High-Growth Brands</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {brands.map((b, i) => (
              <span key={i} className={`text-2xl md:text-3xl font-serif text-stone-800 ${i % 2 === 0 ? 'italic' : 'font-bold'}`}>{b}</span>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Case Study Section */}
      <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeIn>
            <div className="relative">
              <div className="absolute -inset-4 bg-gold-200/30 rounded-3xl blur-xl"></div>
              <div className="relative bg-white border border-stone-100 p-8 rounded-2xl shadow-xl">
                <div className="flex justify-between items-end mb-8 border-b border-stone-100 pb-8">
                  <div>
                    <p className="text-stone-500 text-sm mb-1">Brand</p>
                    <p className="font-serif text-2xl text-stone-900">Gilded & Co.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-stone-500 text-sm mb-1">Timeline</p>
                    <p className="font-medium text-stone-900">3 Months</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-stone-50 p-4 rounded-lg border border-stone-100">
                    <p className="text-xs font-bold text-stone-400 uppercase mb-2">Before Lumina</p>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-600">Conversion Rate</span>
                      <span className="font-mono text-stone-500">1.8%</span>
                    </div>
                  </div>
                  <div className="bg-stone-900 p-6 rounded-xl shadow-lg transform scale-105 border border-gold-500/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gold-500/10 rounded-full blur-xl"></div>
                    <div className="relative z-10">
                      <p className="text-xs font-bold text-gold-400 uppercase mb-2 flex items-center gap-2">
                        <Sparkles size={12} /> After Lumina
                      </p>
                      <div className="flex justify-between items-end">
                        <span className="text-stone-300">Conversion Rate</span>
                        <div className="text-right">
                          <span className="block font-mono text-3xl text-white font-bold">4.35%</span>
                          <span className="text-xs text-emerald-400 font-bold">+142% Uplift</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-6">
              "We didn't just grow.<br /> We evolved."
            </h2>
            <p className="text-lg text-stone-600 mb-8 leading-relaxed">
              Gilded & Co. was struggling with high acquisition costs and a 1.8% conversion rate. Their inventory was disconnected from current trends, leading to dead stock.
            </p>
            <p className="text-lg text-stone-600 mb-8 leading-relaxed">
              By implementing Lumina's <strong>The AI Engine</strong>, they automated styling recommendations and synchronized stock with real-time demand. The result? A 142% increase in conversion matching our benchmark projections.
            </p>
            <div className="flex items-center gap-4">
              <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop" className="w-12 h-12 rounded-full border-2 border-white shadow-md" alt="Sarah Jenkins" />
              <div>
                <p className="font-bold text-stone-900">Sarah Jenkins</p>
                <p className="text-sm text-stone-500">CEO, Gilded & Co.</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* 3. Testimonials Section (Dark) */}
      <div className="bg-stone-900 text-white py-24 border-t border-stone-800 relative z-10">
        <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h2 className="text-3xl font-serif mb-2">Trusted by Visionaries</h2>
            <p className="text-stone-400">Join the leaders redefining modern luxury.</p>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <button
                onClick={handleOpenReview}
                className="px-5 py-2.5 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 text-sm font-medium hover:bg-gold-500 hover:text-white transition-all duration-300 flex items-center gap-2"
              >
                <MessageSquarePlus size={16} /> Write a Review
              </button>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="px-5 py-2.5 rounded-full border border-stone-700 text-stone-400 text-sm font-medium hover:border-gold-500/50 hover:text-gold-400 transition-all duration-300"
              >
                Log in to Review
              </button>
            )}

            <div className="flex gap-3 ml-4">
              <button
                onClick={() => scroll('left')}
                className="p-3 border border-stone-700 rounded-full hover:bg-stone-800 hover:border-stone-600 transition-all active:scale-95"
                aria-label="Scroll left"
              >
                <ArrowRight className="rotate-180 w-5 h-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="p-3 border border-stone-700 rounded-full hover:bg-stone-800 hover:border-stone-600 transition-all active:scale-95"
                aria-label="Scroll right"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            paddingLeft: 'max(1.5rem, calc((100vw - 80rem) / 2))',
            paddingRight: 'max(1.5rem, calc((100vw - 80rem) / 2))'
          }}
        >
          {reviews.map((t, i) => (
            <div key={i} className="w-[350px] md:w-[450px] shrink-0 snap-start">
              <div className="bg-stone-800/50 backdrop-blur-sm p-8 rounded-2xl border border-stone-700/50 h-full hover:bg-stone-800 transition-colors duration-300 flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 mb-6 text-gold-500">
                    {[1, 2, 3, 4, 5].map(s => <Sparkles key={s} size={14} fill="currentColor" className={s > 4 ? "opacity-30" : ""} />)}
                  </div>
                  <p className="text-stone-200 text-lg leading-relaxed mb-8 font-light italic">"{t.quote}"</p>
                </div>
                <div className="flex items-center gap-4 pt-6 border-t border-stone-700/50">
                  <img src={t.img} className="w-12 h-12 rounded-full object-cover ring-2 ring-stone-700 bg-stone-700" alt={t.author} />
                  <div>
                    <p className="font-semibold text-white">{t.author}</p>
                    <p className="text-sm text-stone-400">{t.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-serif text-stone-900 mb-1">Share Your Experience</h3>
                    <p className="text-sm text-stone-500">Posting as <span className="font-semibold text-stone-800">{user?.displayName}</span></p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-900 transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmitReview} className="space-y-5">
                  <InputField
                    name="quote"
                    placeholder="How has Lumina impacted your brand?"
                    value={formData.quote}
                    onChange={(e: any) => setFormData({ ...formData, quote: e.target.value })}
                    textarea
                    icon={PenTool}
                  />
                  <InputField
                    name="role"
                    placeholder="Your Role & Company (e.g. Founder, Velvet)"
                    value={formData.role}
                    onChange={(e: any) => setFormData({ ...formData, role: e.target.value })}
                    icon={User}
                  />

                  <div className="flex gap-3 pt-4">
                    <Button variant="ghost" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button className="flex-1">Post Review</Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}

// --- Pricing Page ---

const PricingPage = ({ user, onNavigate }: { user: any, onNavigate: (page: any) => void }) => {
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [trialDetails, setTrialDetails] = useState({
    name: '',
    email: '',
    company: '',
    preference: 'trial_only' // 'trial_only' | 'continue'
  });
  const [userQuery, setUserQuery] = useState('');

  const handleOpenTrial = (plan: string) => {
    setSelectedPlan(plan);
    setIsTrialModalOpen(true);
  };

  const handleAskQuestion = () => {
    if (!user) {
      onNavigate('login');
      return;
    }
    setIsQuestionModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTrialModalOpen(false);
    setTrialDetails({ name: '', email: '', company: '', preference: 'trial_only' });
    // Simulate successful submission
    alert(`Welcome to Lumina! Your 14-day trial for ${selectedPlan} has been activated. Check your email for access instructions.`);
  };

  const handleSubmitQuery = (e: React.FormEvent) => {
    e.preventDefault();
    setIsQuestionModalOpen(false);
    setUserQuery('');
    alert("Thank you for your query! Our support team will respond to your email shortly.");
  };

  return (
    <div className="pt-32 pb-24 relative">
      <Section className="!py-12 text-center max-w-4xl mx-auto">
        <FadeIn>
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-medium tracking-wide uppercase rounded-full bg-gold-100 text-gold-800 border border-gold-200">
            <Gem size={12} className="text-gold-600" />
            Invest in Growth
          </div>
          <h1 className="font-serif text-5xl md:text-6xl text-stone-900 mb-6">
            Transparent Pricing for <br />
            <span className="italic text-gold-600">Exponential</span> Returns.
          </h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto mb-16">
            Choose the plan that fits your brand's stage. From emerging designers to global powerhouses, Lumina scales with you.
          </p>
        </FadeIn>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {/* Tier 1 */}
          <FadeIn delay={0.1}>
            <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 relative h-full flex flex-col">
              <h3 className="font-serif text-2xl text-stone-900 mb-2">Emerging Brands</h3>
              <p className="text-sm text-stone-500 mb-6 h-10">Includes a custom-designed flagship store to launch your brand.</p>
              <div className="mb-8">
                <span className="text-4xl font-serif text-stone-900">$79</span>
                <span className="text-stone-500 text-sm">/mo</span>
              </div>
              <Button variant="outline" className="w-full mb-8" onClick={() => handleOpenTrial('Emerging Brands')}>Start Free Trial</Button>
              <div className="space-y-4 flex-grow">
                {/* High-value hook */}
                <div className="flex items-start gap-3 text-sm text-stone-900 font-semibold bg-gold-50/50 p-2 -ml-2 rounded-lg border border-gold-100/50">
                  <Sparkles size={16} className="text-gold-600 mt-0.5 shrink-0" />
                  <span>Custom Luxury Storefront Build</span>
                </div>
                {['Core Trend Data', 'Basic Analytics Dashboard', '5 Team Members', 'Email Support', 'Weekly Market Reports'].map((feat, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-stone-700">
                    <Check size={16} className="text-gold-500 mt-0.5 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Tier 2 */}
          <FadeIn delay={0.2}>
            <div className="bg-stone-900 p-8 rounded-2xl border border-stone-800 shadow-2xl hover:scale-105 transition-all duration-300 relative h-full flex flex-col">
              <div className="absolute top-0 right-0 bg-gold-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl uppercase tracking-wider">
                Most Popular
              </div>
              <h3 className="font-serif text-2xl text-white mb-2">Scale-ups</h3>
              <p className="text-sm text-stone-400 mb-6 h-10">Automate operations for your new custom store.</p>
              <div className="mb-8">
                <span className="text-4xl font-serif text-white">$229</span>
                <span className="text-stone-400 text-sm">/mo</span>
              </div>
              <Button variant="white" className="w-full mb-8" onClick={() => handleOpenTrial('Scale-ups')}>Start Free Trial</Button>
              <div className="space-y-4 flex-grow">
                {['Everything in Emerging', 'Inventory Forecasting', 'Competitor Tracking', 'Advanced Audience Segmentation', '20 Team Members', 'Priority Support'].map((feat, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-stone-300">
                    <Check size={16} className="text-gold-400 mt-0.5 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Tier 3 */}
          <FadeIn delay={0.3}>
            <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 relative h-full flex flex-col">
              <h3 className="font-serif text-2xl text-stone-900 mb-2">Enterprise</h3>
              <p className="text-sm text-stone-500 mb-6 h-10">Full neural network access for global dominance.</p>
              <div className="mb-8 pt-2">
                <span className="text-4xl font-serif text-stone-900">Custom</span>
              </div>
              <Button variant="outline" className="w-full mb-8">Contact Sales</Button>
              <div className="space-y-4 flex-grow">
                {['Everything in Scale-up', 'Full API Access', 'Custom AI Model Training', 'Dedicated Account Strategist', 'Unlimited Seats', 'SLA Guarantees'].map((feat, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-stone-700">
                    <Check size={16} className="text-gold-500 mt-0.5 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>

        <div className="mt-16 bg-gold-50 rounded-xl p-6 border border-gold-100 inline-flex items-center gap-3">
          <Sparkles className="text-gold-600 w-5 h-5" />
          <p className="text-stone-800 text-sm font-medium">
            All plans come with a <strong>14-day free trial</strong>. No credit card required to start.
          </p>
        </div>
      </Section>

      {/* FAQ Mini Section */}
      <Section className="!py-16">
        <div className="max-w-3xl mx-auto">
          <h3 className="font-serif text-4xl text-center mb-12 text-stone-900">FAQs</h3>
          <div className="flex flex-col gap-6">
            {[
              { q: "Can I switch plans later?", a: "Absolutely. You can upgrade or downgrade your plan at any time from your dashboard settings." },
              { q: "Do I need technical skills?", a: "Not for the Emerging or Scale-up plans. Our dashboard is designed for creative directors and merchants, not just data scientists." },
              { q: "How accurate is the forecasting?", a: "Our models currently average 98% accuracy on 3-month demand horizons for established accounts." }
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-lg border border-stone-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex gap-4">
                  <div className="shrink-0 mt-1">
                    <HelpCircle className="w-5 h-5 text-stone-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-stone-900 mb-2">{item.q}</h4>
                    <p className="text-stone-600 leading-relaxed">{item.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Ask a Question Section */}
          <div className="mt-12 text-center">
            <div className="inline-block p-6 rounded-2xl bg-stone-50 border border-stone-100 hover:border-gold-200 transition-colors">
              <h4 className="font-serif text-lg text-stone-900 mb-2">Still have questions?</h4>
              <p className="text-stone-500 text-sm mb-6">We're here to help you understand the power of Lumina.</p>
              <Button onClick={handleAskQuestion} variant={user ? "primary" : "outline"} icon={!!user}>
                {user ? "Submit a Query" : "Log in to Ask"}
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Trial Modal */}
      <AnimatePresence>
        {isTrialModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTrialModalOpen(false)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-serif text-stone-900 mb-1">Start Your Free Trial</h3>
                    <p className="text-sm text-stone-500">Selected Plan: <span className="font-semibold text-stone-800">{selectedPlan}</span></p>
                  </div>
                  <button onClick={() => setIsTrialModalOpen(false)} className="text-stone-400 hover:text-stone-900 transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <InputField
                      name="name"
                      placeholder="Full Name"
                      value={trialDetails.name}
                      onChange={(e: any) => setTrialDetails({ ...trialDetails, name: e.target.value })}
                      icon={User}
                    />
                    <InputField
                      name="email"
                      type="email"
                      placeholder="Work Email"
                      value={trialDetails.email}
                      onChange={(e: any) => setTrialDetails({ ...trialDetails, email: e.target.value })}
                      icon={Mail}
                    />
                    <InputField
                      name="company"
                      placeholder="Company Name"
                      value={trialDetails.company}
                      onChange={(e: any) => setTrialDetails({ ...trialDetails, company: e.target.value })}
                      icon={Building2}
                    />
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-stone-700">Choose your trial path:</p>

                    {/* Option 1: Trial Only */}
                    <div
                      onClick={() => setTrialDetails({ ...trialDetails, preference: 'trial_only' })}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-center gap-4 ${trialDetails.preference === 'trial_only' ? 'border-gold-500 bg-gold-50/50' : 'border-stone-100 hover:border-stone-200'}`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${trialDetails.preference === 'trial_only' ? 'border-gold-500' : 'border-stone-300'}`}>
                        {trialDetails.preference === 'trial_only' && <div className="w-2.5 h-2.5 rounded-full bg-gold-500" />}
                      </div>
                      <div>
                        <p className="font-semibold text-stone-900">Standard Free Trial</p>
                        <p className="text-xs text-stone-500">14 days free access. No commitment required.</p>
                      </div>
                    </div>

                    {/* Option 2: Trial + Continue */}
                    <div
                      onClick={() => setTrialDetails({ ...trialDetails, preference: 'continue' })}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-center gap-4 relative overflow-hidden ${trialDetails.preference === 'continue' ? 'border-gold-500 bg-gold-50/50' : 'border-stone-100 hover:border-stone-200'}`}
                    >
                      <div className="absolute top-0 right-0 bg-gold-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">SAVE 10%</div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${trialDetails.preference === 'continue' ? 'border-gold-500' : 'border-stone-300'}`}>
                        {trialDetails.preference === 'continue' && <div className="w-2.5 h-2.5 rounded-full bg-gold-500" />}
                      </div>
                      <div>
                        <p className="font-semibold text-stone-900">Seamless Scaling</p>
                        <p className="text-xs text-stone-500">14 days free, then auto-upgrade to {selectedPlan}.</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button variant="ghost" className="flex-1" onClick={() => setIsTrialModalOpen(false)}>Cancel</Button>
                    <Button className="flex-1">Activate 14-Day Pass</Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Query Modal */}
      <AnimatePresence>
        {isQuestionModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsQuestionModalOpen(false)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-serif text-stone-900 mb-1">Submit Your Query</h3>
                    <p className="text-sm text-stone-500">Posting as <span className="font-semibold text-stone-800">{user?.displayName}</span></p>
                  </div>
                  <button onClick={() => setIsQuestionModalOpen(false)} className="text-stone-400 hover:text-stone-900 transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmitQuery} className="space-y-5">
                  <InputField
                    name="query"
                    placeholder="What would you like to know?"
                    value={userQuery}
                    onChange={(e: any) => setUserQuery(e.target.value)}
                    textarea
                    icon={HelpCircle}
                  />

                  <div className="flex gap-3 pt-4">
                    <Button variant="ghost" className="flex-1" onClick={() => setIsQuestionModalOpen(false)}>Cancel</Button>
                    <Button className="flex-1">Send Query</Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- CTA Section ---

const CTA = () => {
  const [step, setStep] = useState<'form' | 'result'>('form');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    leadValue: '',
    subscribers: '',
    emailsPerWeek: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('result');
  };

  const calculateLoss = () => {
    // A realistic heuristic for "Lost Revenue" based on unoptimized email marketing.
    // Formula: Subscribers * AvgLeadValue * 0.08
    // Assumption: An unoptimized list misses out on ~8% of potential monthly revenue generation compared to an optimized one (flows, segmentation).
    const subs = parseInt(formData.subscribers.replace(/,/g, '')) || 0;
    const val = parseInt(formData.leadValue.replace(/,/g, '')) || 0;

    const estimatedLoss = (subs * val) * 0.08;
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(estimatedLoss);
  };

  return (
    <Section>
      <div className="relative rounded-[3rem] overflow-hidden bg-gold-200 text-stone-900 py-20 px-6 md:px-12 shadow-2xl border border-gold-300/50">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150 mix-blend-overlay" />
        <div className="absolute -top-[50%] -left-[20%] w-[100%] h-[100%] bg-white/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[50%] h-[50%] bg-orange-100/40 rounded-full blur-[100px]" />

        <div className="relative z-10 max-w-4xl mx-auto">
          {step === 'form' ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-12">
                <h2 className="font-serif text-3xl md:text-5xl mb-4 leading-tight text-stone-900">
                  Revenue. Realized.
                </h2>
                <p className="text-stone-700 text-lg max-w-2xl mx-auto">
                  Calculate the true cost of inaction for your accessory brand.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField icon={User} name="name" placeholder="Brand Name" value={formData.name} onChange={handleChange} />
                  <InputField icon={Mail} name="email" type="email" placeholder="Business Email" value={formData.email} onChange={handleChange} />
                  <InputField icon={Phone} name="phone" type="tel" placeholder="Phone Number (Optional)" required={false} value={formData.phone} onChange={handleChange} />
                  <InputField icon={DollarSign} name="leadValue" type="number" placeholder="Avg. Value per Lead ($)" value={formData.leadValue} onChange={handleChange} />
                  <InputField icon={Users} name="subscribers" type="number" placeholder="Number of Subscribers" value={formData.subscribers} onChange={handleChange} />
                  <InputField icon={Send} name="emailsPerWeek" type="number" placeholder="Emails Sent Per Week" value={formData.emailsPerWeek} onChange={handleChange} />
                </div>

                <div className="flex justify-center pt-4">
                  <Button variant="primary" className="w-full md:w-auto px-12 py-4 text-base">
                    Calculate Missed Revenue
                  </Button>
                </div>
              </form>
              <p className="text-center text-xs text-stone-600 mt-6">
                Your data is secure. We use this only to generate your personalized report.
              </p>
            </div>
          ) : (
            <div className="text-center py-12 animate-in fade-in zoom-in duration-700">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-stone-900/10 text-stone-900 mb-6 ring-1 ring-stone-900/20">
                <TrendingUp className="w-8 h-8 rotate-180" />
              </div>
              <p className="text-stone-600 mb-4 text-lg font-medium uppercase tracking-wide">Potential Monthly Revenue Loss</p>
              <div className="text-5xl md:text-8xl font-serif text-stone-900 mb-8 tracking-tighter">
                {calculateLoss()}
              </div>
              <p className="max-w-xl mx-auto text-stone-700 mb-10 text-lg leading-relaxed">
                Based on your list size and lead value, unoptimized communication is costing you significant growth. Lumina's automated systems can help you recapture this value starting day one.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-stone-900 text-white hover:bg-stone-800 border-none shadow-xl" onClick={() => window.location.reload()}>
                  Stop Losing Revenue
                </Button>
                <Button variant="outline" className="text-stone-900 border-stone-400 hover:bg-white/50 hover:border-stone-900" onClick={() => setStep('form')}>
                  Recalculate
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Section>
  )
}

// --- Integrations Page ---
const IntegrationsPage = ({ onNavigate }: { onNavigate: (page: 'home' | 'engine' | 'pricing' | 'integrations') => void }) => {
  return (
    <div className="pt-32 pb-24">
      {/* Hero for Integrations */}
      <Section className="!py-12 text-center max-w-4xl mx-auto">
        <FadeIn>
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-medium tracking-wide uppercase rounded-full bg-stone-100 text-stone-800 border border-stone-200">
            <Globe size={12} className="text-stone-600" />
            Global Compatibility
          </div>
          <h1 className="font-serif text-5xl md:text-6xl text-stone-900 mb-6">
            Plug-and-Play <br />
            <span className="italic text-gold-600">Luxury Intelligence</span>.
          </h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto mb-10">
            Connect Lumina to your existing commerce stack in minutes. Our engine operates silently in the background, ingesting data and delivering insights without disrupting your operations.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-16 opacity-70">
            {['Shopify', 'Salesforce Commerce Cloud', 'Magento', 'WooCommerce', 'BigCommerce'].map(platform => (
              <span key={platform} className="px-4 py-2 bg-white border border-stone-200 rounded-full text-sm text-stone-600 font-medium">
                {platform}
              </span>
            ))}
          </div>
        </FadeIn>
      </Section>

      {/* Integration Steps */}
      <Section className="bg-white border-y border-stone-100">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl text-stone-900 mb-4">How It Works</h2>
          <p className="text-stone-600">A seamless three-step setup process designed for CTOs and Merchants alike.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-0.5 bg-stone-200 z-0"></div>

          {[
            { icon: <Plug className="w-6 h-6" />, title: "1. Connect Data Source", desc: "Securely link your PIM and OMS via our API. We support one-click OAuth for major platforms." },
            { icon: <Settings className="w-6 h-6" />, title: "2. Calibration", desc: "Velvet Logic ingests 12 months of historical data to establish baselines and train your private model instance." },
            { icon: <Code2 className="w-6 h-6" />, title: "3. Go Live", desc: "Inject our lightweight, non-blocking script tag to enable frontend experiences like Virtual Try-On." }
          ].map((step, i) => (
            <React.Fragment key={i}>
              <FadeIn delay={i * 0.2} className="relative z-10">
                <div className="bg-white p-8 rounded-2xl border border-stone-100 shadow-lg text-center h-full">
                  <div className="w-14 h-14 bg-stone-900 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md border-4 border-white">
                    {step.icon}
                  </div>
                  <h3 className="font-serif text-xl text-stone-900 mb-3">{step.title}</h3>
                  <p className="text-sm text-stone-600 leading-relaxed">{step.desc}</p>
                </div>
              </FadeIn>
            </React.Fragment>
          ))}
        </div>

        <div className="mt-20 text-center">
          <div className="bg-stone-50 p-8 rounded-2xl border border-stone-200 max-w-3xl mx-auto">
            <h3 className="font-serif text-2xl text-stone-900 mb-4">Curious about the Neural Architecture?</h3>
            <p className="text-stone-600 mb-8">
              Dive deep into how Velvet Logic processes visual signals and sentiment data to predict trends with 98% accuracy.
            </p>
            <Button onClick={() => onNavigate('engine')} icon>
              View Engine Specifications
            </Button>
          </div>
        </div>
      </Section>
    </div>
  )
}

// --- Footer ---
const Footer = ({ onNavigate }: { onNavigate: (page: 'home' | 'engine' | 'pricing' | 'integrations' | 'about', hash?: string) => void }) => (
  <footer className="bg-white pt-20 pb-10 border-t border-stone-100">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 items-start">

      {/* Left Side - Platform */}
      <div className="flex flex-col items-center md:items-start order-2 md:order-1">
        <h4 className="font-semibold mb-4 text-stone-900">Platform</h4>
        <ul className="space-y-2 text-stone-500 text-sm text-center md:text-left">
          <li><button onClick={() => onNavigate('engine')} className="hover:text-gold-600 transition-colors">The AI Engine</button></li>
          <li><button onClick={() => onNavigate('integrations')} className="hover:text-gold-600 transition-colors">Integrations</button></li>
          <li><button onClick={() => onNavigate('pricing')} className="hover:text-gold-600 transition-colors">Pricing</button></li>
        </ul>
      </div>

      {/* Center - Brand */}
      <div className="flex flex-col items-center order-1 md:order-2 mb-8 md:mb-0">
        <div className="flex items-center gap-2 font-serif text-2xl font-semibold mb-4">
          <Sparkles className="w-6 h-6 text-gold-600" />
          <span>Lumina</span>
        </div>
        <p className="text-stone-500 text-sm italic font-medium">
          "Curating desire for the modern age."
        </p>
      </div>

      {/* Right Side - Company */}
      <div className="flex flex-col items-center md:items-end order-3">
        <h4 className="font-semibold mb-4 text-stone-900">Company</h4>
        <ul className="space-y-2 text-stone-500 text-sm text-center md:text-right">
          <li><button onClick={() => onNavigate('about', 'about-story')} className="hover:text-gold-600 transition-colors">About</button></li>
          <li><button onClick={() => onNavigate('about', 'about-careers')} className="hover:text-gold-600 transition-colors">Careers</button></li>
          <li><button onClick={() => onNavigate('about', 'about-contact')} className="hover:text-gold-600 transition-colors">Contact</button></li>
        </ul>
      </div>

    </div>
    <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-stone-100 text-center text-xs text-stone-400">
      © 2026 Lumina. All rights reserved.
    </div>
  </footer>
)

// --- Engine Page (Velvet Logic) ---

const EnginePage = ({ onNavigate }: { onNavigate: (page: 'home' | 'engine' | 'pricing' | 'integrations') => void }) => {
  return (
    <div className="bg-stone-900 text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 md:pt-48 md:pb-32 overflow-hidden">
        {/* Abstract Tech Background */}
        <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold-600/20 via-stone-900/0 to-stone-900/0"></div>
          <div className="absolute bottom-0 right-0 w-[50vw] h-[50vh] bg-blue-500/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-xs font-mono font-medium tracking-widest uppercase rounded-full bg-stone-800 text-gold-400 border border-stone-700">
              <Cpu size={12} /> System Status: Online
            </div>
            <h1 className="font-serif text-5xl md:text-8xl mb-8 tracking-tight">
              Velvet <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-amber-600 italic">Logic</span>
            </h1>
            <p className="text-xl text-stone-400 max-w-2xl mx-auto leading-relaxed mb-12">
              The neural network designed for luxury. Velvet Logic ingests millions of data points to predict desire before it happens.
            </p>
            <button
              onClick={() => onNavigate('integrations')}
              className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold text-stone-950 transition-all duration-300 bg-transparent rounded-full hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 focus:ring-offset-stone-900"
            >
              {/* Gradient Background */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gold-300 via-amber-400 to-gold-500 opacity-100 group-hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(196,147,96,0.3)] group-hover:shadow-[0_0_30px_rgba(196,147,96,0.5)]" />

              {/* Shine effect */}
              <div className="absolute inset-0 rounded-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] bg-[position:200%_0,0_0] bg-no-repeat transition-[background-position] duration-[0s] group-hover:duration-[1.5s] group-hover:bg-[position:-200%_0,0_0]" />

              {/* Button Content */}
              <span className="relative flex items-center gap-2 font-bold tracking-wide uppercase text-sm">
                Deploy Integration
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </button>
          </FadeIn>
        </div>
      </section>

      {/* Feature Grid */}
      <Section className="py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Visual Signal Ingestion", icon: <Search className="w-8 h-8 text-blue-400" />, desc: "Our computer vision algorithms scan social feeds, runway footage, and street style blogs to identify emerging patterns in color, silhouette, and texture." },
            { title: "Sentiment Architecture", icon: <Network className="w-8 h-8 text-purple-400" />, desc: "We don't just count likes. We analyze the emotional resonance of engagement to distinguish fleeting fads from enduring movements." },
            { title: "Predictive Supply Chain", icon: <Database className="w-8 h-8 text-green-400" />, desc: "Velvet Logic connects demand signals directly to your inventory management, suggesting reorders automatically." }
          ].map((item, i) => (
            <React.Fragment key={i}>
              <FadeIn delay={i * 0.2}>
                <div className="bg-stone-800/50 p-8 rounded-2xl border border-stone-700 h-full hover:bg-stone-800 transition-colors">
                  <div className="mb-6 bg-stone-900/50 w-16 h-16 rounded-xl flex items-center justify-center border border-stone-700">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-serif mb-4">{item.title}</h3>
                  <p className="text-stone-400 leading-relaxed text-sm">{item.desc}</p>
                </div>
              </FadeIn>
            </React.Fragment>
          ))}
        </div>
      </Section>

      {/* Technical Deep Dive */}
      <Section className="py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <FadeIn>
            <div className="space-y-8">
              <h2 className="text-4xl font-serif">The Black Box, <br />Opened.</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold-900/20 text-gold-500 flex items-center justify-center shrink-0 border border-gold-900/50"><Zap size={20} /></div>
                  <div>
                    <h4 className="text-lg font-bold mb-2">Real-Time Processing</h4>
                    <p className="text-stone-400 text-sm">Latency under 50ms for style recommendations during user browsing sessions.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold-900/20 text-gold-500 flex items-center justify-center shrink-0 border border-gold-900/50"><Lock size={20} /></div>
                  <div>
                    <h4 className="text-lg font-bold mb-2">Private Models</h4>
                    <p className="text-stone-400 text-sm">Your brand data trains a dedicated instance of Velvet Logic. Your insights are yours alone.</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="bg-stone-800 rounded-xl p-2 border border-stone-700 shadow-2xl">
              <div className="bg-stone-950 rounded-lg p-6 font-mono text-xs md:text-sm text-green-400 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-50">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                  </div>
                </div>
                <div className="space-y-2 opacity-80">
                  <p><span className="text-blue-400">const</span> <span className="text-yellow-200">analyzeTrend</span> = <span className="text-blue-400">async</span> (input) ={'>'} {'{'}</p>
                  <p className="pl-4"><span className="text-purple-400">await</span> velvet.connect();</p>
                  <p className="pl-4"><span className="text-stone-500">// Scanning 4.2M nodes</span></p>
                  <p className="pl-4"><span className="text-blue-400">const</span> signal = <span className="text-purple-400">await</span> neuralNet.predict(input.visuals);</p>
                  <p className="pl-4"><span className="text-blue-400">if</span> (signal.confidence {'>'} <span className="text-orange-400">0.98</span>) {'{'}</p>
                  <p className="pl-8"><span className="text-blue-400">return</span> optimizeInventory(signal);</p>
                  <p className="pl-4">{'}'}</p>
                  <p>{'}'}</p>
                  <div className="mt-4 pt-4 border-t border-stone-800 text-stone-500">
                    {'>'} Optimization complete.
                    <br />{'>'} ROI projected: +240%
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </Section>
    </div>
  );
};

// --- About Page ---

const AboutPage = () => {
  return (
    <div className="pt-32 pb-24">
      {/* Hero / Story */}
      <Section id="about-story" className="text-center max-w-4xl mx-auto">
        <FadeIn>
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-medium tracking-wide uppercase rounded-full bg-gold-100 text-gold-800 border border-gold-200">
            <Sparkles size={12} className="text-gold-600" />
            Our Story
          </div>
          <h1 className="font-serif text-5xl md:text-6xl text-stone-900 mb-8">
            The Intersection of <br />
            <span className="italic text-gold-600">Art & Algorithm</span>.
          </h1>
          <p className="text-lg text-stone-600 leading-relaxed mb-8">
            Lumina was born from a simple observation: luxury is no longer about scarcity, but about relevance. In 2026, a fashion editor and a neural network engineer met in Paris and realized they were trying to solve the same problem—how to connect the right object of desire with the right person at the exact moment of inspiration.
          </p>
          <p className="text-lg text-stone-600 leading-relaxed">
            Today, we are a team of 10+ spanning three continents, united by a single mission: to build the digital nervous system for the world's most prestigious accessory brands.
          </p>
        </FadeIn>
      </Section>

      {/* Stats/Values Grid */}
      <Section className="!py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: "Founded", value: "2026" },
            { label: "Global HQ", value: "New York, NY" },
            { label: "Brands Powered", value: "500+" }
          ].map((stat, i) => (
            <React.Fragment key={i}>
              <FadeIn delay={i * 0.1}>
                <div className="p-8 bg-white border border-stone-100 rounded-2xl text-center shadow-sm">
                  <div className="text-4xl font-serif text-stone-900 mb-2">{stat.value}</div>
                  <div className="text-stone-500 uppercase tracking-widest text-xs font-medium">{stat.label}</div>
                </div>
              </FadeIn>
            </React.Fragment>
          ))}
        </div>
      </Section>

      {/* Careers */}
      <div id="about-careers" className="bg-stone-50 py-24 border-y border-stone-200">
        <Section className="!py-0">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <FadeIn>
              <h2 className="font-serif text-4xl text-stone-900 mb-4">Join the Vanguard</h2>
              <p className="text-stone-600 max-w-md">We're looking for visionaries who speak both Python and Prada. Help us define the future of computational luxury.</p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <Button variant="outline" icon>View All Positions</Button>
            </FadeIn>
          </div>

          <div className="space-y-4">
            {[
              { role: "Senior Machine Learning Engineer", dept: "Engineering", loc: "Remote / NY" },
              { role: "Director of Brand Partnerships", dept: "Sales", loc: "London" },
              { role: "Product Designer (Growth)", dept: "Product", loc: "New York" },
              { role: "Fashion Data Analyst", dept: "Data Science", loc: "Paris" }
            ].map((job, i) => (
              <React.Fragment key={i}>
                <FadeIn delay={i * 0.1}>
                  <div className="group flex items-center justify-between p-6 bg-white rounded-xl border border-stone-200 hover:border-gold-400 transition-all cursor-pointer hover:shadow-md">
                    <div>
                      <h3 className="font-serif text-lg text-stone-900 group-hover:text-gold-700 transition-colors">{job.role}</h3>
                      <div className="flex gap-3 text-sm text-stone-500 mt-1">
                        <span>{job.dept}</span>
                        <span>•</span>
                        <span>{job.loc}</span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 group-hover:bg-gold-500 group-hover:text-white transition-all">
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </FadeIn>
              </React.Fragment>
            ))}
          </div>
        </Section>
      </div>

      {/* Contact */}
      <Section id="about-contact" className="text-center">
        <FadeIn>
          <h2 className="font-serif text-4xl text-stone-900 mb-6">Let's Create Together</h2>
          <p className="text-stone-600 mb-12 max-w-xl mx-auto">
            Whether you're a brand looking to scale or a developer looking to build, we'd love to hear from you.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-left">
            <div className="bg-white p-8 rounded-2xl border border-stone-100 shadow-sm flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-gold-50 text-gold-600 rounded-full flex items-center justify-center mb-4">
                <Mail size={20} />
              </div>
              <h3 className="font-semibold text-stone-900 mb-2">General Inquiries</h3>
              <a href="mailto:hello@lumina.ai" className="text-stone-600 hover:text-gold-600 transition-colors">hello@lumina.ai</a>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-stone-100 shadow-sm flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-gold-50 text-gold-600 rounded-full flex items-center justify-center mb-4">
                <Users size={20} />
              </div>
              <h3 className="font-semibold text-stone-900 mb-2">Partnerships</h3>
              <a href="mailto:partners@lumina.ai" className="text-stone-600 hover:text-gold-600 transition-colors">partners@lumina.ai</a>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-stone-100 shadow-sm flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 bg-gold-50 text-gold-600 rounded-full flex items-center justify-center mb-4">
                <Globe size={20} />
              </div>
              <h3 className="font-semibold text-stone-900 mb-2">Visit HQ</h3>
              <p className="text-stone-600">
                140 Broadway, Suite 42<br />New York, NY 10005
              </p>
            </div>
          </div>
        </FadeIn>
      </Section>
    </div>
  );
};

// --- Login Page ---
const LoginPage = ({ onNavigate }: { onNavigate: (page: any) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onNavigate('home');
    } catch (err: any) {
      setError('Failed to log in. Please check your credentials.');
      console.error(err);
    }
  };

  return (
    <Section className="min-h-screen flex items-center justify-center !py-0">
      <div className="w-full max-w-md mt-20">
        <FadeIn>
          <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl border border-stone-200 shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold-50 text-gold-600 mb-4">
                <Lock size={20} />
              </div>
              <h2 className="font-serif text-3xl text-stone-900">Welcome Back</h2>
              <p className="text-stone-500 text-sm mt-2">Access your brand dashboard</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-6 flex items-center gap-2">
                <X size={14} /> {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <InputField
                icon={Mail}
                name="email"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
              />
              <InputField
                icon={Lock}
                name="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
              />
              <Button className="w-full mt-2">Log In</Button>
            </form>
            <div className="mt-8 text-center text-sm text-stone-600">
              Don't have an account? <button onClick={() => onNavigate('signup')} className="text-gold-600 font-bold hover:underline">Sign up</button>
            </div>
          </div>
        </FadeIn>
      </div>
    </Section>
  );
};

// --- Signup Page ---
const SignupPage = ({ onNavigate }: { onNavigate: (page: any) => void }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      onNavigate('home');
    } catch (err: any) {
      setError('Failed to create account. ' + err.message);
    }
  };

  return (
    <Section className="min-h-screen flex items-center justify-center !py-0">
      <div className="w-full max-w-md mt-20">
        <FadeIn>
          <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl border border-stone-200 shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold-50 text-gold-600 mb-4">
                <Sparkles size={20} />
              </div>
              <h2 className="font-serif text-3xl text-stone-900">Start Your Journey</h2>
              <p className="text-stone-500 text-sm mt-2">Join 500+ high-growth brands</p>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-6 flex items-center gap-2">
                <X size={14} /> {error}
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
              <InputField
                icon={User}
                name="name"
                placeholder="Full Name"
                value={name}
                onChange={(e: any) => setName(e.target.value)}
              />
              <InputField
                icon={Mail}
                name="email"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
              />
              <InputField
                icon={Lock}
                name="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e: any) => setPassword(e.target.value)}
              />
              <Button className="w-full mt-2">Create Account</Button>
            </form>
            <div className="mt-8 text-center text-sm text-stone-600">
              Already have an account? <button onClick={() => onNavigate('login')} className="text-gold-600 font-bold hover:underline">Log in</button>
            </div>
          </div>
        </FadeIn>
      </div>
    </Section>
  );
};

// --- Home Component ---
const Home = ({ onNavigate, user }: { onNavigate: (page: 'home' | 'engine' | 'pricing' | 'integrations') => void, user: any }) => {
  return (
    <>
      <Hero onNavigate={onNavigate} />
      <div id="features" className="scroll-mt-32"><ValueProp /></div>
      <DetailedFeatures />
      <div id="proof" className="scroll-mt-32"><Impact user={user} onNavigate={onNavigate} /></div>
      <div id="pricing" className="scroll-mt-32"><CTA /></div>
    </>
  );
};

// --- Main App Component ---
const App = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'engine' | 'pricing' | 'integrations' | 'about' | 'login' | 'signup'>('home');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      setCurrentPage('home');
    });
  };

  // Navigation Logic
  const handleNavigate = (page: 'home' | 'engine' | 'pricing' | 'integrations' | 'about' | 'login' | 'signup', hash?: string) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);

    if (hash) {
      // Small delay to allow the DOM to update if switching pages
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <div className="font-sans antialiased text-stone-900 bg-transparent min-h-screen selection:bg-gold-200 selection:text-gold-900">
      <Background />
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} user={user} onSignOut={handleSignOut} />
      <main>
        {currentPage === 'home' && <Home onNavigate={handleNavigate} user={user} />}
        {currentPage === 'engine' && <EnginePage onNavigate={handleNavigate} />}
        {currentPage === 'pricing' && <PricingPage user={user} onNavigate={handleNavigate} />}
        {currentPage === 'integrations' && <IntegrationsPage onNavigate={handleNavigate} />}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'login' && <LoginPage onNavigate={handleNavigate} />}
        {currentPage === 'signup' && <SignupPage onNavigate={handleNavigate} />}
      </main>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default App;