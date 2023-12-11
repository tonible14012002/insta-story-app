import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Layout } from "@/components/common/layout";
import AuthGuard from "@/components/auth/auth-guard";
import { AuthProvider } from "@/context/auth";
import { Header } from "@/components/common/header";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Toaster />
      <AuthProvider>
        <AuthGuard>
          <Header />
          <Component {...pageProps} />
        </AuthGuard>
      </AuthProvider>
    </Layout>
  );
}
