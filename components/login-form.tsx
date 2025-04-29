"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      setError("Username atau password salah.");
      return;
    }

    const { role } = await res.json();
    if (role === "admin" || role === "finance") {
      router.push("/dashboard");
    } 
  };

  const canSubmit = username.trim() !== "" && password.trim() !== "";

  return (
    <Card className="w-[360px] bg-white shadow-md rounded-[24px] border-none">
      <CardContent className="px-6 py-8">
        {/* Header */}
        <h2 className="text-xl font-bold text-center">Login</h2>
        <p className="text-gray-500 text-center mt-1 mb-8 text-sm">
          Please login to admin dashboard
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <Label
              htmlFor="username"
              className="block text-xs font-medium text-black mb-1"
            >
              Username
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full py-2 px-3 border border-gray-300 rounded-full placeholder-gray-300 text-sm"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Label
              htmlFor="password"
              className="block text-xs font-medium text-black mb-1"
            >
              Password
            </Label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full py-2 px-3 border border-gray-300 rounded-full placeholder-gray-300 text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-8 flex items-center"
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-xs">{error}</p>}

          {/* Submit */}
          <Button
            type="submit"
            disabled={!canSubmit}
            className={`
              w-full py-2 rounded-full text-sm font-medium
              ${canSubmit
                ? "bg-[#377dec] text-white hover:bg-blue-700"
                : "bg-gray-500 text-white cursor-not-allowed"}
            `}
          >
            Login
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
