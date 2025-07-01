
import { Link, useLocation } from "react-router-dom";
import { useSession } from "@/hooks/useSession";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogIn, User, Menu, LogOut } from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { user } = useSession();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const getDashboardUrl = () => {
    if (location.pathname.includes("admin")) return "/dashboard-admin";
    if (location.pathname.includes("pandit")) return "/dashboard-pandit";
    return "/dashboard-customer";
  };

  const MobileNav = () => (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="md:hidden p-2">
          <Menu size={24} className="text-orange-600" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle className="text-orange-600 font-playfair text-xl">E-GURUJI</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 mt-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setIsOpen(false)}
              className={`text-lg py-3 px-4 rounded-lg transition-colors ${
                location.pathname === item.href
                  ? "bg-orange-100 text-orange-700 font-semibold"
                  : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
              }`}
            >
              {item.name}
            </Link>
          ))}
          <div className="border-t pt-4 mt-4">
            {!user ? (
              <div className="flex flex-col gap-3">
                <Link
                  to="/auth?role=customer"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 text-sm bg-orange-50 px-4 py-3 rounded-lg hover:bg-orange-100"
                >
                  <User size={16} />
                  Customer Login
                </Link>
                <Link
                  to="/auth?role=pandit"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 text-sm bg-orange-50 px-4 py-3 rounded-lg hover:bg-orange-100"
                >
                  <LogIn size={16} />
                  Pandit Login
                </Link>
                <Link
                  to="/auth?role=admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 text-sm bg-red-50 px-4 py-3 rounded-lg hover:bg-red-100 text-red-700"
                >
                  <LogIn size={16} />
                  Admin Login
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  to={getDashboardUrl()}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-orange-50"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.user_metadata?.profile_image_url} alt={user.user_metadata?.name || "avatar"} />
                    <AvatarFallback>{user.user_metadata?.name?.charAt(0)?.toUpperCase() || "A"}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-2 text-sm bg-red-50 px-4 py-3 rounded-lg hover:bg-red-100 text-red-700"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );

  const DesktopNav = () => (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList className="gap-1">
        {navItems.map((item) => (
          <NavigationMenuItem key={item.name}>
            <NavigationMenuLink asChild>
              <Link
                to={item.href}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  location.pathname === item.href
                    ? "bg-orange-100 text-orange-700"
                    : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                }`}
              >
                {item.name}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );

  return (
    <nav className="w-full bg-white shadow px-4 py-3 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-orange-600 font-playfair tracking-wide">
            E-GURUJI
          </span>
        </Link>
        <DesktopNav />
      </div>

      <div className="flex items-center gap-3">
        {!user && !isMobile ? (
          <>
            <Link to="/auth?role=customer" className="flex gap-1 items-center text-sm hover:text-orange-700 bg-orange-50 px-3 py-2 rounded-md">
              <User size={16} />
              Customer Login
            </Link>
            <Link to="/auth?role=pandit" className="flex gap-1 items-center text-sm hover:text-orange-700 bg-orange-50 px-3 py-2 rounded-md">
              <LogIn size={16} />
              Pandit Login
            </Link>
            <Link to="/auth?role=admin" className="flex gap-1 items-center text-sm hover:text-red-700 bg-red-50 px-3 py-2 rounded-md text-red-600">
              <LogIn size={16} />
              Admin
            </Link>
          </>
        ) : (
          user && !isMobile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none">
                  <Avatar className="hover:ring-2 hover:ring-orange-200 transition-all">
                    <AvatarImage src={user.user_metadata?.profile_image_url} alt={user.user_metadata?.name || "avatar"} />
                    <AvatarFallback>{user.user_metadata?.name?.charAt(0)?.toUpperCase() || "A"}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to={getDashboardUrl()} className="flex items-center gap-2">
                    <User size={16} />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-red-600">
                  <LogOut size={16} />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        )}
        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
