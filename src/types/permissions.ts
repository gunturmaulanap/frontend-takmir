// // Permission types based on Laravel Spatie Permissions
// export type Permission = string;

// // User structure from Laravel Spatie
// export interface User {
//   id: number;
//   name: string;
//   email: string;
//   permissions: Permission[]; // Direct permissions
//   roles: UserRole[]; // User roles
// }

// // Role structure from Laravel Spatie
// export interface UserRole {
//   id: number;
//   name: "superadmin" | "admin" | "takmir";
//   permissions: Permission[]; // Permissions assigned to this role
// }

// // Available permissions (sesuai dengan backend)
// export const PERMISSIONS = {
//   // Categories
//   CATEGORIES_INDEX: "categories.index",
//   CATEGORIES_CREATE: "categories.create",
//   CATEGORIES_EDIT: "categories.edit",
//   CATEGORIES_DELETE: "categories.delete",

//   // Transaksi Keuangan
//   TRANSAKSI_INDEX: "transaksi-keuangan.index",
//   TRANSAKSI_CREATE: "transaksi-keuangan.create",
//   TRANSAKSI_EDIT: "transaksi-keuangan.edit",
//   TRANSAKSI_DELETE: "transaksi-keuangan.delete",

//   // Jadwal Khutbah
//   JADWAL_PETUGAS_INDEX: "jadwal-petugas.index",
//   JADWAL_PETUGAS_CREATE: "jadwal-petugas.create",
//   JADWAL_PETUGAS_EDIT: "jadwal-petugas.edit",
//   JADWAL_PETUGAS_DELETE: "jadwal-petugas.delete",

//   // Takmirs
//   TAKMIRS_INDEX: "takmirs.index",
//   TAKMIRS_CREATE: "takmirs.create",
//   TAKMIRS_EDIT: "takmirs.edit",
//   TAKMIRS_DELETE: "takmirs.delete",

//   // Muadzins
//   MUADZINS_INDEX: "muadzins.index",
//   MUADZINS_CREATE: "muadzins.create",
//   MUADZINS_EDIT: "muadzins.edit",
//   MUADZINS_DELETE: "muadzins.delete",

//   // Imams
//   IMAMS_INDEX: "imams.index",
//   IMAMS_CREATE: "imams.create",
//   IMAMS_EDIT: "imams.edit",
//   IMAMS_DELETE: "imams.delete",

//   // Khatibs
//   KHATIBS_INDEX: "khatibs.index",
//   KHATIBS_CREATE: "khatibs.create",
//   KHATIBS_EDIT: "khatibs.edit",
//   KHATIBS_DELETE: "khatibs.delete",

//   // Events
//   EVENTS_INDEX: "events.index",
//   EVENTS_CREATE: "events.create",
//   EVENTS_EDIT: "events.edit",
//   EVENTS_DELETE: "events.delete",

//   // Jamaahs
//   JAMAAHS_INDEX: "jamaahs.index",
//   JAMAAHS_CREATE: "jamaahs.create",
//   JAMAAHS_EDIT: "jamaahs.edit",
//   JAMAAHS_DELETE: "jamaahs.delete",

//   // Event Views
//   EVENT_VIEWS_INDEX: "event_views.index",
//   EVENT_VIEWS_CREATE: "event_views.create",
//   EVENT_VIEWS_DELETE: "event_views.delete",
//   EVENT_VIEWS_EDIT: "event_views.edit",

//   // Asatidzs
//   ASATIDZS_INDEX: "asatidzs.index",
//   ASATIDZS_CREATE: "asatidzs.create",
//   ASATIDZS_EDIT: "asatidzs.edit",
//   ASATIDZS_DELETE: "asatidzs.delete",

//   // Aktivitas Jamaahs
//   AKTIVITAS_JAMAAHS_INDEX: "aktivitas_jamaahs.index",
//   AKTIVITAS_JAMAAHS_CREATE: "aktivitas_jamaahs.create",
//   AKTIVITAS_JAMAAHS_EDIT: "aktivitas_jamaahs.edit",
//   AKTIVITAS_JAMAAHS_DELETE: "aktivitas_jamaahs.delete",
// } as const;

// // Resource types for canCreate/canEdit/canDelete/canIndex methods
// export const RESOURCES = {
//   CATEGORIES: "CATEGORIES",
//   TRANSAKSI_KEUANGAN: "TRANSAKSI_KEUANGAN",
//   JADWAL_KHUTBAH: "JADWAL_KHUTBAH",
//   TAKMIRS: "TAKMIRS",
//   MUADZINS: "MUADZINS",
//   IMAMS: "IMAMS",
//   KHATIBS: "KHATIBS",
//   EVENTS: "EVENTS",
//   JAMAAHS: "JAMAAHS",
//   EVENT_VIEWS: "EVENT_VIEWS",
//   ASATIDZS: "ASATIDZS",
//   AKTIVITAS_JAMAAHS: "AKTIVITAS_JAMAAHS",
// } as const;

// export type Resource = keyof typeof RESOURCES;

