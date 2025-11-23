import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { EventCard } from "@/app/(dashboard)/events/components/Card";
import { Shield, AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Events",
  description: "Manage events",
};

export default function EventsPage() {
  return (
    <PermissionGuard
      permissions={["events.index"]}
      fallback={
        <div className="min-h-[600px] flex items-center justify-center">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-red-200 p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                <Shield className="w-8 h-8 text-red-600" />
              </div>x
              <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Access Denied
              </h1>
              <p className="text-gray-600 mb-4">
                You don't have permission to view events.
              </p>
              <p className="text-sm text-gray-500">
                Please contact your administrator for access.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <div className="max-w-8xl mx-auto p-8 ">
        <EventCard />
      </div>
    </PermissionGuard>
  );
}
