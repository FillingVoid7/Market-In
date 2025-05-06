import './globals.css';
import { Providers } from "./providers";
import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}



// import Header from '@/components/Header';
// import Footer from '@/components/Footer';
// import { usePathname } from 'next/navigation';
// import { ReactNode } from 'react';

// export default function RootLayout({ children }: { children: ReactNode }) {
//   const pathname = usePathname();
//   const hideHeaderFooter = [
//     '/login', '/register', '/verify-email', '/product-design',
//     '/forgot-password', '/reset-password', '/free-template',
//     '/basic-template', '/pro-template', '/free-template-preview',
//     '/basic-template-preview', '/pro-template-preview'
//   ];

//   return (
//     <html lang="en">
//       <body className="flex flex-col bg-white max-w-full">
//         {!hideHeaderFooter.includes(pathname) && <Header />}
//         <div className="flex-1">{children}</div>
//         {!hideHeaderFooter.includes(pathname) && <Footer />}
//       </body>
//     </html>
//   );
// }
