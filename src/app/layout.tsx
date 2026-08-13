import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppStateProvider } from '@/context/AppStateContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'LeafCare — AI Crop Disease Detection',
  description:
    'AI-powered crop disease detection, localized weather forecasts, and farming guidance for farmers.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Pinch-zoom stays enabled — locking it out fails WCAG 1.4.4 and hurts
  // low-vision users on both phones and laptops.
  viewportFit: 'cover',
  themeColor: '#16A34A',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppStateProvider>
          <LanguageProvider>
            <AppShell>{children}</AppShell>
          </LanguageProvider>
        </AppStateProvider>
      </body>
    </html>
  );
}
