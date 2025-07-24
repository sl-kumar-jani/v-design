"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/admin/auth-guard";
import { PortfolioManagement } from "@/components/admin/portfolio-management";
import { TestimonialsManagement } from "@/components/admin/testimonials-management";
import { StatisticsManagement } from "@/components/admin/statistics-management";
import { UserManagement } from "@/components/admin/user-management";
import {
  LogOut,
  Upload,
  Save,
  User,
  FileText,
  Image as ImageIcon,
  Trophy,
  Calendar,
  Star,
  Grid,
  MessageSquare,
  UserPlus,
  BarChart3,
} from "lucide-react";
import Image from "next/image";
import { IFounder } from "@/lib/models/founder";

export default function AdminDashboard() {
  const [formData, setFormData] = useState({
    founderName: "",
    founderTitle: "",
    founderDescription: "",
    founderPhotoUrl: "",
    projectsCompleted: 0,
    yearsOfExperience: 0,
    clientSatisfaction: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if current user is super-admin
    const adminUser = localStorage.getItem("adminUser");
    if (adminUser) {
      const { role } = JSON.parse(adminUser);
      setIsSuperAdmin(role === "super-admin");
    }
  }, []);

  // Load existing founder data
  useEffect(() => {
    const loadFounderData = async () => {
      try {
        const response = await fetch("/api/founder");
        if (response.ok) {
          const data = await response.json();
          setFormData(data);
          setPreviewUrl(data.founderPhotoUrl);
        }
      } catch (error) {
        console.error("Error loading founder data:", error);
      }
    };

    loadFounderData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    router.push("/admin/login");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    const token = localStorage.getItem("adminToken");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData((prev) => ({ ...prev, founderPhotoUrl: data.url }));
        setMessage("Image uploaded successfully!");
        setMessageType("success");
      } else {
        setMessage("Failed to upload image");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Error uploading image");
      setMessageType("error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    const token = localStorage.getItem("adminToken");

    try {
      const response = await fetch("/api/founder", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage("Founder information updated successfully!");
        setMessageType("success");
      } else {
        setMessage("Failed to update founder information");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Error updating founder information");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "projectsCompleted" ||
        name === "yearsOfExperience" ||
        name === "clientSatisfaction"
          ? parseInt(value) || 0
          : value,
    }));
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#365545]">
        {/* Header */}
        <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-[#FFD700]/20">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Image
                  src="/images/v-design-logo.png"
                  alt="V Design Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
                <div>
                  <h1 className="font-['Cormorant_Garamond'] text-2xl text-[#365545] font-semibold">
                    Admin Dashboard
                  </h1>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-[#365545] text-[#365545] hover:bg-[#365545] hover:text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Tabs defaultValue="founder" className="w-full">
              <TabsList
                className={`grid w-full ${
                  isSuperAdmin ? "grid-cols-5" : "grid-cols-4"
                } mb-8`}
              >
                <TabsTrigger
                  value="founder"
                  className="font-['Playfair_Display'] text-base"
                >
                  <User className="w-4 h-4 mr-2" />
                  Founder Info
                </TabsTrigger>
                <TabsTrigger
                  value="portfolio"
                  className="font-['Playfair_Display'] text-base"
                >
                  <Grid className="w-4 h-4 mr-2" />
                  Portfolio
                </TabsTrigger>
                <TabsTrigger
                  value="testimonials"
                  className="font-['Playfair_Display'] text-base"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Testimonials
                </TabsTrigger>
                <TabsTrigger
                  value="statistics"
                  className="font-['Playfair_Display'] text-base"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Statistics
                </TabsTrigger>
                {isSuperAdmin && (
                  <TabsTrigger
                    value="users"
                    className="font-['Playfair_Display'] text-base"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Admin
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="founder" className="space-y-6">
                <Card className="bg-white/95 backdrop-blur-md shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="font-['Cormorant_Garamond'] text-3xl text-[#365545] flex items-center">
                      <User className="w-8 h-8 mr-3 text-[#FFD700]" />
                      About the Founder
                    </CardTitle>
                    <CardDescription className="font-['Playfair_Display'] text-gray-600">
                      Update founder information that will be displayed on the
                      website
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-8">
                      {/* Photo Upload Section */}
                      <div className="space-y-4">
                        <Label className="font-['Playfair_Display'] text-[#365545] font-medium flex items-center">
                          <ImageIcon className="w-5 h-5 mr-2 text-[#FFD700]" />
                          Founder Photo
                        </Label>
                        <div className="flex items-center space-x-6">
                          <div className="relative">
                            <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                              {previewUrl ? (
                                <Image
                                  src={previewUrl}
                                  alt="Founder photo preview"
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ImageIcon className="w-8 h-8 text-gray-400" />
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleFileSelect}
                              className="font-['Playfair_Display']"
                            />
                            <Button
                              type="button"
                              onClick={handleImageUpload}
                              disabled={!selectedFile || isUploading}
                              className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#365545] font-['Playfair_Display'] font-medium"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              {isUploading ? "Uploading..." : "Upload Photo"}
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Form Fields */}
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="founderName"
                            className="font-['Playfair_Display'] text-[#365545] font-medium"
                          >
                            Founder Name
                          </Label>
                          <Input
                            id="founderName"
                            name="founderName"
                            value={formData.founderName}
                            onChange={handleInputChange}
                            placeholder="Enter founder name"
                            className="font-['Playfair_Display']"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="founderTitle"
                            className="font-['Playfair_Display'] text-[#365545] font-medium flex items-center"
                          >
                            <User className="w-4 h-4 mr-2 text-[#FFD700]" />
                            Founder Title
                          </Label>
                          <Input
                            id="founderTitle"
                            name="founderTitle"
                            type="text"
                            value={formData.founderTitle}
                            onChange={handleInputChange}
                            placeholder="Enter founder title"
                            className="font-['Playfair_Display']"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="yearsOfExperience"
                            className="font-['Playfair_Display'] text-[#365545] font-medium flex items-center"
                          >
                            <Calendar className="w-4 h-4 mr-2 text-[#FFD700]" />
                            Years of Experience
                          </Label>
                          <Input
                            id="yearsOfExperience"
                            name="yearsOfExperience"
                            type="number"
                            value={formData.yearsOfExperience}
                            onChange={handleInputChange}
                            placeholder="0"
                            className="font-['Playfair_Display']"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="founderDescription"
                          className="font-['Playfair_Display'] text-[#365545] font-medium flex items-center"
                        >
                          <FileText className="w-4 h-4 mr-2 text-[#FFD700]" />
                          Description
                        </Label>
                        <Textarea
                          id="founderDescription"
                          name="founderDescription"
                          value={formData.founderDescription}
                          onChange={handleInputChange}
                          placeholder="Enter founder description"
                          className="font-['Playfair_Display'] min-h-[120px]"
                          required
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label
                            htmlFor="projectsCompleted"
                            className="font-['Playfair_Display'] text-[#365545] font-medium flex items-center"
                          >
                            <Trophy className="w-4 h-4 mr-2 text-[#FFD700]" />
                            Projects Completed
                          </Label>
                          <Input
                            id="projectsCompleted"
                            name="projectsCompleted"
                            type="number"
                            value={formData.projectsCompleted}
                            onChange={handleInputChange}
                            placeholder="0"
                            className="font-['Playfair_Display']"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="clientSatisfaction"
                            className="font-['Playfair_Display'] text-[#365545] font-medium flex items-center"
                          >
                            <Star className="w-4 h-4 mr-2 text-[#FFD700]" />
                            Client Satisfaction (%)
                          </Label>
                          <Input
                            id="clientSatisfaction"
                            name="clientSatisfaction"
                            type="number"
                            min="0"
                            max="100"
                            value={formData.clientSatisfaction}
                            onChange={handleInputChange}
                            placeholder="0"
                            className="font-['Playfair_Display']"
                            required
                          />
                        </div>
                      </div>

                      {/* Message Display */}
                      {message && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-4 rounded-lg ${
                            messageType === "success"
                              ? "bg-green-50 text-green-800 border border-green-200"
                              : "bg-red-50 text-red-800 border border-red-200"
                          }`}
                        >
                          <p className="font-['Playfair_Display'] font-medium">
                            {message}
                          </p>
                        </motion.div>
                      )}

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 bg-[#365545] hover:bg-[#2a4136] text-white font-['Playfair_Display'] font-medium text-lg"
                      >
                        <Save className="w-5 h-5 mr-2" />
                        {isLoading ? "Saving..." : "Save Changes"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="portfolio" className="space-y-6">
                <PortfolioManagement />
              </TabsContent>

              <TabsContent value="testimonials" className="space-y-6">
                <TestimonialsManagement />
              </TabsContent>

              <TabsContent value="statistics" className="space-y-6">
                <StatisticsManagement />
              </TabsContent>

              {isSuperAdmin && (
                <TabsContent value="users" className="space-y-6">
                  <UserManagement />
                </TabsContent>
              )}
            </Tabs>
          </motion.div>
        </main>
      </div>
    </AuthGuard>
  );
}
