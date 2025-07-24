"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag, Edit, Trash2, Save, X, Plus } from "lucide-react";
import { ICategory } from "@/lib/models/category";
import { useToast } from "@/hooks/use-toast";

export function CategoryManagement() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(
    null
  );
  const [categoryName, setCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem("adminToken");

    try {
      const url = editingCategory
        ? `/api/categories/${editingCategory._id}`
        : "/api/categories";
      const method = editingCategory ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: categoryName }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: editingCategory
            ? "Category updated successfully!"
            : "Category created successfully!",
        });
        resetForm();
        await fetchCategories();
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.error || "Failed to save category",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error saving category",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (category: ICategory) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    const token = localStorage.getItem("adminToken");

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Category deleted successfully!",
        });
        await fetchCategories();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete category",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error deleting category",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setCategoryName("");
    setEditingCategory(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-['Cormorant_Garamond'] text-3xl text-white font-semibold flex items-center">
            <Tag className="w-8 h-8 mr-3 text-[#FFD700]" />
            Category Management
          </h2>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-[#365545] hover:bg-[#2a4136] text-white font-['Playfair_Display'] font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Category
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card
            key={category._id}
            className="bg-white/95 backdrop-blur-md shadow-lg"
          >
            <CardContent className="p-2 pl-2">
              <div className="flex items-center justify-between">
                <h3 className="font-['Playfair_Display'] font-semibold text-[#365545] text-base">
                  {category.name}
                </h3>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(category)}
                    className="text-blue-600 hover:bg-blue-50"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(category._id!)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
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
              className="bg-white rounded-lg max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-['Cormorant_Garamond'] text-2xl text-[#365545] font-semibold">
                    {editingCategory ? "Edit Category" : "Add New Category"}
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
                  <div className="space-y-2">
                    <Input
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      placeholder="Enter category name"
                      className="font-['Playfair_Display']"
                      required
                    />
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
                      disabled={isLoading}
                      className="flex-1 bg-[#365545] hover:bg-[#2a4136] text-white font-['Playfair_Display'] font-medium"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading
                        ? "Saving..."
                        : editingCategory
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
    </div>
  );
}
