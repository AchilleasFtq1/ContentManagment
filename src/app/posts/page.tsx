"use client";

import React, { useState } from "react";
import Layout from "~/components/layout";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import LoadingSpinner from "~/components/ui/loadingSpinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { api } from "~/trpc/react";

// Post interface
interface Post {
  id: string;
  phoneNumber: string;
  socialPlatform: string;
  title: string;
  type: string; // Type can be Image, Video, URL, Text
  createdOn: Date;
  contentUuid: string;
  status: "Success" | "Failed"; // Either Success or Failed
  failReason?: string; // Optional field for failed posts
}

const PostsPage: React.FC = () => {
  // Fetch posts data from tRPC
  const { data: rawPosts, isLoading } = api.posts.getAllPosts.useQuery();

  const [sortAsc, setSortAsc] = useState(true);

  // Transform the raw data to match the Post interface
  const posts: Post[] | undefined = rawPosts?.map((post) => ({
    id: post.id,
    phoneNumber: post.phoneNumberId, // Adjust this if needed
    socialPlatform: post.appId ?? "Unknown", // Adjust the logic to derive the platform
    title: post.contentId, // Adjust the logic if necessary
    type: post.type || "Unknown", // Add type property based on your API
    createdOn: post.createdOn,
    contentUuid: post.contentId, // Assuming contentId is your contentUuid
    status: post.status ? "Success" : "Failed", // Map the boolean status to "Success" or "Failed"
    failReason: post.failReason ?? "N/A", // Use nullish coalescing operator
  }));

  const handleSort = () => {
    setSortAsc(!sortAsc);
  };

  const sortedPosts = posts?.sort((a, b) =>
    sortAsc
      ? new Date(a.createdOn).getTime() - new Date(b.createdOn).getTime()
      : new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime(),
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Layout>
      <Card className="mx-auto max-w-6xl p-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Table for displaying posts */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Phone Number</TableHead>
                <TableHead>Social Platform</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>
                  <div className="flex items-center">
                    Created On
                    <Button
                      variant="ghost"
                      className="ml-2"
                      onClick={handleSort}
                    >
                      {sortAsc ? "▲" : "▼"}
                    </Button>
                  </div>
                </TableHead>
                <TableHead>Content UUID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Fail Reason</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPosts?.map((post: Post) => (
                <TableRow key={post.id}>
                  <TableCell>{post.phoneNumber}</TableCell>
                  <TableCell>{post.socialPlatform}</TableCell>
                  <TableCell>{post.title}</TableCell>
                  <TableCell>{post.type}</TableCell>
                  <TableCell>
                    {new Date(post.createdOn).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{post.contentUuid}</TableCell>
                  <TableCell>{post.status}</TableCell>
                  <TableCell>{post.failReason}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      onClick={() => console.log(`Viewing post ${post.id}`)}
                    >
                      View
                    </Button>
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

export default PostsPage;
