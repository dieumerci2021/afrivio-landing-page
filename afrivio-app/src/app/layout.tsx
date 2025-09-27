import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ChatbotWidget from "@/components/ChatbotWidget"; // Importer le chatbot

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Afrivio - Voyagez en Afrique",
  description: "Découvrez et réservez des expériences uniques en Afrique.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {children}
        <ChatbotWidget /> {/* Ajouter le widget ici */}
      </body>
    </html>
  );
}