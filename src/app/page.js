import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center justify-center py-10 px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
          Welcome to School Management
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          Manage school information easily. Add new schools or browse the list of registered schools.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/addSchool">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition transform hover:scale-105">
              Add a School
            </button>
          </Link>
          <Link href="/showSchools">
            <button className="bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition transform hover:scale-105">
              View Schools
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}