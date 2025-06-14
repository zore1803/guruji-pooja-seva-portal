import { useParams, Link, useNavigate } from "react-router-dom";
import { poojas } from "@/data/poojas";
import { Button } from "@/components/ui/button";

export default function PoojaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const pooja = poojas.find(p => p.id === Number(id));

  if (!pooja) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <h1 className="text-2xl font-bold mb-4 text-orange-700">Pooja not found</h1>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8ede8] py-12 px-4 flex flex-col items-center">
      <div className="max-w-5xl w-full flex flex-col md:flex-row gap-10 bg-[#faefe5] rounded-xl shadow p-6 items-center">
        <div className="relative flex-shrink-0">
          <img src={pooja.image} alt={pooja.title} className="w-72 h-72 rounded shadow object-cover" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full bg-orange-700 text-white font-bold rounded-l-lg px-3 py-2 text-lg rotate-[-90deg] origin-top-left hidden md:block">
            {pooja.title.toUpperCase()} PUJAN
          </div>
        </div>
        <div className="flex flex-col flex-1 items-center md:items-start">
          <h1 className="text-3xl md:text-4xl font-extrabold text-center md:text-left mb-2">{pooja.title.toUpperCase()}</h1>
          <h3 className="text-green-600 text-2xl font-bold mb-2">₹{pooja.price}</h3>
          <p className="mb-3 text-gray-700 text-base md:text-lg max-w-xl">
            {pooja.description}
          </p>
          {pooja.details && (
            <div className="bg-orange-100 p-4 rounded-lg mb-6 w-full max-w-xl">
              <span className="font-semibold text-orange-700">More Information:</span>
              <div className="mt-1 text-sm text-gray-800">{pooja.details}</div>
            </div>
          )}
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-base font-medium rounded" size="lg">
            Select Dates/Timings
          </Button>
        </div>
      </div>
      <Link to="/services" className="mt-8 text-orange-700 underline hover:text-orange-900 font-medium">← Back to Services</Link>
    </div>
  );
}
