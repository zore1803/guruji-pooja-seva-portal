
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";

// New local image paths for the first 10 services
const serviceImages = [
  "/lovable-uploads/dc4a5c8a-3832-4bfc-860c-e235b8c225b7.png", // 1
  "/lovable-uploads/2263f060-33f7-4944-b853-5a140ec68e36.png", // 2
  "/lovable-uploads/2ee87fe5-d7a5-4aec-8867-4fb74c778dc2.png", // 3
  "/lovable-uploads/c1a5b2a3-ee18-40e5-8581-c3c52d85a9b9.png", // 4
  "/lovable-uploads/b9a8b749-7987-4c52-ba97-a3805e555da7.png", // 5
  "/lovable-uploads/65e174e3-c7e8-4606-a7a6-2b458a910f4c.png", // 6
  "/lovable-uploads/d8c3c874-61f6-4372-b601-3ebe4c4580c0.png", // 7
  "/lovable-uploads/62f5c343-495a-4a65-bd20-2fc1c99fb626.png", // 8
  "/lovable-uploads/695814da-ae02-443d-8ab9-80dfa76c9755.png", // 9
  "/lovable-uploads/5d3e5a15-cb00-4549-9a4d-3efc26b032cd.png", // 10
];

// Map your uploaded images to the correct services (11-20) below:
const services = [
  {
    id: 1,
    title: "Vaastu Shanti",
    category: "REGULAR",
    img: serviceImages[0],
    price: "₹1000.00",
    link: "/product/1",
  },
  {
    id: 2,
    title: "Griha Pravesh",
    category: "REGULAR",
    img: serviceImages[1],
    price: "₹1200.00",
    link: "/product/2",
  },
  {
    id: 3,
    title: "Bhoomi Pooja",
    category: "REGULAR",
    img: serviceImages[2],
    price: "₹1100.00",
    link: "/product/3",
  },
  {
    id: 4,
    title: "Satya Narayan",
    category: "REGULAR",
    img: serviceImages[3],
    price: "₹900.00",
    link: "/product/4",
  },
  {
    id: 5,
    title: "Durja Pooja",
    category: "REGULAR",
    img: serviceImages[4],
    price: "₹1000.00",
    link: "/product/5",
  },
  {
    id: 6,
    title: "Office Opening Pooja",
    category: "REGULAR",
    img: serviceImages[5],
    price: "₹2000.00",
    link: "/product/6",
  },
  {
    id: 7,
    title: "Mahalakshmi Pooja",
    category: "REGULAR",
    img: serviceImages[6],
    price: "₹1400.00",
    link: "/product/7",
  },
  {
    id: 8,
    title: "Ganpati Pooja",
    category: "REGULAR",
    img: serviceImages[7],
    price: "₹1200.00",
    link: "/product/8",
  },
  {
    id: 9,
    title: "Rudra Abhishek",
    category: "REGULAR",
    img: serviceImages[8],
    price: "₹1800.00",
    link: "/product/9",
  },
  {
    id: 10,
    title: "Mangalagaur Pooja",
    category: "REGULAR",
    img: serviceImages[9],
    price: "₹1300.00",
    link: "/product/10",
  },
  {
    id: 11,
    title: "Ganpati Visarjan Pooja",
    category: "FESTIVAL",
    img: "/lovable-uploads/8f56705a-3508-48d2-b025-b9746aa30f85.png", // Ganpati Visarjan
    price: "₹900.00",
    link: "/product/11",
  },
  {
    id: 12,
    title: "Janmashtami Pooja",
    category: "FESTIVAL",
    img: "/lovable-uploads/6953ad6b-9da3-45bc-bc02-63febada4a34.png", // Janmashtami
    price: "₹1100.00",
    link: "/product/12",
  },
  {
    id: 13,
    title: "Diwali Lakshmi Pooja",
    category: "FESTIVAL",
    img: "/lovable-uploads/7a18e668-8e8d-4d40-a8a8-a286e4089324.png", // Diwali Lakshmi
    price: "₹2100.00",
    link: "/product/13",
  },
  {
    id: 14,
    title: "Ganapti Sthapana Pooja",
    category: "FESTIVAL",
    img: "/lovable-uploads/3a7d649e-67b9-4c49-9866-d9cb4f95f0aa.png", // Ganpati Sthapana
    price: "₹1000.00",
    link: "/product/14",
  },
  {
    id: 15,
    title: "Udak Shanti",
    category: "SHANTI",
    img: "/lovable-uploads/251e248a-4351-49bd-8651-6aeefdaee648.png", // Udak Shanti
    price: "₹950.00",
    link: "/product/15",
  },
  {
    id: 16,
    title: "Navgraha Shanti",
    category: "SHANTI",
    img: "/lovable-uploads/25013b1e-6e13-409f-803d-fbdd499fd7da.png", // Navgraha Shanti
    price: "₹1700.00",
    link: "/product/16",
  },
  {
    id: 17,
    title: "Ganapti Havan",
    category: "HAVAN",
    img: "/lovable-uploads/07f5ed97-9548-4467-b6f8-68cf9301ec72.png", // Ganapti Havan
    price: "₹1500.00",
    link: "/product/17",
  },
  {
    id: 18,
    title: "Dhan Laxmi Pooja",
    category: "HAVAN",
    img: "/lovable-uploads/b9ec4e6a-73d1-4536-8eaa-809140586224.png", // Dhan Laxmi
    price: "₹2000.00",
    link: "/product/18",
  },
  {
    id: 19,
    title: "Ganesh Havan",
    category: "HAVAN",
    img: "/lovable-uploads/9ec09147-1249-4be2-9391-19df10c3d32f.png", // Ganesh Havan
    price: "₹1600.00",
    link: "/product/19",
  },
  {
    id: 20,
    title: "Satyanarayan Havan",
    category: "HAVAN",
    img: "/lovable-uploads/1a779d2d-ca9c-4348-a5b7-1745de1e05fa.png", // Satyanarayan
    price: "₹1200.00",
    link: "/product/20",
  },
];

