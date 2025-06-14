
import { Link, useLocation } from "react-router-dom";
import { useSession } from "@/hooks/useSession";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogIn, User } from "lucide-react";

const Navbar = () => {
  const { user } = useSession();
  const location = useLocation();

  return (
    <nav className="w-full bg-white shadow px-4 py-2 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-orange-600 font-playfair tracking-wide">
          Eguruji1803
        </span>
        <Link to="/" className="ml-2 text-gray-600 hover:text-orange-600 text-sm">Home</Link>
        <Link to="/services" className="ml-2 text-gray-600 hover:text-orange-600 text-sm">Services</Link>
      </div>
      <div className="flex items-center gap-3">
        {!user && (
          <>
            <Link to="/auth?role=customer" className="flex gap-1 items-center text-sm hover:text-orange-700 bg-orange-50 px-2 py-1 rounded">
              <User size={16} />
              Customer Login
            </Link>
            <Link to="/auth?role=pandit" className="flex gap-1 items-center text-sm hover:text-orange-700 bg-orange-50 px-2 py-1 rounded">
              <LogIn size={16} />
              Pandit Login
            </Link>
          </>
        )}
        {user && (
          <Link to={location.pathname.includes("pandit") ? "/dashboard-pandit" : "/dashboard-customer"}>
            <Avatar>
              <AvatarImage src={user.user_metadata?.profile_image_url} alt={user.user_metadata?.name || "avatar"} />
              <AvatarFallback>{user.user_metadata?.name?.charAt(0)?.toUpperCase() || "A"}</AvatarFallback>
            </Avatar>
          </Link>
        )}
      </div>
    </nav>
  );
};
export default Navbar;
