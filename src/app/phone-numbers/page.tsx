"use client";
import React, { useState } from "react";
import Layout from "~/components/layout";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

const PhoneNumbersPage: React.FC = () => {
  const [phoneNumbers, setPhoneNumbers] = useState([
    {
      phoneNumber: "1-333-222-4444",
      uuid: "123e4567-e89b-12d3-a456-426614174000",
      password: "********",
      createdOn: "10/17/2024",
    },
  ]);

  const handleAddPhoneNumber = () => {
    // Function to handle adding a new phone number
    const newPhoneNumber = {
      phoneNumber: "New-Phone-Number",
      uuid: "Generated-UUID",
      password: "********",
      createdOn: new Date().toLocaleDateString(),
    };

    setPhoneNumbers([...phoneNumbers, newPhoneNumber]);
  };

  const handlePostsClick = (phoneNumber: string) => {
    alert(`Posts for phone number: ${phoneNumber}`);
  };

  const handleLogClick = (phoneNumber: string) => {
    alert(`Log for phone number: ${phoneNumber}`);
  };

  return (
    <Layout>
      <Card className="mx-auto max-w-4xl p-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Phone Numbers</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Add Phone Number Button */}
          <div className="mb-4 flex justify-end">
            <Button onClick={handleAddPhoneNumber} variant="default">
              Add Phone Number
            </Button>
          </div>

          {/* Phone Number Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Phone Number</TableHead>
                <TableHead>Phone Number UUID</TableHead>
                <TableHead>Password</TableHead>
                <TableHead>Created On</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {phoneNumbers.map((number, index) => (
                <TableRow key={index}>
                  <TableCell>{number.phoneNumber}</TableCell>
                  <TableCell>{number.uuid}</TableCell>
                  <TableCell>{number.password}</TableCell>
                  <TableCell>{number.createdOn}</TableCell>
                  <TableCell>
                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handlePostsClick(number.phoneNumber)}
                        variant="outline"
                      >
                        Posts
                      </Button>
                      <Button
                        onClick={() => handleLogClick(number.phoneNumber)}
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
    </Layout>
  );
};

export default PhoneNumbersPage;
