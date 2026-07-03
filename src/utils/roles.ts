export enum UserRole {
  FAN = 'fan',
  CREATOR = 'creator',
  ADMIN = 'admin',
}

export const hasRole = (userRole: string, requiredRole: UserRole): boolean => {
  return userRole === requiredRole;
};

export const hasAnyRole = (userRole: string, requiredRoles: UserRole[]): boolean => {
  return requiredRoles.includes(userRole as UserRole);
};

export const isAdmin = (userRole: string): boolean => {
  return hasRole(userRole, UserRole.ADMIN);
};

export const isCreator = (userRole: string): boolean => {
  return hasRole(userRole, UserRole.CREATOR);
};

export const isFan = (userRole: string): boolean => {
  return hasRole(userRole, UserRole.FAN);
};
