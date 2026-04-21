'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import { Check, Zap, Shield, Star } from 'lucide-react';
import { motion } from 'framer-motion';

type PlanProps = {
  name: string;
  price: string;
  features: string[];
  isPopular?: boolean;
  icon: React.ReactNode;
  color: string;
}

const PlanCard: React.FC<PlanProps> = ({ name, price, features, isPopular, icon, color }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className={`relative flex flex-col p-8 rounded-[2rem] bg-white/[0.05] backdrop-blur-3xl border ${isPopular ? 'border-purple-500 shadow-2xl shadow-purple-500/10' : 'border-white/10'} transition-all`}
  >
    {isPopular && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-purple-600 text-[10px] font-semibold text-white rounded-full uppercase tracking-widest">
        Best Choice
      </div>
    )}
    
    <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-6`}>
      {React.cloneElement(icon as React.ReactElement<{ size: number }>, { size: 22 })}
    </div>
    
    <h3 className="text-xl font-semibold text-white/80 mb-1">{name}</h3>
    <div className="flex items-baseline gap-1 mb-8">
      <span className="text-3xl font-semibold text-white/80">{price}</span>
      <span className="text-[10px] uppercase font-semibold text-gray-500 tracking-wider">/bulan</span>
    </div>
    
    <ul className="space-y-3.5 mb-10 flex-grow">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start gap-3 text-gray-400 text-[13px] leading-snug">
          <Check size={14} className="text-purple-500 mt-0.5 flex-shrink-0" />
          {feature}
        </li>
      ))}
    </ul>
    
    <button className={`w-full py-3 rounded-full text-xs font-semibold uppercase tracking-widest transition-all active:scale-[0.98] ${isPopular ? 'bg-purple-600 hover:bg-purple-500 text-white/80 shadow-xl shadow-purple-900/20' : 'bg-white/5 hover:bg-white/10 text-white/80'}`}>
      Subscribe Now
    </button>
  </motion.div>
);

const SubscribePage: React.FC = () => {
  const plans = [
    {
      name: 'Essential',
      price: 'Rp 49k',
      color: 'bg-white/5 text-gray-400',
      icon: <Shield />,
      features: [
        'Kualitas 720p (HD)',
        'Tonton di 2 perangkat',
        'Bebas iklan premium',
        'Download film offline'
      ]
    },
    {
      name: 'Professional',
      price: 'Rp 79k',
      isPopular: true,
      color: 'bg-purple-600/20 text-purple-400',
      icon: <Zap />,
      features: [
        'Kualitas 1080p (Full HD)',
        'Tonton di 4 perangkat',
        'Streaming tanpa batas',
        'Spatial audio support',
        'Konten original Chill'
      ]
    },
    {
      name: 'Ultimate',
      price: 'Rp 119k',
      color: 'bg-yellow-500/20 text-yellow-400',
      icon: <Star />,
      features: [
        'Kualitas 4K + HDR10',
        'Tonton di 6 perangkat',
        'Dolby Atmos & Vision',
        'Akses awal film baru',
        'Kualitas bit-rate tinggi'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <Navbar />
      
      <main className="pt-52 pb-48 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-8">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-semibold tracking-tight text-white/80 mb-8"
          >
            Smarter <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">Streaming </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/60 text-xs md:text-sm font-medium leading-relaxed max-w-lg mx-auto drop-shadow-md"
          >
          Pilih paket sesuai gaya hidup digital Anda, batalkan kapan saja tanpa biaya tambahan. 
          </motion.p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, index) => (
            <PlanCard key={index} {...plan} />
          ))}
        </div>

        <div className="mt-32 pt-20 text-center space-y-6">
            <div className="flex items-center justify-center gap-6 opacity-30 grayscale">
                <Shield size={24} />
                <Zap size={24} />
                <Star size={24} />
            </div>
            <div>
                <p className="text-[10px] font-semibold text-white/40 uppercase tracking-[0.3em] mb-2">
                    Secure Payment Gateway
                </p>
                <p className="text-[9px] font-medium text-gray-600 max-w-sm mx-auto leading-relaxed">
                    Setiap transaksi dilindungi oleh enkripsi 256-bit kelas militer dan sistem deteksi penipuan tingkat lanjut untuk menjamin keamanan data finansial Anda.
                </p>
            </div>
        </div>
      </main>
    </div>
  );
};

export default SubscribePage;
