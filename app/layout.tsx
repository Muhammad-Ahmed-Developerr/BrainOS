import type {Metadata} from 'next';
import './globals.css'; // Global styles
import AuthProvider from '@/components/providers/AuthProvider';

export const metadata: Metadata = {
  title: 'BrainOS — Personal Mental Health Operating System',
  description: "The World's First Personal Mental Health Operating System",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

