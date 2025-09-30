"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ROUTES, TOAST_MESSAGES } from "@/lib/constants";
import { ServiceCategoryForm } from "@/components/service-categories/service-category-form";
import { serviceCategoryService } from "@/lib/services/service-category.service";
import type {
  CreateServiceCategoryRequest,
  UpdateServiceCategoryRequest,
} from "@/lib/types/service-category.types";
import { useToast } from "@/hooks/use-toast";

export default function CreateServiceCategoryPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (
    data: CreateServiceCategoryRequest | UpdateServiceCategoryRequest
  ) => {
    // Ensure required fields for creation are present
    if (!data.name) {
      toast({
        title: "Error",
        description: "Name is required",
        variant: "destructive",
      });
      throw new Error("Name is required");
    }
    try {
      await serviceCategoryService.create({
        ...data,
        name: data.name as string, // ensure name is string
        description: (data as CreateServiceCategoryRequest).description ?? "", // ensure description is string
        icon: (data as CreateServiceCategoryRequest).icon ?? "", // ensure icon is string
        color: (data as CreateServiceCategoryRequest).color ?? "", // ensure color is string
        sortOrder: (data as CreateServiceCategoryRequest).sortOrder ?? 0, // ensure sortOrder is number
      });
      toast({
        title: "Success",
        description: TOAST_MESSAGES.CREATE_SUCCESS,
      });
      router.push(ROUTES.SERVICE_CATEGORIES);
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to create service category",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Create Service Category
          </h2>
          <p className="text-muted-foreground">
            Add a new service category to your platform
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
          <CardDescription>
            Fill in the information below to create a new service category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ServiceCategoryForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  );
}
