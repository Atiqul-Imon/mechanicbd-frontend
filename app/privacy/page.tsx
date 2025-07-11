export const metadata = {
  title: 'Privacy Policy - Mechanic BD',
  description: 'Learn how Mechanic BD collects, uses, and protects your personal information. Your privacy is important to us.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-light)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-dark)] to-[#7F1D1D] text-white py-20 lg:py-32 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Privacy <span className="text-accent">Policy</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Your privacy is important to us. Learn how we collect, use, and protect your personal information.
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
                1. Information We Collect
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-6 leading-relaxed">
                We collect information you provide directly to us, such as when you create an account, 
                book a service, or contact our support team. This may include:
              </p>
              <ul className="list-disc pl-6 mb-8 text-[var(--color-text-secondary)] space-y-2">
                <li>Name, email address, and phone number</li>
                <li>Vehicle information and service history</li>
                <li>Payment information (processed securely through our payment partners)</li>
                <li>Service preferences and requirements</li>
                <li>Communications with our support team</li>
              </ul>

              <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6">
                2. How We Use Your Information
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-6 leading-relaxed">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 mb-8 text-[var(--color-text-secondary)] space-y-2">
                <li>Provide and improve our services</li>
                <li>Process bookings and payments</li>
                <li>Connect you with qualified mechanics</li>
                <li>Send service updates and notifications</li>
                <li>Respond to your inquiries and support requests</li>
                <li>Analyze usage patterns to improve our platform</li>
                <li>Ensure platform security and prevent fraud</li>
              </ul>

              <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6">
                3. Information Sharing
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-6 leading-relaxed">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 mb-8 text-[var(--color-text-secondary)] space-y-2">
                <li>With mechanics to fulfill your service requests</li>
                <li>With payment processors to complete transactions</li>
                <li>When required by law or to protect our rights</li>
                <li>With your explicit consent</li>
              </ul>

              <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6">
                4. Data Security
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-6 leading-relaxed">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc pl-6 mb-8 text-[var(--color-text-secondary)] space-y-2">
                <li>Encryption of sensitive data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication measures</li>
                <li>Secure payment processing through trusted partners</li>
              </ul>

              <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6">
                5. Your Rights
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-6 leading-relaxed">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 mb-8 text-[var(--color-text-secondary)] space-y-2">
                <li>Access and review your personal information</li>
                <li>Update or correct inaccurate information</li>
                <li>Request deletion of your account and data</li>
                <li>Opt out of marketing communications</li>
                <li>File a complaint with relevant authorities</li>
              </ul>

              <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6">
                6. Cookies and Tracking
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-6 leading-relaxed">
                We use cookies and similar technologies to enhance your experience on our platform. These help us:
              </p>
              <ul className="list-disc pl-6 mb-8 text-[var(--color-text-secondary)] space-y-2">
                <li>Remember your preferences and settings</li>
                <li>Analyze website traffic and usage patterns</li>
                <li>Provide personalized content and recommendations</li>
                <li>Ensure platform functionality and security</li>
              </ul>

              <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6">
                7. Third-Party Services
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-6 leading-relaxed">
                Our platform may integrate with third-party services for payment processing, analytics, and other functionalities. These services have their own privacy policies, and we encourage you to review them.
              </p>

              <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6">
                8. Data Retention
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-6 leading-relaxed">
                We retain your personal information for as long as necessary to provide our services and comply with legal obligations. When you delete your account, we will delete or anonymize your personal information, except where retention is required by law.
              </p>

              <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6">
                9. Children's Privacy
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-6 leading-relaxed">
                Our services are not intended for children under the age of 18. We do not knowingly collect personal information from children under 18. If you believe we have collected information from a child under 18, please contact us immediately.
              </p>

              <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6">
                10. Changes to This Policy
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-6 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our website and updating the "Last updated" date. Your continued use of our services after such changes constitutes acceptance of the updated policy.
              </p>

              <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6">
                11. Contact Us
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-6 leading-relaxed">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-[var(--color-bg-light)] p-6 rounded-lg">
                <p className="text-[var(--color-text-secondary)] mb-2">
                  <strong>Email:</strong> privacy@mechanicbd.com
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