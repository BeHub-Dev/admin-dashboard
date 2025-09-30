"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import type {
  CreateServiceCategoryRequest,
  UpdateServiceCategoryRequest,
  ServiceCategory,
} from "@/lib/types/service-category.types";
import { validateServiceCategory } from "@/lib/helpers/formValidator.helper";

interface ServiceCategoryFormProps {
  onSubmit: (
    data: CreateServiceCategoryRequest | UpdateServiceCategoryRequest
  ) => Promise<void>;
  initialData?: ServiceCategory;
  isEdit?: boolean;
}

export function ServiceCategoryForm({
  onSubmit,
  initialData,
  isEdit = false,
}: ServiceCategoryFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    icon: initialData?.icon || "",
    color: initialData?.color || "#ffb320",
    sortOrder: initialData?.sortOrder || 1,
    isActive: initialData?.isActive ?? true,
    averageDuration: initialData?.averageDuration || 60,
    requiresLicense: initialData?.requiresLicense || false,
    requiresSpecialEquipment: initialData?.requiresSpecialEquipment || false,
    metaTitle: initialData?.metaTitle || "",
    metaDescription: initialData?.metaDescription || "",
    priceMin: initialData?.averagePriceRange?.min || 0,
    priceMax: initialData?.averagePriceRange?.max || 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFieldErrors({});

    const validation = validateServiceCategory(formData);
    if (!validation.success) {
      setFieldErrors(validation.errors ?? {});
      setIsLoading(false);
      return;
    }

    const parsed = validation.data as unknown as {
      name: string;
      icon: string;
      description: string;
      color: string;
      sortOrder?: number;
      averageDuration?: number;
      requiresLicense?: boolean;
      requiresSpecialEquipment?: boolean;
      metaTitle?: string | null;
      metaDescription?: string | null;
      priceMin?: number;
      priceMax?: number;
      isActive?: boolean;
    };

    try {
      const submitData:
        | CreateServiceCategoryRequest
        | UpdateServiceCategoryRequest = {
        name: parsed.name,
        description: parsed.description,
        icon: parsed.icon,
        color: parsed.color,
        sortOrder: Number(parsed.sortOrder ?? 1),
        averageDuration: Number(parsed.averageDuration ?? 60),
        requiresLicense: parsed.requiresLicense ?? false,
        requiresSpecialEquipment: parsed.requiresSpecialEquipment ?? false,
        metaTitle: parsed.metaTitle ?? undefined,
        metaDescription: parsed.metaDescription ?? undefined,
        isActive: parsed.isActive ?? true,
      };

      if (
        typeof parsed.priceMin === "number" ||
        typeof parsed.priceMax === "number"
      ) {
        submitData.averagePriceRange = {
          min: Number(parsed.priceMin ?? 0),
          max: Number(parsed.priceMax ?? 0),
        };
      }

      await onSubmit(submitData);
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">
            Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Hair Styling"
            required
            maxLength={100}
            disabled={isLoading}
          />
          {fieldErrors.name?.[0] && (
            <p className="text-sm text-destructive mt-1">
              {fieldErrors.name[0]}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Maximum 100 characters
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="icon">
            Icon <span className="text-destructive">*</span>
          </Label>
          <Input
            id="icon"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            placeholder="e.g., scissors"
            required
            disabled={isLoading}
          />
          {fieldErrors.icon?.[0] && (
            <p className="text-sm text-destructive mt-1">
              {fieldErrors.icon[0]}
            </p>
          )}
          <p className="text-xs text-muted-foreground">Icon name or emoji</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">
          Description <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Describe the service category..."
          required
          maxLength={500}
          rows={4}
          disabled={isLoading}
        />
        {fieldErrors.description?.[0] && (
          <p className="text-sm text-destructive mt-1">
            {fieldErrors.description[0]}
          </p>
        )}
        <p className="text-xs text-muted-foreground">Maximum 500 characters</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <div className="flex gap-2">
            <Input
              id="color"
              type="color"
              value={formData.color}
              onChange={(e) =>
                setFormData({ ...formData, color: e.target.value })
              }
              className="h-10 w-20"
              disabled={isLoading}
            />
            <Input
              type="text"
              value={formData.color}
              onChange={(e) =>
                setFormData({ ...formData, color: e.target.value })
              }
              placeholder="#ffb320"
              className="flex-1"
              disabled={isLoading}
            />
          </div>
          {fieldErrors.color?.[0] && (
            <p className="text-sm text-destructive mt-1">
              {fieldErrors.color[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sortOrder">Sort Order</Label>
          <Input
            id="sortOrder"
            type="number"
            value={formData.sortOrder}
            onChange={(e) =>
              setFormData({ ...formData, sortOrder: Number(e.target.value) })
            }
            min={0}
            disabled={isLoading}
          />
          {fieldErrors.sortOrder?.[0] && (
            <p className="text-sm text-destructive mt-1">
              {fieldErrors.sortOrder[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="averageDuration">Average Duration (minutes)</Label>
          <Input
            id="averageDuration"
            type="number"
            value={formData.averageDuration}
            onChange={(e) =>
              setFormData({
                ...formData,
                averageDuration: Number(e.target.value),
              })
            }
            min={15}
            max={480}
            disabled={isLoading}
          />
        </div>
        {fieldErrors.averageDuration?.[0] && (
          <p className="text-sm text-destructive mt-1">
            {fieldErrors.averageDuration[0]}
          </p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="priceMin">Minimum Price ($)</Label>
          <Input
            id="priceMin"
            type="number"
            value={formData.priceMin}
            onChange={(e) =>
              setFormData({ ...formData, priceMin: Number(e.target.value) })
            }
            min={0}
            step={0.01}
            disabled={isLoading}
          />
          {fieldErrors.priceMin?.[0] && (
            <p className="text-sm text-destructive mt-1">
              {fieldErrors.priceMin[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="priceMax">Maximum Price ($)</Label>
          <Input
            id="priceMax"
            type="number"
            value={formData.priceMax}
            onChange={(e) =>
              setFormData({ ...formData, priceMax: Number(e.target.value) })
            }
            min={0}
            step={0.01}
            disabled={isLoading}
          />
        </div>
        {fieldErrors.priceMax?.[0] && (
          <p className="text-sm text-destructive mt-1">
            {fieldErrors.priceMax[0]}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="requiresLicense">Requires License</Label>
            <p className="text-sm text-muted-foreground">
              Does this service require a professional license?
            </p>
          </div>
          <Switch
            id="requiresLicense"
            checked={formData.requiresLicense}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, requiresLicense: checked })
            }
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="requiresSpecialEquipment">
              Requires Special Equipment
            </Label>
            <p className="text-sm text-muted-foreground">
              Does this service require special equipment?
            </p>
          </div>
          <Switch
            id="requiresSpecialEquipment"
            checked={formData.requiresSpecialEquipment}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, requiresSpecialEquipment: checked })
            }
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="isActive">Active Status</Label>
            <p className="text-sm text-muted-foreground">
              Is this category currently active?
            </p>
          </div>
          <Switch
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) =>
              setFormData({ ...formData, isActive: checked })
            }
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-4 rounded-lg border p-4">
        <h3 className="font-medium">SEO Settings (Optional)</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="metaTitle">Meta Title</Label>
            <Input
              id="metaTitle"
              value={formData.metaTitle}
              onChange={(e) =>
                setFormData({ ...formData, metaTitle: e.target.value })
              }
              placeholder="SEO title for this category"
              maxLength={60}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Maximum 60 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea
              id="metaDescription"
              value={formData.metaDescription}
              onChange={(e) =>
                setFormData({ ...formData, metaDescription: e.target.value })
              }
              placeholder="SEO description for this category"
              maxLength={160}
              rows={3}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Maximum 160 characters
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {isEdit ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>{isEdit ? "Update Category" : "Create Category"}</>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isLoading}
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
