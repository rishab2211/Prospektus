import LandingPageNavbar from "@/components/LandingPage/navbar.";
import { ReactNode } from "react";

type Props = { children: ReactNode };

const Layout = ({ children }: Props) => {
  return (
    <div className="bg-[#0a0a0f] min-h-screen">
      <LandingPageNavbar />
      {children}
    </div>
  );
};

export default Layout;