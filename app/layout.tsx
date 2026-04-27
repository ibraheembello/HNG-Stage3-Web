import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Insighta Labs+ — Profile Intelligence',
  description: 'Secure profile intelligence platform with role-based access for analysts and admins.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
