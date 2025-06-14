
import React from "react";

type Props = {
  name: string;
  description: string;
  price: number;
  image?: string;
  onBook?: () => void;
};

const ServiceCard = ({ name, description, price, image, onBook }: Props) => (
  <div className="border shadow rounded-lg flex flex-col p-4 bg-white">
    {image && <img src={image} className="w-full h-36 object-cover mb-2 rounded" alt={name} />}
    <h3 className="text-xl font-semibold">{name}</h3>
    <p className="text-sm text-gray-500 my-2">{description}</p>
    <div className="flex items-center justify-between">
      <span className="font-bold text-orange-700 text-lg">
        ₹{(price/100).toLocaleString("en-IN")}
      </span>
      {onBook && (
        <button className="px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 mt-0.5" onClick={onBook}>
          Book
        </button>
      )}
    </div>
  </div>
);

export default ServiceCard;
