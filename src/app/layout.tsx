import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import ServerSelector from "@/components/ServerSelector";
import TopNav from "@/components/TopNav";
import { Providers } from "@/components/Providers";

const cairo = Cairo({ subsets: ["arabic"], variable: '--font-cairo' });

export const metadata: Metadata = {
  title: "i5alo Dashboard",
  description: "Advanced Discord Bot Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body className={`${cairo.variable} font-cairo bg-[#1e1f22] text-white flex h-screen overflow-hidden antialiased`}>
        <Providers>
          <ServerSelector />
          <Sidebar />
          <main className="flex-1 h-full overflow-y-auto bg-[#313338] relative rounded-tr-xl mt-2 mr-0 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
              {/* Top Navbar / Header */}
              <TopNav />
              
              <div className="p-8 max-w-5xl mx-auto">
                  {children}
              </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
