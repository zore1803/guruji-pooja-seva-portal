
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubscribing(true);

    if (!email || !/^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/.test(email)) {
      setError("Please enter a valid email.");
      setSubscribing(false);
      return;
    }

    const { error } = await supabase.from("subscribers").insert([{ email }]);
    setSubscribing(false);

    if (error) {
      setError("You have already subscribed or something went wrong.");
      return;
    }

    setSubscribed(true);
  };

  return (
    <footer className="bg-orange-50 border-t mt-6 py-10">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 px-4">
        {/* CUSTOMER SUPPORT */}
        <div className="flex-1">
          <h3 className="text-md font-bold text-orange-600 mb-2">CUSTOMER SUPPORT</h3>
          <p>
            <a href="mailto:customer@eguruji.com" className="text-orange-700 hover:underline">customer@eguruji.com</a><br />
            <a href="tel:+9191XXXXXX69" className="text-orange-700 hover:underline">+91 91XXXXXX69</a>
          </p>
        </div>
        {/* INFO */}
        <div className="flex-1">
          <h3 className="text-md font-bold text-orange-600 mb-2">INFO</h3>
          <ul className="space-y-1">
            <li><a href="/cancelpolicy" className="hover:underline text-gray-700">Cancellation Policy</a></li>
            <li><a href="/terms" className="hover:underline text-gray-700">Terms & Conditions</a></li>
            <li><a href="/policy" className="hover:underline text-gray-700">Privacy Policy</a></li>
            <li><a href="/erase" className="hover:underline text-gray-700">Erase my data</a></li>
          </ul>
        </div>
        {/* Newsletter */}
        <div className="flex-1">
          <h3 className="text-md font-bold text-orange-600 mb-2">KEEP UP TO DATE</h3>
          <form
            className="flex flex-col gap-2 max-w-xs"
            onSubmit={handleSubscribe}
            autoComplete="off"
          >
            <label htmlFor="footer-field" className="text-sm">Your Email Here</label>
            <input
              type="email"
              id="footer-field"
              name="footer-field"
              className="border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-orange-200"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={subscribing || subscribed}
            />
            {error && <span className="text-red-500 text-xs">{error}</span>}
            <button
              type="submit"
              className={`px-3 py-1 rounded font-bold transition ${
                subscribed
                  ? "bg-green-600 text-white cursor-default"
                  : "bg-orange-600 text-white hover:bg-orange-700"
              }`}
              disabled={subscribing || subscribed}
            >
              {subscribed ? "SUBSCRIBED" : subscribing ? "SUBSCRIBING..." : "SUBSCRIBE"}
            </button>
          </form>
        </div>
      </div>
      <div className="max-w-5xl mx-auto mt-8 text-center text-xs text-gray-600">
        <span>© 2024 E-GURUJI.</span>
      </div>
    </footer>
  );
};

export default Footer;
