import type { Metadata, Viewport } from "next";
import { Inter, Manrope, JetBrains_Mono, Doto, Unbounded } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
  preload: false,
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  preload: false,
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
  display: "swap",
  preload: false,
});

/* Дот-матричный шрифт в духе Nothing — используется для цифр и латиницы. */
const doto = Doto({
  variable: "--font-doto",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  preload: false,
});

/* Экстравагантная акциденция-антипод к точечному Doto: широкий,
   техно-гротеск с кириллицей. Пара «Nothing dot-matrix x Unbounded». */
const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Dotify — корпоративная геймификация",
  description:
    "Единая система мотивации и вовлечения сотрудников: биржа задач, челленджи, колесо фортуны, лидерборды, аукционы и внутренний магазин.",
  icons: { icon: "/logo.svg" },
};

export const viewport: Viewport = {
  themeColor: "#050505",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${manrope.variable} ${jetbrains.variable} ${doto.variable} ${unbounded.variable} font-sans antialiased bg-background text-foreground min-h-screen`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
