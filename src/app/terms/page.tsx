import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms and conditions for using PetBedNStay — the US pet boarding directory.",
  alternates: { canonical: "https://petbednstay.com/terms" },
};

const LAST_UPDATED = "June 9, 2026";

export default function TermsPage() {
  return (
    <div className="bg-warm-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-amber-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <p className="text-sm text-stone-400 mb-1">Legal</p>
          <h1 className="text-3xl font-bold text-stone-800">Terms of Use</h1>
          <p className="mt-2 text-stone-500 text-sm">Last updated: {LAST_UPDATED}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">

        <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6 sm:p-8 space-y-8 text-stone-600 leading-relaxed text-sm">

          <section>
            <p>
              Welcome to PetBedNStay. By accessing or using petbednstay.com (&ldquo;the Site&rdquo;), you agree to be
              bound by these Terms of Use. Please read them carefully. If you do not agree, please do not use the Site.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-stone-800 mb-3">1. About the Service</h2>
            <p>
              PetBedNStay is an online directory that lists pet boarding facilities, pet hotels, kennels, and pet sitters
              across the United States. We provide this information as a convenience to pet owners. We do not own,
              operate, manage, or endorse any of the businesses listed on the Site.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-stone-800 mb-3">2. Accuracy of Listings</h2>
            <p className="mb-3">
              Listing information (business name, address, phone, hours, pricing, etc.) is sourced from publicly
              available records and/or submitted by business owners. PetBedNStay does not guarantee the accuracy,
              completeness, or timeliness of any listing.
            </p>
            <p>
              We strongly recommend that you independently verify all information before booking or engaging with any
              listed business. Contact the business directly to confirm availability, pricing, and services.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-stone-800 mb-3">3. No Endorsement</h2>
            <p>
              The presence of a business on PetBedNStay does not constitute an endorsement, recommendation, or
              guarantee by us. We are not responsible for the quality, safety, or legality of any services provided by
              listed businesses. Any arrangement you make with a listed business is solely between you and that business.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-stone-800 mb-3">4. User Conduct</h2>
            <p className="mb-3">By using the Site, you agree not to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Submit false, misleading, or fraudulent information (including reviews or listing requests).</li>
              <li>Use the Site to harass, defame, or harm any person or business.</li>
              <li>Attempt to scrape, crawl, or systematically extract data from the Site without our written permission.</li>
              <li>Use the Site for any unlawful purpose or in violation of any applicable law.</li>
              <li>Attempt to disrupt, damage, or gain unauthorized access to the Site or its servers.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-stone-800 mb-3">5. Listing Submissions & Business Owners</h2>
            <p className="mb-3">
              Business owners may submit or claim their listing through our &ldquo;List Your Business&rdquo; form. By submitting a listing, you represent that:
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-3">
              <li>You are authorized to represent the business.</li>
              <li>All information you provide is accurate and up to date.</li>
              <li>You own or have the rights to any photos or content you submit.</li>
            </ul>
            <p>
              We reserve the right to reject, edit, or remove any listing at our sole discretion, including listings
              that are off-brand, inaccurate, or in violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-stone-800 mb-3">6. Paid Plans & Subscriptions</h2>
            <p className="mb-3">
              Featured and Premium listing plans are billed as monthly subscriptions via PayPal. By subscribing, you agree to PayPal&apos;s terms of service. You may cancel your subscription at any time through your PayPal account. Cancellations take effect at the end of the current billing period — no partial refunds are provided for unused time.
            </p>
            <p>
              PetBedNStay reserves the right to modify pricing at any time. Existing subscribers will be notified of
              price changes at least 30 days in advance.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-stone-800 mb-3">7. Reviews</h2>
            <p className="mb-3">
              Users may submit reviews for listed businesses. By submitting a review, you grant PetBedNStay a
              non-exclusive, royalty-free license to display your review on the Site. You represent that:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Your review reflects your honest, first-hand experience.</li>
              <li>You are not affiliated with the business you are reviewing.</li>
              <li>Your review does not contain false statements, personal attacks, or inappropriate content.</li>
            </ul>
            <p className="mt-3">
              We reserve the right to reject or remove any review that violates these guidelines.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-stone-800 mb-3">8. Affiliate Disclosure</h2>
            <p>
              PetBedNStay participates in affiliate marketing programs. This means we may earn a commission if you
              click a link to a third-party product or service and make a purchase. This comes at no additional cost
              to you. Affiliate relationships do not influence our listing content or directory rankings.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-stone-800 mb-3">9. Intellectual Property</h2>
            <p>
              The PetBedNStay name, logo, website design, and original content are the intellectual property of
              PetBedNStay and may not be reproduced, distributed, or used without our prior written consent.
              Business names, trademarks, and logos belong to their respective owners.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-stone-800 mb-3">10. Disclaimer of Warranties</h2>
            <p>
              The Site and its content are provided &ldquo;as is&rdquo; without warranties of any kind, express or implied.
              PetBedNStay makes no warranty that the Site will be uninterrupted, error-free, or free of viruses.
              We do not warrant the accuracy, reliability, or completeness of any listing information.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-stone-800 mb-3">11. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, PetBedNStay shall not be liable for any indirect, incidental,
              special, or consequential damages arising out of your use of the Site or any listed business&apos;s services.
              Our total liability to you for any claim shall not exceed $100.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-stone-800 mb-3">12. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the United States. Any disputes arising from these Terms or
              your use of the Site shall be resolved through binding arbitration or in the courts of competent
              jurisdiction in the United States.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-stone-800 mb-3">13. Changes to These Terms</h2>
            <p>
              We may update these Terms at any time. The &ldquo;Last updated&rdquo; date at the top of this page reflects the
              most recent revision. Continued use of the Site after changes are posted constitutes your acceptance
              of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-stone-800 mb-3">14. Contact</h2>
            <p>
              Questions about these Terms? Contact us at:
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
          <Link href="/privacy" className="hover:text-brand-600 transition-colors">Privacy Policy →</Link>
          <Link href="/contact" className="hover:text-brand-600 transition-colors">Contact Us →</Link>
        </div>

      </div>
    </div>
  );
}
