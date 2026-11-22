export const Role = {
  SUPER_ADMIN: "SUPER_ADMIN",
  CENTRE_OWNER: "CENTRE_OWNER",
  CENTRE_MANAGER: "CENTRE_MANAGER",
  ACCOUNTANT: "ACCOUNTANT",
  TEACHER: "TEACHER",
  STUDENT: "STUDENT",
  GUARDIAN: "GUARDIAN",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const CentreStatus = {
  PENDING_VERIFICATION: "PENDING_VERIFICATION",
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
  INACTIVE: "INACTIVE",
} as const;

export type CentreStatus = (typeof CentreStatus)[keyof typeof CentreStatus];

export const SubscriptionTier = {
  STARTER: "STARTER",
  STANDARD: "STANDARD",
  PREMIUM: "PREMIUM",
  ENTERPRISE: "ENTERPRISE",
} as const;

export type SubscriptionTier = (typeof SubscriptionTier)[keyof typeof SubscriptionTier];

export const SubscriptionStatus = {
  TRIAL: "TRIAL",
  ACTIVE: "ACTIVE",
  PAST_DUE: "PAST_DUE",
  CANCELED: "CANCELED",
  EXPIRED: "EXPIRED",
} as const;

export type SubscriptionStatus = (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus];

export const AttendanceStatus = {
  PRESENT: "PRESENT",
  ABSENT: "ABSENT",
  LATE: "LATE",
  EXCUSED: "EXCUSED",
} as const;

export type AttendanceStatus = (typeof AttendanceStatus)[keyof typeof AttendanceStatus];

export const InvoiceStatus = {
  DRAFT: "DRAFT",
  UNPAID: "UNPAID",
  PARTIALLY_PAID: "PARTIALLY_PAID",
  PAID: "PAID",
  VOID: "VOID",
} as const;

export type InvoiceStatus = (typeof InvoiceStatus)[keyof typeof InvoiceStatus];

export const PaymentMethod = {
  CASH: "CASH",
  BANK_TRANSFER: "BANK_TRANSFER",
  POS: "POS",
  ONLINE_PAYSTACK: "ONLINE_PAYSTACK",
  SCHOLARSHIP_WAIVER: "SCHOLARSHIP_WAIVER",
} as const;

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export const TargetExam = {
  JAMB_UTME: "JAMB_UTME",
  WAEC_SSCE: "WAEC_SSCE",
  NECO_SSCE: "NECO_SSCE",
  POST_UTME: "POST_UTME",
  GCE: "GCE",
  REMEDIAL: "REMEDIAL",
  OTHER: "OTHER",
} as const;

export type TargetExam = (typeof TargetExam)[keyof typeof TargetExam];
