export type UserRole = 'requester' | 'staff' | 'manager';

export const getHomeRouteForRole = (role?: UserRole | string | null): string => {
  switch (role) {
    case 'requester':
      return '/my-requests';
    case 'staff':
      return '/staff/tickets';
    case 'manager':
      return '/manager/queue';
    default:
      return '/login';
  }
};
