"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Upload,
  Image as ImageIcon,
  MessageSquare,
  Eye,
  EyeOff,
  Star,
  MapPin,
  User,
} from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

interface ITestimonial {
  _id?: string;
  name: string;
  location: string;
  project: string;
  rating: number;
  review: string;
  image: string;
  isActive: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export function TestimonialsManagement() {
  const [testimonials, setTestimonials] = useState<ITestimonial[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ITestimonial | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<ITestimonial>({
    name: "",
    location: "",
    project: "",
    rating: 5,
    review: "",
    image: "",
    isActive: true,
    order: 0,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/testimonials");
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data);
      } else {
        throw new Error("Failed to fetch testimonials");
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      toast({
        title: "Error",
        description: "Failed to fetch testimonials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
    if (!selectedFile) return "";

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data.url;
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = formData.image;
      if (selectedFile) {
        imageUrl = await handleImageUpload();
      }

      const token = localStorage.getItem("adminToken");
      const url = editingItem
        ? `/api/testimonials/${editingItem._id}`
        : "/api/testimonials";
      const method = editingItem ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          image: imageUrl,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: editingItem
            ? "Testimonial updated successfully!"
            : "Testimonial created successfully!",
        });
        fetchTestimonials();
        resetForm();
      } else {
        throw new Error("Failed to save testimonial");
      }
    } catch (error) {
      console.error("Error saving testimonial:", error);
      toast({
        title: "Error",
        description: "Failed to save testimonial",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item: ITestimonial) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      location: item.location,
      project: item.project,
      rating: item.rating,
      review: item.review,
      image: item.image,
      isActive: item.isActive,
      order: item.order,
    });
    setPreviewUrl(item.image);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/testimonials/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Testimonial deleted successfully!",
        });
        fetchTestimonials();
      } else {
        throw new Error("Failed to delete testimonial");
      }
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      toast({
        title: "Error",
        description: "Failed to delete testimonial",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      project: "",
      rating: 5,
      review: "",
      image: "",
      isActive: true,
      order: 0,
    });
    setEditingItem(null);
    setSelectedFile(null);
    setPreviewUrl("");
    setShowForm(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "order" || name === "rating" ? parseInt(value) || 0 : value,
    }));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "text-[#FFD700] fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-['Cormorant_Garamond'] text-3xl text-white font-semibold flex items-center">
            <MessageSquare className="w-8 h-8 mr-3 text-[#FFD700]" />
            Testimonials Management
          </h2>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-[#365545] hover:bg-[#2a4136] text-white font-['Playfair_Display'] font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Testimonial
        </Button>
      </div>

      {/* Testimonials Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <Card
            key={testimonial._id}
            className="bg-white/95 backdrop-blur-md shadow-lg"
          >
            <div className="relative h-32">
              <Image
                src={testimonial.image}
                alt={testimonial.name}
                fill
                className="object-cover rounded-t-lg"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <Badge variant={testimonial.isActive ? "default" : "secondary"}>
                  {testimonial.isActive ? (
                    <>
                      <Eye className="w-3 h-3 mr-1" /> Active
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3 h-3 mr-1" /> Inactive
                    </>
                  )}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-['Playfair_Display'] font-semibold text-[#365545] text-lg flex items-center">
                    <User className="w-4 h-4 mr-2 text-[#FFD700]" />
                    {testimonial.name}
                  </h3>
                  <p className="font-['Playfair_Display'] text-gray-600 text-sm flex items-center mt-1">
                    <MapPin className="w-3 h-3 mr-1 text-gray-500" />
                    {testimonial.location}
                  </p>
                </div>
                <div className="flex gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(testimonial)}
                    className="text-blue-600 hover:bg-blue-50"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(testimonial._id!)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center mb-2">
                {renderStars(testimonial.rating)}
                <span className="ml-2 text-sm text-gray-600">
                  ({testimonial.rating}/5)
                </span>
              </div>

              <Badge variant="outline" className="mb-2">
                {testimonial.project}
              </Badge>

              <p className="font-['Playfair_Display'] text-gray-600 text-sm line-clamp-3">
                {testimonial.review}
              </p>

              <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                <span>Order: {testimonial.order}</span>
                <span>
                  {new Date(testimonial.createdAt!).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-['Cormorant_Garamond'] text-2xl text-[#365545] font-semibold">
                  {editingItem ? "Edit Testimonial" : "Add New Testimonial"}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="name"
                      className="text-[#365545] font-['Playfair_Display'] font-medium"
                    >
                      Client Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                      placeholder="Enter client name"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="location"
                      className="text-[#365545] font-['Playfair_Display'] font-medium"
                    >
                      Location *
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                      placeholder="e.g., Mumbai, Maharashtra"
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="project"
                    className="text-[#365545] font-['Playfair_Display'] font-medium"
                  >
                    Project Type *
                  </Label>
                  <Input
                    id="project"
                    name="project"
                    value={formData.project}
                    onChange={handleInputChange}
                    required
                    className="mt-1"
                    placeholder="e.g., 3BHK Apartment Interior"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="rating"
                    className="text-[#365545] font-['Playfair_Display'] font-medium"
                  >
                    Rating *
                  </Label>
                  <Select
                    value={formData.rating.toString()}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        rating: parseInt(value),
                      }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 Stars</SelectItem>
                      <SelectItem value="4">4 Stars</SelectItem>
                      <SelectItem value="3">3 Stars</SelectItem>
                      <SelectItem value="2">2 Stars</SelectItem>
                      <SelectItem value="1">1 Star</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label
                    htmlFor="review"
                    className="text-[#365545] font-['Playfair_Display'] font-medium"
                  >
                    Review *
                  </Label>
                  <Textarea
                    id="review"
                    name="review"
                    value={formData.review}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="mt-1"
                    placeholder="Enter client review..."
                  />
                </div>

                <div>
                  <Label className="text-[#365545] font-['Playfair_Display'] font-medium">
                    Client Image *
                  </Label>
                  <div className="mt-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#365545] transition-colors"
                    >
                      {previewUrl ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={previewUrl}
                            alt="Preview"
                            fill
                            className="object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <Upload className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <ImageIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">
                            Click to upload image
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="order"
                      className="text-[#365545] font-['Playfair_Display'] font-medium"
                    >
                      Display Order
                    </Label>
                    <Input
                      id="order"
                      name="order"
                      type="number"
                      value={formData.order}
                      onChange={handleInputChange}
                      className="mt-1"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex items-center space-x-2 mt-6">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, isActive: checked }))
                      }
                    />
                    <Label
                      htmlFor="isActive"
                      className="text-[#365545] font-['Playfair_Display'] font-medium"
                    >
                      Active
                    </Label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading || isUploading}
                    className="bg-[#365545] hover:bg-[#2a4136] text-white font-['Playfair_Display'] font-medium"
                  >
                    {isLoading || isUploading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {isLoading || isUploading
                      ? "Saving..."
                      : "Save Testimonial"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="font-['Playfair_Display'] font-medium"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
