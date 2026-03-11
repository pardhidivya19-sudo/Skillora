import Hero from "./Hero";
import ByCategories from "./ByCategories";
import PopularServices from "./PopularServices";
import HowWorks from "./HowWorks";
import TopProfessionals from "./TopProfessionals";
import Testimonials from "./Testimonials";

function Home() {
  return (
    <>
      <Hero />
      <ByCategories />
      <PopularServices/>
      <HowWorks/>
      <TopProfessionals/>
      <Testimonials/>
    </>
  );
}

export default Home;