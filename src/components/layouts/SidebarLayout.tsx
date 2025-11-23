"use client";

import React from "react";
import { FeatureNavbar } from "./FeatureNavbar";
import { FeatureFooter } from "./FeatureFooter";
import { FeatureHeader } from "./FeatureHeader";

interface SidebarLayoutProps {
  children: React.ReactNode;
  featureIcon?: React.ReactNode;
  featureName: string;
  basePath: string;

  showBreadcrumb?: boolean;
  getBreadcrumb?: (pathname: string) => string;
}

export function SidebarLayout({
  children,
  featureIcon,
  featureName,
  basePath,
  showBreadcrumb = true,
  getBreadcrumb,
}: SidebarLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <FeatureNavbar />

      {showBreadcrumb && (
        <FeatureHeader
          featureIcon={featureIcon}
          featureName={featureName}
          basePath={basePath}
          getBreadcrumb={getBreadcrumb}
        />
      )}

      <main className="flex-1 w-full">{children}</main>

      <FeatureFooter />
    </div>
  );
}
