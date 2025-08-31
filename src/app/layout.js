import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'School Management App',
  description: 'Manage schools with Next.js and MySQL',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}