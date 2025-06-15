
import React from "react";

const CancelPolicy = () => (
  <div className="min-h-screen bg-white flex flex-col items-center justify-start py-10 px-2">
    <div className="bg-orange-50 max-w-xl w-full rounded-xl shadow p-8">
      <h1 className="text-2xl font-bold text-orange-700 mb-4 text-center">Cancellation Policy</h1>
      <h2 className="text-lg font-semibold mt-4 text-orange-700">Cancellation by Customer</h2>
      <ul className="list-disc pl-5 mb-3 text-gray-700">
        <li>
          <strong>Before 48 hours of the scheduled service:</strong> <br />
          Cancel more than 48 hours before the scheduled time to receive a full refund, minus any applicable payment gateway charges.
        </li>
        <li>
          <strong>Between 24 to 48 hours before the scheduled service:</strong> <br />
          Cancel within this window to receive a 50% refund of the total booking amount.
        </li>
        <li>
          <strong>Within 24 hours of the scheduled service:</strong> <br />
          Cancellations made within 24 hours will not be eligible for a refund.
        </li>
      </ul>
      <h2 className="text-lg font-semibold mt-6 text-orange-700">Rescheduling</h2>
      <ul className="list-disc pl-5 mb-3 text-gray-700">
        <li>
          <strong>More than 48 hours before the scheduled service:</strong> <br />
          You can reschedule your booking without additional charge if requested more than 48 hours in advance.
        </li>
        <li>
          <strong>Within 24 to 48 hours of the scheduled service:</strong> <br />
          Rescheduling within this period may incur a rescheduling fee of [X amount].
        </li>
        <li>
          <strong>Less than 24 hours before the scheduled service:</strong> <br />
          Rescheduling requests within 24 hours will be treated as a cancellation, and the above cancellation policy will apply.
        </li>
      </ul>
      <h2 className="text-lg font-semibold mt-6 text-orange-700">Cancellation by E-Guruji</h2>
      <ul className="list-disc pl-5 mb-3 text-gray-700">
        <li>
          In rare cases, we may cancel bookings due to unforeseen circumstances like pandit unavailability or extreme weather. You will be notified and offered either a full refund or a free reschedule.
        </li>
      </ul>
      <h2 className="text-lg font-semibold mt-6 text-orange-700">No-Show Policy</h2>
      <p className="mb-3 text-gray-700">
        If the customer does not attend the puja at the scheduled time and location, it will be treated as a no-show and no refund will be provided.
      </p>
      <h2 className="text-lg font-semibold mt-6 text-orange-700">Refund Processing</h2>
      <p className="mb-3 text-gray-700">
        Refunds, if applicable, will be processed within 7-10 business days. It may take longer for the amount to reflect in your bank account depending on your payment provider.
      </p>
      <h2 className="text-lg font-semibold mt-6 text-orange-700">Special Cases</h2>
      <p className="mb-1 text-gray-700">
        For certain services or events, a different cancellation policy may apply; these will be clearly mentioned during booking.
      </p>
    </div>
  </div>
);

export default CancelPolicy;
