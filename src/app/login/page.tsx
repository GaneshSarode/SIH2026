import LoginForm from "@/components/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <LoginForm />
      <div className="mt-6 text-sm text-gray-500">
        <Link href="/" className="hover:text-white transition-colors">
          &larr; Back to public dashboard
        </Link>
      </div>
    </div>
  );
}
