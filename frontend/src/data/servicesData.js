import cleaning from "../assets/images/cleaning.jpg";
import plumbing from "../assets/images/plumbing.jpg";
import electrical from "../assets/images/electrical.jpg";
import beauty from "../assets/images/beauty.jpg";
import appliance from "../assets/images/appliance.jpg";
import painting from "../assets/images/painting1.jpg";

const servicesData = [
  {
    id: 1,
    categoryId: 1,
    category: "Cleaning",
    slug: "deep-home-cleaning",
    title: "Deep Home Cleaning",
    description:
      "Thorough cleaning of your entire home including all rooms, kitchen, and bathroom.",
    rating: 4.9,
    reviews: 324,
    duration: "3-4 hrs",
    price: 289,
    image: cleaning,
  },
  {
    id: 2,
    categoryId: 2,
    category: "Plumbing",
    slug: "plumbing-repair",
    title: "Plumbing Repair",
    description:
      "Expert plumbing repair for leaks, clogs, installations, and pipe maintenance.",
    rating: 4.8,
    reviews: 218,
    duration: "1-2 hrs",
    price: 165,
    image: plumbing,
  },
  {
    id: 3,
    categoryId: 3,
    category: "Electrical",
    slug: "electrical-wiring-repair",
    title: "Electrical Wiring & Repair",
    description:
      "Safe and certified electrical work including wiring, switches, and panel repair.",
    rating: 4.7,
    reviews: 186,
    duration: "1-3 hrs",
    price: 175,
    image: electrical,
  },
  {
    id: 4,
    categoryId: 4,
    category: "Beauty & Spa",
    slug: "bridal-makeup-styling",
    title: "Bridal Makeup & Styling",
    description:
      "Professional bridal makeup and hair styling at your doorstep.",
    rating: 4.9,
    reviews: 412,
    duration: "2-3 hrs",
    price: 650,
    image: beauty,
  },
  {
    id: 5,
    categoryId: 5,
    category: "Appliance Repair",
    slug: "washing-machine-repair",
    title: "Washing Machine Repair",
    description:
      "Expert repair service for all brands of washing machines and dryers.",
    rating: 4.6,
    reviews: 156,
    duration: "1-2 hrs",
    price: 855,
    image: appliance,
  },
  {
    id: 6,
    categoryId: 6,
    category: "Painting",
    slug: "interior-wall-painting",
    title: "Interior Wall Painting",
    description:
      "Premium interior painting with quality paints and professional finish.",
    rating: 4.8,
    reviews: 1003,
    duration: "4-6 hrs",
    price: 1060,
    image: painting,
  },
  {
    id: 7,
    categoryId: 1,
    category: "Cleaning",
    slug: "bathroom-deep-clean",
    title: "Bathroom Deep Clean",
    description:
      "Intensive bathroom cleaning with sanitization and grout cleaning.",
    rating: 4.7,
    reviews: 289,
    duration: "1-2 hrs",
    price: 249,
    image: cleaning,
  },
  {
    id: 8,
    categoryId: 5,
    category: "Appliance Repair",
    slug: "ac-service-repair",
    title: "AC Service & Repair",
    description:
      "Complete AC servicing, gas refill, and repair for all brands.",
    rating: 4.8,
    reviews: 276,
    duration: "1-2 hrs",
    price: 345,
    image: appliance,
  },
];

export default servicesData;