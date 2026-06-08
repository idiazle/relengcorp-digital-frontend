import type { Metadata } from "next";
import QueryProvider from './_providers/QueryProvider'
import "./globals.css";

export const metadata: Metadata = {
  title: "Relengcorp Digital",
  description: "Software de confiablilidad",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`antialiased`}>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
