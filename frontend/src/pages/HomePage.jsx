import React, { useEffect, useState } from 'react';
import HeroSection from '../components/home/HeroSection';
import CategorySection from '../components/home/CategorySection';
import FeaturedTours from '../components/home/FeaturedTours';
import DealsSection from '../components/home/DealsSection';
import FeaturesSection from '../components/home/FeaturesSection';
import BlogSection from '../components/home/BlogSection';
import Loading from '../components/common/Loading';
import { toursService } from '../services/toursService';
import { categoriesService } from '../services/categoriesService';
import { blogService } from '../services/blogService';
import { contentService } from '../services/contentService';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    heroContent: null,
    categories: [],
    featuredTours: [],
    deals: [],
    blogPosts: [],
  });

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [categoriesRes, featuredRes, dealsRes, blogRes, contentRes] = await Promise.all([
          categoriesService.getCategories(),
          toursService.getFeaturedTours(),
          toursService.getDeals(),
          blogService.getBlogPosts({ limit: 3 }),
          contentService.getContentBySection('hero'),
        ]);

        setData({
          categories: categoriesRes.data,
          featuredTours: featuredRes.data,
          deals: dealsRes.data,
          blogPosts: blogRes.data.posts || blogRes.data,
          heroContent: contentRes.data,
        });
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div>
      <HeroSection heroContent={data.heroContent} />
      <CategorySection categories={data.categories} />
      <FeaturedTours tours={data.featuredTours} />
      <DealsSection deals={data.deals} />
      <FeaturesSection />
      <BlogSection posts={data.blogPosts} />
    </div>
  );
}
