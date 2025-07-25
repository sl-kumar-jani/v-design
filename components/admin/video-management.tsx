"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Video as VideoIcon,
  Image as ImageIcon,
  Play,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { IVideo } from "@/lib/models/video";
import { useToast } from "@/hooks/use-toast";

// Cloudinary config (replace with your actual values)
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`;
const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

const uploadToCloudinary = async (file: File, folder: string) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", folder);

  const response = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Cloudinary upload failed");
  const data = await response.json();
  return data.secure_url;
};

export function VideoManagement() {
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<IVideo | null>(null);
  const [selectedThumbnailFile, setSelectedThumbnailFile] =
    useState<File | null>(null);
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string>("");
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>("");
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnailUrl: "",
    videoUrl: "",
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch("/api/videos?active=false");
      if (response.ok) {
        const data = await response.json();
        setVideos(data);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  const handleThumbnailFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedVideoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleThumbnailUpload = async () => {
    if (!selectedThumbnailFile) return;
    // Check file size (5MB = 5 * 1024 * 1024 bytes)
    if (selectedThumbnailFile.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description:
          "Image size exceeds 5MB. Please upload an image smaller than 5MB.",
        variant: "destructive",
      });
      return null;
    }
    setIsUploadingThumbnail(true);
    const token = localStorage.getItem("adminToken");
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", selectedThumbnailFile);
      uploadFormData.append("fileType", "image");
      uploadFormData.append("folder", "v-design/videos/thumbnails");
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadFormData,
      });
      if (response.ok) {
        const data = await response.json();
        setFormData((prev) => ({ ...prev, thumbnailUrl: data.url }));
        toast({
          title: "Success",
          description: "Thumbnail uploaded successfully!",
        });
        return data.url;
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.error || "Failed to upload thumbnail",
          variant: "destructive",
        });
        return null;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload thumbnail",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploadingThumbnail(false);
    }
  };

  const handleVideoUpload = async () => {
    if (!selectedVideoFile) return;
    // Check file size (20MB = 20 * 1024 * 1024 bytes)
    if (selectedVideoFile.size > 20 * 1024 * 1024) {
      toast({
        title: "Error",
        description:
          "Video size exceeds 20MB. Please upload a video smaller than 20MB.",
        variant: "destructive",
      });
      return null;
    }
    setIsUploadingVideo(true);
    try {
      const url = await uploadToCloudinary(
        selectedVideoFile,
        "v-design/videos"
      );
      setFormData((prev) => ({ ...prev, videoUrl: url }));
      toast({ title: "Success", description: "Video uploaded successfully!" });
      return url;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload video",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem("adminToken");

    try {
      const url = editingVideo
        ? `/api/videos/${editingVideo._id}`
        : "/api/videos";
      const method = editingVideo ? "PUT" : "POST";

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
          description: editingVideo
            ? "Video updated successfully!"
            : "Video created successfully!",
        });
        resetForm();
        await fetchVideos();
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.error || "Failed to save video",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error saving video",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (video: IVideo) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description,
      thumbnailUrl: video.thumbnailUrl,
      videoUrl: video.videoUrl,
      order: video.order,
      isActive: video.isActive,
    });
    setThumbnailPreviewUrl(video.thumbnailUrl);
    setVideoPreviewUrl(video.videoUrl);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;

    const token = localStorage.getItem("adminToken");

    try {
      const response = await fetch(`/api/videos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Video deleted successfully!",
        });
        await fetchVideos();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete video",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error deleting video",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      thumbnailUrl: "",
      videoUrl: "",
      order: 0,
      isActive: true,
    });
    setEditingVideo(null);
    setShowForm(false);
    setSelectedThumbnailFile(null);
    setSelectedVideoFile(null);
    setThumbnailPreviewUrl("");
    setVideoPreviewUrl("");
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

  const nextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
    setIsPlaying(false);
  };

  const prevVideo = () => {
    setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);
    setIsPlaying(false);
  };

  const activeVideos = videos.filter((video) => video.isActive);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-['Cormorant_Garamond'] text-3xl text-white font-semibold flex items-center">
            <VideoIcon className="w-8 h-8 mr-3 text-[#FFD700]" />
            Video Management
          </h2>
          <p className="text-white/70 font-['Playfair_Display'] mt-2">
            Manage portfolio videos with thumbnails and playback controls
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-[#365545] hover:bg-[#2a4136] text-white font-['Playfair_Display'] font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Video
        </Button>
      </div>

      {/* Video Preview Carousel */}
      {activeVideos.length > 0 && (
        <Card className="bg-white/95 backdrop-blur-md shadow-lg">
          <CardHeader>
            <CardTitle className="font-['Cormorant_Garamond'] text-2xl text-[#365545]">
              Video Preview
            </CardTitle>
            <CardDescription className="font-['Playfair_Display']">
              Preview how videos will appear on the portfolio page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="relative aspect-video max-w-4xl mx-auto rounded-lg overflow-hidden shadow-2xl">
                {!isPlaying ? (
                  <>
                    <Image
                      src={
                        activeVideos[currentVideoIndex]?.thumbnailUrl ||
                        "/placeholder.svg"
                      }
                      alt={
                        activeVideos[currentVideoIndex]?.title ||
                        "Video thumbnail"
                      }
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <button
                        onClick={() => setIsPlaying(true)}
                        className="w-20 h-20 rounded-full bg-[#FFD700] flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-300 shadow-2xl"
                      >
                        <Play className="w-8 h-8 text-[#365545] ml-1" />
                      </button>
                    </div>
                  </>
                ) : (
                  <video
                    src={activeVideos[currentVideoIndex]?.videoUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-cover"
                    onEnded={() => setIsPlaying(false)}
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>

              {/* Navigation Controls */}
              {activeVideos.length > 1 && (
                <>
                  <button
                    onClick={prevVideo}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextVideo}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Video Info */}
              <div className="mt-4 text-center">
                <h3 className="font-['Playfair_Display'] text-lg font-semibold text-[#365545]">
                  {activeVideos[currentVideoIndex]?.title}
                </h3>
                <p className="font-['Playfair_Display'] text-gray-600 mt-1">
                  {activeVideos[currentVideoIndex]?.description}
                </p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="text-sm text-gray-500">
                    {currentVideoIndex + 1} of {activeVideos.length}
                  </span>
                  {activeVideos.length > 1 && (
                    <div className="flex gap-1">
                      {activeVideos.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setCurrentVideoIndex(index);
                            setIsPlaying(false);
                          }}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentVideoIndex
                              ? "bg-[#FFD700]"
                              : "bg-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Videos Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Card
            key={video._id}
            className="bg-white/95 backdrop-blur-md shadow-lg"
          >
            <div className="relative aspect-video">
              <Image
                src={video.thumbnailUrl}
                alt={video.title}
                fill
                className="object-cover rounded-t-lg"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <Badge variant={video.isActive ? "default" : "secondary"}>
                  {video.isActive ? (
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
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Play className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-['Playfair_Display'] font-semibold text-[#365545] text-lg line-clamp-2">
                  {video.title}
                </h3>
                <div className="flex gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(video)}
                    className="text-blue-600 hover:bg-blue-50"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(video._id!)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="font-['Playfair_Display'] text-gray-600 text-sm line-clamp-2">
                {video.description}
              </p>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <span>Order: {video.order}</span>
                <span>{new Date(video.createdAt!).toLocaleDateString()}</span>
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
              className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-['Cormorant_Garamond'] text-2xl text-[#365545] font-semibold">
                    {editingVideo ? "Edit Video" : "Add New Video"}
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
                  {/* File Uploads */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Thumbnail Upload */}
                    <div className="space-y-4">
                      <Label className="font-['Playfair_Display'] text-[#365545] font-medium flex items-center">
                        <ImageIcon className="w-5 h-5 mr-2 text-[#FFD700]" />
                        Thumbnail Image
                      </Label>
                      <div className="space-y-4">
                        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                          {thumbnailPreviewUrl ? (
                            <Image
                              src={thumbnailPreviewUrl}
                              alt="Thumbnail preview"
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleThumbnailFileSelect}
                            className="font-['Playfair_Display']"
                          />
                          <Button
                            type="button"
                            onClick={handleThumbnailUpload}
                            disabled={
                              !selectedThumbnailFile || isUploadingThumbnail
                            }
                            className="w-full bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#365545] font-['Playfair_Display'] font-medium"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {isUploadingThumbnail
                              ? "Uploading..."
                              : "Upload Thumbnail"}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Video Upload */}
                    <div className="space-y-4">
                      <Label className="font-['Playfair_Display'] text-[#365545] font-medium flex items-center">
                        <VideoIcon className="w-5 h-5 mr-2 text-[#FFD700]" />
                        Video File
                      </Label>
                      <div className="space-y-4">
                        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                          {videoPreviewUrl ? (
                            <video
                              src={videoPreviewUrl}
                              className="w-full h-full object-cover"
                              controls
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <VideoIcon className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Input
                            type="file"
                            accept="video/*"
                            onChange={handleVideoFileSelect}
                            className="font-['Playfair_Display']"
                          />
                          <Button
                            type="button"
                            onClick={handleVideoUpload}
                            disabled={!selectedVideoFile || isUploadingVideo}
                            className="w-full bg-[#FFD700] hover:bg-[#FFD700]/90 text-[#365545] font-['Playfair_Display'] font-medium"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {isUploadingVideo ? "Uploading..." : "Upload Video"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-4">
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
                        placeholder="Enter video title"
                        className="font-['Playfair_Display']"
                        required
                      />
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
                        placeholder="Enter video description"
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
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      className="font-['Playfair_Display'] font-medium"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={
                        isLoading ||
                        !formData.title ||
                        !formData.description ||
                        !formData.thumbnailUrl ||
                        !formData.videoUrl
                      }
                      className="bg-[#365545] hover:bg-[#2a4136] text-white font-['Playfair_Display'] font-medium"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading
                        ? "Saving..."
                        : editingVideo
                        ? "Update Video"
                        : "Create Video"}
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
