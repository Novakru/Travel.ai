"use client"
import Header from "./components/Header"
import Banner from "./components/Banner"
import Category from "./components/Category"
import Destination from "./components/Destination"
import Book from "./components/Book"
import Subscribe from "./components/Subscribe"
import Footer from "./components/Footer"
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
      <Subscribe />
      <Footer />
    </main>
  )
}
