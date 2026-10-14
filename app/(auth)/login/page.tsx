"use client"
import { signIn } from "next-auth/react"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="text-center p-8 border border-zinc-800 rounded-xl">
        <h1 className="text-2xl font-bold mb-2">NexusFlow AI</h1>
        <p className="text-zinc-400 mb-6">Login to access your dashboard</p>
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-zinc-200"
        >
          Continue with Google
        </button>
      </div>
    </div>
  )
}