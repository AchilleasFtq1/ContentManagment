"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
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

// Define types for PhoneNumber and PostLog
interface PhoneNumber {
  id: string;
  phoneNumber: string;
  password: string;
  active: boolean;
  createdOn: Date;
}

interface PostLog {
  id: string;
  postId: string;
  requestIp: string | null;
  userId: string | null;
  createdAt: Date;
  status: boolean;
  failReason: string | null;
}

const PhoneNumbersPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);

  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [postLogs, setPostLogs] = useState<PostLog[]>([]);
  const [selectedPhoneId, setSelectedPhoneId] = useState<string | null>(null);

  const router = useRouter();

  // Fetch all phone numbers using tRPC
  const {
    data: phoneNumbers,
    isLoading,
    refetch,
  } = api.phoneNumber.getAllPhoneNumbers.useQuery();

  // tRPC mutations for creating and updating phone numbers
  const createPhoneNumberMutation =
    api.phoneNumber.createPhoneNumber.useMutation();
  const updatePhoneNumberActiveStatusMutation =
    api.phoneNumber.updatePhoneNumberActiveStatus.useMutation();

  // Fetch post logs by phone number ID
  const { data: postLogsData, refetch: refetchPostLogs } =
    api.posts.getPostLogHistoryByPhoneNumberId.useQuery(
      { phoneNumberId: selectedPhoneId ?? "" },
      {
        enabled: !!selectedPhoneId, // Ensure query only runs when phoneNumberId is available
      },
    );

  // Map post logs when data is fetched
  useEffect(() => {
    if (postLogsData) {
      const mappedLogs: PostLog[] = postLogsData.map((log) => ({
        id: log.id,
        postId: log.postId, // Use correct field
        requestIp: log.requestIp ?? null,
        userId: log.userId ?? null,
        createdAt: log.createdAt ? new Date(log.createdAt) : new Date(), // Handle missing or null createdAt
        status: log.status ?? false,
        failReason: log.failReason ?? null,
      }));

      setPostLogs(mappedLogs);
    }
  }, [postLogsData]);

  // Loading spinner while data is fetching
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Function to save or update a phone number
  const handleSavePhoneNumber = async () => {
    try {
      let phoneId: string | null = null;

      if (isEditMode && editId) {
        await updatePhoneNumberActiveStatusMutation.mutateAsync({
          id: editId,
          active: isActive,
        });
        phoneId = editId;
      } else {
        const newPhone = await createPhoneNumberMutation.mutateAsync({
          phoneNumber,
          password,
          active: isActive,
        });
        phoneId = newPhone.id;
      }

      closeModal(); // Close modal and reset form
      await refetch(); // Refetch the phone numbers
      router.push(`/logs?phoneNumberId=${phoneId}`); // Redirect to logs page
    } catch (error) {
      console.error("Error saving phone number:", error);
    }
  };

  // Function to edit a phone number
  const handleEditPhoneNumber = (phone: PhoneNumber) => {
    setPhoneNumber(phone.phoneNumber);
    setPassword(phone.password);
    setIsActive(phone.active);
    setEditId(phone.id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  // Function to toggle the active status of a phone number
  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      await updatePhoneNumberActiveStatusMutation.mutateAsync({
        id,
        active: !active,
      });
      await refetch(); // Refetch phone numbers after updating
    } catch (error) {
      console.error("Error updating active status:", error);
    }
  };

  // Open modal for viewing logs and fetch post logs
  const handleLogModalOpen = async (phoneId: string) => {
    setSelectedPhoneId(phoneId);
    setIsLogModalOpen(true);
    await refetchPostLogs(); // Fetch post logs
  };

  // Close modal and reset form
  const closeModal = () => {
    setIsModalOpen(false);
    setPhoneNumber("");
    setPassword("");
    setIsActive(true);
    setIsEditMode(false);
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
              {isEditMode ? "Edit Phone Number" : "Add Phone Number"}
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
                  <TableCell>
                    {new Date(number.createdOn).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={number.active}
                      onCheckedChange={() =>
                        handleToggleActive(number.id, number.active)
                      }
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
                        onClick={() => handleLogModalOpen(number.id)}
                        variant="outline"
                      >
                        Log
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal for viewing post logs */}
      <Dialog
        open={isLogModalOpen}
        onOpenChange={() => setIsLogModalOpen(false)}
      >
        <DialogContent>
          <DialogTitle>Post Log History</DialogTitle>
          <div className="max-h-[400px] space-y-4 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Post ID</TableHead>
                  <TableHead>Request IP</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Fail Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {postLogs?.map((log: PostLog) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.postId}</TableCell>
                    <TableCell>{log.requestIp ?? "N/A"}</TableCell>
                    <TableCell>{log.userId ?? "N/A"}</TableCell>
                    <TableCell>
                      {new Date(log.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{log.status ? "Success" : "Failed"}</TableCell>
                    <TableCell>{log.failReason ?? "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal for adding/editing phone number */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
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
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                {isPasswordVisible ? (
                  <EyeOffIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
            <Switch
              checked={isActive}
              onCheckedChange={(checked) => setIsActive(checked)}
            />
            <label className="ml-2">Active</label>
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
