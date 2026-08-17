import { format, formatDistanceToNow } from 'date-fns';

export const formatDate = (date) => {
  try {
    return format(new Date(date), 'MMM dd, yyyy');
  } catch {
    return 'Invalid date';
  }
};

export const formatRelative = (date) => {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch {
    return '';
  }
};

export const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Jewelry',
  'Documents',
  'Keys',
  'Wallet/Purse',
  'Bag/Backpack',
  'Pet',
  'Vehicle',
  'Other',
];

export const STATUS_COLORS = {
  active: 'bg-blue-100 text-blue-700',
  claimed: 'bg-yellow-100 text-yellow-700',
  resolved: 'bg-green-100 text-green-700',
  deleted: 'bg-red-100 text-red-700',
};

export const truncate = (str, n = 100) => (str?.length > n ? str.slice(0, n) + '…' : str);

export const getInitials = (name = '') =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

export const PLACEHOLDER_IMG = 'https://placehold.co/600x400/e2e8f0/94a3b8?text=No+Image';