// // Role-based permission sets
// export const ROLE_PERMISSIONS = {
//   superadmin: [
//     // Superadmin gets all permissions
//     ...Object.values(PERMISSIONS),
//   ] as Permission[],
//   admin: [
//     PERMISSIONS.CATEGORIES_INDEX,
//     PERMISSIONS.CATEGORIES_CREATE,
//     PERMISSIONS.CATEGORIES_EDIT,
//     PERMISSIONS.CATEGORIES_DELETE,
//     PERMISSIONS.TRANSAKSI_INDEX,
//     PERMISSIONS.TRANSAKSI_CREATE,
//     PERMISSIONS.TRANSAKSI_EDIT,
//     PERMISSIONS.TRANSAKSI_DELETE,
//     PERMISSIONS.JADWAL_PETUGAS_INDEX,
//     PERMISSIONS.JADWAL_PETUGAS_CREATE,
//     PERMISSIONS.JADWAL_PETUGAS_EDIT,
//     PERMISSIONS.JADWAL_PETUGAS_DELETE,
//     PERMISSIONS.TAKMIRS_INDEX,
//     PERMISSIONS.TAKMIRS_CREATE,
//     PERMISSIONS.TAKMIRS_EDIT,
//     PERMISSIONS.TAKMIRS_DELETE,
//     PERMISSIONS.MUADZINS_INDEX,
//     PERMISSIONS.MUADZINS_CREATE,
//     PERMISSIONS.MUADZINS_EDIT,
//     PERMISSIONS.MUADZINS_DELETE,
//     PERMISSIONS.IMAMS_INDEX,
//     PERMISSIONS.IMAMS_CREATE,
//     PERMISSIONS.IMAMS_EDIT,
//     PERMISSIONS.IMAMS_DELETE,
//     PERMISSIONS.KHATIBS_INDEX,
//     PERMISSIONS.KHATIBS_CREATE,
//     PERMISSIONS.KHATIBS_EDIT,
//     PERMISSIONS.KHATIBS_DELETE,
//     PERMISSIONS.EVENTS_INDEX,
//     PERMISSIONS.EVENTS_CREATE,
//     PERMISSIONS.EVENTS_EDIT,
//     PERMISSIONS.EVENTS_DELETE,
//     PERMISSIONS.JAMAAHS_INDEX,
//     PERMISSIONS.JAMAAHS_CREATE,
//     PERMISSIONS.JAMAAHS_EDIT,
//     PERMISSIONS.JAMAAHS_DELETE,
//     PERMISSIONS.EVENT_VIEWS_INDEX,
//     PERMISSIONS.EVENT_VIEWS_CREATE,
//     PERMISSIONS.EVENT_VIEWS_DELETE,
//     PERMISSIONS.EVENT_VIEWS_EDIT,
//     PERMISSIONS.ASATIDZS_INDEX,
//     PERMISSIONS.ASATIDZS_CREATE,
//     PERMISSIONS.ASATIDZS_EDIT,
//     PERMISSIONS.ASATIDZS_DELETE,
//     PERMISSIONS.AKTIVITAS_JAMAAHS_INDEX,
//     PERMISSIONS.AKTIVITAS_JAMAAHS_CREATE,
//     PERMISSIONS.AKTIVITAS_JAMAAHS_EDIT,
//     PERMISSIONS.AKTIVITAS_JAMAAHS_DELETE,
//   ] as Permission[],
//   takmir: [
//     PERMISSIONS.CATEGORIES_INDEX,
//     PERMISSIONS.TRANSAKSI_INDEX,
//     PERMISSIONS.JADWAL_PETUGAS_INDEX,
//     PERMISSIONS.JADWAL_PETUGAS_CREATE,
//     PERMISSIONS.JADWAL_PETUGAS_EDIT,
//     PERMISSIONS.JADWAL_PETUGAS_DELETE,
//     PERMISSIONS.IMAMS_INDEX,
//     PERMISSIONS.IMAMS_CREATE,
//     PERMISSIONS.IMAMS_EDIT,
//     PERMISSIONS.IMAMS_DELETE,
//     PERMISSIONS.MUADZINS_INDEX,
//     PERMISSIONS.MUADZINS_CREATE,
//     PERMISSIONS.MUADZINS_EDIT,
//     PERMISSIONS.MUADZINS_DELETE,
//     PERMISSIONS.KHATIBS_INDEX,
//     PERMISSIONS.KHATIBS_CREATE,
//     PERMISSIONS.KHATIBS_EDIT,
//     PERMISSIONS.KHATIBS_DELETE,
//     PERMISSIONS.EVENTS_INDEX,
//     PERMISSIONS.JAMAAHS_INDEX,
//     PERMISSIONS.JAMAAHS_CREATE,
//     PERMISSIONS.JAMAAHS_EDIT,
//     PERMISSIONS.JAMAAHS_DELETE,
//     PERMISSIONS.EVENT_VIEWS_INDEX,
//   ] as Permission[],
// } as const;

// export type Role = "superadmin" | "admin" | "takmir";
