
import { supabase } from "@/integrations/supabase/client";

// Call this manually once to add seed services!
export async function seedServices() {
  const services = [
    {
      name: "Griha Pravesh Pooja",
      description: "Traditional housewarming (griha pravesh) puja by expert pandits. All materials provided.",
      price: 510000, // Rs.5100
      image: "https://www.jagranimages.com/images/newimg/02022023/02_02_2023-grih_pravesh_puja_ke_fayde_23366602.jpg"
    },
    {
      name: "Satyanarayan Katha",
      description: "Book a certified Pandit for Satyanarayan Katha with proper vidhi and material.",
      price: 410000,
      image: "https://www.panditjiinlucknow.com/uploads/satyanarayan-katha-puja-panditjiinlucknow.jpg"
    },
    {
      name: "Marriage Pooja",
      description: "Pooja and rituals for auspicious marriage ceremonies as per Vedic customs.",
      price: 1100000,
      image: "https://hindi.cdn.zeenews.com/hindi/sites/default/files/2023/07/20/262206-janmashtami-puja-vidhi.jpg"
    },
    {
      name: "Mahamrityunjaya Jaap",
      description: "108 Mahamrityunjaya Jaap/havan for health and obstacles removal, performed by expert Pandit.",
      price: 610000,
      image: "https://www.drikpanchang.com/img/puja-items/Mahamrityunjaya%20Mantra.jpg"
    }
  ];
  for (const svc of services) {
    await supabase.from("services").insert([svc]);
  }
}
</lov_write>

<lov-write file_path="src/pages/Index.tsx">
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-white min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center pt-20">
        <div className="max-w-xl text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-orange-700 mb-4">Book Authentic Hindu Rituals Online</h1>
          <p className="text-lg text-gray-700 mb-8">
            Welcome to Eguruji1803—Your trusted platform to connect with certified Pandits for all Hindu rituals and pooja services.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-5">
            <Button asChild size="lg" className="bg-orange-600 text-white hover:bg-orange-700">
              <Link to="/auth?role=customer">Book a Pooja</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/auth?role=pandit">Pandit: Join as Guruji</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
