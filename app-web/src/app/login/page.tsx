import { signIn, auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();
  
  // If already authenticated, redirect to dashboard
  if (session?.user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="max-w-md w-full mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-6xl">🌸</span>
          <h1 className="text-4xl font-bold mt-4 bg-clip-text text-transparent bg-linear-to-r from-blue-400 via-purple-500 to-pink-500">
            BOOMFLOW
          </h1>
          <p className="text-zinc-500 mt-2">Professional Recognition System</p>
          <p className="text-zinc-600 text-sm">Sistemas Ursol</p>
        </div>

        {/* Login Card */}
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-center mb-6">Sign In</h2>
          
          <form
            action={async () => {
              "use server";
              await signIn("github", { redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-white/10 transition-all duration-200 group"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className="font-medium">Continue with GitHub</span>
              <span className="text-zinc-500 group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-zinc-500">
              Only for collaborators of{" "}
              <a href="https://www.ursol.com" className="text-purple-400 hover:text-purple-300">
                Sistemas Ursol
              </a>
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 text-center text-sm text-zinc-600">
          <p>By signing in, you accept the BOOMFLOW terms of use</p>
          <p className="mt-2">
            Don't have access?{" "}
            <a href="mailto:admin@ursol.com" className="text-blue-400 hover:underline">
              Contact your team lead
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
