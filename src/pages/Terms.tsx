
import React from "react";

const Terms = () => (
  <div className="min-h-screen bg-white flex flex-col items-center justify-start py-10 px-2">
    <div className="bg-orange-50 max-w-xl w-full rounded-xl shadow p-8">
      <h1 className="text-2xl font-bold text-orange-700 mb-4 text-center">Terms &amp; Conditions for Customer</h1>
      <p className="mb-4">
        Welcome to <b>E GURUJI</b>! By using our website and services, you agree to comply with the following Terms and Conditions. Please read them carefully before proceeding.
      </p>
      <h3 className="text-lg font-semibold mt-6 text-orange-700">Definitions</h3>
      <ul className="list-disc pl-5 mb-3 text-gray-700">
        <li><strong>"Website"</strong> refers to E GURUJI.</li>
        <li><strong>"User"</strong> refers to both customers and pandits (service providers) using the platform.</li>
        <li><strong>"Customer"</strong> refers to individuals seeking pandit services through E GURUJI.</li>
        <li><strong>"Pandit"</strong> refers to service providers offering spiritual, religious, or ceremonial services.</li>
        <li><strong>"Appointment"</strong> refers to a scheduled service between a customer and a pandit.</li>
      </ul>
      <h3 className="text-lg font-semibold mt-6 text-orange-700">User Eligibility</h3>
      <p className="mb-3 text-gray-700">
        You must be at least 18 years old to use this platform. By registering, you confirm that the information provided is accurate and up-to-date.
      </p>
      <h3 className="text-lg font-semibold mt-6 text-orange-700">Account Registration - E GURUJI</h3>
      <ul className="list-disc pl-5 mb-3 text-gray-700">
        <li>Both customers and pandits must create an account to use E GURUJI.</li>
        <li>Users are responsible for maintaining the confidentiality of their account credentials.</li>
        <li>Any unauthorized use of your account must be reported immediately.</li>
      </ul>
      <h3 className="text-lg font-semibold mt-6 text-orange-700">Pandit Appointments</h3>
      <ul className="list-disc pl-5 mb-3 text-gray-700">
        <li>Customers can book appointments with registered pandits through the website.</li>
        <li>Pandits must ensure they are available at the scheduled time and provide the agreed-upon service.</li>
        <li>E GURUJI is not responsible for any cancellations, delays, or disputes between customers and pandits.</li>
        <li>Customers must provide accurate details while booking appointments.</li>
      </ul>
      <h3 className="text-lg font-semibold mt-6 text-orange-700">Payment and Fees</h3>
      <ul className="list-disc pl-5 mb-3 text-gray-700">
        <li>Customers must pay for the appointment as per the rates displayed on the website.</li>
        <li>
          E GURUJI may charge a service fee for facilitating appointments. Payments must be made through the designated payment gateway.
        </li>
        <li>Refunds and cancellations will be governed by our <a href="/cancelpolicy" className="underline text-orange-600">Cancellation Policy</a>.</li>
      </ul>
      <h3 className="text-lg font-semibold mt-6 text-orange-700">Modifications to Terms</h3>
      <ul className="list-disc pl-5 mb-3 text-gray-700">
        <li>E GURUJI may modify these Terms at any time. Updates will be posted on the website.</li>
        <li>For certain special services or events, a different cancellation policy may apply; these will be clearly mentioned during booking.</li>
      </ul>
    </div>
  </div>
);

export default Terms;
