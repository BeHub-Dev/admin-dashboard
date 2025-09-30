"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { IconButton } from "@/components/ui/icon-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  Calendar,
  User,
  Star,
  DollarSign,
  Clock,
  Users,
  BookOpen,
  Shield,
  Wrench,
} from "lucide-react";
import { serviceCategoryService } from "@/lib/services/service-category.service";
import type { ServiceCategory } from "@/lib/types/service-category.types";
import { useToast } from "@/hooks/use-toast";
import { ROUTES } from "@/lib/constants";
import { formatDateTime } from "@/lib/helpers/format.helper";

export default function ServiceCategoryDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [category, setCategory] = useState<ServiceCategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const categoryId = params.id as string;

  const fetchCategory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await serviceCategoryService.getById(categoryId);
      setCategory(response.data.category);
    } catch (error: any) {
      const errorMessage =
        error.response?.status === 404
          ? "Service category not found"
          : error.response?.status === 401
          ? "Authentication failed. Please check your credentials and try again."
          : error.response?.data?.message ||
            "Failed to fetch service category details. Please try again.";

      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId]);

  const handleDelete = async () => {
    if (!category) return;

    setIsDeleting(true);
    try {
      await serviceCategoryService.delete(category._id);
      toast({
        title: "Success",
        description: "Service category deleted successfully",
      });
      router.push(ROUTES.SERVICE_CATEGORIES);
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to delete service category",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <div className="space-y-2">
          <p className="text-lg font-medium">Unable to load service category</p>
          <p className="text-sm text-muted-foreground max-w-md">
            {error || "Category not found"}
          </p>
        </div>
        <div className="flex gap-2">
          <IconButton
            variant="outline"
            icon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => router.back()}
          >
            Go Back
          </IconButton>
          <IconButton onClick={fetchCategory}>Try Again</IconButton>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <IconButton
              variant="outline"
              size="icon"
              icon={<ArrowLeft className="h-4 w-4" />}
              onClick={() => router.back()}
            />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {category.name}
              </h1>
              <p className="text-muted-foreground">Service category details</p>
            </div>
          </div>
          <div className="flex gap-2">
            <IconButton
              icon={<Edit className="h-4 w-4" />}
              onClick={() =>
                router.push(ROUTES.SERVICE_CATEGORY_EDIT(category._id))
              }
            >
              Edit Category
            </IconButton>
            <IconButton
              variant="destructive"
              icon={<Trash2 className="h-4 w-4" />}
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete
            </IconButton>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Name
                  </label>
                  <p className="text-lg">{category.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Icon
                  </label>
                  <p className="text-sm italic">{category.icon}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Description
                </label>
                <p className="text-sm">{category.description}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Status
                </label>
                <div className="mt-1">
                  <Badge variant={category.isActive ? "default" : "secondary"}>
                    {category.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Sort Order
                </label>
                <p className="text-sm font-mono">{category.sortOrder}</p>
              </div>

              {category.slug && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Slug
                  </label>
                  <p className="text-sm font-mono">/{category.slug}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-bold">
                      {category.totalProviders || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Providers</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-bold">
                      {category.totalBookings || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Bookings</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Star className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-bold">
                      {category.averageRating
                        ? category.averageRating.toFixed(1)
                        : "N/A"}
                    </p>
                    <p className="text-sm text-muted-foreground">Rating</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-bold">
                      {category.averageDuration
                        ? `${category.averageDuration}m`
                        : "N/A"}
                    </p>
                    <p className="text-sm text-muted-foreground">Duration</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Information */}
          {category.averagePriceRange && (
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Average Price Range
                  </label>
                  <p className="text-lg">
                    ${category.averagePriceRange.min} - $
                    {category.averagePriceRange.max}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  License Required: {category.requiresLicense ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Special Equipment:{" "}
                  {category.requiresSpecialEquipment ? "Yes" : "No"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Meta Information */}
          <Card>
            <CardHeader>
              <CardTitle>Meta Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Created By
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {category.createdBy?.fullName || "Unknown"}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Created At
                </label>
                <p className="text-sm">{formatDateTime(category.createdAt)}</p>
              </div>

              {category.updatedAt && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Last Updated
                  </label>
                  <p className="text-sm">
                    {formatDateTime(category.updatedAt)}
                  </p>
                </div>
              )}

              {category.updatedBy && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Last Updated By
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {category.updatedBy.fullName}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* SEO Information */}
          {(category.metaTitle || category.metaDescription) && (
            <Card>
              <CardHeader>
                <CardTitle>SEO Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.metaTitle && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Meta Title
                    </label>
                    <p className="text-sm">{category.metaTitle}</p>
                  </div>
                )}
                {category.metaDescription && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Meta Description
                    </label>
                    <p className="text-sm">{category.metaDescription}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the service category "{category.name}
              ". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
