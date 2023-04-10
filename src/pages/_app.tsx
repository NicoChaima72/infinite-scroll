import { type AppType } from "next/app";

import { api } from "y/utils/api";

import "y/styles/globals.css";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import Layout from "y/layout/Layout";

const MyApp: AppType = ({ Component, pageProps }) => {
  const router = useRouter();

  return (
    <AnimatePresence
      mode="wait"
      initial={false} 
      onExitComplete={() => window.scrollTo(0, 0)}
    >
      <Layout key={router.asPath}>
        <Component {...pageProps} />;
      </Layout>
    </AnimatePresence>
  );
};

export default api.withTRPC(MyApp);
