
import { Link } from "react-router-dom";

// Add all your service cards here as constant data
const services = [
  {
    id: 1,
    title: "Vaastu Shanti",
    category: "REGULAR",
    img: "/pic/20220418105201.png",
    price: "₹00.00",
    link: "/product/1",
  },
  {
    id: 2,
    title: "Griha Pravesh",
    category: "REGULAR",
    img: "/pic/GRIHA.png",
    price: "₹00.00",
    link: "/product/2",
  },
  {
    id: 3,
    title: "Bhoomi Pooja",
    category: "REGULAR",
    img: "/pic/BHOOMI.jpg",
    price: "₹00.00",
    link: "/product/3",
  },
  {
    id: 4,
    title: "Satya Narayan",
    category: "REGULAR",
    img: "/pic/SATYA.jpg",
    price: "₹00.00",
    link: "/product/4",
  },
  {
    id: 5,
    title: "Durja Pooja",
    category: "REGULAR",
    img: "/pic/DURGA.jpg",
    price: "₹00.00",
  },
  {
    id: 6,
    title: "Office Opening Pooja",
    category: "REGULAR",
    img: "/pic/OFF OPEN.jpg",
    price: "₹00.00",
  },
  {
    id: 7,
    title: "Mahalakshmi Pooja",
    category: "REGULAR",
    img: "/pic/MAHALAKSHI.jpg",
    price: "₹00.00",
  },
  {
    id: 8,
    title: "Ganpati Pooja",
    category: "REGULAR",
    img: "/pic/GANESH.jpg",
    price: "₹00.00",
  },
  {
    id: 9,
    title: "Rudra Abhishek",
    category: "REGULAR",
    img: "/pic/RUDRA.jpeg",
    price: "₹00.00",
  },
  {
    id: 10,
    title: "Mangalagaur Pooja",
    category: "REGULAR",
    img: "/pic/MANGALAKAUR.jpeg",
    price: "₹00.00",
  },
  {
    id: 11,
    title: "Ganpati Visarjan Pooja",
    category: "FESTIVAL",
    img: "/pic/GANVIS.jpg",
    price: "₹00.00",
  },
  {
    id: 12,
    title: "Janmashtami Pooja",
    category: "FESTIVAL",
    img: "/pic/JAN.jpg",
    price: "₹00.00",
  },
  {
    id: 13,
    title: "Diwali Lakshmi Pooja",
    category: "FESTIVAL",
    img: "/pic/DIWALI LAK.jpg",
    price: "₹00.00",
  },
  {
    id: 14,
    title: "Ganapti Sthapana Pooja",
    category: "FESTIVAL",
    img: "/pic/GAN STHA.jpg",
    price: "₹00.00",
  },
  {
    id: 15,
    title: "Udak Shanti",
    category: "SHANTI",
    img: "/pic/UDAK.jpg",
    price: "₹00.00",
  },
  {
    id: 16,
    title: "Navgraha Shanti",
    category: "SHANTI",
    img: "/pic/NAV.png",
    price: "₹00.00",
  },
  {
    id: 17,
    title: "Ganapti Havan",
    category: "HAVAN",
    img: "/pic/GAN H.jpg",
    price: "₹00.00",
  },
  {
    id: 18,
    title: "Dhan Laxmi Pooja",
    category: "HAVAN",
    img: "/pic/DHAN.jpg",
    price: "₹00.00",
  },
  {
    id: 19,
    title: "Ganesh Havan",
    category: "HAVAN",
    img: "/pic/GANESH.jpg",
    price: "₹00.00",
  },
  {
    id: 20,
    title: "Satyanarayan Havan",
    category: "HAVAN",
    img: "/pic/SATYA.jpg",
    price: "₹00.00",
  },
];

export default function ServicesPage() {
  return (
    <div className="bg-white min-h-screen w-full">
      {/* Navbar */}
      <header className="w-full shadow bg-white sticky top-0 z-20">
        <div className="container mx-auto px-4 flex items-center justify-between py-3">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logoo.png" className="h-9 w-9 object-contain" alt="Logo" />
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
            <div key={s.title} className="service-card bg-white rounded-lg shadow hover:shadow-xl transition-all flex flex-col p-3">
              {s.link ? (
                <Link to={s.link}><img src={s.img} alt={s.title} className="w-full h-44 object-cover rounded" /></Link>
              ) : (
                <img src={s.img} alt={s.title} className="w-full h-44 object-cover rounded" />
              )}
              <div className="service-info flex flex-col flex-1 py-3 px-1">
                <h3 className="font-bold text-xs text-gray-500 mb-1">{s.category}</h3>
                <h2 className="text-lg font-semibold mb-1">{s.title}</h2>
                <p className="text-orange-700 font-bold">{s.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Footer */}
      <footer className="border-t mt-12 py-6 bg-gray-50">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row justify-between gap-8">
          <div>
            <h4 className="font-semibold mb-2">CUSTOMER SUPPORT</h4>
            <nav className="flex flex-col gap-1">
              <a href="mailto:customer@eguruji.com" className="hover:underline">customer@eguruji.com</a>
              <a href="tel:+9191XXXXXX69" className="hover:underline">+91 91XXXXXX69</a>
            </nav>
          </div>
          <div>
            <h4 className="font-semibold mb-2">INFO</h4>
            <nav className="flex flex-col gap-1">
              <a href="/cancelpolicy" className="hover:underline">Cancellation Policy</a>
              <a href="/terms" className="hover:underline">Terms & Conditions</a>
              <a href="/policy" className="hover:underline">Privacy Policy</a>
              <a href="#" className="hover:underline">Erase my data</a>
            </nav>
          </div>
          <div>
            <h4 className="font-semibold mb-2">KEEP UP TO DATE</h4>
            <form className="flex gap-2">
              <input type="email" required placeholder="Your Email Here" className="px-3 py-2 border rounded text-sm" />
              <button className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">SUBSCRIBE</button>
            </form>
          </div>
        </div>
        <div className="text-center mt-6 text-gray-400 text-xs">
          © 2024 E-GURUJI
        </div>
      </footer>
    </div>
  );
}
