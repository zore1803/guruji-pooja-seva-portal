
import React from "react";

const Policy = () => (
  <div className="min-h-screen bg-white flex flex-col items-center justify-start py-10 px-2">
    <div className="bg-orange-50 max-w-xl w-full rounded-xl shadow p-8">
      <h1 className="text-2xl font-bold text-orange-700 mb-4 text-center">Privacy Policy For Customer</h1>
      <p className="mb-4">
        Welcome to <b>E GURUJI</b>. Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website and services.
      </p>
      <h3 className="text-lg font-semibold mt-6 text-orange-700">Information We Collect</h3>
      <ul className="list-disc pl-5 mb-3 text-gray-700">
        <li>
          <b>Personal Information:</b> Name, email address, phone number, and other contact details. Payment info for appointment bookings. Location details (if provided). Profile info of customers and pandits.
        </li>
        <li>
          <b>Non-Personal Information:</b> Browser type, IP address, device info, usage data (pages visited, interactions).
        </li>
      </ul>
      <h3 className="text-lg font-semibold mt-6 text-orange-700">How We Use Your Information</h3>
      <ul className="list-disc pl-5 mb-3 text-gray-700">
        <li>To facilitate appointments between customers and pandits.</li>
        <li>To process payments and send appointment confirmations.</li>
        <li>To improve our website and services based on user behavior.</li>
        <li>To send notifications, updates, and promotions (if opted in).</li>
        <li>To ensure user security and prevent fraudulent activities.</li>
      </ul>
      <h3 className="text-lg font-semibold mt-6 text-orange-700">Sharing of Information</h3>
      <ul className="list-disc pl-5 mb-3 text-gray-700">
        <li><b>With Pandits:</b> Customer details (except payment info) may be shared with the booked pandit.</li>
        <li><b>With Customers:</b> Basic details of the pandit may be shared with the customer upon booking.</li>
        <li><b>With Third Parties:</b> Payment gateways, service providers, legal authorities if required by law.</li>
      </ul>
      <h3 className="text-lg font-semibold mt-6 text-orange-700">Data Security</h3>
      <ul className="list-disc pl-5 mb-3 text-gray-700">
        <li>We use encryption and secure servers to protect user data.</li>
        <li>Users must keep their login credentials confidential.</li>
        <li>While we take security measures, no online service is 100% secure.</li>
      </ul>
      <h3 className="text-lg font-semibold mt-6 text-orange-700">Cookies and Tracking Technologies</h3>
      <ul className="list-disc pl-5 mb-3 text-gray-700">
        <li>We use cookies to improve user experience and website functionality.</li>
        <li>Users can manage or disable cookies through browser settings.</li>
      </ul>
      <div className="mt-6" />
    </div>
  </div>
);

export default Policy;
