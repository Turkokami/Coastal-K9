import type { Metadata, Viewport } from 'next';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileBar from '@/components/MobileBar';
import ClientEnhance from '@/components/ClientEnhance';
import Analytics from '@/components/Analytics';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `K9 Pest & Bed Bug Detection in Aiken, SC | ${SITE.name}`, template: `%s | ${SITE.name}` },
  description: 'Certified K9 bed bug, rodent and wildlife detection in Aiken, North Augusta and the CSRA — detection before treatment, every time.',
  openGraph: { siteName: SITE.name, locale: 'en_US', type: 'website' },
  twitter: { card: 'summary_large_image' },
  formatDetection: { telephone: false },
};
export const viewport: Viewport = { themeColor: '#0b1f38', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US">
      <body>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MobileBar />
        <ClientEnhance />
        <Analytics />
      </body>
    </html>
  );
}
