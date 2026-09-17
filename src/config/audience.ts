// Age / audience configuration.
//
// Per 18_AGE_AUDIENCE_AND_PROGRAM_ARCHITECTURE.md and the v10 owner audit
// (30_Staging_Website_Audit_and_Corrections.md, Priority 6): no numeric age
// range is customer-facing until pilot testing is complete and the owner
// approves it. Any internal working number lives in docs/OWNER_DECISIONS.md,
// not in code or rendered copy.

export const audience = {
  brandAudience: 'primarily children under 12',
  // Public-safe copy used across the site instead of a number.
  publicAudienceLine: 'Made for growing readers, creators and curious kids.'
};
