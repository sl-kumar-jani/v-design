"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, Shield } from "lucide-react";
import Image from "next/image";

export default function SuperAdminRegistration() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [canRegister, setCanRegister] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAdminExists = async () => {
      try {
        const response = await fetch("/api/auth/register");
        const data = await response.json();

        if (response.ok) {
          setCanRegister(!data.adminExists);
        } else {
          setError("Failed to check admin status");
        }
      } catch (error) {
        setError("An error occurred while checking admin status");
      } finally {
        setIsCheckingAdmin(false);
      }
    };

    checkAdminExists();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminEmail: email,
          adminPassword: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and admin data
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem(
          "adminUser",
          JSON.stringify({
            id: data._id,
            email: data.adminEmail,
            role: data.role,
          })
        );
        router.push("/admin");
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAdmin) {
    return (
      <div className="min-h-screen bg-[#365545] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-['Playfair_Display'] text-lg">
            Checking admin status...
          </p>
        </div>
      </div>
    );
  }

  if (!canRegister) {
    return (
      <div className="min-h-screen bg-[#365545] flex items-center justify-center p-6">
        <Card className="bg-white/95 backdrop-blur-md shadow-2xl border-0 max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="font-['Cormorant_Garamond'] text-2xl text-[#365545]">
              Registration Not Available
            </CardTitle>
            <CardDescription className="font-['Playfair_Display'] text-gray-600">
              An admin user already exists. Please contact your administrator
              for access.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => router.push("/admin/login")}
              className="w-full bg-[#365545] hover:bg-[#2a4136] text-white"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#365545] flex items-center justify-center p-6">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFD700]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="bg-white/95 backdrop-blur-md shadow-2xl border-0">
          <CardHeader className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center"
            >
              <Image
                src="/images/v-design-logo.png"
                alt="V Design Logo"
                width={80}
                height={80}
                className="object-contain"
              />
            </motion.div>

            <div>
              <CardTitle className="font-['Cormorant_Garamond'] text-3xl text-[#365545] mb-2 flex items-center justify-center">
                <Shield className="w-8 h-8 mr-3 text-[#FFD700]" />
                Super Admin Setup
              </CardTitle>
              <CardDescription className="font-['Playfair_Display'] text-gray-600">
                Create your super admin account to manage the website
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="space-y-2"
              >
                <Label
                  htmlFor="email"
                  className="font-['Playfair_Display'] text-[#365545] font-medium"
                >
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10 h-12 border-gray-300 focus:border-[#365545] focus:ring-[#365545] font-['Playfair_Display']"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="space-y-2"
              >
                <Label
                  htmlFor="password"
                  className="font-['Playfair_Display'] text-[#365545] font-medium"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 h-12 border-gray-300 focus:border-[#365545] focus:ring-[#365545] font-['Playfair_Display']"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </motion.div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm text-center font-['Playfair_Display']"
                >
                  {error}
                </motion.div>
              )}

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-[#365545] hover:bg-[#2a4136] text-white font-['Playfair_Display'] font-medium text-lg transition-all duration-300 transform hover:scale-105"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    "Create Super Admin Account"
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-6"
        >
          <div className="flex items-center justify-center space-x-2">
            <div className="w-8 h-0.5 bg-[#FFD700]"></div>
            <span className="font-['Cinzel'] text-[#FFD700] text-sm tracking-widest uppercase">
              V Design Admin
            </span>
            <div className="w-8 h-0.5 bg-[#FFD700]"></div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
