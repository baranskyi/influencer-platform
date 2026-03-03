export type DealStatus =
  | "negotiation"
  | "agreed"
  | "in_progress"
  | "content_submitted"
  | "content_approved"
  | "invoiced"
  | "paid"
  | "completed"
  | "cancelled"
  | "disputed";

export type InvoiceStatus =
  | "draft"
  | "sent"
  | "viewed"
  | "paid"
  | "overdue"
  | "cancelled";

export type DealType =
  | "sponsored"
  | "affiliate"
  | "barter"
  | "ambassador"
  | "ugc";

export type Platform = "instagram" | "tiktok" | "youtube" | "multi";

export type ContentEventType =
  | "post"
  | "story"
  | "reel"
  | "video"
  | "review"
  | "deadline"
  | "payment_due";

export type ContentEventStatus =
  | "planned"
  | "in_progress"
  | "completed"
  | "missed";

export type ReminderType =
  | "payment_due"
  | "content_deadline"
  | "follow_up"
  | "custom";

export type FileType =
  | "contract"
  | "invoice"
  | "creative"
  | "brief"
  | "other";

export interface Profile {
  id: string;
  full_name: string;
  display_name: string | null;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  legal_name: string | null;
  tax_id: string | null;
  address: {
    street?: string;
    city?: string;
    postal_code?: string;
    country?: string;
  } | null;
  bank_details: {
    iban?: string;
    swift?: string;
    bank_name?: string;
  } | null;
  instagram_handle: string | null;
  tiktok_handle: string | null;
  youtube_handle: string | null;
  follower_count: number | null;
  currency: string;
  timezone: string;
  notification_preferences: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  user_id: string;
  name: string;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  website: string | null;
  category: string | null;
  notes: string | null;
  payment_rating: number | null;
  avg_payment_days: number | null;
  total_deals: number;
  total_revenue: number;
  created_at: string;
  updated_at: string;
}

export interface Deal {
  id: string;
  user_id: string;
  client_id: string | null;
  title: string;
  brand_name: string;
  platform: Platform;
  deal_type: DealType;
  amount: number | null;
  currency: string;
  payment_terms: string | null;
  status: DealStatus;
  start_date: string | null;
  end_date: string | null;
  content_deadline: string | null;
  payment_due_date: string | null;
  paid_date: string | null;
  deliverables: { type: string; count: number; specs?: string }[] | null;
  content_requirements: string | null;
  hashtags: string[] | null;
  contract_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  user_id: string;
  deal_id: string | null;
  client_id: string | null;
  invoice_number: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number | null;
  irpf_rate: number;
  irpf_amount: number;
  total: number;
  currency: string;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string | null;
  paid_date: string | null;
  reminder_sent_count: number;
  last_reminder_at: string | null;
  next_reminder_at: string | null;
  pdf_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContentEvent {
  id: string;
  user_id: string;
  deal_id: string | null;
  title: string;
  description: string | null;
  event_type: ContentEventType;
  platform: Platform | null;
  scheduled_at: string;
  completed_at: string | null;
  status: ContentEventStatus;
  source: "manual" | "deal_sync";
  created_at: string;
  updated_at: string;
}

export interface Reminder {
  id: string;
  user_id: string;
  deal_id: string | null;
  invoice_id: string | null;
  type: ReminderType;
  title: string;
  message: string | null;
  remind_at: string;
  channels: string[];
  status: "pending" | "sent" | "dismissed";
  sent_at: string | null;
  created_at: string;
}

export interface FileRecord {
  id: string;
  user_id: string;
  deal_id: string | null;
  file_name: string;
  file_type: FileType;
  mime_type: string | null;
  file_size: number | null;
  storage_path: string;
  created_at: string;
}
