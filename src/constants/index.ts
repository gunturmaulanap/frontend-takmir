export const USER_ROLES = {
  SUPERADMIN: "superadmin",
  ADMIN: "admin",
  TAKMIR: "takmir",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
