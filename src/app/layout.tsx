import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppStateProvider } from '@/context/AppStateContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { AppShell } from '@/components/layout/AppShell';
import { TourProvider } from '@/context/TourContext';
import { GuidedTour } from '@/components/tour/GuidedTour';

export const metadata: Metadata = {
  title: 'LeafCare — AI Crop Disease Detection',
  description:
    'AI-powered crop disease detection, localized weather forecasts, and farming guidance for farmers.',
  manifest: '/manifest.json',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
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
  // `data-scroll-behavior` tells Next the smooth scrolling in globals.css is
  // intentional, so it suppresses it during route transitions only.
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <AppStateProvider>
          <LanguageProvider>
            {/* The tour sits outside AppShell so its state survives the route
                changes it performs while walking the user through the app. */}
            <TourProvider>
              <AppShell>{children}</AppShell>
              <GuidedTour />
            </TourProvider>
          </LanguageProvider>
        </AppStateProvider>
      </body>
    </html>
  );
}
