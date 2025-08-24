import type { Metadata } from "next";
import "./globals.css";
import ApolloProvider from "@/components/ApolloProvider";
import QueryProvider from "@/components/QueryProvider";

export const metadata: Metadata = {
  title: "Auth App",
  description: "Sign up and login application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <ApolloProvider>
            {children}
          </ApolloProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
