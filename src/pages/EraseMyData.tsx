
import React from "react";

const EraseMyData = () => (
  <div className="min-h-screen bg-white flex flex-col items-center justify-start py-10 px-2">
    <div className="bg-orange-50 max-w-xl w-full rounded-xl shadow p-8">
      <h1 className="text-2xl font-bold text-orange-700 mb-4 text-center">Erase My Data</h1>
      <p>
        To request erasure of your data from our platform, please email <a href="mailto:customer@eguruji.com" className="text-orange-600 underline">customer@eguruji.com</a> 
        with your account details. We will process your request as per our policy.
      </p>
    </div>
  </div>
);

export default EraseMyData;
