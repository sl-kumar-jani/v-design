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
  Grid,
  Eye,
  EyeOff,
  Tag,
  Video,
} from "lucide-react";
import Image from "next/image";
import { IPortfolio } from "@/lib/models/portfolio";
import { CategoryManagement } from "./category-management";
import { VideoManagement } from "./video-management";
import { ICategory } from "@/lib/models/category";
import { useToast } from "@/hooks/use-toast";

export function PortfolioManagement() {
  const [portfolioItems, setPortfolioItems] = useState<IPortfolio[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [showCategoryManagement, setShowCategoryManagement] = useState(false);
  const [showVideoManagement, setShowVideoManagement] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<IPortfolio | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    image: "",
    description: "",
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchPortfolioItems();
    fetchCategories();
  }, []);

  const fetchPortfolioItems = async () => {
    try {
      const response = await fetch("/api/portfolio?active=false");
      if (response.ok) {
        const data = await response.json();
        setPortfolioItems(data);
      }
    } catch (error) {
      console.error("Error fetching portfolio items:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
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
    if (!selectedFile) return;

    setIsUploading(true);
    const token = localStorage.getItem("adminToken");

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", selectedFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadFormData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData((prev) => ({ ...prev, image: data.url }));
        toast({
          title: "Success",
          description: "Image uploaded successfully!",
        });
        return data.url;
      } else {
        toast({
          title: "Error",
          description: "Failed to upload image",
          variant: "destructive",
        });
        return null;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error uploading image",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem("adminToken");

    try {
      const url = editingItem
        ? `/api/portfolio/${editingItem._id}`
        : "/api/portfolio";
      const method = editingItem ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: editingItem
            ? "Portfolio item updated successfully!"
            : "Portfolio item created successfully!",
        });
        resetForm();
        await fetchPortfolioItems();
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.error || "Failed to save portfolio item",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error saving portfolio item",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item: IPortfolio) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      image: item.image,
      description: item.description,
      order: item.order,
      isActive: item.isActive,
    });
    setPreviewUrl(item.image);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this portfolio item?"))
      return;

    const token = localStorage.getItem("adminToken");

    try {
      const response = await fetch(`/api/portfolio/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Portfolio item deleted successfully!",
        });
        await fetchPortfolioItems();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete portfolio item",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error deleting portfolio item",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      image: "",
      description: "",
      order: 0,
      isActive: true,
    });
    setEditingItem(null);
    setShowForm(false);
    setSelectedFile(null);
    setPreviewUrl("");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "order" ? parseInt(value) || 0 : value,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-['Cormorant_Garamond'] text-3xl text-white font-semibold flex items-center">
            <Grid className="w-8 h-8 mr-3 text-[#FFD700]" />
            Portfolio Management
          </h2>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setShowCategoryManagement(true)}
            className="bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#365545] font-['Playfair_Display'] font-medium"
          >
            <Tag className="w-4 h-4 mr-2" />
            Manage Categories
          </Button>
          <Button
            onClick={() => setShowVideoManagement(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-['Playfair_Display'] font-medium"
          >
            <Video className="w-4 h-4 mr-2" />
            Manage Videos
          </Button>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-[#365545] hover:bg-[#2a4136] text-white font-['Playfair_Display'] font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Item
          </Button>
        </div>
      </div>

      {/* Message Display */}
      {/* {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg ${
            messageType === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <p className="font-['Playfair_Display'] font-medium">{message}</p>
        </motion.div>
      )} */}

      {/* Portfolio Items Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolioItems.map((item) => (
          <Card
            key={item._id}
            className="bg-white/95 backdrop-blur-md shadow-lg"
          >
            <div className="relative aspect-video">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover rounded-t-lg"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <Badge variant={item.isActive ? "default" : "secondary"}>
                  {item.isActive ? (
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
                <h3 className="font-['Playfair_Display'] font-semibold text-[#365545] text-lg line-clamp-2">
                  {item.title}
                </h3>
                <div className="flex gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(item)}
                    className="text-blue-600 hover:bg-blue-50"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item._id!)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Badge variant="outline" className="mb-2">
                {item.category}
              </Badge>
              <p className="font-['Playfair_Display'] text-gray-600 text-sm line-clamp-2">
                {item.description}
              </p>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <span>Order: {item.order}</span>
                <span>{new Date(item.createdAt!).toLocaleDateString()}</span>
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
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => resetForm()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-['Cormorant_Garamond'] text-2xl text-[#365545] font-semibold">
                    {editingItem
                      ? "Edit Portfolio Item"
                      : "Add New Portfolio Item"}
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

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Image Upload */}
                  <div className="space-y-4">
                    <Label className="font-['Playfair_Display'] text-[#365545] font-medium flex items-center">
                      <ImageIcon className="w-5 h-5 mr-2 text-[#FFD700]" />
                      Portfolio Image
                    </Label>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                          {previewUrl ? (
                            <Image
                              src={previewUrl}
                              alt="Portfolio preview"
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
                          {isUploading ? "Uploading..." : "Upload Image"}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="title"
                        className="font-['Playfair_Display'] text-[#365545] font-medium"
                      >
                        Title
                      </Label>
                      <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter portfolio title"
                        className="font-['Playfair_Display']"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="category"
                        className="font-['Playfair_Display'] text-[#365545] font-medium"
                      >
                        Category
                      </Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            category: value,
                          }))
                        }
                      >
                        <SelectTrigger className="font-['Playfair_Display']">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category._id?.toString()}
                              value={category.name}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="description"
                      className="font-['Playfair_Display'] text-[#365545] font-medium"
                    >
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter portfolio description"
                      className="font-['Playfair_Display'] min-h-[100px]"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="order"
                        className="font-['Playfair_Display'] text-[#365545] font-medium"
                      >
                        Display Order
                      </Label>
                      <Input
                        id="order"
                        name="order"
                        type="number"
                        value={formData.order}
                        onChange={handleInputChange}
                        placeholder="0"
                        className="font-['Playfair_Display']"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="font-['Playfair_Display'] text-[#365545] font-medium">
                        Status
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={formData.isActive}
                          onCheckedChange={(checked) =>
                            setFormData((prev) => ({
                              ...prev,
                              isActive: checked,
                            }))
                          }
                        />
                        <span className="font-['Playfair_Display'] text-sm">
                          {formData.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      className="flex-1 font-['Playfair_Display'] font-medium"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading || !formData.image}
                      className="flex-1 bg-[#365545] hover:bg-[#2a4136] text-white font-['Playfair_Display'] font-medium"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading
                        ? "Saving..."
                        : editingItem
                        ? "Update"
                        : "Create"}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Management Modal */}
      <AnimatePresence>
        {showCategoryManagement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowCategoryManagement(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1a1a1a] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <CategoryManagement />
                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={() => {
                      setShowCategoryManagement(false);
                      fetchCategories();
                    }}
                    className="bg-[#365545] hover:bg-[#2a4136] text-white font-['Playfair_Display'] font-medium"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Management Modal */}
      <AnimatePresence>
        {showVideoManagement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowVideoManagement(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#365545] rounded-lg max-w-7xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <VideoManagement />
                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={() => setShowVideoManagement(false)}
                    className="bg-white hover:bg-gray-100 text-[#365545] font-['Playfair_Display'] font-medium"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
