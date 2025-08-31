'use client';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          School Management
        </Link>
        <div className="flex gap-4">
          <Link href="/addSchool" className="hover:underline">
            Add School
          </Link>
          <Link href="/showSchools" className="hover:underline">
            View Schools
          </Link>
        </div>
      </div>
    </nav>
  );
}