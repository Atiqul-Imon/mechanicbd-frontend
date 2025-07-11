import Link from 'next/link';

const services = [
  { icon: '🔧', name: 'Car Repair', description: 'Reliable automotive services' },
  { icon: '⚡', name: 'Electrical', description: 'Expert electrical solutions' },
  { icon: '🚰', name: 'Plumbing', description: 'Reliable plumbing services' },
  { icon: '🏠', name: 'Appliances', description: 'Home appliance repair' },
  { icon: '🔨', name: 'Carpentry', description: 'Quality woodwork services' },
  { icon: '🎨', name: 'Painting', description: 'Quality painting work' },
  { icon: '🧹', name: 'Cleaning', description: 'Thorough cleaning services' },
];

const testimonials = [
  {
    name: 'Md. Rahim',
    text: 'Mechanic BD made it so easy to find a trusted mechanic. The service was fast and reliable!',
    location: 'Dhaka',
    rating: 5,
  },
  {
    name: 'Sadia Akter',
    text: 'I booked an electrician in minutes. Highly recommend for anyone needing home services!',
    location: 'Chattogram',
    rating: 5,
  },
  {
    name: 'Tanvir Hasan',
    text: 'Great experience! The plumber arrived on time and fixed everything perfectly.',
    location: 'Sylhet',
    rating: 5,
  },
];

const partners = [
  { name: 'bKash', logo: '💳' },
  { name: 'Nagad', logo: '📱' },
  { name: 'City Bank', logo: '🏦' },
  { name: 'BRAC', logo: '🏢' },
];

const stats = [
  { number: '10K+', label: 'Happy Customers' },
  { number: '500+', label: 'Expert Mechanics' },
  { number: '50+', label: 'Cities Covered' },
  { number: '24/7', label: 'Support Available' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-light)]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-dark)] to-[#7F1D1D] text-white py-20 lg:py-32 px-4 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-white rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white rounded-full"></div>
        </div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="mb-8">
            <span className="text-6xl mb-4 block">🛠️</span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-poppins mb-6 leading-tight !text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              <span className="!text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">Mechanic</span> <span className="text-accent drop-shadow">BD</span>
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl mb-6 font-hind text-white font-medium">
              আপনার নির্ভরযোগ্য মেকানিক এবং হোম সার্ভিস প্ল্যাটফর্ম
            </p>
            <p className="mb-10 text-lg md:text-xl text-white max-w-3xl mx-auto leading-relaxed">
              Book trusted mechanics and home services easily, anywhere in Bangladesh. 
              Reliable and convenient solutions for all your needs.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/services"
              className="bg-accent hover:bg-accent-hover text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Browse Services
            </Link>
            <Link
              href="/register"
              className="bg-accent hover:bg-accent-hover text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 border-2 border-accent hover:border-accent-hover"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
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

      {/* Trust Bar */}
      <section className="bg-[var(--color-bg-surface)] py-8 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-6">
            <span className="text-[var(--color-text-muted)] text-sm font-medium">Trusted by leading companies:</span>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {partners.map((p, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-white px-6 py-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <span className="text-2xl">{p.logo}</span>
                <span className="text-[var(--color-text-secondary)] text-sm font-medium">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Highlights */}
      <section className="max-w-7xl mx-auto py-20 px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-[var(--color-primary)] font-poppins">
            Popular Services
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            From car repairs to home services, we've got you covered with reliable solutions
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-6">
          {services.map((service, idx) => (
            <div 
              key={service.name} 
              className="group bg-white rounded-xl p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover:border-accent/20"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-primary-dark)]/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">{service.icon}</span>
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-primary-dark)] mb-2">{service.name}</h3>
              <p className="text-text-secondary">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gradient-to-br from-[var(--color-bg-surface)] to-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-[var(--color-primary)] font-poppins">
              How It Works
            </h2>
            <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
              Get reliable services in just three simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] rounded-full mb-6 text-white text-2xl shadow-lg">
                  🔍
                </div>
                <h3 className="text-xl font-semibold mb-4 text-[var(--color-text-main)]">1. Find a Service</h3>
                <p className="text-[var(--color-text-secondary)] leading-relaxed">
                  Browse or search for the service you need from our wide range of categories.
                </p>
              </div>
              <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-[var(--color-primary)] to-transparent transform translate-x-4"></div>
            </div>
            
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-accent to-accent-hover rounded-full mb-6 text-white text-2xl shadow-lg">
                  📅
                </div>
                <h3 className="text-xl font-semibold mb-4 text-[var(--color-text-main)]">2. Book Instantly</h3>
                <p className="text-[var(--color-text-secondary)] leading-relaxed">
                  Choose your preferred time and location. Booking is fast and hassle-free.
                </p>
              </div>
              <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-accent to-transparent transform translate-x-4"></div>
            </div>
            
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-[var(--color-success)] to-[var(--color-success-dark)] rounded-full mb-6 text-white text-2xl shadow-lg">
                  ✅
                </div>
                <h3 className="text-xl font-semibold mb-4 text-[var(--color-text-main)]">3. Get the Job Done</h3>
                <p className="text-[var(--color-text-secondary)] leading-relaxed">
                  A trusted mechanic arrives and completes your service to your satisfaction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto py-20 px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-[var(--color-primary)] font-poppins">
            What Our Users Say
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-primary-dark)]/10 rounded-full flex items-center justify-center text-2xl mr-4">
                  👤
                </div>
                <div>
                  <div className="font-semibold text-[var(--color-text-main)]">{t.name}</div>
                  <div className="text-sm text-[var(--color-text-muted)]">{t.location}</div>
                  <div className="flex items-center mt-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">⭐</span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-[var(--color-text-secondary)] leading-relaxed italic">
                "{t.text}"
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white py-20 px-4 relative overflow-hidden">
        {/* Overlay for contrast */}
        <div className="absolute inset-0 bg-black/30 z-0 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-semibold !text-white mb-4 opacity-100 drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">Ready to Get Started?</h2>
          <p className="text-xl mb-10 text-white max-w-2xl mx-auto opacity-100 drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">Join thousands of satisfied customers who trust Mechanic BD for their service needs</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              href="/register"
              className="bg-accent hover:bg-accent-hover text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Sign Up Now
            </Link>
            <Link
              href="/services"
              className="bg-accent hover:bg-accent-hover text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 border-2 border-accent hover:border-accent-hover"
            >
              Browse Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
