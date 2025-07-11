import Link from 'next/link';

export const metadata = {
  title: 'About Us - Mechanic BD',
  description: 'Learn about Mechanic BD, your trusted partner for automotive services across Bangladesh. Professional mechanics, reliable service, and peace of mind.',
};

export default function AboutPage() {
  const stats = [
    { number: '10K+', label: 'Happy Customers' },
    { number: '500+', label: 'Expert Mechanics' },
    { number: '50+', label: 'Cities Covered' },
    { number: '24/7', label: 'Support Available' },
  ];

  const values = [
    {
      icon: '🤝',
      title: 'Trust & Reliability',
      description: 'We connect you with verified, experienced mechanics who deliver quality service every time.'
    },
    {
      icon: '⚡',
      title: 'Quick & Convenient',
      description: 'Book services instantly, get real-time updates, and enjoy hassle-free automotive care.'
    },
    {
      icon: '💰',
      title: 'Transparent Pricing',
      description: 'No hidden fees. Get upfront pricing and detailed quotes before booking any service.'
    },
    {
      icon: '🛡️',
      title: 'Quality Guarantee',
      description: 'All our mechanics are verified and insured. Your satisfaction is our priority.'
    }
  ];

  const team = [
    {
      name: 'Md. Rahman',
      role: 'Founder & CEO',
      description: 'Automotive expert with 15+ years of experience in the industry.'
    },
    {
      name: 'Sadia Akter',
      role: 'Head of Operations',
      description: 'Ensuring smooth operations and excellent customer service.'
    },
    {
      name: 'Ahmed Khan',
      role: 'Technical Director',
      description: 'Leading our technical standards and mechanic verification process.'
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg-light)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-dark)] to-[#7F1D1D] text-white py-20 lg:py-32 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            About <span className="text-accent">Mechanic BD</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Your trusted partner for automotive services across Bangladesh. 
            We're revolutionizing how people access reliable car maintenance and repair services.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-[var(--color-text-secondary)] mb-6 leading-relaxed">
                At Mechanic BD, we believe that quality automotive service should be accessible to everyone. 
                Our mission is to connect vehicle owners with skilled, verified mechanics who provide 
                professional, reliable, and affordable services.
              </p>
              <p className="text-lg text-[var(--color-text-secondary)] mb-8 leading-relaxed">
                We're building a community where trust, transparency, and quality service are the foundation 
                of every interaction. Whether you need a simple oil change or complex engine repair, 
                we're here to make your automotive care journey smooth and stress-free.
              </p>
              <Link
                href="/services"
                className="inline-block bg-[var(--color-primary)] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[var(--color-primary-dark)] transition-colors"
              >
                Explore Our Services
              </Link>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="text-8xl mb-6 text-center">🛠️</div>
              <h3 className="text-2xl font-bold text-[var(--color-primary)] mb-4 text-center">
                Why Choose Mechanic BD?
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-accent text-xl">✓</span>
                  <span className="text-[var(--color-text-secondary)]">Verified and certified mechanics</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent text-xl">✓</span>
                  <span className="text-[var(--color-text-secondary)]">Transparent pricing with no hidden fees</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent text-xl">✓</span>
                  <span className="text-[var(--color-text-secondary)]">Real-time booking and tracking</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent text-xl">✓</span>
                  <span className="text-[var(--color-text-secondary)]">24/7 customer support</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent text-xl">✓</span>
                  <span className="text-[var(--color-text-secondary)]">Quality guarantee on all services</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] text-center mb-12">
            Our Impact
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-2">{stat.number}</div>
                <div className="text-[var(--color-text-secondary)] font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] text-center mb-12">
            Our Values
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-3">{value.title}</h3>
                <p className="text-[var(--color-text-secondary)] leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] text-center mb-12">
            Our Leadership Team
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <div key={idx} className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl text-white">👤</span>
                </div>
                <h3 className="text-xl font-semibold text-[var(--color-text-main)] mb-2">{member.name}</h3>
                <p className="text-accent font-medium mb-3">{member.role}</p>
                <p className="text-[var(--color-text-secondary)] leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Experience Better Automotive Care?
          </h2>
          <p className="text-xl mb-8 leading-relaxed">
            Join thousands of satisfied customers who trust Mechanic BD for their vehicle maintenance needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-accent text-white px-8 py-4 rounded-lg font-semibold hover:bg-accent-hover transition-colors"
            >
              Get Started Today
            </Link>
            <Link
              href="/contact"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[var(--color-primary)] transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 