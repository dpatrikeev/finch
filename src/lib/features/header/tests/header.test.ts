import { describe, it, expect } from 'vitest';
import {
  getNavigationItems,
  shouldShowBadge,
  formatBadgeCount,
} from '../utils/header.utils';

describe('header-utils', () => {
  describe('getNavigationItems', () => {
    it('should return teacher navigation items for teacher role', () => {
      const items = getNavigationItems('teacher', 0);

      expect(items).toHaveLength(1);
      expect(items[0]).toEqual({
        href: '/students',
        label: 'Мои студенты',
        icon: 'Users',
      });
    });

    it('should return student navigation items for student role', () => {
      const items = getNavigationItems('student', 5);

      expect(items).toHaveLength(1);
      expect(items[0]).toEqual({
        href: '/homework',
        label: 'Моя домашка',
        icon: 'BookOpen',
        showBadge: true,
        badgeCount: 5,
      });
    });

    it('should not show badge when newHomeworkCount is 0', () => {
      const items = getNavigationItems('student', 0);

      expect(items[0].showBadge).toBe(false);
      expect(items[0].badgeCount).toBe(0);
    });
  });

  describe('shouldShowBadge', () => {
    it('should return true when count is greater than 0', () => {
      expect(shouldShowBadge(1)).toBe(true);
      expect(shouldShowBadge(5)).toBe(true);
      expect(shouldShowBadge(100)).toBe(true);
    });

    it('should return false when count is 0 or negative', () => {
      expect(shouldShowBadge(0)).toBe(false);
      expect(shouldShowBadge(-1)).toBe(false);
    });
  });

  describe('formatBadgeCount', () => {
    it('should return count as string for numbers <= 99', () => {
      expect(formatBadgeCount(0)).toBe('0');
      expect(formatBadgeCount(1)).toBe('1');
      expect(formatBadgeCount(99)).toBe('99');
    });

    it('should return "99+" for numbers > 99', () => {
      expect(formatBadgeCount(100)).toBe('99+');
      expect(formatBadgeCount(999)).toBe('99+');
    });
  });
});
