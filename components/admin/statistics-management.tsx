"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  BarChart3,
  Users,
  Star,
  Award,
  TrendingUp,
  Eye,
  EyeOff,
} from "lucide-react";
import { IStatistics } from "@/lib/models/statistics";
import { useToast } from "@/hooks/use-toast";

export function StatisticsManagement() {
  const [statistics, setStatistics] = useState<IStatistics[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<IStatistics | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<IStatistics>({
    happyClients: 50,
    averageRating: 5.0,
    satisfaction: 100,
    awardsWon: 15,
    isActive: true,
    displayOrder: 0,
  });

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/statistics");
      if (response.ok) {
        const data = await response.json();
        // If we get a single object, wrap it in an array
        setStatistics(Array.isArray(data) ? data : [data]);
      } else {
        throw new Error("Failed to fetch statistics");
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
      toast({
        title: "Error",
        description: "Failed to fetch statistics",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      const url = editingItem
        ? `/api/statistics/${editingItem._id}`
        : "/api/statistics";
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
            ? "Statistics updated successfully!"
            : "Statistics created successfully!",
        });
        fetchStatistics();
        resetForm();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save statistics");
      }
    } catch (error) {
      console.error("Error saving statistics:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save statistics",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item: IStatistics) => {
    setEditingItem(item);
    setFormData({
      happyClients: item.happyClients,
      averageRating: item.averageRating,
      satisfaction: item.satisfaction,
      awardsWon: item.awardsWon,
      isActive: item.isActive,
      displayOrder: item.displayOrder,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this statistics record?"))
      return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/statistics/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Statistics deleted successfully!",
        });
        fetchStatistics();
      } else {
        throw new Error("Failed to delete statistics");
      }
    } catch (error) {
      console.error("Error deleting statistics:", error);
      toast({
        title: "Error",
        description: "Failed to delete statistics",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      happyClients: 50,
      averageRating: 5.0,
      satisfaction: 100,
      awardsWon: 15,
      isActive: true,
      displayOrder: 0,
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "averageRating" || name === "satisfaction"
          ? parseFloat(value) || 0
          : parseInt(value) || 0,
    }));
  };

  const getStatIcon = (type: string) => {
    switch (type) {
      case "happyClients":
        return <Users className="w-6 h-6 text-blue-500" />;
      case "averageRating":
        return <Star className="w-6 h-6 text-yellow-500" />;
      case "satisfaction":
        return <TrendingUp className="w-6 h-6 text-green-500" />;
      case "awardsWon":
        return <Award className="w-6 h-6 text-purple-500" />;
      default:
        return <BarChart3 className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatLabel = (type: string) => {
    switch (type) {
      case "happyClients":
        return "Happy Clients";
      case "averageRating":
        return "Average Rating";
      case "satisfaction":
        return "Satisfaction";
      case "awardsWon":
        return "Awards Won";
      default:
        return "";
    }
  };

  const getStatValue = (item: IStatistics, type: string) => {
    switch (type) {
      case "happyClients":
        return `${item.happyClients}+`;
      case "averageRating":
        return item.averageRating.toFixed(1);
      case "satisfaction":
        return `${item.satisfaction}%`;
      case "awardsWon":
        return `${item.awardsWon}+`;
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-['Cormorant_Garamond'] text-3xl text-white font-semibold flex items-center">
            <BarChart3 className="w-8 h-8 mr-3 text-[#FFD700]" />
            Statistics Management
          </h2>
          <p className="font-['Playfair_Display'] text-white/70 mt-2">
            Manage testimonial statistics displayed in the client reviews
            section
          </p>
        </div>
        {/* <Button
          onClick={() => setShowForm(true)}
          className="bg-[#365545] hover:bg-[#2a4136] text-white font-['Playfair_Display'] font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Statistics
        </Button> */}
      </div>

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statistics.map((item) => (
          <Card
            key={item._id}
            className="bg-white/95 backdrop-blur-md shadow-lg"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="font-['Playfair_Display'] text-[#365545] text-lg">
                  Statistics Record
                </CardTitle>
                <div className="flex gap-2">
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
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Statistics Grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  "happyClients",
                  "averageRating",
                  "satisfaction",
                  "awardsWon",
                ].map((statType) => (
                  <div
                    key={statType}
                    className="text-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex justify-center mb-2">
                      {getStatIcon(statType)}
                    </div>
                    <div className="font-['Cinzel'] text-xl font-semibold text-[#365545]">
                      {getStatValue(item, statType)}
                    </div>
                    <div className="font-['Playfair_Display'] text-xs text-gray-600 uppercase tracking-wide">
                      {getStatLabel(statType)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-sm text-gray-500">
                  Order: {item.displayOrder}
                </span>
                <div className="flex gap-2">
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
                  {editingItem ? "Edit Statistics" : "Add New Statistics"}
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
                      htmlFor="happyClients"
                      className="text-[#365545] font-['Playfair_Display'] font-medium flex items-center"
                    >
                      <Users className="w-4 h-4 mr-2 text-blue-500" />
                      Happy Clients *
                    </Label>
                    <Input
                      id="happyClients"
                      name="happyClients"
                      type="number"
                      value={formData.happyClients}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="mt-1"
                      placeholder="50"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="averageRating"
                      className="text-[#365545] font-['Playfair_Display'] font-medium flex items-center"
                    >
                      <Star className="w-4 h-4 mr-2 text-yellow-500" />
                      Average Rating *
                    </Label>
                    <Input
                      id="averageRating"
                      name="averageRating"
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={formData.averageRating}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                      placeholder="5.0"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="satisfaction"
                      className="text-[#365545] font-['Playfair_Display'] font-medium flex items-center"
                    >
                      <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                      Satisfaction (%) *
                    </Label>
                    <Input
                      id="satisfaction"
                      name="satisfaction"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.satisfaction}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                      placeholder="100"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="awardsWon"
                      className="text-[#365545] font-['Playfair_Display'] font-medium flex items-center"
                    >
                      <Award className="w-4 h-4 mr-2 text-purple-500" />
                      Awards Won *
                    </Label>
                    <Input
                      id="awardsWon"
                      name="awardsWon"
                      type="number"
                      min="0"
                      value={formData.awardsWon}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                      placeholder="15"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="displayOrder"
                      className="text-[#365545] font-['Playfair_Display'] font-medium"
                    >
                      Display Order
                    </Label>
                    <Input
                      id="displayOrder"
                      name="displayOrder"
                      type="number"
                      value={formData.displayOrder}
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
                    disabled={isLoading}
                    className="bg-[#365545] hover:bg-[#2a4136] text-white font-['Playfair_Display'] font-medium"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {isLoading ? "Saving..." : "Save Statistics"}
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
