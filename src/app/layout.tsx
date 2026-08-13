import type { Metadata } from 'next';
import './globals.css';
import { AppStateProvider } from '@/context/AppStateContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { BottomNavigation } from '@/components/navigation/BottomNavigation';

export const metadata: Metadata = {
  title: 'LeafCare - AI Crop Disease Detection Platform',
  description: 'AI-powered crop disease detection, localized weather forecast, and farming guidance platform for farmers.',
  manifest: '/manifest.json',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
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
            <div className="app-container">
              <main className="flex-1 flex flex-col relative overflow-x-hidden">
                {children}
              </main>
              <BottomNavigation />
            </div>
          </LanguageProvider>
        </AppStateProvider>
      </body>
    </html>
  );
}
