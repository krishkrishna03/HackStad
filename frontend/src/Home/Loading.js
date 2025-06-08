import React from 'react';
import { motion } from 'framer-motion';

function Loading() {
  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(136,143,126,0.15)_0%,_rgba(0,0,0,1)_70%)]"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(136,143,126,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(136,143,126,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          transform: 'rotate(45deg) scale(2)',
          transformOrigin: 'center',
        }}></div>
      </div>

      {/* Loading Animation */}
      <div className="z-10 text-center">
        <motion.div
          className="w-20 h-20 border-4 border-[#888F7E] border-t-[#F3FDC9] rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.h2
          className="mt-8 text-2xl font-bold text-[#F3FDC9]"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          Loading...
        </motion.h2>
      </div>

      {/* Glowing Orb */}
      <motion.div
        className="absolute w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle at center, rgba(243,253,201,0.1) 0%, transparent 70%)',
          filter: 'blur(40px)',
          top: '20%',
          left: '30%'
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}

export default Loading;
