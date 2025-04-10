import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="h-screen flex items-center justify-center flex-col gap-4">
      <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
      <p className="text-gray-600">
        You are not authorized to access this page.
      </p>
      <Link href="/" className="text-blue-600 hover:underline">
        Return to Home
      </Link>
    </div>
  );
}
