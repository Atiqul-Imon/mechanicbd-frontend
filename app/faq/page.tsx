'use client';
import { useState } from 'react';

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqs = [
    {
      question: 'How do I book a service?',
      answer: 'Booking a service is easy! Simply browse our available services, select the one you need, choose your preferred mechanic, and complete the booking form with your details and service requirements. You can also specify your preferred date and time for the service.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major mobile financial services in Bangladesh including bKash, Nagad, Rocket, and other popular payment methods. All payments are processed securely through our trusted payment partners.'
    },
    {
      question: 'Are your mechanics verified and qualified?',
      answer: 'Yes, all our mechanics go through a thorough verification process including background checks, skill assessments, and customer reviews. We only work with qualified, experienced professionals who meet our high standards.'
    },
    {
      question: 'What if I\'m not satisfied with the service?',
      answer: 'We have a satisfaction guarantee. If you\'re not happy with the service, contact our support team immediately and we\'ll work to resolve the issue. We may offer a refund or arrange for the service to be redone by another mechanic.'
    },
    {
      question: 'Can I cancel or reschedule my booking?',
      answer: 'Yes, you can cancel or reschedule your booking up to 24 hours before the scheduled service time. Cancellations made within 24 hours may be subject to a cancellation fee. Contact our support team to make changes to your booking.'
    },
    {
      question: 'How do I know the mechanic is reliable?',
      answer: 'All our mechanics are rated and reviewed by previous customers. You can see their ratings, reviews, and service history before booking. We also monitor their performance and only work with mechanics who maintain high standards.'
    },
    {
      question: 'What types of vehicles do you service?',
      answer: 'We service all types of vehicles including cars, motorcycles, trucks, and commercial vehicles. Our mechanics are specialized in different vehicle types and brands, so you can find the right expert for your specific vehicle.'
    },
    {
      question: 'Do you provide emergency services?',
      answer: 'Yes, we offer emergency roadside assistance for urgent situations like breakdowns, flat tires, and battery issues. Emergency services are available 24/7, though response times may vary based on location and availability.'
    },
    {
      question: 'How much do your services cost?',
      answer: 'Service costs vary depending on the type of service, vehicle, and location. All prices are clearly displayed before booking with no hidden fees. You\'ll get a detailed quote that includes all costs upfront.'
    },
    {
      question: 'Can I track my service progress?',
      answer: 'Yes! You can track your service progress in real-time through our platform. You\'ll receive updates when the mechanic is on the way, when they arrive, and when the service is completed. You can also communicate directly with the mechanic through our chat feature.'
    },
    {
      question: 'What if the mechanic doesn\'t show up?',
      answer: 'If a mechanic doesn\'t show up for a scheduled appointment, contact our support team immediately. We\'ll either arrange for another mechanic or provide a full refund. We take reliability very seriously and have strict policies for our mechanics.'
    },
    {
      question: 'Do you provide warranty on services?',
      answer: 'Yes, we provide warranty on most services. The warranty period varies by service type and is clearly stated when you book. If there are any issues with the service within the warranty period, we\'ll fix it at no additional cost.'
    }
  ];

  const categories = [
    {
      title: 'Booking & Services',
      icon: '📅',
      faqs: [0, 1, 2, 6, 7]
    },
    {
      title: 'Payment & Pricing',
      icon: '💰',
      faqs: [1, 8]
    },
    {
      title: 'Quality & Support',
      icon: '🛡️',
      faqs: [2, 3, 5, 11]
    },
    {
      title: 'Service Management',
      icon: '⚙️',
      faqs: [4, 9, 10]
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg-light)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-dark)] to-[#7F1D1D] text-white py-20 lg:py-32 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Frequently Asked <span className="text-accent">Questions</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Find answers to common questions about our services, booking process, and more.
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-4">
              Can't find what you're looking for?
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-6">
              Contact our support team and we'll get back to you within 24 hours.
            </p>
            <a
              href="/contact"
              className="inline-block bg-[var(--color-primary)] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[var(--color-primary-dark)] transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] text-center mb-12">
            Browse by Category
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {categories.map((category, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-3">{category.title}</h3>
                <p className="text-[var(--color-text-secondary)] text-sm">
                  {category.faqs.length} questions
                </p>
              </div>
            ))}
          </div>

          {/* All FAQs */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-[var(--color-primary)]">
                All Questions
              </h2>
            </div>
            
            <div className="divide-y divide-gray-100">
              {faqs.map((faq, index) => (
                <div key={index} className="p-6">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full text-left flex justify-between items-start gap-4 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 rounded-lg p-2 -m-2"
                  >
                    <h3 className="text-lg font-semibold text-[var(--color-text-main)] flex-1">
                      {faq.question}
                    </h3>
                    <span className="text-[var(--color-primary)] text-xl font-bold flex-shrink-0">
                      {openItems.includes(index) ? '−' : '+'}
                    </span>
                  </button>
                  
                  {openItems.includes(index) && (
                    <div className="mt-4 pl-2">
                      <p className="text-[var(--color-text-secondary)] leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Still Have Questions?
          </h2>
          <p className="text-xl mb-8 leading-relaxed">
            Our support team is here to help you with any questions or concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-accent text-white px-8 py-4 rounded-lg font-semibold hover:bg-accent-hover transition-colors"
            >
              Contact Us
            </a>
            <a
              href="tel:+8801234567890"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[var(--color-primary)] transition-colors"
            >
              Call Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
} 