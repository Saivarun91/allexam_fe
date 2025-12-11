"use client";

import { useEffect, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";

// Import icons
import {
  Cloud,
  Shield,
  Award,
  Database,
  Code,
  Building,
} from "lucide-react";

// Map string name → icon component
const iconMap = {
  Cloud,
  Shield,
  Award,
  Database,
  Code,
  Building,
};

export default function PopularProviders() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [carouselSpeed, setCarouselSpeed] = useState(1500); // Default 1.5 seconds
  const [logoSize, setLogoSize] = useState(80); // Default 80px
  const controls = useAnimationControls();
  
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

  useEffect(() => {
    async function loadProviders() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/providers/`);

        if (!res.ok) {
          console.warn("Failed to fetch providers:", res.status);
          setProviders([]);
          return;
        }

        const data = await res.json();
        if (Array.isArray(data)) {
          // Filter only active providers
          const activeProviders = data.filter(p => p.is_active !== false);
          setProviders(activeProviders);
        } else {
          setProviders([]);
        }
      } catch (err) {
        console.error("Error loading providers:", err);
        setProviders([]);
      } finally {
        setLoading(false);
      }
    }

    loadProviders();
  }, [API_BASE_URL]);

  // Fetch carousel settings
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/settings/public/`);
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setCarouselSpeed(data.providers_carousel_speed || 1500);
            setLogoSize(data.providers_logo_size || 80);
          }
        }
      } catch (err) {
        console.error("Error loading settings:", err);
      }
    }
    loadSettings();
  }, [API_BASE_URL]);

  // Duplicate providers for seamless loop
  const duplicatedProviders = providers.length > 0 ? [...providers, ...providers] : [];
  
  // Calculate total width: each provider card is 120px + 16px gap (136px total)
  const itemWidth = 136;
  const totalWidth = providers.length > 0 ? itemWidth * providers.length : 0;

  // Animation effect - starts on mount and resumes when not hovered
  useEffect(() => {
    if (providers.length > 0 && totalWidth > 0) {
      if (!isHovered) {
        controls.start({
          x: [0, -totalWidth],
          transition: {
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
            },
          },
        });
      }
    }
  }, [isHovered, controls, totalWidth, providers.length]);

  if (loading) {
    return (
      <section className="py-20 text-center">
        <p className="text-[#0C1A35]/70">Loading providers...</p>
      </section>
    );
  }

  if (providers.length === 0) {
    return null;
  }

  return (
    <section id="popular-providers" className="py-12 md:py-20 bg-[#F5F8FC]">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3 md:mb-4 text-[#0C1A35] px-2">
          Popular Providers
        </h2>

        <p className="text-center text-[#0C1A35]/70 mb-8 md:mb-12 text-sm sm:text-base md:text-lg px-2">
          Practice questions from the world's leading certification bodies
        </p>

        {/* Infinite Carousel */}
        <div 
          className="relative overflow-hidden"
          onMouseEnter={() => {
            setIsHovered(true);
            controls.stop();
          }}
          onMouseLeave={() => {
            setIsHovered(false);
          }}
        >
          <motion.div
            className="flex gap-4 md:gap-6"
            animate={controls}
            style={{ width: "max-content" }}
          >
            {duplicatedProviders.map((provider, index) => {
              const Icon = iconMap[provider.icon] || Cloud;
              const hasLogo = provider.logo_url;

              return (
                <div
                  key={`${provider.id || provider.slug || index}-${Math.floor(index / providers.length)}`}
                  className="flex-shrink-0 flex items-center justify-center"
                  style={{ 
                    width: '120px',
                    minWidth: '120px',
                    maxWidth: '120px',
                    flexShrink: 0,
                    padding: '0 8px',
                  }}
                >
                  <div className="w-full flex flex-col items-center justify-center gap-1.5 hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center justify-center" style={{ height: `${logoSize}px`, width: `${logoSize}px` }}>
                      {hasLogo ? (
                        <img 
                          src={provider.logo_url} 
                          alt={provider.name}
                          className="object-contain"
                          style={{ maxWidth: `${logoSize}px`, maxHeight: `${logoSize}px` }}
                          onError={(e) => {
                            // Fallback to icon if logo fails to load
                            e.target.style.display = 'none';
                            const fallback = e.target.nextElementSibling;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      {!hasLogo && (
                        <div 
                          className="rounded-lg bg-[#1A73E8]/10 flex items-center justify-center"
                          style={{ width: `${logoSize}px`, height: `${logoSize}px` }}
                        >
                          <Icon 
                            className="text-[#1A73E8]"
                            style={{ width: `${logoSize * 0.5}px`, height: `${logoSize * 0.5}px` }}
                          />
                        </div>
                      )}
                    </div>
                    <span className="font-semibold text-center text-[#0C1A35] text-xs md:text-sm">
                      {provider.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

