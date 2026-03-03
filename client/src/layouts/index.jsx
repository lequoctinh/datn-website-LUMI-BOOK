import React from "react";
import Header from "./Header";
import HeaderMobile from "./HeaderMobile";
import Footer from "./Footer";

function MainLayout({ children }) {
    return (
        <div className="flex flex-col min-h-screen bg-background font-body text-text-primary">
            <Header />
            <HeaderMobile />
            
            <main className="flex-grow w-full">
                {children}
            </main>

            <Footer />
        </div>
    );
}

export default MainLayout;