import { LogOut, User as UserIcon, GraduationCap } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/Button";
export function Navbar() {
  const { user, logout } = useAuth();
  if (!user) return null;
  return (
    <header className="bg-sage text-white shadow-lg sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-1.5 bg-white/20 rounded-lg">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight leading-none">
              Class
            </h1>
            <p className="text-xs text-sage-100 opacity-90 capitalize">
              {user.role} Portal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className="flex items-center gap-1 sm:gap-2
          px-2 sm:px-3 
          py-1 sm:py-1.5 
          bg-white/10 rounded-full 
          max-w-[140px] sm:max-w-none"
          >
            <UserIcon className="h-3 w-3 sm:h-4 sm:w-4 text-sage-100 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium truncate">
              {user.name}
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-white hover:bg-white/20 hover:text-white border-transparent"
            aria-label="Log out"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
