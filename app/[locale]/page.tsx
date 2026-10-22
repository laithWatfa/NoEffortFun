import React from "react";
import Header from "@/components/home/Header";
import Hero from "@/components/home/Hero";
import Games from "@/components/home/games/Games";
import Footer from "@/components/ui/Footer";

export default function HomePage() {
    return (
        <main className="w-screen mx-auto ">
            <Header />
            <Hero/>
            <Games/>
            <Footer/>
        </main>
    );
}
