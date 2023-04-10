import Link from "next/link";
import { motion } from "framer-motion";

type Props = {
  children: React.ReactNode;
};
export default function Layout({ children }: Props) {
  return (
    <>
      <div className="container mx-auto flex border-b py-3">
        <h3 className="text-lg font-semibold">Infinite scroll</h3>
        <div className="ml-auto flex gap-4">
          <Link href={"/"}>Example</Link>
          <Link href={"/inverse"}>Inverse</Link>
          <Link href={"/database"}>Database 1</Link>
          <Link href={"/database-2"}>Database 2</Link>
          <Link href={"/database-3"}>Database 3</Link>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          // type: "spring",
          // stiffness: 260,
          // damping: 20,
          duration: ".05",
        }}
      >
        {children}
      </motion.div>
    </>
  );
}
