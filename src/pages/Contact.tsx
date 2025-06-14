
import React from "react";
import Footer from "@/components/Footer";

const Contact = () => (
  <div className="bg-white min-h-screen py-10 px-2">
    <div className="max-w-4xl mx-auto">
      <h2 className="font-playfair text-3xl md:text-4xl font-bold text-center text-orange-700 mb-6">Contact Us</h2>
      <div className="flex flex-col lg:flex-row gap-8 bg-orange-50 rounded-lg shadow-md p-6">
        <div className="w-full lg:w-1/2 flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-orange-800 mb-2">Address</h3>
          <p className="text-gray-700">
            Vasantdada Patil Education Complex, Eastern Express Highway Near Everard Nagar, Chunabhatti, Sion, Mumbai, Maharashtra 400022
          </p>
          <div className="my-4 rounded overflow-hidden border w-full">
            <img
              src="https://maps.googleapis.com/maps/api/staticmap?center=Vasantdada+Patil+Education+Complex,Chunabhatti,Mumbai&zoom=15&size=600x300&maptype=roadmap&markers=color:orange%7Clabel:E%7CVasantdada+Patil+Education+Complex,Chunabhatti,Mumbai"
              alt="Map location of address"
              className="w-full h-48 object-cover"
              style={{ borderRadius: 8, background: "#eee" }}
            />
          </div>
          <h3 className="text-lg font-semibold text-orange-800 mt-4 mb-2">Email</h3>
          <a href="mailto:customer@eguruji.com" className="text-orange-700 hover:underline">customer@eguruji.com</a>
          <h3 className="text-lg font-semibold text-orange-800 mt-4 mb-2">Phone</h3>
          <a href="tel:+9191XXXXXX69" className="text-orange-700 hover:underline">+91 91XXXXXX69</a>
        </div>
        <div className="w-full lg:w-1/2 flex flex-col">
          <h3 className="text-lg font-semibold text-orange-800 mb-4">Send Us Feedback</h3>
          <form className="flex flex-col gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold mb-1">Name</label>
              <input type="text" id="name" name="name" className="w-full border px-3 py-2 rounded focus:ring focus:ring-orange-200" required />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-1">Email</label>
              <input type="email" id="email" name="email" className="w-full border px-3 py-2 rounded focus:ring focus:ring-orange-200" required />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-semibold mb-1">Message</label>
              <textarea id="message" name="message" className="w-full border px-3 py-2 rounded resize-none focus:ring focus:ring-orange-200" rows={4} required />
            </div>
            <button type="submit" className="bg-orange-600 text-white px-4 py-2 rounded font-bold hover:bg-orange-700 transition">SEND MESSAGE</button>
          </form>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default Contact;
