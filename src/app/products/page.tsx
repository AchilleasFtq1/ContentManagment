"use client";

import { useSearchParams } from "next/navigation"; // Use for query params
import React, { useState } from "react";
import Layout from "~/components/layout";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import LoadingSpinner from "~/components/ui/loadingSpinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"; // shadcn select component
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { api } from "~/trpc/react";

// Updated 'Product' interface
interface Product {
  id: string;
  productName: string;
  createdOn: Date;
  appId: string | null;
}

const ProductsPage: React.FC = () => {
  const searchParams = useSearchParams(); // Get query parameters from URL
  const queryAppId = searchParams.get("appId"); // Extract appId if present in query params

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [productName, setProductName] = useState("");
  const [appId, setAppId] = useState<string | null>(null); // Store selected appId
  const [editId, setEditId] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Determine whether to call getProductsByAppId or getAllProducts based on the presence of appId in the URL
  const {
    data: products,
    isLoading: isProductsLoading,
    refetch,
  } = queryAppId
    ? api.product.getProductsByAppId.useQuery({ appId: queryAppId }) // If appId exists, fetch products by appId
    : api.product.getAllProducts.useQuery(); // Else fetch all products

  // Fetch all apps to display in the dropdown
  const { data: apps, isLoading: isAppsLoading } =
    api.app.getAllApps.useQuery();

  // tRPC mutations
  const createProductMutation = api.product.createProduct.useMutation();
  const updateProductMutation = api.product.updateProduct.useMutation();
  const deleteProductMutation = api.product.deleteProduct.useMutation();

  if (isProductsLoading || isAppsLoading) {
    return <LoadingSpinner />;
  }

  const handleSaveProduct = async () => {
    try {
      if (!appId) {
        console.error("App ID is required");
        return;
      }

      if (isEditMode && editId) {
        await updateProductMutation.mutateAsync({
          id: editId,
          data: { productName },
        });
        console.log(`Product ${editId} was successfully updated`);
      } else {
        const newProduct = await createProductMutation.mutateAsync({
          productName,
          appId, // Save selected appId
        });
        console.log(`Product ${newProduct.id} was successfully created`);
      }

      setIsModalOpen(false);
      setProductName("");
      setAppId(null); // Reset the selected app
      setIsEditMode(false);
      setEditId(null);
      await refetch();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleEditProduct = (product: Product) => {
    setProductName(product.productName);
    setAppId(product.appId); // Set the current appId for the product
    setEditId(product.id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = (id: string) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  const handleDeleteProduct = async () => {
    if (deleteId) {
      try {
        await deleteProductMutation.mutateAsync({ productId: deleteId });
        console.log(`Product ${deleteId} was successfully deleted`);
        await refetch();
      } catch (error) {
        console.error("Error deleting product:", error);
      } finally {
        setIsConfirmOpen(false);
        setDeleteId(null);
      }
    }
  };

  return (
    <Layout>
      <Card className="mx-auto max-w-4xl p-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex justify-end">
            <Button onClick={() => setIsModalOpen(true)} variant="default">
              {isEditMode ? "Edit Product" : "Add Product"}
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Product UUID</TableHead>
                <TableHead>Created On</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products?.map((product: Product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.productName}</TableCell>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>
                    {new Date(product.createdOn).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleEditProduct(product)}
                        variant="outline"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleConfirmDelete(product.id)}
                        variant="outline"
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Confirm Delete Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={() => setIsConfirmOpen(false)}>
        <DialogContent>
          <DialogTitle>Confirm Delete</DialogTitle>
          <div className="space-y-4">
            <p>Are you sure you want to delete this product?</p>
            <div className="flex justify-end space-x-2">
              <Button onClick={() => setIsConfirmOpen(false)} variant="outline">
                Cancel
              </Button>
              <Button onClick={handleDeleteProduct} variant="default">
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Product Dialog */}
      <Dialog open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
        <DialogContent>
          <DialogTitle>
            {isEditMode ? "Edit Product" : "Add Product"}
          </DialogTitle>
          <div className="space-y-4">
            <Input
              placeholder="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />

            {/* Dropdown to select the app using shadcn select */}
            <Select value={appId ?? ""} onValueChange={setAppId}>
              <SelectTrigger>
                <SelectValue placeholder="Select an App" />
              </SelectTrigger>
              <SelectContent>
                {apps?.map((app) => (
                  <SelectItem key={app.id} value={app.id}>
                    {app.appName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={handleSaveProduct}
              variant="default"
              className="w-full"
            >
              {isEditMode ? "Save Changes" : "Add Product"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default ProductsPage;
