/* eslint-disable react/jsx-no-undef */
import { CircleUser } from "lucide-react";
import { signOut } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({});
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <>
      <Head>
        <title>Management System</title>
      </Head>

      <header className="bg-background sticky top-0 flex h-16 items-center gap-4 border-b px-4 shadow-md md:px-6">
        {/* Menu items with stronger shadow */}
        <nav className="flex flex-grow justify-center space-x-8 text-lg font-medium">
          <Button
            onClick={() => handleNavigation("/phone-numbers")}
            variant="ghost"
            className="shadow-lg transition-shadow hover:shadow-xl"
          >
            Phone Number
          </Button>
          <Button
            onClick={() => handleNavigation("/social-media")}
            variant="ghost"
            className="shadow-lg transition-shadow hover:shadow-xl"
          >
            Social Media Platform
          </Button>
          <Button
            onClick={() => handleNavigation("/products")}
            variant="ghost"
            className="shadow-lg transition-shadow hover:shadow-xl"
          >
            Product
          </Button>
          <Button
            onClick={() => handleNavigation("/content")}
            variant="ghost"
            className="shadow-lg transition-shadow hover:shadow-xl"
          >
            Content
          </Button>
          <Button
            onClick={() => handleNavigation("/posts")}
            variant="ghost"
            className="shadow-lg transition-shadow hover:shadow-xl"
          >
            Post
          </Button>
        </nav>

        {/* User account dropdown */}
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full shadow-lg transition-shadow hover:shadow-xl"
              >
                <CircleUser className="h-6 w-6" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  );
}

export default Header;
