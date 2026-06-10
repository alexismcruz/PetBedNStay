import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How PetBedNStay collects, uses, and protects your personal information.",
  alternates: { canonical: "https://petbednstay.com/privacy" },
};

const LAST_UPDATED = "June 9, 2026";

export default function PrivacyPage() {
  return (
    <div className="bg-warm-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-amber-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <p className="text-sm text-stone-400 mb-1">Legal</p>
          <h1 className="text-3xl font-bold text-stone-800">Privacy Policy</h1>
          <p className="mt-2 text-stone-500 text-sm">Last updated: {LAST_UPDATED}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">

        <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6 sm:p-8 space-y-8 text-stone-600 leading-relaxed text-sm">

          <section>
            <p>
              PetBedNStay (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) operates petbednstay.com. This Privacy Policy
              explains what information we collect, how we use it, and your rights regarding your data.
              By using our website, you agree to the practices described in this policy.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-stone-800 mb-3">1. Information We Collect</h2>
            <p className="mb-3"><strong className="text-stone-700">Information you provide directly:</strong></p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>Business name, owner name, email address, phone number, and address when you submit a listing or claim request via our &ldquo;List Your Business&rdquo; form.</li>
              <li>Your name, email, rating, and review text when you submit a review for a listing.</li>
              <li>Your email address when you subscribe to our newsletter or updates.</li>
              <li>Any messages you send us through the contact form.</li>
            </ul>
            <p className="mb-3"><strong className="text-stone-700">Information collected automatically:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Usage data such as pages visited, time spent, search queries, and clicks, collected via Google Analytics (GA4).</li>
              <li>Device and browser information (type, operating system, screen size).</li>
              <li>IP address (anonymized by Google Analytics).</li>
              <li>Cookies and similar tracking technologies (see Section 5).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-stone-800 mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>To create, display, and manage business listings on our directory.</li>
              <li>To verify and process listing claim and upgrade requests.</li>
              <li>To send transactional emails related to your listing or request.</li>
              <li>To send marketing emails and newsletters if you have opted in (you can unsubscribe at any time).</li>
              <li>To improve our website, search functionality, and user experience.</li>
              <li>To display relevant third-party affiliate offers (such as pet insurance or pet product recommendations) that may be useful to our visitors.</li>
              <li>To comply with legal obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-stone-800 mb-3">3. Sharing Your Information</h2>
            <p className="mb-3">We do not sell your personal information. We may share it with:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-stone-700">Service providers:</strong> Third-party tools that help us operate the site, including Vercel (hosting), Railway (database), Brevo (email marketing), and PayPal (payment processing). These providers are contractually bound to protect your data.</li>
              <li><strong className="text-stone-700">Analytics:</strong> Google Analytics collects anonymized usage data to help us understand how visitors use our site.</li>
              <li><strong className="text-stone-700">Affiliate partners:</strong> If you click an affiliate link on our site and make a purchase, the affiliate partner may receive information necessary to track and credit the referral. We do not share your email or contact details with affiliate partners.</li>
              <li><strong className="text-stone-700">Legal requirements:</strong> We may disclose information if required by law or to protect the rights, property, or safety of PetBedNStay, our users, or others.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-stone-800 mb-3">4. Business Listing Data</h2>
            <p>
              Business information displayed on PetBedNStay (name, address, phone, website, email) is sourced from publicly available records and submitted by business owners. If you are a business owner and wish to update, correct, or remove your listing, please contact us at{" "}
              <a href="mailto:hello@petbednstay.com" className="text-brand-600 hover:underline">hello@petbednstay.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-stone-800 mb-3">5. Cookies</h2>
            <p className="mb-3">We use the following types of cookies:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-stone-700">Essential cookies:</strong> Required for core site functionality (e.g., saved listings stored in localStorage).</li>
              <li><strong className="text-stone-700">Analytics cookies:</strong> Google Analytics uses cookies to collect anonymized information about how visitors use the site. You can opt out via <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">Google&apos;s opt-out tool</a>.</li>
              <li><strong className="text-stone-700">Affiliate tracking cookies:</strong> When you click an affiliate link, the partner may set a cookie to track the referral for commission purposes.</li>
            </ul>
            <p className="mt-3">You can control cookies through your browser settings. Disabling cookies may affect some site features.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-stone-800 mb-3">6. Data Retention</h2>
            <p>
              We retain personal data for as long as necessary to provide our services or as required by law. Listing submission data is kept until the listing is removed or you request deletion. Email marketing data is retained until you unsubscribe. Analytics data is retained per Google Analytics&apos; default retention settings (14 months).
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-stone-800 mb-3">7. Your Rights</h2>
            <p className="mb-3">Depending on your location, you may have the right to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Access the personal information we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your data.</li>
              <li>Opt out of marketing communications at any time (via the unsubscribe link in any email).</li>
              <li>Lodge a complaint with your local data protection authority.</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, email us at{" "}
              <a href="mailto:hello@petbednstay.com" className="text-brand-600 hover:underline">hello@petbednstay.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-stone-800 mb-3">8. Children&apos;s Privacy</h2>
            <p>
              PetBedNStay is not directed at children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us and we will delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-stone-800 mb-3">9. Third-Party Links</h2>
            <p>
              Our site contains links to third-party websites, including business websites, Google Maps, Yelp, and affiliate partners. We are not responsible for the privacy practices of those sites. We encourage you to review their privacy policies before providing any personal information.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-stone-800 mb-3">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. When we do, we will update the &ldquo;Last updated&rdquo; date at the top of this page. Continued use of the site after changes constitutes your acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-stone-800 mb-3">11. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="mt-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
              <p className="font-semibold text-stone-700">PetBedNStay</p>
              <p>Email: <a href="mailto:hello@petbednstay.com" className="text-brand-600 hover:underline">hello@petbednstay.com</a></p>
              <p>Website: <a href="https://petbednstay.com" className="text-brand-600 hover:underline">petbednstay.com</a></p>
            </div>
          </section>

        </div>

        {/* Nav links */}
        <div className="flex gap-4 text-sm text-stone-500">
          <Link href="/terms" className="hover:text-brand-600 transition-colors">Terms of Use →</Link>
          <Link href="/contact" className="hover:text-brand-600 transition-colors">Contact Us →</Link>
        </div>

      </div>
    </div>
  );
}
