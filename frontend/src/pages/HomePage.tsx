import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/40 to-white flex items-center justify-center p-6">
      <div className="max-w-md text-center space-y-6">
        <div className="flex justify-center">
          {/* Placeholder for earth icon / logo */}
          <div className="h-16 w-16 rounded-full bg-green-200/70" />
        </div>

        <h1 className="text-3xl font-semibold text-gray-900">
          Campus Carbon
        </h1>

        <p className="text-sm text-gray-600">
          A gamified carbon footprint tracker helping Exeter students
          take real-world climate action together.
        </p>

        <Link
          to="/login"
          className="inline-block rounded-xl bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800"
        >
          Log in
        </Link>

        <p className="text-xs text-gray-500">
          Prototype demo.
        </p>
      </div>
    </div>
  );
}
