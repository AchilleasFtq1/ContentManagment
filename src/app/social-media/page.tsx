"use client";

import { useRouter } from "next/navigation"; // Import useRouter for navigation
import React, { useState } from "react";
import Layout from "~/components/layout";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"; // Updated shadcn Dialog components
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label"; // Import Label from ShadCN
import LoadingSpinner from "~/components/ui/loadingSpinner";
import { Switch } from "~/components/ui/switch"; // For status toggle
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { api } from "~/trpc/react";

// Define the App type
interface App {
  id: string;
  appName: string;
  createdOn: Date;
  active: boolean;
}

const SocialMediaAppPage: React.FC = () => {
  const router = useRouter(); // Initialize useRouter for navigation

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [appName, setAppName] = useState("");
  const [appActive, setAppActive] = useState(false); // Track the status of the app
  const [editId, setEditId] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch all apps using tRPC
  const {
    data: apps,
    isLoading: isAppsLoading,
    refetch,
  } = api.app.getAllApps.useQuery();

  // tRPC mutations
  const createAppMutation = api.app.createApp.useMutation();
  const updateAppStatusMutation = api.app.updateAppStatus.useMutation(); // Use the new updateAppStatus route
  const deleteAppMutation = api.app.deleteApp.useMutation();
  const updateAppMutation = api.app.updateApp.useMutation();

  if (isAppsLoading) {
    return <LoadingSpinner />;
  }

  // Fixing how updateApp mutation is called
  const handleSaveApp = async () => {
    try {
      if (isEditMode && editId) {
        await updateAppMutation.mutateAsync({
          id: editId, // id is passed separately
          data: { appName, active: appActive }, // Only data fields are passed here
        });
        console.log(`App ${editId} was successfully updated`);
      } else {
        // Create a new app
        await createAppMutation.mutateAsync({ appName, active: appActive });
        console.log("App created");
      }

      // Reset the modal state after save
      setIsModalOpen(false);
      setAppName("");
      setAppActive(false);
      setIsEditMode(false);
      setEditId(null);
      await refetch();
    } catch (error) {
      console.error("Error saving app:", error);
    }
  };

  const handleEditApp = (app: App) => {
    setAppName(app.appName);
    setAppActive(app.active); // Set current app status
    setEditId(app.id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = (id: string) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  const handleDeleteApp = async () => {
    if (deleteId) {
      try {
        await deleteAppMutation.mutateAsync({ appId: deleteId });
        console.log(`App ${deleteId} was successfully deleted`);
        await refetch();
      } catch (error) {
        console.error("Error deleting app:", error);
      } finally {
        setIsConfirmOpen(false);
        setDeleteId(null);
      }
    }
  };

  // Function to navigate to the products page with appId in the URL params
  const handleProductsRedirect = (appId: string) => {
    router.push(`/products?appId=${appId}`);
  };

  // Function to handle status update using the new route
  const handleUpdateAppStatus = async (appId: string, newStatus: boolean) => {
    try {
      await updateAppStatusMutation.mutateAsync({
        appId, // ID of the app
        active: newStatus, // New status (true or false)
      });
      console.log(`App ${appId} status updated to ${newStatus}`);
      await refetch(); // Refresh the app list after update
    } catch (error) {
      console.error("Error updating app status:", error);
    }
  };

  return (
    <Layout>
      <Card className="mx-auto max-w-4xl p-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Social Media Apps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex justify-end">
            <Button onClick={() => setIsModalOpen(true)} variant="default">
              {isEditMode ? "Edit App" : "Add App"}
            </Button>
          </div>

          {/* Table for displaying apps */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>App UUID</TableHead>
                <TableHead>App Name</TableHead>
                <TableHead>Created On</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apps?.map((app: App) => (
                <TableRow key={app.id}>
                  <TableCell>{app.id}</TableCell>
                  <TableCell>{app.appName}</TableCell>
                  <TableCell>
                    {new Date(app.createdOn).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {/* Switch for app status */}
                    <Switch
                      checked={app.active}
                      onCheckedChange={
                        (checked) => handleUpdateAppStatus(app.id, checked) // Call to update status
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleEditApp(app)}
                        variant="outline"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleConfirmDelete(app.id)}
                        variant="outline"
                      >
                        Delete
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleProductsRedirect(app.id)} // Redirect to products page with appId
                      >
                        Products
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
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to delete this app?</p>
            <div className="flex justify-end space-x-2">
              <Button onClick={() => setIsConfirmOpen(false)} variant="outline">
                Cancel
              </Button>
              <Button onClick={handleDeleteApp} variant="default">
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add/Edit App Dialog */}
      <Dialog open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit App" : "Add App"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="App Name"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
            />
            <div className="flex items-center space-x-2">
              <Switch
                checked={appActive}
                onCheckedChange={(checked) => setAppActive(checked)}
              />
              <Label>Status</Label> {/* Using ShadCN Label component */}
            </div>
            <Button
              onClick={handleSaveApp}
              variant="default"
              className="w-full"
            >
              {isEditMode ? "Save Changes" : "Add App"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default SocialMediaAppPage;
