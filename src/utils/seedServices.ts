
import { supabase } from "@/integrations/supabase/client";

// Seed some default pooja services (run only once manually)
async function seedServices() {
  const services = [
    {
      name: "Ganesh Pooja",
      description: "For auspicious beginnings, success in new ventures, and removing obstacles.",
      price: 250000, // 2500 INR
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=480&q=80",
    },
    {
      name: "Satyanarayan Katha",
      description: "A sacred pooja for prosperity, happiness, and the well-being of the family.",
      price: 310000, // 3100 INR
      image: "https://images.unsplash.com/photo-1518877593221-1f28583780b4?auto=format&fit=crop&w=480&q=80"
    },
    {
      name: "Mahamrityunjaya Jaap",
      description: "For health, longevity, protection from untimely events, and spiritual progress.",
      price: 510000, // 5100 INR
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=480&q=80"
    },
    {
      name: "Griha Pravesh",
      description: "Housewarming pooja, purifies and sanctifies the home for a lucky start.",
      price: 410000, // 4100 INR
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=480&q=80"
    },
    {
      name: "Rudrabhishek",
      description: "Lord Shiva's abhishek for peace, prosperity, and protection from negativity.",
      price: 360000, // 3600 INR
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=480&q=80"
    },
  ];

  for (const s of services) {
    await supabase.from("services").insert([s]);
  }
  // eslint-disable-next-line no-console
  console.log("Demo services seeded!");
}

// Only run if you want to seed the database!
seedServices();
