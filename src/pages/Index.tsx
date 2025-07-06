
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="bg-orange-50 min-h-screen">
    <section className="max-w-5xl mx-auto py-16 px-5 flex flex-col md:flex-row items-center gap-8 justify-between">
      {/* Left: Title & description */}
      <div className="flex-1 flex flex-col items-start justify-center text-left w-full">
        <h1 className="text-4xl md:text-5xl font-bold text-orange-700 font-playfair mb-4">
          E-GURUJI: Your Trusted Online Pandit Booking Portal
        </h1>
        <p className="text-lg text-gray-700 max-w-xl leading-relaxed mb-6">
          Book Vedic Pandits online for pujas, kathas, sanskaars, and astrological consultations. 100% verified Guruji, Personalized Services, Secure Payment, Transparent Pricing.<br />
          Get blessings & authentic rituals, in person or online.
        </p>
        <div className="mt-2 flex flex-col sm:flex-row gap-4">
          <Link to="/services" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded font-semibold text-lg shadow">Book Your Pooja</Link>
          <Link to="/auth?role=customer" className="bg-white text-orange-700 border border-orange-700 px-6 py-3 rounded font-semibold text-lg shadow hover:bg-orange-50">Login as Customer</Link>
          <Link to="/auth?role=pandit" className="bg-white text-orange-700 border border-orange-700 px-6 py-3 rounded font-semibold text-lg shadow hover:bg-orange-50">Login as Pandit</Link>
        </div>
      </div>
      {/* Right: Logo image */}
      <div className="flex justify-center md:justify-end w-full md:w-auto">
        <img
          src="/lovable-uploads/be6198c7-494f-4214-907a-fd1da0249e44.png"
          alt="E-GURUJI Logo"
          className="w-60 max-w-[320px] md:w-72 lg:w-80 rounded-lg shadow-lg object-contain bg-transparent"
          style={{ background: "transparent" }}
        />
      </div>
    </section>

    {/* How to Book a Pooja Section */}
    <section className="py-12 bg-gradient-to-r from-orange-100 to-orange-200">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-orange-700 mb-8 text-center font-playfair">How to Book Your Pooja</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-lg text-center transform hover:scale-105 transition-transform">
            <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">1</span>
            </div>
            <h3 className="font-bold text-lg text-orange-600 mb-2">Choose Your Pooja</h3>
            <p className="text-gray-700 text-sm">Browse our extensive list of Vedic rituals and select the pooja that suits your needs.</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg text-center transform hover:scale-105 transition-transform">
            <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">2</span>
            </div>
            <h3 className="font-bold text-lg text-orange-600 mb-2">Select Date & Time</h3>
            <p className="text-gray-700 text-sm">Pick your preferred date and time for the ceremony that works best for you.</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg text-center transform hover:scale-105 transition-transform">
            <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">3</span>
            </div>
            <h3 className="font-bold text-lg text-orange-600 mb-2">Book & Pay</h3>
            <p className="text-gray-700 text-sm">Complete your booking with secure payment and receive instant confirmation.</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg text-center transform hover:scale-105 transition-transform">
            <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">4</span>
            </div>
            <h3 className="font-bold text-lg text-orange-600 mb-2">Get Blessed</h3>
            <p className="text-gray-700 text-sm">Our verified pandit will perform the ritual and provide you with divine blessings.</p>
          </div>
        </div>
      </div>
    </section>

    <section className="py-10 bg-white border-t mt-10">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-orange-700 mb-6 font-playfair">Why Choose E-GURUJI?</h2>
        <div className="grid md:grid-cols-3 gap-6 text-gray-700">
          <div className="bg-orange-100 rounded p-6 shadow text-center">
            <h3 className="font-bold text-lg text-orange-600 mb-2">Verified Pandits</h3>
            <p>All gurus and purohits are carefully verified for authenticity and experience.</p>
          </div>
          <div className="bg-orange-100 rounded p-6 shadow text-center">
            <h3 className="font-bold text-lg text-orange-600 mb-2">All Major Rituals Covered</h3>
            <p>From Ganesh Pooja to Mahamrityunjaya Jaap, we arrange every major Vedic ritual.</p>
          </div>
          <div className="bg-orange-100 rounded p-6 shadow text-center">
            <h3 className="font-bold text-lg text-orange-600 mb-2">Dedicated Support</h3>
            <p>Personalized pooja planning, reminders & post-pooja reports, just a call away.</p>
          </div>
        </div>
      </div>
    </section>
    <Footer />
  </div>
);

export default Index;
