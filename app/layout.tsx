import { DialogProvider } from "@/components/dialog-provider";
import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import ClientSessionProvider from "./client-session-provider";
import "./globals.css";
// import ReactQueryProvider from "@/lib/react-query-provider";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Class Master | Vođenje Škole Stranih Jezika",
  description:
    "Efikasno upravljajte svojom školom stranih jezika uz našu intuitivnu aplikaciju. Organizacija kurseva, evidencija studenata i više.",
  // icons: {
  //   icon: "/logo-base-32x32.png", // Favicon link
  // },
  keywords:
    "upravljanje školom stranih jezika, softver za školu, aplikacija za školu, sistem za vođenje škole jezika, administracija škole jezika, platforma za učenje jezika",
  robots: "index, follow",
  openGraph: {
    title: "Najbolja aplikacija za škole stranih jezika | Class Master",
    description:
      "Efikasno upravljajte svojom školom stranih jezika uz našu intuitivnu aplikaciju. Organizacija kurseva, evidencija studenata i više.",
    images: [{ url: "" }],
    url: "https://www.class-master.com/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Najbolja aplikacija za škole stranih jezika | Class Master",
    description:
      "Efikasno upravljajte svojom školom stranih jezika uz našu intuitivnu aplikaciju. Organizacija kurseva, evidencija studenata i više.",
    images: "https://www.class-master.com/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "font-sans antialiased grainy"
          // inter.className
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {/* <ReactQueryProvider> */}
          <ClientSessionProvider>
            <Toaster
              position="top-center"
              richColors
              theme="light"
              duration={3500}
            />
            <Navbar />
            {children}
            <DialogProvider />
          </ClientSessionProvider>
          {/* </ReactQueryProvider> */}
        </ThemeProvider>
      </body>
    </html>
  );
}
