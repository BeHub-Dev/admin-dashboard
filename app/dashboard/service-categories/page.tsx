"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, AlertCircle, RefreshCw } from "lucide-react";
import { serviceCategoryService } from "@/lib/services/service-category.service";
import type { ServiceCategory } from "@/lib/types/service-category.types";
import { useToast } from "@/hooks/use-toast";
import { ROUTES } from "@/lib/constants";
import { ServiceCategoryTable } from "@/components/service-categories/service-category-table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ServiceCategoriesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("sortOrder");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const fetchCategories = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams = {
        page: params?.page || currentPage,
        limit: params?.limit || pageSize,
        search: params?.search !== undefined ? params.search : searchTerm,
        sortBy: params?.sortBy || sortBy,
        sortOrder: params?.sortOrder || sortOrder,
      };

      const response = await serviceCategoryService.getAll(queryParams);
      setCategories(response.data.categories);
      setTotalPages(response.data.pagination.totalPages);
      setTotalItems(response.data.pagination.totalItems);
      setCurrentPage(response.data.pagination.currentPage);
    } catch (error: any) {
      const errorMessage =
        error.response?.status === 401
          ? "Authentication failed. Please check your credentials and try again."
          : error.response?.data?.message ||
            "Failed to fetch service categories. Please try again.";

      setError(errorMessage);
      setCategories([]);

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
    fetchCategories();
  }, [currentPage, pageSize, sortBy, sortOrder]);

  const handleSearch = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1);
    fetchCategories({ page: 1, search });
  };

  const handleSort = (newSortBy: string, newSortOrder: "asc" | "desc") => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setCurrentPage(1);
    fetchCategories({ page: 1, sortBy: newSortBy, sortOrder: newSortOrder });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchCategories({ page });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
    fetchCategories({ page: 1, limit: newPageSize });
  };

  const handleDelete = async (id: string) => {
    try {
      await serviceCategoryService.delete(id);
      toast({
        title: "Success",
        description: "Service category deleted successfully",
      });
      fetchCategories();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to delete service category",
        variant: "destructive",
      });
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    try {
      // Delete multiple categories
      await Promise.all(ids.map((id) => serviceCategoryService.delete(id)));
      toast({
        title: "Success",
        description: `${ids.length} service categories deleted successfully`,
      });
      fetchCategories();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "Failed to delete service categories",
        variant: "destructive",
      });
    }
  };

  const handleRetry = () => {
    // Reset everything to default state
    setCurrentPage(1);
    setPageSize(20);
    setSearchTerm("");
    setSortBy("sortOrder");
    setSortOrder("asc");
    fetchCategories({
      page: 1,
      limit: 20,
      search: "",
      sortBy: "sortOrder",
      sortOrder: "asc",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Service Categories
          </h2>
          <p className="text-muted-foreground">
            Manage your service categories and offerings
          </p>
        </div>
        <IconButton
          icon={<Plus className="h-4 w-4" />}
          onClick={() => router.push(ROUTES.SERVICE_CATEGORY_CREATE)}
        >
          Add Category
        </IconButton>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <IconButton
              variant="outline"
              size="sm"
              onClick={handleRetry}
              className="ml-4 bg-transparent"
            >
              Retry
            </IconButton>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="flex justify-between">
          <div className="space-y-2">
            <CardTitle>All Categories</CardTitle>
            <CardDescription>
              {totalItems} {totalItems === 1 ? "category" : "categories"} found
            </CardDescription>
          </div>
          <IconButton
            variant="outline"
            size="sm"
            icon={<RefreshCw className="h-4 w-4" />}
            onClick={handleRetry}
            className="bg-transparent"
          >
            Refresh
          </IconButton>
        </CardHeader>
        <CardContent>
          <ServiceCategoryTable
            categories={categories}
            isLoading={isLoading}
            error={error}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            searchTerm={searchTerm}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onSearch={handleSearch}
            onSort={handleSort}
            onDelete={handleDelete}
            onBulkDelete={handleBulkDelete}
            onRetry={handleRetry}
          />
        </CardContent>
      </Card>
    </div>
  );
}
