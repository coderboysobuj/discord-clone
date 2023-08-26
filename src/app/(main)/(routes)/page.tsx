import ApplicationLogo from "@/components/Logo";
import { ModeToggle } from '@/components/mode-toggle'
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex items-center justify-between px-40 py-4">
      <ApplicationLogo />
      <div className="flex items-center gap-4">
        <ModeToggle />
        <UserButton />
      </div>
    </div>
  );
}
