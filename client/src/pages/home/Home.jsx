import React from "react";
import HeroSection from "./components/HeroSection";
import BookCategories from "./components/BookCategories";
import BestSellerBooks from "./components/BestSellerBooks";
import NewArrivals from "./components/NewArrivals";
import WhyChooseUs from "./components/WhyChooseUs";

function Home() {
    return (
        <div className="home-page min-h-screen bg-background">
            <HeroSection />
            <BookCategories />
            <BestSellerBooks/>
            <NewArrivals/>
            <WhyChooseUs/>
        </div>
    );
}

export default Home;