// Cloudflare Pages Function — Free Starter Pack email capture.
// Lives outside the Astro `src/` tree so it runs on Cloudflare Pages without
// requiring an Astro SSR adapter for the rest of the (static) site.
//
// EMAIL_MODE=preview (default, staging): validates syntax only, never
// contacts Brevo, never persists anything, and logs clearly to the
// server/function console that no email was sent. This is dev-only
// behavior and must never be described to the customer as "broken."
//
// EMAIL_MODE=brevo (production, once configured): calls the real Brevo
// double opt-in endpoint. See PART C/D of
// 27_IMPLEMENT_COMMERCE_EMAIL_AND_LINKS.md.
//
// Required production environment variables (set in Cloudflare Pages, never
// committed, never exposed via a PUBLIC_ prefix):
//   BREVO_API_KEY
//   BREVO_FREE_LIST_ID
//   BREVO_DOI_TEMPLATE_ID
//   BREVO_CONFIRM_REDIRECT_URL
//   EMAIL_MODE=brevo

interface Env {
  EMAIL_MODE?: string;
  BREVO_API_KEY?: string;
  BREVO_FREE_LIST_ID?: string;
  BREVO_DOI_TEMPLATE_ID?: string;
  BREVO_CONFIRM_REDIRECT_URL?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;

  let body: { email?: string; firstName?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'invalid_json' }), { status: 400 });
  }

  const email = (body.email || '').trim();
  if (!EMAIL_PATTERN.test(email)) {
    return new Response(JSON.stringify({ ok: false, error: 'invalid_email' }), { status: 400 });
  }

  const mode = env.EMAIL_MODE || 'preview';

  if (mode === 'preview') {
    // Dev-only console log — never shown to the customer.
    console.log(`[free-starter:preview] validated ${email}; no email sent (EMAIL_MODE=preview).`);
    return new Response(JSON.stringify({ ok: true, mode: 'preview' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // mode === 'brevo'
  if (!env.BREVO_API_KEY || !env.BREVO_FREE_LIST_ID || !env.BREVO_DOI_TEMPLATE_ID || !env.BREVO_CONFIRM_REDIRECT_URL) {
    console.error('[free-starter:brevo] missing Brevo configuration; refusing to send.');
    return new Response(JSON.stringify({ ok: false, error: 'provider_not_configured' }), { status: 500 });
  }

  try {
    // TODO(owner, production only): confirm this matches Brevo's current
    // doubleOptinConfirmation contract before go-live.
    const brevoRes = await fetch('https://api.brevo.com/v3/contacts/doubleOptinConfirmation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': env.BREVO_API_KEY
      },
      body: JSON.stringify({
        email,
        includeListIds: [Number(env.BREVO_FREE_LIST_ID)],
        templateId: Number(env.BREVO_DOI_TEMPLATE_ID),
        redirectionUrl: env.BREVO_CONFIRM_REDIRECT_URL,
        attributes: body.firstName ? { FIRSTNAME: body.firstName } : undefined
      })
    });

    if (!brevoRes.ok) {
      const errText = await brevoRes.text();
      console.error('[free-starter:brevo] provider error', brevoRes.status, errText);
      return new Response(JSON.stringify({ ok: false, error: 'provider_error' }), { status: 502 });
    }

    return new Response(JSON.stringify({ ok: true, mode: 'brevo' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('[free-starter:brevo] request failed', err);
    return new Response(JSON.stringify({ ok: false, error: 'provider_unreachable' }), { status: 502 });
  }
};
