
import React from "react";

const About = () => (
  <div className="bg-white min-h-screen pb-10">
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-3xl md:text-4xl font-bold text-orange-700 mb-6 font-playfair text-center">About Us</h2>
      <div className="bg-orange-50/70 p-6 rounded shadow flex flex-col gap-2">
        <p className="text-base text-gray-800 mb-2 font-semibold">
          E-Guruji is an Online Puja Booking Portal where technology meets tradition. All our Pandits are trained in certified Vedic Pathashalas and are experienced in performing puja professionally.
        </p>
        <p className="text-gray-700">E-Guruji Offers:</p>
        <ul className="list-disc ml-6 space-y-1 text-gray-700 text-sm md:text-base">
          <li>Convenience to clients and streamlined processing at the click of a button.</li>
          <li>Robust and interactive online platform for clients using superior technology.</li>
          <li>Services of qualified Panditjis, checked and confirmed for both qualifications and conduct.</li>
          <li>A complete Puja samagri kit, in branded boxes and bags.</li>
          <li>Absolute transparency in pricing, displayed directly on the website.</li>
          <li>Pujas and Panditjis are serious, but E-Guruji brings celebratory emotion, quick service, and maintains the austerity of the ritual.</li>
          <li>All Panditjis undergo soft skills training; they are courteous, communicative, and trained in etiquette for an inclusive and festive atmosphere.</li>
          <li>Our Pandits are approachable and communicative.</li>
          <li>Panditjis visiting for Pujas are vetted for security.</li>
          <li>E-Guruji encourages online reviews for continuous improvement.</li>
        </ul>
      </div>
    </div>
  </div>
);

export default About;
