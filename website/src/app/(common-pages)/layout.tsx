import { Inter } from "next/font/google";

import dynamic from "next/dynamic";
import Navbar from "@/src/components/sp-home/Navbar";
import Footer from "@/src/components/sp-home/Footer";

const NextBreadcrumb = dynamic(
  () => import("@/src/components/breadCrumb/NextBredCrumb"),
  {
    ssr: false,
  }
);

export const metadata = {
  metadataBase: new URL("https://acme.com"),
  title: {
    template: "SpeakingMate | %s",
  },
  description: "",
  icons: {
    icon: "/img/sp-logo-new.jpg",
    shortcut: "/img/sp-logo-new.jpg",
    apple: "/img/sp-logo-new.jpg",
  },
  logo: "/img/sp-logo-new.jpg",
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800"],
});

// const interFont = inter.variable;

const PageLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div className="hidden"> {/* Use "hidden" to hide with Tailwind */}
        <NextBreadcrumb
          homeElement={"Home"}
          separator={<span> / </span>}
          containerClasses="flex py-5 main-container "
          listClasses={`hover:underline mx-2 font-bold ${inter.className}`}
          capitalizeLinks
        />
      </div>
      <main className={`${inter.className} container-min-height`}>
        <Navbar />
        {children}
        <Footer />
      </main>
    </div>
  );
};

export default PageLayout;
