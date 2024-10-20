"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useRouter } from "next/navigation"; // Import useRouter for redirection
import React, { useState } from "react";
import Layout from "~/components/layout";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import LoadingSpinner from "~/components/ui/loadingSpinner";
import { Switch } from "~/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { api } from "~/trpc/react";

// Updated 'PhoneNumber' interface: 'createdOn' is now a Date
interface PhoneNumber {
  id: string;
  phoneNumber: string;
  password: string;
  active: boolean;
  createdOn: Date;
}

const PhoneNumbersPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Track if edit mode is active
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Toggle password visibility
  const [isActive, setIsActive] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);

  const router = useRouter(); // Initialize router for redirection

  // Fetch all phone numbers from the API using tRPC
  const {
    data: phoneNumbers,
    isLoading,
    refetch,
  } = api.phoneNumber.getAllPhoneNumbers.useQuery();

  // tRPC mutations
  const createPhoneNumberMutation =
    api.phoneNumber.createPhoneNumber.useMutation();
  const updatePhoneNumberActiveStatusMutation =
    api.phoneNumber.updatePhoneNumberActiveStatus.useMutation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const handleSavePhoneNumber = async () => {
    try {
      let phoneId: string | null = null;

      if (isEditMode && editId) {
        await updatePhoneNumberActiveStatusMutation.mutateAsync({
          id: editId,
          active: isActive,
        });
        phoneId = editId;
        console.log(`Phone number ${editId} was successfully updated`);
      } else {
        const newPhone = await createPhoneNumberMutation.mutateAsync({
          phoneNumber,
          password,
          active: isActive,
        });
        phoneId = newPhone.id;
        console.log(`Phone number ${newPhone.id} was successfully created`);
      }

      // Reset all state when closing the modal
      setIsModalOpen(false);
      setPhoneNumber("");
      setPassword("");
      setIsActive(true);
      setIsEditMode(false); // Reset edit mode to false after saving
      setEditId(null);

      // Refetch phone numbers
      await refetch();

      // Redirect to /logs page with the phone number ID as a query parameter
      router.push(`/logs?phoneNumberId=${phoneId}`);
    } catch (error) {
      console.error("Error saving phone number:", error);
    }
  };

  const handleEditPhoneNumber = (phone: PhoneNumber) => {
    setPhoneNumber(phone.phoneNumber);
    setPassword(phone.password);
    setIsActive(phone.active); // Set active state from the selected phone number
    setEditId(phone.id);
    setIsEditMode(true); // Set edit mode to true when editing
    setIsModalOpen(true); // Open the modal for editing
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      await updatePhoneNumberActiveStatusMutation.mutateAsync({
        id,
        active: !active, // Toggle the active status
      });
      console.log(`Phone number ${id} active status changed to ${!active}`);

      // Refetch phone numbers
      await refetch();
    } catch (error) {
      console.error("Error updating active status:", error);
    }
  };

  // Function to redirect to /logs with the phone number ID as a query param
  const handleRedirectToLogs = async (phoneId: string) => {
    router.push(`/logs?phoneNumberId=${phoneId}`);
  };

  // Function to redirect to /posts with the phone number ID as a query param
  const handleRedirectToPosts = async (phoneId: string) => {
    router.push(`/posts?phoneNumberId=${phoneId}`);
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Handle modal close to reset states properly
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPhoneNumber("");
    setPassword("");
    setIsActive(true);
    setIsEditMode(false); // Reset edit mode when modal closes
    setEditId(null);
  };

  return (
    <Layout>
      <Card className="mx-auto max-w-4xl p-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Phone Numbers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex justify-end">
            <Button onClick={() => setIsModalOpen(true)} variant="default">
              {isEditMode ? "Edit Phone Number" : "Add Phone Number"}{" "}
              {/* Toggle button text */}
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Phone Number</TableHead>
                <TableHead>Phone Number UUID</TableHead>
                <TableHead>Created On</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {phoneNumbers?.map((number: PhoneNumber) => (
                <TableRow key={number.id}>
                  <TableCell>{number.phoneNumber}</TableCell>
                  <TableCell>{number.id}</TableCell>
                  <TableCell>{number.createdOn.toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Switch
                      checked={number.active}
                      onCheckedChange={() =>
                        handleToggleActive(number.id, number.active)
                      } // Fixed the event handler
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleEditPhoneNumber(number)}
                        variant="outline"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleRedirectToLogs(number.id)}
                        variant="outline"
                      >
                        Log
                      </Button>
                      <Button
                        onClick={() => handleRedirectToPosts(number.id)}
                        variant="outline"
                      >
                        Posts
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        {" "}
        {/* Use handleCloseModal to reset state */}
        <DialogContent>
          <DialogTitle>
            {isEditMode ? "Edit Phone Number" : "Add Phone Number"}
          </DialogTitle>
          <div className="space-y-4">
            <Input
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <div className="relative">
              <Input
                type={isPasswordVisible ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={togglePasswordVisibility}
              >
                {isPasswordVisible ? (
                  <EyeOffIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
            <div className="flex items-center">
              <Switch
                checked={isActive}
                onCheckedChange={(checked: boolean) => setIsActive(checked)} // This will update the isActive state in the modal
              />
              <label className="ml-2">Active</label>
            </div>
            <Button
              onClick={handleSavePhoneNumber}
              variant="default"
              className="w-full"
            >
              {isEditMode ? "Save Changes" : "Add Phone Number"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default PhoneNumbersPage;
