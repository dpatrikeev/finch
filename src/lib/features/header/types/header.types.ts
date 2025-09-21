import type { UserRole } from '$lib/utils/user';

export interface HeaderProps {
  role: UserRole;
  newHomeworkCount?: number;
}

export interface NavigationItem {
  href: string;
  label: string;
  icon: string;
  showBadge?: boolean;
  badgeCount?: number;
}

export interface MobileMenuProps {
  role: UserRole;
  newHomeworkCount?: number;
  isOpen: boolean;
  onClose: () => void;
}

export interface DesktopMenuProps {
  role: UserRole;
  newHomeworkCount?: number;
}
