import React from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, Locale } from "@/i18n/routing";
import "./globals.css";
import {
    Bricolage_Grotesque,
    Inter,
    El_Messiri,
    Cairo,
} from "next/font/google";
import { AuthProvider } from "@/providers/AuthProvider";
import { SoundProvider } from "@/providers/SoundProvider";

const bricolage = Bricolage_Grotesque({
    subsets: ["latin"],
    variable: "--font-bricolage",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const elMessiri = El_Messiri({
    subsets: ["arabic", "latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-el-messiri",
});
const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo" });

interface LocaleLayoutProps {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
    children,
    params,
}: LocaleLayoutProps) {
    // Await the dynamic layout route params
    const { locale } = await params;

    // Strict type verification guard clause
    if (!routing.locales.includes(locale as Locale)) {
        notFound();
    }

    // Set the global layout structure dynamically
    const direction = locale === "ar" ? "rtl" : "ltr";
    const messages = await getMessages();

    return (
        <html
            lang={locale}
            dir={direction}
            className={`${bricolage.variable} ${inter.variable} ${elMessiri.variable} ${cairo.variable}`}
            suppressHydrationWarning
        >
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `try{var t=localStorage.getItem('playhub-theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}`,
                    }}
                />
            </head>
            <body className="antialiased min-h-screen ">
                <NextIntlClientProvider messages={messages}>
                    <AuthProvider>
                        <SoundProvider>{children}</SoundProvider>
                    </AuthProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
