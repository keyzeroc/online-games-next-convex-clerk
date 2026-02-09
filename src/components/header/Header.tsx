import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { HeaderModeToggle } from "./HeaderModeToggle";
import Link from "next/link";

export default function Header() {
  return (
    <header className="p-4 md:p-6 lg:p-8">
      <nav>
        <ul className="flex items-center justify-between gap-2">
          <li className="text-xl sm:text-2xl font-bold">
            <Link href="/"> Online Games</Link>
          </li>
          <li className="flex gap-2 items-center">
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <HeaderModeToggle />
          </li>
        </ul>
      </nav>
    </header>
  );
}
