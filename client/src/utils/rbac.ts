export const Roles = {
  GUEST: 'GUEST',
  CLUB_MEMBER: 'CLUB_MEMBER',
  FACULTY_COORDINATOR: 'FACULTY_COORDINATOR',
  STUDENT_COORDINATOR: 'STUDENT_COORDINATOR',
  TECH_COORDINATOR: 'TECH_COORDINATOR',
  CONTENT_COORDINATOR: 'CONTENT_COORDINATOR',
  SOCIAL_MEDIA_COORDINATOR: 'SOCIAL_MEDIA_COORDINATOR',
} as const;

export type RoleType = keyof typeof Roles;

// Define which roles can access which nav items
export const RolePermissions: Record<string, string[]> = {
  '/dashboard': [
    Roles.GUEST,
    Roles.CLUB_MEMBER,
    Roles.FACULTY_COORDINATOR,
    Roles.STUDENT_COORDINATOR,
    Roles.TECH_COORDINATOR,
    Roles.CONTENT_COORDINATOR,
    Roles.SOCIAL_MEDIA_COORDINATOR,
  ],
  '/dashboard/events': [
    Roles.CLUB_MEMBER,
    Roles.FACULTY_COORDINATOR,
    Roles.STUDENT_COORDINATOR,
    Roles.TECH_COORDINATOR,
  ],
  '/dashboard/teams': [
    Roles.CLUB_MEMBER,
    Roles.TECH_COORDINATOR,
    Roles.FACULTY_COORDINATOR,
  ],
  '/dashboard/attendance': [
    Roles.CLUB_MEMBER,
    Roles.FACULTY_COORDINATOR,
    Roles.TECH_COORDINATOR,
  ],
  '/dashboard/certificates': [
    Roles.CLUB_MEMBER,
    Roles.FACULTY_COORDINATOR,
    Roles.TECH_COORDINATOR,
  ],
  '/dashboard/rewards': [
    Roles.CLUB_MEMBER,
  ],
  '/dashboard/approvals': [
    Roles.FACULTY_COORDINATOR,
    Roles.STUDENT_COORDINATOR,
    Roles.CONTENT_COORDINATOR,
  ],
  '/dashboard/notifications': [
    Roles.GUEST,
    Roles.CLUB_MEMBER,
    Roles.FACULTY_COORDINATOR,
    Roles.STUDENT_COORDINATOR,
    Roles.TECH_COORDINATOR,
    Roles.CONTENT_COORDINATOR,
    Roles.SOCIAL_MEDIA_COORDINATOR,
  ],
  '/dashboard/users': [
    Roles.FACULTY_COORDINATOR,
  ],
  '/dashboard/analytics': [
    Roles.FACULTY_COORDINATOR,
    Roles.STUDENT_COORDINATOR,
  ],
  '/dashboard/settings': [
    Roles.FACULTY_COORDINATOR,
  ],
};

export const hasPermission = (userRole: string | undefined, path: string): boolean => {
  if (!userRole) return false;
  if (!RolePermissions[path]) return true; // If path is not defined in permissions, allow
  return RolePermissions[path].includes(userRole);
};
