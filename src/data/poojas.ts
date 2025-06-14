
export interface Pooja {
  id: number;
  title: string;
  category: string;
  image: string;
  price: number;
  description: string;
  details?: string; // new field for extended info
}

export const poojas: Pooja[] = [
  {
    id: 1,
    title: "Vaastu Shanti",
    category: "REGULAR",
    image: "/lovable-uploads/dc4a5c8a-3832-4bfc-860c-e235b8c225b7.png",
    price: 1000,
    description:
      "Vaastu Shanti Puja is a spiritual and religious process to offer prayers to the Vastu Purush, the Lord, protector, and soul of the house, to seek blessings for positivity and prosperity. It also pays tribute to the deity of directions, five elements of nature, and natural forces.",
    details:
      "This puja helps in negating Vastu dosha and inviting harmony into your dwelling space. Traditionally performed before occupying a new home, or after major renovations."
  },
  {
    id: 2,
    title: "Griha Pravesh",
    category: "REGULAR",
    image: "/lovable-uploads/2263f060-33f7-4944-b853-5a140ec68e36.png",
    price: 1200,
    description:
      "Griha Pravesh Puja is performed before entering a new house for the first time. It purifies the space and invokes blessings of happiness, health, and prosperity for the occupants.",
    details:
      "Best performed on auspicious dates (muhurats), this ritual ensures peace and spiritual safety for new residents. It wards off negative energies and brings positive vibrations."
  },
  {
    id: 3,
    title: "Bhoomi Pooja",
    category: "REGULAR",
    image: "/lovable-uploads/2ee87fe5-d7a5-4aec-8867-4fb74c778dc2.png",
    price: 1100,
    description:
      "Bhoomi Pooja is performed before the construction of a new building to seek blessings from the earth, remove negative energies, and promote successful project completion.",
    details:
      "It is believed to remove obstacles caused by the disturbance of land and pacifies spiritual energies. This puja expresses gratitude and harmony with Mother Earth."
  },
  {
    id: 4,
    title: "Satya Narayan",
    category: "REGULAR",
    image: "/lovable-uploads/c1a5b2a3-ee18-40e5-8581-c3c52d85a9b9.png",
    price: 900,
    description:
      "Satya Narayan Puja is performed to seek the blessings of Lord Vishnu for overall prosperity and happiness. It is observed on auspicious occasions and after achieving significant milestones.",
    details:
      "This puja brings good luck, success, and spiritual advancement. Frequently performed during housewarmings, birthdays, and marriages across India."
  },
  {
    id: 5,
    title: "Durja Pooja",
    category: "REGULAR",
    image: "/lovable-uploads/b9a8b749-7987-4c52-ba97-a3805e555da7.png",
    price: 1000,
    description:
      "Durja Puja is dedicated to invoking the blessings of the Goddess Durga to gain strength, courage, and protection from negative energies.",
    details:
      "Ideal during Navratri and related festivals, the puja helps overcome fears and obstacles, signifying the victory of good over evil."
  },
  {
    id: 6,
    title: "Office Opening Pooja",
    category: "REGULAR",
    image: "/lovable-uploads/65e174e3-c7e8-4606-a7a6-2b458a910f4c.png",
    price: 2000,
    description:
      "Office Opening Pooja ensures the workspace is abundant with positive energy, success, and prosperity for all stakeholders.",
    details:
      "Recommended for new business ventures; removes hurdles, brings growth, and invokes blessings for financial health and teamwork."
  },
  {
    id: 7,
    title: "Mahalakshmi Pooja",
    category: "REGULAR",
    image: "/lovable-uploads/d8c3c874-61f6-4372-b601-3ebe4c4580c0.png",
    price: 1400,
    description:
      "Mahalakshmi Pooja is performed to invite Goddess Lakshmi, the harbinger of wealth and prosperity, into homes and businesses.",
    details:
      "Commonly performed during Diwali, Fridays, and Akshay Tritiya; believed to bestow financial abundance and remove scarcity."
  },
  {
    id: 8,
    title: "Ganpati Pooja",
    category: "REGULAR",
    image: "/lovable-uploads/62f5c343-495a-4a65-bd20-2fc1c99fb626.png",
    price: 1200,
    description:
      "Ganpati Puja is dedicated to Lord Ganesha, the remover of obstacles, and is performed before starting any new venture.",
    details:
      "Ganpati is worshipped at the start of important tasks. Ensures work begins without hindrance and brings intelligence and wisdom."
  },
  {
    id: 9,
    title: "Rudra Abhishek",
    category: "REGULAR",
    image: "/lovable-uploads/695814da-ae02-443d-8ab9-80dfa76c9755.png",
    price: 1800,
    description:
      "Rudra Abhishek is a ritual for Lord Shiva to gain health, wealth, and to dissolve negative karmas, performed especially during the month of Shravan.",
    details:
      "A sacred bath ritual with holy substances, believed to fulfill wishes and cleanse souls. Enhances well-being when performed on Mondays."
  },
  {
    id: 10,
    title: "Mangalagaur Pooja",
    category: "REGULAR",
    image: "/lovable-uploads/5d3e5a15-cb00-4549-9a4d-3efc26b032cd.png",
    price: 1300,
    description:
      "Mangalagaur Puja is a Maharashtrian tradition observed by married women for the wellbeing and prosperity of their families.",
    details:
      "Celebrated during Shravan, it involves games, singing, and devotion, praying for marital bliss and family welfare."
  },
  {
    id: 11,
    title: "Ganpati Visarjan Pooja",
    category: "FESTIVAL",
    image: "/lovable-uploads/8f56705a-3508-48d2-b025-b9746aa30f85.png",
    price: 900,
    description:
      "Ganpati Visarjan Puja is performed at the conclusion of Ganesh Chaturthi, bidding farewell to Lord Ganesha and seeking prosperity till next time.",
    details:
      "This ritual symbolizes letting go of obstacles and starting anew. Families immerse Ganesha idols with songs and processions."
  },
  {
    id: 12,
    title: "Janmashtami Pooja",
    category: "FESTIVAL",
    image: "/lovable-uploads/6953ad6b-9da3-45bc-bc02-63febada4a34.png",
    price: 1100,
    description:
      "Janmashtami Puja celebrates the birth of Lord Krishna and invokes his blessings for happiness and peace in the household.",
    details:
      "Devotees observe a night-long vigil, fasting, and sing devotional songs. Dahi Handi is a special part in Maharashtra."
  },
  {
    id: 13,
    title: "Diwali Lakshmi Pooja",
    category: "FESTIVAL",
    image: "/lovable-uploads/7a18e668-8e8d-4d40-a8a8-a286e4089324.png",
    price: 2100,
    description:
      "Lakshmi Puja during Diwali brings good fortune, prosperity and removes negative energies from home and business.",
    details:
      "The most auspicious Diwali event, this puja welcomes Goddess Lakshmi into homes with lights, rangoli, and sweets."
  },
  {
    id: 14,
    title: "Ganapti Sthapana Pooja",
    category: "FESTIVAL",
    image: "/lovable-uploads/3a7d649e-67b9-4c49-9866-d9cb4f95f0aa.png",
    price: 1000,
    description: "Ganesh Sthapana Puja marks the arrival of Lord Ganesha before Ganeshotsav begins, seeking his blessings for a successful festival.",
    details:
      "Brings positivity to the household. Sthapana is performed on Chaturthi and invokes a festive spirit for 10 days."
  },
  {
    id: 15,
    title: "Udak Shanti",
    category: "SHANTI",
    image: "/lovable-uploads/251e248a-4351-49bd-8651-6aeefdaee648.png",
    price: 950,
    description: "Udak Shanti Puja is performed to purify water and bring harmony and prosperity to the household.",
    details:
      "Ideal for housewarming and before major functions, this ritual promotes purity, health, and blessings from divine forces."
  },
  {
    id: 16,
    title: "Navgraha Shanti",
    category: "SHANTI",
    image: "/lovable-uploads/25013b1e-6e13-409f-803d-fbdd499fd7da.png",
    price: 1700,
    description: "Navgraha Shanti Puja helps neutralize negative influences of all nine planets and brings peace and prosperity.",
    details:
      "Highly recommended for astrological imbalances. Often suggested after tough times or planetary transitions (dasha/antardasha)."
  },
  {
    id: 17,
    title: "Ganapti Havan",
    category: "HAVAN",
    image: "/lovable-uploads/07f5ed97-9548-4467-b6f8-68cf9301ec72.png",
    price: 1500,
    description: "Ganpati Havan purifies the mind and environment while seeking Lord Ganesh’s blessings before major work or events.",
    details:
      "The sacred fire ritual removes hurdles and brings auspicious beginnings. Ghee, sesame, and herbs are key elements."
  },
  {
    id: 18,
    title: "Dhan Laxmi Pooja",
    category: "HAVAN",
    image: "/lovable-uploads/b9ec4e6a-73d1-4536-8eaa-809140586224.png",
    price: 2000,
    description: "Dhan Lakshmi Puja is performed to invoke Goddess Lakshmi for wealth, abundance, and success in business.",
    details:
      "Particularly relevant for business owners and before Diwali. Believed to open new sources of financial income."
  },
  {
    id: 19,
    title: "Ganesh Havan",
    category: "HAVAN",
    image: "/lovable-uploads/9ec09147-1249-4be2-9391-19df10c3d32f.png",
    price: 1600,
    description: "Ganesh Havan is performed for new beginnings, removing obstacles, and ensuring success in all endeavors.",
    details:
      "Recommended before weddings, new businesses, or exams. It is said to bring clarity and a fresh start."
  },
  {
    id: 20,
    title: "Satyanarayan Havan",
    category: "HAVAN",
    image: "/lovable-uploads/1a779d2d-ca9c-4348-a5b7-1745de1e05fa.png",
    price: 1200,
    description: "Satyanarayan Havan is performed to ensure achievements, peace, and prosperity in life. It also helps fulfill your wishes and brings spiritual bliss.",
    details:
      "A great choice for celebrating milestones and family occasions, believed to maintain harmony and protect against misfortune."
  }
];
