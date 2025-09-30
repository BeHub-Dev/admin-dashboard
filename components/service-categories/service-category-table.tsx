"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  MoreHorizontal,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Filter,
  X,
  Eye,
} from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  type VisibilityState,
  type RowSelectionState,
} from "@tanstack/react-table";
import type { ServiceCategory } from "@/lib/types/service-category.types";
import { formatDate, truncateText } from "@/lib/helpers/format.helper";
import { ROUTES } from "@/lib/constants";

// Define the column helper for TypeScript support
const columnHelper = createColumnHelper<ServiceCategory>();

interface ServiceCategoryTableProps {
  categories: ServiceCategory[];
  isLoading: boolean;
  error?: string | null;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  searchTerm: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSearch: (search: string) => void;
  onSort: (sortBy: string, sortOrder: "asc" | "desc") => void;
  onDelete: (id: string) => Promise<void>;
  onBulkDelete?: (ids: string[]) => Promise<void>;
  onRetry?: () => void;
}

export function ServiceCategoryTable({
  categories,
  isLoading,
  error,
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  searchTerm,
  sortBy,
  sortOrder,
  onPageChange,
  onPageSizeChange,
  onSearch,
  onSort,
  onDelete,
  onBulkDelete,
  onRetry,
}: ServiceCategoryTableProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<ServiceCategory | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    description: false,
    averagePriceRange: false,
    averageDuration: false,
    createdAt: false,
  });
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localSearchTerm !== searchTerm) {
        onSearch(localSearchTerm);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [localSearchTerm, searchTerm, onSearch]);

  // Update local search term when prop changes
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  // Define columns with sorting and filtering
  const columns = useMemo(
    () => [
      // Selection column
      columnHelper.display({
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      }),

      // Name column with icon and color
      columnHelper.accessor("name", {
        header: () => (
          <Button
            variant="ghost"
            onClick={() => {
              const newSortOrder =
                sortBy === "name" && sortOrder === "asc" ? "desc" : "asc";
              onSort("name", newSortOrder);
            }}
            className="h-auto p-0 font-medium"
          >
            Name
            {sortBy === "name" ? (
              sortOrder === "asc" ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )
            ) : (
              <ArrowUpDown className="h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ row }) => {
          const category = row.original;
          return (
            <div>
              <h2 className="font-medium">{category.name}</h2>
              <div className="text-xs text-muted-foreground">
                {category.slug && `/${category.slug}`}
              </div>
            </div>
          );
        },
        enableColumnFilter: true,
        filterFn: "includesString",
      }),

      // Status column
      columnHelper.accessor("isActive", {
        header: () => (
          <Button
            variant="ghost"
            onClick={() => {
              const newSortOrder =
                sortBy === "isActive" && sortOrder === "asc" ? "desc" : "asc";
              onSort("isActive", newSortOrder);
            }}
            className="h-auto p-0 font-medium"
          >
            Status
            {sortBy === "isActive" ? (
              sortOrder === "asc" ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )
            ) : (
              <ArrowUpDown className="h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ getValue }) => (
          <Badge variant={getValue() ? "default" : "secondary"}>
            {getValue() ? "Active" : "Inactive"}
          </Badge>
        ),
        enableColumnFilter: true,
        filterFn: "equals",
      }),

      // Sort Order column
      columnHelper.accessor("sortOrder", {
        header: () => (
          <Button
            variant="ghost"
            onClick={() => {
              const newSortOrder =
                sortBy === "sortOrder" && sortOrder === "asc" ? "desc" : "asc";
              onSort("sortOrder", newSortOrder);
            }}
            className="h-auto p-0 font-medium"
          >
            Sort Order
            {sortBy === "sortOrder" ? (
              sortOrder === "asc" ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )
            ) : (
              <ArrowUpDown className="h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ getValue }) => <span className="font-mono">{getValue()}</span>,
      }),

      // Providers column
      columnHelper.accessor("totalProviders", {
        header: () => (
          <Button
            variant="ghost"
            onClick={() => {
              const newSortOrder =
                sortBy === "totalProviders" && sortOrder === "asc"
                  ? "desc"
                  : "asc";
              onSort("totalProviders", newSortOrder);
            }}
            className="h-auto p-0 font-medium"
          >
            Providers
            {sortBy === "totalProviders" ? (
              sortOrder === "asc" ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )
            ) : (
              <ArrowUpDown className="h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ getValue }) => getValue() || 0,
      }),

      // Bookings column
      columnHelper.accessor("totalBookings", {
        header: () => (
          <Button
            variant="ghost"
            onClick={() => {
              const newSortOrder =
                sortBy === "totalBookings" && sortOrder === "asc"
                  ? "desc"
                  : "asc";
              onSort("totalBookings", newSortOrder);
            }}
            className="h-auto p-0 font-medium"
          >
            Bookings
            {sortBy === "totalBookings" ? (
              sortOrder === "asc" ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )
            ) : (
              <ArrowUpDown className="h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ getValue }) => getValue() || 0,
      }),

      // Rating column
      columnHelper.accessor("averageRating", {
        header: () => (
          <Button
            variant="ghost"
            onClick={() => {
              const newSortOrder =
                sortBy === "averageRating" && sortOrder === "asc"
                  ? "desc"
                  : "asc";
              onSort("averageRating", newSortOrder);
            }}
            className="h-auto p-0 font-medium"
          >
            Rating
            {sortBy === "averageRating" ? (
              sortOrder === "asc" ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )
            ) : (
              <ArrowUpDown className="h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ getValue }) => {
          const rating = getValue();
          return rating ? rating.toFixed(1) : "N/A";
        },
      }),

      // Description column
      columnHelper.accessor("description", {
        header: "Description",
        cell: ({ getValue }) => (
          <div className="max-w-[300px]">
            <p className="truncate text-sm text-muted-foreground">
              {truncateText(getValue(), 60)}
            </p>
          </div>
        ),
        enableColumnFilter: true,
        filterFn: "includesString",
      }),

      // Price Range column
      columnHelper.accessor("averagePriceRange", {
        header: "Price Range",
        cell: ({ getValue }) => {
          const priceRange = getValue();
          if (!priceRange) return "N/A";
          return (
            <div className="text-sm">
              <div>
                ${priceRange.min} - ${priceRange.max}
              </div>
            </div>
          );
        },
      }),

      // Duration column
      columnHelper.accessor("averageDuration", {
        header: "Duration",
        cell: ({ getValue }) => {
          const duration = getValue();
          if (!duration) return "N/A";
          return <span className="text-sm">{duration} min</span>;
        },
      }),

      // Created Date column
      columnHelper.accessor("createdAt", {
        header: () => (
          <Button
            variant="ghost"
            onClick={() => {
              const newSortOrder =
                sortBy === "createdAt" && sortOrder === "asc" ? "desc" : "asc";
              onSort("createdAt", newSortOrder);
            }}
            className="h-auto p-0 font-medium"
          >
            Created
            {sortBy === "createdAt" ? (
              sortOrder === "asc" ? (
                <ArrowUp className="h-4 w-4" />
              ) : (
                <ArrowDown className="h-4 w-4" />
              )
            ) : (
              <ArrowUpDown className="h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ getValue }) => (
          <span className="text-sm text-muted-foreground">
            {formatDate(getValue())}
          </span>
        ),
      }),

      // Actions column
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const category = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    router.push(ROUTES.SERVICE_CATEGORY_DETAILS(category._id))
                  }
                >
                  <Eye className="h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    router.push(ROUTES.SERVICE_CATEGORY_EDIT(category._id))
                  }
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDeleteClick(category)}>
                  <Trash2 className="h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
        enableSorting: false,
        enableHiding: false,
      }),
    ],
    [router]
  );

  // Create table instance (server-side data, no client-side filtering/sorting)
  const table = useReactTable({
    data: categories,
    columns,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnVisibility,
      rowSelection,
    },
    initialState: {
      columnVisibility: {
        description: false,
        sortOrder: false,
        averagePriceRange: false,
        averageDuration: false,
        createdAt: false,
      },
    },
  });

  const handleDeleteClick = (category: ServiceCategory) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCategory) return;

    setIsDeleting(true);
    try {
      await onDelete(selectedCategory._id);
      setDeleteDialogOpen(false);
      setSelectedCategory(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkDeleteClick = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    if (selectedRows.length > 0) {
      setBulkDeleteDialogOpen(true);
    }
  };

  const handleBulkDeleteConfirm = async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const selectedIds = selectedRows.map((row) => row.original._id);

    if (selectedIds.length === 0) return;

    setIsBulkDeleting(true);
    try {
      if (onBulkDelete) {
        await onBulkDelete(selectedIds);
        setRowSelection({});
      }
    } finally {
      setIsBulkDeleting(false);
      setBulkDeleteDialogOpen(false);
    }
  };

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const hasSelectedRows = selectedRows.length > 0;

  // Always render search and filters, even when loading

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <div className="space-y-2">
          <p className="text-lg font-medium">
            Unable to load service categories
          </p>
          <p className="text-sm text-muted-foreground max-w-md">{error}</p>
        </div>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            Try Again
          </Button>
        )}
      </div>
    );
  }

  // Always render search and filters, even when no data
  const hasData = categories.length > 0;

  return (
    <>
      {/* Filters and Controls */}
      <div className="flex flex-col gap-4 mb-4">
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Global Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                value={localSearchTerm}
                onChange={(event) => setLocalSearchTerm(event.target.value)}
                disabled={isLoading}
                className="pl-9 pr-9"
              />
              {localSearchTerm && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setLocalSearchTerm('')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 hover:text-foreground dark:hover:bg-transparent hover:bg-transparent"
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear search</span>
                </Button>
              )}
            </div>
          </div>

          {/* Column Visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuItem
                      key={column.id}
                      className="capitalize"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <Checkbox
                        className="
                        border-foreground
                        data-[state=checked]:bg-primary
                        data-[state=checked]:[&>span>svg]:text-white
                      "
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      />

                      {column.id}
                    </DropdownMenuItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Bulk Actions */}
        {hasSelectedRows && (
          <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
            <span className="text-sm text-muted-foreground">
              {selectedRows.length} row(s) selected
            </span>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDeleteClick}
              disabled={!onBulkDelete}
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRowSelection({})}
            >
              <X className="h-4 w-4" />
              Clear Selection
            </Button>
          </div>
        )}
      </div>

      {/* Data Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-10">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading categories...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : hasData ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => {
                    const category = row.original;
                    router.push(ROUTES.SERVICE_CATEGORY_DETAILS(category._id));
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      onClick={(e) => {
                        // Prevent row click when clicking on checkboxes or action buttons
                        if (
                          cell.column.id === "select" ||
                          cell.column.id === "actions"
                        ) {
                          e.stopPropagation();
                        }
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-lg font-medium">
                      No service categories found
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {searchTerm
                        ? "Try adjusting your search or filters"
                        : "Get started by creating your first service category"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, totalItems)} of {totalItems}{" "}
            entries
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Page Size Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show:</span>
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => {
                onPageSizeChange(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1">
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the service category "
              {selectedCategory?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-primary-foreground hover:bg-destructive/90"
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

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {selectedRows.length} service categor
              {selectedRows.length === 1 ? "y" : "ies"}. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBulkDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDeleteConfirm}
              disabled={isBulkDeleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isBulkDeleting ? (
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
