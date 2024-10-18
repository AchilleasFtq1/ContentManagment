"use client";

import { signOut, useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { DismissableAlert } from "../components/ui/alert";
import { useMessage } from "../context/MessageContext";
import Header from "./header";

const Spinner: React.FC = () => (
  <div
    style={{
      border: "4px solid rgba(0, 0, 0, 0.1)",
      borderTop: "4px solid #09f",
      borderRadius: "50%",
      width: "40px",
      height: "40px",
      animation: "spin 1s linear infinite",
    }}
  ></div>
);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { status } = useSession();
  const { message } = useMessage();

  useEffect(() => {
    if (status === "unauthenticated") {
      // Redirect without full refresh
      void signOut({ redirect: false, callbackUrl: "/login" });
    }
  }, [status]);

  useEffect(() => {
    const styleSheet = document.styleSheets[0];
    if (styleSheet) {
      const keyframes = `@keyframes spin {
        to { transform: rotate(360deg); }
      }`;
      styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
    }
  }, []);

  if (status === "loading") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <Header />
      <br />
      {message && (
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <DismissableAlert
                variant={message.type === "error" ? "destructive" : undefined}
                className="mb-4"
              >
                {message.text}
              </DismissableAlert>
            </div>
          </div>
        </div>
      )}
      <main>{children}</main>
    </>
  );
};

export default Layout;
