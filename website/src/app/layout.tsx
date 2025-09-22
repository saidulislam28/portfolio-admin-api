import "@fortawesome/fontawesome-free/css/all.css";
import { Inter } from "next/font/google";
import Providers from "./Providers";
import "./globals.css";
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: {
    template: "%s",
  },
  description: "",
  icons: {
    icon: "/img/sp-logo-new.jpg",
    shortcut: "/img/sp-logo-new.jpg",
    apple: "/img/sp-logo-new.jpg",
  },
  logo: "/img/sp-logo-new.jpg",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/home`, {
  //   next: { tags: ["homePageLayoutData"], revalidate: 30 },
  // }).catch((err) => console.log(err));
  // const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/home`, {
  //   next: { tags: ["homePageLayoutData"], revalidate: 30 },
  // }).catch((err) => console.log(err));

  // const settingData = await getHomePageLayout();

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {/* <Header></Header> */}
          <main>{children}</main>
          {/* <Footer></Footer> */}
        </Providers>
      </body>
    </html>
  );
}
