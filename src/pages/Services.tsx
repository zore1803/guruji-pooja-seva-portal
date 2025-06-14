
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import ServiceCard from "@/components/ServiceCard";

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  useEffect(() => {
    supabase.from("services").select("*").order("price", { ascending: true }).then(({ data }) => {
      setServices(data || []);
    });
  }, []);
  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      <h2 className="text-3xl font-bold mb-7 font-playfair text-orange-700 text-center">Available Pooja Services</h2>
      <div className="grid sm:grid-cols-2 gap-7">
        {services.length === 0 ? (
          <div className="text-center col-span-2 text-gray-400">No services listed yet.</div>
        ) : (
          services.map(s => (
            <ServiceCard
              key={s.id}
              name={s.name}
              description={s.description}
              price={s.price}
              image={s.image}
            />
          ))
        )}
      </div>
    </div>
  );
}
