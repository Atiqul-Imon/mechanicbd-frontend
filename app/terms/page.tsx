export const metadata = {
  title: 'Terms of Service - Mechanic BD',
  description: 'Read our Terms of Service to understand the rules and guidelines for using Mechanic BD services.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-light)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-dark)] to-[#7F1D1D] text-white py-20 lg:py-32 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Terms of <span className="text-accent">Service</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Please read these terms carefully before using our services.
          </p>
          <p className="text-lg opacity-90">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6">
                1. Acceptance of Terms
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-6 leading-relaxed">
                By accessing and using Mechanic BD's website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>

              <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6">
                2. Description of Service
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-6 leading-relaxed">
                Mechanic BD is a platform that connects vehicle owners with qualified mechanics for automotive services. Our services include:
              </p>
              <ul className="list-disc pl-6 mb-8 text-[var(--color-text-secondary)] space-y-2">
                <li>Service booking and scheduling</li>
                <li>Mechanic verification and rating system</li>
                <li>Payment processing</li>
                <li>Customer support and dispute resolution</li>
                <li>Service tracking and updates</li>
              </ul>

              <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6">
                3. User Accounts
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-6 leading-relaxed">
                To use certain features of our service, you must create an account. You agree to:
              </p>
              <ul className="list-disc pl-6 mb-8 text-[var(--color-text-secondary)] space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized use</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Be at least 18 years old to create an account</li>
              </ul>

              <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6">
                4. Service Booking and Payment
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-6 leading-relaxed">
                When booking services through our platform:
              </p>
              <ul className="list-disc pl-6 mb-8 text-[var(--color-text-secondary)] space-y-2">
                <li>All prices are quoted in Bangladeshi Taka (BDT)</li>
                <li>Payment is processed through secure third-party payment gateways</li>
                <li>Service fees and taxes are clearly displayed before booking</li>
                <li>Cancellation policies apply as specified for each service</li>
                <li>Refunds are processed according to our refund policy</li>
              </ul>

              <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6">
                5. User Responsibilities
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-6 leading-relaxed">
                As a user of our platform, you agree to:
              </p>
              <ul className="list-disc pl-6 mb-8 text-[var(--color-text-secondary)] space-y-2">
                <li>Provide accurate vehicle and service information</li>
                <li>Be present or available during scheduled service times</li>
                <li>Treat mechanics with respect and professionalism</li>
                <li>Provide honest feedback and reviews</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Not use the service for any illegal or unauthorized purpose</li>
              </ul>

              <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6">
                6. Mechanic Responsibilities
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-6 leading-relaxed">
                Mechanics using our platform must:
              </p>
              <ul className="list-disc pl-6 mb-8 text-[var(--color-text-secondary)] space-y-2">
                <li>Provide accurate qualifications and experience information</li>
                <li>Maintain proper licenses and certifications</li>
                <li>Arrive on time for scheduled appointments</li>
                <li>Provide quality service as described</li>
                <li>Use proper tools and equipment</li>
                <li>Maintain professional conduct and appearance</li>
                <li>Carry appropriate insurance coverage</li>
              </ul>

              <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6">
                7. Dispute Resolution
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-6 leading-relaxed">
                In case of disputes between customers and mechanics:
              </p>
              <ul className="list-disc pl-6 mb-8 text-[var(--color-text-secondary)] space-y-2">
                <li>We encourage direct communication to resolve issues</li>
                <li>Our support team is available to mediate disputes</li>
                <li>We may withhold payments during dispute resolution</li>
                <li>Final decisions are made by our support team</li>
                <li>Legal disputes are subject to Bangladeshi law</li>
              </ul>

              <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6">
                8. Limitation of Liability
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-6 leading-relaxed">
                Mechanic BD acts as a platform connecting customers and mechanics. We are not responsible for:
              </p>
              <ul className="list-disc pl-6 mb-8 text-[var(--color-text-secondary)] space-y-2">
                <li>The quality of services provided by mechanics</li>
                <li>Damage to vehicles during service</li>
                <li>Personal injury during service provision</li>
                <li>Disputes between customers and mechanics</li>
                <li>Any indirect, incidental, or consequential damages</li>
              </ul>

              <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6">
                9. Intellectual Property
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-6 leading-relaxed">
                All content on our platform, including text, graphics, logos, and software, is the property of Mechanic BD or its licensors and is protected by copyright and other intellectual property laws.
              </p>

              <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6">
                10. Privacy and Data Protection
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-6 leading-relaxed">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, to understand our practices regarding the collection and use of your personal information.
              </p>

              <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6">
                11. Termination
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-6 leading-relaxed">
                We may terminate or suspend your account and access to our services at any time, with or without cause, with or without notice. You may also terminate your account at any time by contacting our support team.
              </p>

              <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6">
                12. Changes to Terms
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-6 leading-relaxed">
                We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new terms on our website and updating the "Last updated" date. Your continued use of the service after such changes constitutes acceptance of the new terms.
              </p>

              <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6">
                13. Governing Law
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-6 leading-relaxed">
                These terms are governed by and construed in accordance with the laws of Bangladesh. Any disputes arising from these terms or your use of our services shall be subject to the exclusive jurisdiction of the courts in Dhaka, Bangladesh.
              </p>

              <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6">
                14. Contact Information
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-6 leading-relaxed">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-[var(--color-bg-light)] p-6 rounded-lg">
                <p className="text-[var(--color-text-secondary)] mb-2">
                  <strong>Email:</strong> legal@mechanicbd.com
                </p>
                <p className="text-[var(--color-text-secondary)] mb-2">
                  <strong>Phone:</strong> +880 1234-567890
                </p>
                <p className="text-[var(--color-text-secondary)]">
                  <strong>Address:</strong> Dhaka, Bangladesh
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 