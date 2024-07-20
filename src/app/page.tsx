"use client"
import Header from "./components/Header"
import Banner from "./components/Banner"
import Category from "./components/Category"
import Destination from "./components/Destination"
import Book from "./components/Book"
import Sponsors from "./components/Sponsors"
import Subscribe from "./components/Subscribe"
import Footer from "./components/Footer"
import Map from "./components/Map"
import CallToActionL from "./components/CallToActionL"
import CallToActionR from "./components/CallToActionR"
import dynamic from "next/dynamic";
const Chatui = dynamic(() => import('./components/Chatui'), { ssr: false });


export default function Home() {
  return (
    <main>
      {/* <Header />
      <Banner />
      <Category />
	  <CallToActionL/>
      <CallToActionR/>
      <Destination />
      <Book />
      <Subscribe />
      <Footer /> */}
      <Map />
    </main>
  )
}
