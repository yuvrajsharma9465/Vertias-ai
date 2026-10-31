import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'VERITAS AI | AI Claim Verification & Evidence Intelligence Platform',
  description:
    'Clean, modern enterprise SaaS platform for verifying AI-generated claims against ground-truth source documents with exact evidentiary citations.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#F8FAFC] text-[#0F172A] antialiased selection:bg-emerald-500/20 selection:text-emerald-900">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
