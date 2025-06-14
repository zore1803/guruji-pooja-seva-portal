
import React from "react";

const About = () => (
  <div className="bg-white min-h-screen pb-10">
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-3xl md:text-4xl font-bold text-orange-700 mb-6 font-playfair text-center">About Us</h2>
      <div className="bg-orange-50/70 p-6 rounded shadow flex flex-col gap-2">
        <p className="text-base text-gray-800 mb-2 font-semibold">
          E-GURUJI is an Online Puja Booking Portal where technology meets tradition. All our Pandits are trained in certified Vedic Pathashalas and are experienced in performing puja professionally.
        </p>
        <p className="text-gray-700">E-GURUJI Offers:</p>
        <ul className="list-disc ml-6 space-y-1 text-gray-700 text-sm md:text-base">
          <li>Convenience to clients and streamlined processing at the click of a button.</li>
          <li>Robust and interactive online platform for clients using superior technology.</li>
          <li>Services of qualified Panditjis, checked and confirmed for both qualifications and conduct.</li>
          <li>A complete Puja samagri kit, in branded boxes and bags.</li>
          <li>Absolute transparency in pricing, displayed directly on the website.</li>
          <li>Pujas and Panditjis are serious, but E-GURUJI brings celebratory emotion, quick service, and maintains the austerity of the ritual.</li>
          <li>All Panditjis undergo soft skills training; they are courteous, communicative, and trained in etiquette for an inclusive and festive atmosphere.</li>
          <li>Our Pandits are approachable and communicative.</li>
          <li>Panditjis visiting for Pujas are vetted for security.</li>
          <li>E-GURUJI encourages online reviews for continuous improvement.</li>
        </ul>
      </div>
    </div>
    {/* Footer-style info below the About section */}
    <div className="bg-orange-50 border-t mt-6 py-10">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 px-4">
        {/* CUSTOMER SUPPORT */}
        <div className="flex-1">
          <h3 className="text-md font-bold text-orange-600 mb-2">CUSTOMER SUPPORT</h3>
          <p>
            <a href="mailto:customer@eguruji.com" className="text-orange-700 hover:underline">customer@eguruji.com</a><br />
            <a href="tel:+9191XXXXXX69" className="text-orange-700 hover:underline">+91 91XXXXXX69</a>
          </p>
        </div>
        {/* INFO */}
        <div className="flex-1">
          <h3 className="text-md font-bold text-orange-600 mb-2">INFO</h3>
          <ul className="space-y-1">
            <li><a href="#" className="hover:underline text-gray-700">Cancellation Policy</a></li>
            <li><a href="#" className="hover:underline text-gray-700">Terms & Conditions</a></li>
            <li><a href="#" className="hover:underline text-gray-700">Privacy Policy</a></li>
            <li><a href="#" className="hover:underline text-gray-700">Erase my data</a></li>
          </ul>
        </div>
        {/* Newsletter */}
        <div className="flex-1">
          <h3 className="text-md font-bold text-orange-600 mb-2">KEEP UP TO DATE</h3>
          <form className="flex flex-col gap-2 max-w-xs">
            <label htmlFor="footer-field" className="text-sm">Your Email Here</label>
            <input
              type="email"
              id="footer-field"
              name="footer-field"
              className="border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-orange-200"
              placeholder="you@example.com"
            />
            <button type="submit" className="bg-orange-600 text-white px-3 py-1 rounded font-bold hover:bg-orange-700 transition">SUBSCRIBE</button>
          </form>
        </div>
      </div>
      <div className="max-w-5xl mx-auto mt-8 text-center text-xs text-gray-600">
        <span>© 2024 E-GURUJI.</span>
      </div>
    </div>
  </div>
);

export default About;

