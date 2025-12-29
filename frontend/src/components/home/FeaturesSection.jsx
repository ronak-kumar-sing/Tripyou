import React from 'react';
import { Shield, Clock, CreditCard, Headphones } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Best Price Guarantee',
    description: 'We guarantee the best prices. Found a lower price? We\'ll match it!',
  },
  {
    icon: Clock,
    title: '24/7 Customer Support',
    description: 'Our team is available around the clock to assist you.',
  },
  {
    icon: CreditCard,
    title: 'Easy Secure Booking',
    description: 'Book your tours easily with our secure payment system.',
  },
  {
    icon: Headphones,
    title: 'Free Cancellation',
    description: 'Cancel up to 24 hours before your tour for a full refund.',
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Us
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're committed to providing you with the best travel experience possible
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-xl bg-gray-50 hover:bg-primary-50 transition-colors group"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 text-primary-500 rounded-full flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-colors">
                <feature.icon size={28} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
