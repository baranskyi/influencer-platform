declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

type AnalyticsEvent =
  // Landing page
  | { action: "landing_nav_click"; label: string }
  | { action: "landing_cta_click"; label: string }
  | { action: "landing_pricing_click"; label: string }
  | { action: "landing_faq_toggle"; label: string }
  // Auth
  | { action: "login_submit" }
  | { action: "login_success" }
  | { action: "login_error"; label: string }
  | { action: "signup_submit" }
  | { action: "signup_success" }
  // Navigation
  | { action: "nav_click"; label: string }
  | { action: "mobile_nav_click"; label: string }
  // Deals
  | { action: "deal_create_submit" }
  | { action: "deal_edit_submit" }
  | { action: "deal_delete" }
  | { action: "deal_status_change"; label: string }
  | { action: "deal_kanban_drag"; label: string }
  | { action: "deal_view_toggle"; label: string }
  | { action: "deal_filter_status"; label: string }
  | { action: "deal_create_invoice" }
  // Invoices
  | { action: "invoice_create_submit" }
  | { action: "invoice_download_pdf" }
  | { action: "invoice_send_email" }
  | { action: "invoice_send_reminder" }
  | { action: "invoice_mark_paid" }
  | { action: "invoice_status_change"; label: string }
  | { action: "invoice_delete" }
  // Calendar
  | { action: "calendar_event_submit" }
  | { action: "calendar_view_toggle"; label: string }
  | { action: "calendar_month_navigate"; label: string }
  | { action: "calendar_platform_filter"; label: string }
  // Clients
  | { action: "client_create_submit" }
  | { action: "client_delete" }
  // Settings
  | { action: "settings_save" }
  | { action: "settings_pipeline_reorder" }
  | { action: "settings_pipeline_toggle_status" }
  | { action: "settings_pipeline_add_status" }
  | { action: "settings_pipeline_delete_status" }
  // Onboarding
  | { action: "onboarding_step"; label: string }
  | { action: "onboarding_complete" }
  | { action: "onboarding_skip" };

export function trackEvent(event: AnalyticsEvent) {
  if (typeof window !== "undefined" && window.gtag) {
    const { action, ...params } = event;
    window.gtag("event", action, params);
  }
}
