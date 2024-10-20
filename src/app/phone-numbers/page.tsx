"use client";

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
  const [isEditMode, setIsEditMode] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);

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
      if (isEditMode && editId) {
        await updatePhoneNumberActiveStatusMutation.mutateAsync({
          id: editId,
          active: isActive,
        });
      } else {
        await createPhoneNumberMutation.mutateAsync({
          phoneNumber,
          password,
          active: isActive,
        });
      }
      setIsModalOpen(false);
      setPhoneNumber("");
      setPassword("");
      setIsActive(true);
      setIsEditMode(false);
      setEditId(null);
      await refetch();
    } catch (error) {
      console.error("Error saving phone number:", error);
    }
  };

  const handleEditPhoneNumber = (phone: PhoneNumber) => {
    setPhoneNumber(phone.phoneNumber);
    setPassword(phone.password);
    setIsActive(phone.active);
    setEditId(phone.id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      await updatePhoneNumberActiveStatusMutation.mutateAsync({
        id,
        active: !active,
      });
      await refetch();
    } catch (error) {
      console.error("Error updating active status:", error);
    }
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
                <TableHead>Password</TableHead>
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
                  <TableCell>{number.password}</TableCell>
                  <TableCell>{number.createdOn.toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Switch
                      checked={number.active}
                      onCheckedChange={(checked) =>
                        handleToggleActive(number.id, checked)
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
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
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
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex items-center">
              <Switch
                checked={isActive}
                onCheckedChange={(checked) => setIsActive(checked)}
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
