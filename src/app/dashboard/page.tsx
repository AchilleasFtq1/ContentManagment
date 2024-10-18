import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import Layout from "../../components/layout";

const DashboardPage: React.FC = () => {
  return (
    <Layout>
      <div className="flex h-full items-center justify-center p-8">
        <Card className="w-full max-w-md text-center shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Welcome!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-lg">
              We&apos;re glad to have you here. Explore the dashboard for more
              information and features.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DashboardPage;
