"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { ROUTES, TOAST_MESSAGES } from "@/lib/constants";
import { ServiceCategoryForm } from "@/components/service-categories/service-category-form";
import { serviceCategoryService } from "@/lib/services/service-category.service";
import type {
  ServiceCategory,
  UpdateServiceCategoryRequest,
} from "@/lib/types/service-category.types";
import { useToast } from "@/hooks/use-toast";
import { IconButton } from "@/components/ui/icon-button";

export default function EditServiceCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [category, setCategory] = useState<ServiceCategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const categoryId = params.id as string;

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await serviceCategoryService.getById(categoryId);
        setCategory(response.data.category);
      } catch (error: any) {
        toast({
          title: "Error",
          description:
            error.response?.data?.message || "Failed to fetch service category",
          variant: "destructive",
        });
        router.push(ROUTES.SERVICE_CATEGORIES);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId, router, toast]);

  const handleSubmit = async (data: UpdateServiceCategoryRequest) => {
    try {
      await serviceCategoryService.update(categoryId, data);
      toast({
        title: "Success",
        description: TOAST_MESSAGES.UPDATE_SUCCESS,
      });
      router.push(ROUTES.SERVICE_CATEGORIES);
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to update service category",
        variant: "destructive",
      });
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!category) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <IconButton
          variant="outline"
          size="icon"
          icon={<ArrowLeft className="h-4 w-4" />}
          onClick={() => router.back()}
        />
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Edit Service Category
          </h2>
          <p className="text-muted-foreground">
            Update the service category information
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
          <CardDescription>
            Update the information below to modify the service category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ServiceCategoryForm
            onSubmit={handleSubmit}
            initialData={category}
            isEdit
          />
        </CardContent>
      </Card>
    </div>
  );
}
