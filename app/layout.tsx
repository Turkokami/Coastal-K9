import type { Metadata, Viewport } from 'next';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@fontsource/great-vibes/latin-400.css';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CredentialLogos from '@/components/CredentialLogos';
import MobileBar from '@/components/MobileBar';
import ClientEnhance from '@/components/ClientEnhance';
import Analytics from '@/components/Analytics';
import { SITE } from '@/lib/site';
import { Analytics as VercelAnalytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `K9 Pest & Bed Bug Detection in Aiken, SC | ${SITE.name}`, template: `%s | ${SITE.name}` },
  description: 'Certified K9 bed bug, rodent and wildlife detection in Aiken, North Augusta and the CSRA — detection before treatment, every time.',
  openGraph: { siteName: SITE.name, locale: 'en_US', type: 'website' },
  twitter: { card: 'summary_large_image' },
  formatDetection: { telephone: false },
  // Bing Webmaster Tools ownership check for https://ck9ps.com/. Keep it: removing it un-verifies the site.
  verification: { other: { 'msvalidate.01': '0F8140562A6D5BF4A76F4EAEB70BC8BE' } },
};
export const viewport: Viewport = { themeColor: '#0b1f38', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US">
      <body>
        <Header />
        <main id="main">{children}</main>
        <CredentialLogos />
        <Footer />
        <MobileBar />
        <ClientEnhance />
        <Analytics />
        {/* Vercel Web Analytics and Speed Insights: first-party, cookieless. */}
        <VercelAnalytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
