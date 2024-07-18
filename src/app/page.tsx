"use client"
import Header from "./components/Header"
import Banner from "./components/Banner"
import Category from "./components/Category"
import Destination from "./components/Destination"
import Book from "./components/Book"
// import Testimonials from "./components/Testimonials"
import Sponsors from "./components/Sponsors"
import Subscribe from "./components/Subscribe"
import Footer from "./components/Footer"
import Map from "./components/Map"
import CallToActionL from "./components/CallToActionL"
import CallToActionR from "./components/CallToActionR"
export default function Home() {
  return (
    <main>
      <Header />
      <Banner />
      <Category />
	    <CallToActionL/>
      <CallToActionR/>
      <Destination />
      <Book />
      {/* <Testimonials /> */}
      {/*<Sponsors />*/}
      <Subscribe />
      <Footer />
      {/* <Map /> */}
    </main>
  )
}
