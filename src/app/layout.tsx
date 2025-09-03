import './globals.css';
import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { poppins } from '@/config';
import { dark } from '@clerk/themes';

export const metadata: Metadata = {
  title: {
    template: '%s | MTBJournal',
    default: 'Home',
  },
  description:
    'MTBJournal is a journal app that helps you understand your emotions and thoughts, keeping a track of your mental health.',
  openGraph: {
    title: 'Home | MTBJournal',
    description:
      'MTBJournal is a journal app that helps you understand your emotions and thoughts, keeping a track of your mental health.',
    url: 'https://mtbjournal.app',
    siteName: 'MTBJournal',
    type: 'website',
    locale: 'en_US',
    images: [
      `https://res.cloudinary.com/dmlpgks2h/image/upload/v1756704657/Portfolio/mtbjournal_jxwmei.png`,
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Home | MTBJournal',
    description:
      'MTBJournal is a journal app that helps you understand your emotions and thoughts, keeping a track of your mental health.',
    images: [
      `https://res.cloudinary.com/dmlpgks2h/image/upload/v1756704657/Portfolio/mtbjournal_jxwmei.png`,
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorBackground: '#171717',
          fontFamily: poppins.style.fontFamily,
          colorText: '#e5e5e5',
        },
      }}
    >
      <html lang="en">
        <body className={poppins.className}>
          <main className="bg-neutral-800 text-neutral-200">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
