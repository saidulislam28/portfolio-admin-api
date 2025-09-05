import { Inter } from "next/font/google";

import dynamic from "next/dynamic";

const NextBreadcrumb = dynamic(
  () => import("@/src/components/breadCrumb/NextBredCrumb"),
  {
    ssr: false,
  }
);

export const metadata = {
  metadataBase: new URL("https://acme.com"),
  title: {
    template: "EK FASHION | %s",
  },
  description: "Online Shopping Center",
  icons: {
    icon: "/img/Vector.png",
    shortcut: "/img/Vector.png",
    apple: "/img/Vector.png",
  },
  logo: "/img/Vector.png",
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
        {children}
      </main>
    </div>
  );
};

export default PageLayout;