// Use the Book A Pandit image as the logo
const logoSrc = "/lovable-uploads/5d3e5a15-cb00-4549-9a4d-3efc26b032cd.png";

export default function ServicesPage() {
  return (
    <div className="bg-white min-h-screen w-full">
      {/* Navbar */}
      <header className="w-full shadow bg-white sticky top-0 z-20">
        <div className="container mx-auto px-4 flex items-center justify-between py-3">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoSrc} className="h-10 w-10 object-contain rounded-full bg-white border" alt="Logo" />
            <span className="text-2xl font-playfair font-bold tracking-tight text-orange-600">E-GURUJI</span>
          </Link>
          <nav className="hidden md:flex gap-6 font-medium text-gray-700">
            <Link to="/" className="hover:text-orange-700">Home</Link>
            <Link to="/services" className="hover:text-orange-700">Services</Link>
            <Link to="/about" className="hover:text-orange-700">About Us</Link>
            <Link to="/contact" className="hover:text-orange-700">Contact</Link>
          </nav>
        </div>
      </header>
      {/* Services Section */}
      <section className="container mx-auto py-10">
        <h2 className="font-playfair text-4xl font-semibold mb-10 text-center text-orange-700">Services</h2>
        <div className="grid grid-cols-1 xsm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
          {services.map((s) => (
            <Link
              key={s.title}
              to={s.link}
              className="service-card bg-white rounded-lg shadow hover:shadow-xl transition-all flex flex-col p-3 cursor-pointer group h-full"
              style={{ textDecoration: "none" }}
            >
              <img src={s.img} alt={s.title} className="w-full h-44 object-cover rounded group-hover:opacity-85" />
              <div className="service-info flex flex-col flex-1 py-3 px-1">
                <h3 className="font-bold text-xs text-gray-500 mb-1">{s.category}</h3>
                <h2 className="text-lg font-semibold mb-1 group-hover:text-orange-700 transition">{s.title}</h2>
                <p className="text-orange-700 font-bold group-hover:underline">{s.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      {/* Footer */}
      <Footer />
    </div>
  );
}

