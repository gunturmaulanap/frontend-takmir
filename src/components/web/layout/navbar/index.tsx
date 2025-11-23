import { MosqueIcon } from "@/components/icons/MosqueIcon";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { FaMosque } from "react-icons/fa";

export const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <MosqueIcon width={40} height={40} className="text-emerald-600" />
            <span className="text-xl font-semibold text-gray-900">
              Mosque Manager
            </span>
          </Link>
          <Link href="/auth/login">
            <Button className="">Login</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};
