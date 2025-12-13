import React from 'react';

const PageLayout: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="min-h-screen pt-24 px-4 max-w-4xl mx-auto pb-20 animate-fade-in">
    <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 border-b border-gray-800 pb-6">{title}</h1>
    <div className="text-gray-300 leading-relaxed space-y-6 text-lg">
      {children}
    </div>
  </div>
);

export const TermsPage = () => (
  <PageLayout title="Terms of Use">
    <section>
        <h3 className="text-2xl font-bold text-white mb-2">1. Intermediation Service</h3>
        <p>
            "O Seu Professor de Inglês" acts exclusively as an intermediary platform connecting students and independent teachers. 
            We provide the digital infrastructure for booking, payments, and course hosting. We do not directly employ the teachers listed on the platform.
        </p>
    </section>
    
    <section>
        <h3 className="text-2xl font-bold text-white mb-2">2. Teacher Obligations</h3>
        <p>
            Teachers are independent service providers. They are solely responsible for:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Declaring and paying all applicable taxes (e.g., ISS, Income Tax) on their earnings.</li>
            <li>Issuing invoices (Nota Fiscal) directly to students upon request.</li>
            <li>Preparing and delivering high-quality class content.</li>
        </ul>
    </section>

    <section>
        <h3 className="text-2xl font-bold text-white mb-2">3. Cancellation Policy</h3>
        <p>
            To respect the time of our professionals, the following rules apply:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
            <li><strong>More than 24 hours notice:</strong> Full refund or free rescheduling.</li>
            <li><strong>Less than 24 hours notice:</strong> No refund. The class is considered "delivered" to compensate the teacher for the reserved slot.</li>
            <li><strong>Teacher No-Show:</strong> Full refund + 10% credit for future classes.</li>
        </ul>
    </section>

    <section>
        <h3 className="text-2xl font-bold text-white mb-2">4. Payments</h3>
        <p>
            All payments are processed securely via our partners (PIX and Credit Card). The platform holds the payment in escrow and releases it to the teacher upon successful completion of the lesson or course purchase.
        </p>
    </section>
  </PageLayout>
);

export const PrivacyPage = () => (
  <PageLayout title="Privacy Policy">
    <div className="bg-cyan-900/20 border border-cyan-500/30 p-4 rounded-xl mb-6">
        <p className="text-cyan-400 font-bold">LGPD Compliance Notice</p>
        <p className="text-sm">We value your data rights under the Brazilian General Data Protection Law (Lei Geral de Proteção de Dados).</p>
    </div>

    <section>
        <h3 className="text-2xl font-bold text-white mb-2">1. Data Collection</h3>
        <p>We collect only the essential data required to operate the service:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Registration info (Name, Email, Phone/WhatsApp).</li>
            <li>Profile data for teachers (Experience, Video introductions).</li>
            <li>Payment history (Stored securely via PCI-compliant gateway).</li>
            <li>Chat logs with Macley (AI) to improve recommendations (anonymized where possible).</li>
        </ul>
    </section>

    <section>
        <h3 className="text-2xl font-bold text-white mb-2">2. Data Usage</h3>
        <p>Your data is used to:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Connect students with suitable teachers.</li>
            <li>Process payments and payouts.</li>
            <li>Send class reminders and receipts.</li>
        </ul>
    </section>

    <section>
        <h3 className="text-2xl font-bold text-white mb-2">3. Your Rights</h3>
        <p>You have the right to:</p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Request a copy of all data we hold about you.</li>
            <li>Request deletion of your account and data ("Right to be forgotten").</li>
            <li>Revoke consent for marketing communications at any time.</li>
        </ul>
    </section>
  </PageLayout>
);

export const AboutPage = () => (
  <PageLayout title="About Us">
    <p className="text-xl text-cyan-400 mb-6">The future of English learning is here.</p>
    
    <p>
        <strong>O Seu Professor de Inglês</strong> was born from a simple frustration: traditional language schools are too slow, and finding a private tutor on classified sites is too risky.
    </p>

    <p>
        We built a <strong>hyper-modern ecosystem</strong> that combines the flexibility of the gig economy with the quality assurance of a premium institution.
    </p>

    <div className="grid md:grid-cols-2 gap-6 my-8">
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h4 className="font-bold text-white text-lg mb-2">For Students</h4>
            <p className="text-sm text-gray-400">Instant access to elite tutors worldwide, AI-powered recommendations, and a seamless booking experience.</p>
        </div>
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <h4 className="font-bold text-white text-lg mb-2">For Teachers</h4>
            <p className="text-sm text-gray-400">A complete "business-in-a-box". We handle marketing, payments, and scheduling so you can focus on teaching.</p>
        </div>
    </div>

    <p>
        Powered by our advanced AI assistant, <strong>Macley</strong>, we are available 24/7 to guide your learning journey.
    </p>
  </PageLayout>
);

export const FAQPage = () => (
  <PageLayout title="Frequently Asked Questions">
    <div className="space-y-6">
        <details className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden group">
            <summary className="p-6 font-bold text-white cursor-pointer hover:bg-gray-800 transition-colors flex justify-between items-center">
                How do I pay for classes?
                <svg className="w-5 h-5 text-cyan-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div className="p-6 pt-0 text-gray-400">
                We accept major Credit Cards and instant PIX payments. Your payment is held securely and only released to the teacher after the class is completed.
            </div>
        </details>

        <details className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden group">
            <summary className="p-6 font-bold text-white cursor-pointer hover:bg-gray-800 transition-colors flex justify-between items-center">
                Can I cancel a class?
                <svg className="w-5 h-5 text-cyan-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div className="p-6 pt-0 text-gray-400">
                Yes. If you cancel more than 24 hours in advance, you get a full refund or can reschedule for free. Cancellations within 24 hours are not refundable.
            </div>
        </details>

        <details className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden group">
            <summary className="p-6 font-bold text-white cursor-pointer hover:bg-gray-800 transition-colors flex justify-between items-center">
                How do I become a teacher?
                <svg className="w-5 h-5 text-cyan-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div className="p-6 pt-0 text-gray-400">
                Click "Become a Teacher" in the menu. You'll need to fill out a profile, set your rates, and upload a video introduction. Our team reviews all applications within 48 hours.
            </div>
        </details>

        <details className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden group">
            <summary className="p-6 font-bold text-white cursor-pointer hover:bg-gray-800 transition-colors flex justify-between items-center">
                Do you offer certificates?
                <svg className="w-5 h-5 text-cyan-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div className="p-6 pt-0 text-gray-400">
                Yes! When you complete a Course purchased from the marketplace, you receive a digital certificate. Individual 1:1 lessons do not generate certificates automatically.
            </div>
        </details>
    </div>
  </PageLayout>
);