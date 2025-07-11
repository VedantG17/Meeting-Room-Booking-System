import Header from "../components/Landing/Header";
import Hero from "../components/Landing/Hero";
import Footer from "../components/Landing/Footer";


export default function Landing(){
  return(
    <div className="flex flex-col">
      <Header />
      <Hero /> 
      <Footer />
    </div>
  );
}