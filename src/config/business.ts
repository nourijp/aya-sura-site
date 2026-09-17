// Central business/launch-state config — v10 corrections.
// This file is the single source of truth for what state the storefront is
// in. Customer-facing copy must always be derived from these values rather
// than hardcoded assumptions scattered across pages. Unresolved/internal
// decisions belong in docs/OWNER_DECISIONS.md, never in rendered UI.

export type LaunchState = 'prelaunch' | 'founding_open' | 'founding_closed' | 'evergreen';
export type CheckoutMode = 'preview' | 'woocommerce';
export type EmailMode = 'preview' | 'brevo';
// FORM_MODE covers every local form (Free Starter Pack, Contact, Parent
// feedback): 'preview' validates fields client-side, shows a realistic
// success/check-email state, never claims real delivery, and only logs the
// payload server-side. 'live' wires the form to its real provider endpoint.
// Today every form on this site is preview-only by construction (no backend
// beyond functions/api/free-starter.ts), so this mirrors emailMode until a
// real Contact/feedback backend exists.
export type FormMode = 'preview' | 'live';

export const business = {
  launchState: 'founding_open' as LaunchState,

  // Aya & Sura Adventure Club — Founding Season offer
  foundingPrice: 24.99,
  foundingMonths: 3,
  foundingDeliveryDelayDays: 14,
  foundingRecurring: false,

  // No public numeric age until pilot testing + owner approval.
  publicAdventureAge: null as string | null,

  // Physical/printed Club option — do not render ANY physical copy until true.
  physicalClubEnabled: false,

  // Checkout adapter
  checkoutMode: (import.meta.env.PUBLIC_CHECKOUT_MODE as CheckoutMode) || 'preview',
  foundingCheckoutUrl: import.meta.env.PUBLIC_FOUNDING_CHECKOUT_URL || '',

  // Book launch state
  bookStatus: 'development' as 'development' | 'pod-live' | 'crowdfunding',

  // Only render testimonials/parent-proof once real, approved quotes exist.
  socialProofEnabled: false,

  // Email capture mode for the Free Starter Pack (see functions/api/free-starter.ts)
  emailMode: (import.meta.env.EMAIL_MODE as EmailMode) || 'preview',

  // Form-submission mode shared by Free Starter Pack, Contact and Parent
  // feedback. No live backend exists yet for Contact/feedback, so this is
  // 'preview' until real endpoints are wired up (see docs/OWNER_DECISIONS.md).
  formMode: (import.meta.env.FORM_MODE as FormMode) || 'preview'
};

/**
 * Resolve where the "Join the Founding Season" CTA should send a customer.
 * - preview: staging checkout summary page, no payment collected.
 * - woocommerce: real direct-to-checkout WooCommerce URL from config/env.
 */
export function getFoundingCheckoutUrl(): string {
  if (business.checkoutMode === 'woocommerce') {
    if (!business.foundingCheckoutUrl || !business.foundingCheckoutUrl.startsWith('https://')) {
      // Never silently fall through to a dead link in a live checkout mode.
      // Falling back to the staging preview keeps the button functional
      // until the owner supplies the real WooCommerce checkout URL.
      return '/checkout-preview/';
    }
    return business.foundingCheckoutUrl;
  }
  return '/checkout-preview/';
}
