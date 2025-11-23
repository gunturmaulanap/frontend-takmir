

// Client-side permission checker - untuk komponen React
export function hasAnyPermission(permissions: string[]): boolean {
  // Check if we're in browser environment
  if (typeof window === "undefined") {
    return false;
  }

  try {
    // Get permissions from localStorage (sesuai yang disimpan oleh loginApi)
    const storedPermissions = localStorage.getItem("permissions");
    if (!storedPermissions) {
      return false;
    }

    const allPermissions = JSON.parse(storedPermissions);

    // Check if user has any of the required permissions
    return permissions.some(permission => allPermissions[permission]);
  } catch (error) {
    console.error("Error checking permissions:", error);
    return false;
  }
}

// Server-side permission checker - untuk API routes/middleware
export function hasAnyPermissionServer(request: Request, permissions: string[]): boolean {
  try {
    // Get permissions from cookies (server-side)
    const cookieHeader = request.headers.get("cookie");
    if (!cookieHeader) {
      return false;
    }

    const cookies = Object.fromEntries(
      cookieHeader.split(';').map(cookie => {
        const [name, value] = cookie.trim().split('=');
        return [name, decodeURIComponent(value)];
      })
    );

    const storedPermissions = cookies.permissions;
    if (!storedPermissions) {
      return false;
    }

    const allPermissions = JSON.parse(storedPermissions);

    return permissions.some(permission => allPermissions[permission]);
  } catch (error) {
    console.error("Error checking server permissions:", error);
    return false;
  }
}

// Get all current permissions
export function getCurrentPermissions(): Record<string, boolean> {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const storedPermissions = localStorage.getItem("permissions");
    return storedPermissions ? JSON.parse(storedPermissions) : {};
  } catch (error) {
    console.error("Error getting current permissions:", error);
    return {};
  }
}

// Check if user has specific role
export function hasRole(role: string): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const user = localStorage.getItem("user");
    if (!user) {
      return false;
    }

    const userData = JSON.parse(user);
    return userData.role === role;
  } catch (error) {
    console.error("Error checking role:", error);
    return false;
  }
}

// Check if user has any of the specified roles
export function hasAnyRole(roles: string[]): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const user = localStorage.getItem("user");
    if (!user) {
      return false;
    }

    const userData = JSON.parse(user);
    return roles.includes(userData.role);
  } catch (error) {
    console.error("Error checking roles:", error);
    return false;
  }
}

// Logout helper - membersihkan semua auth data
export function logout(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    localStorage.removeItem("permissions");
    localStorage.removeItem("login_time");
  } catch (error) {
    console.error("Error during logout:", error);
  }
}

// Export default untuk backward compatibility
export default hasAnyPermission;
