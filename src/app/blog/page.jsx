"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, User, Clock } from "lucide-react";
import Link from "next/link";
import { getOptimizedImageUrl } from "@/utils/imageUtils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export default function BlogPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/home/blog-posts/`);
        const data = await res.json();
        
        if (data.success && data.data && Array.isArray(data.data)) {
          setArticles(data.data);
        } else {
          setArticles([]);
        }
      } catch (err) {
        console.error("Error fetching blog posts:", err);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Set canonical URL for blog listing page
  useEffect(() => {
    if (typeof window !== "undefined") {
      const canonicalUrl = "https://allexamquestions.com/blog";
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement("link");
        canonicalLink.setAttribute("rel", "canonical");
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute("href", canonicalUrl);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A73E8] mx-auto mb-4"></div>
            <p className="text-[#0C1A35]/70">Loading blog posts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0C1A35] via-[#0F2847] to-[#132A54] py-16 px-4">
        <div className="container mx-auto max-w-7xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Preparation Guides & Tips
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Expert advice and strategies to maximize your exam success
          </p>
        </div>
      </section>

      {/* Blog Articles */}
      <section className="py-16 px-4 bg-[#F5F8FC]">
        <div className="container mx-auto max-w-7xl">
          {articles.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#0C1A35]/70 text-lg">No blog posts available at the moment.</p>
            </div>
          ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => {
                const blogUrl = article.slug ? `/blog/${article.slug}` : '#';
                const articleDate = article.created_at 
                  ? new Date(article.created_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })
                  : 'Date not available';

                return (
                  <Link key={article.id} href={blogUrl} className="block group">
                    <Card className="overflow-hidden hover:shadow-[0_6px_20px_rgba(26,115,232,0.15)] hover:-translate-y-1 transition-all duration-300 border-[#DDE7FF] cursor-pointer bg-white shadow-[0_2px_8px_rgba(26,115,232,0.08)] h-full flex flex-col">
                      {article.image_url ? (
                        <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100">
                <img
                            src={getOptimizedImageUrl(article.image_url, 400, 225)}
                  alt={article.title}
                            width={400}
                            height={225}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            style={{ objectFit: 'contain' }}
                            loading="lazy"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                            decoding="async"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/400x300/1A73E8/ffffff?text=Blog+Post';
                            }}
                          />
                          {article.category && (
                            <div className="absolute top-3 left-3">
                              <span className="bg-[#1A73E8] text-white text-xs font-semibold px-3 py-1 rounded-full">
                                {article.category}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="w-full aspect-[16/9] bg-gradient-to-br from-[#1A73E8]/10 to-purple-500/10 flex items-center justify-center">
                          <span className="text-[#0C1A35]/30 text-sm">No image</span>
                        </div>
                      )}

                      <CardContent className="p-6 space-y-4 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-sm text-[#0C1A35]/60">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                            <span>{articleDate}</span>
                    </div>
                          {article.reading_time && (
                    <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{article.reading_time}</span>
                    </div>
                          )}
                  </div>

                        <h3 className="text-xl font-bold text-[#0C1A35] group-hover:text-[#1A73E8] transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                        <p className="text-[#0C1A35]/70 line-clamp-3 flex-1">{article.excerpt}</p>

                        <div className="flex items-center text-[#1A73E8] font-semibold group-hover:translate-x-2 transition-transform pt-2">
                    Read More
                    <ArrowRight className="ml-2 w-4 h-4" />
                        </div>
                </CardContent>
              </Card>
                  </Link>
                );
              })}
          </div>
          )}
        </div>
      </section>
    </div>
  );
}

