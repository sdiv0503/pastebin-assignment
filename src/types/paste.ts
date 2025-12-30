export interface Paste {
  id: string;
  content: string;
  created_at: number; // Standard timestamp
  expires_at: number | null; // Absolute timestamp for when it dies (or null)
  max_views: number | null; // Max views allowed (or null)
  remaining_views: number | null; // How many views are left
}