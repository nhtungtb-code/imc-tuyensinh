// Máy chủ trung gian giữ API key Anthropic cho app IMC Tuyển sinh.
// Key nằm trong secret ANTHROPIC_API_KEY của Cloudflare, không bao giờ gửi xuống trình duyệt.

const ALLOWED_MODELS = ['claude-sonnet-5-5'];
const ALLOWED_FIELDS = ['model', 'max_tokens', 'system', 'messages', 'output_config'];
const MAX_TOKENS = 12000;
const MAX_BODY_BYTES = 35 * 1024 * 1024;

export default {
  async fetch(req, env) {
    const origins = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
    const origin = req.headers.get('Origin') || '';
    const originOk = origins.includes(origin);
    const cors = {
      'Access-Control-Allow-Origin': originOk ? origin : (origins[0] || ''),
      'Access-Control-Allow-Headers': req.headers.get('Access-Control-Request-Headers') || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Max-Age': '86400',
      'Vary': 'Origin',
    };
    const fail = (status, message) =>
      new Response(JSON.stringify({ type: 'error', error: { type: 'proxy_error', message } }), {
        status,
        headers: { ...cors, 'content-type': 'application/json' },
      });

    if (!originOk) return fail(403, 'Origin not allowed');
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

    const url = new URL(req.url);
    if (url.pathname !== '/v1/messages') return fail(404, 'Not found');
    if (req.method !== 'POST') return fail(405, 'Method not allowed');

    if (env.ACCESS_CODE && req.headers.get('x-access-code') !== env.ACCESS_CODE) {
      return fail(401, 'Invalid access code');
    }

    if (env.RL) {
      const { success } = await env.RL.limit({ key: req.headers.get('CF-Connecting-IP') || 'unknown' });
      if (!success) return fail(429, 'Too many requests');
    }

    if (Number(req.headers.get('content-length') || 0) > MAX_BODY_BYTES) return fail(413, 'Request too large');

    let body;
    try { body = await req.json(); } catch { return fail(400, 'Invalid JSON'); }

    const extra = Object.keys(body).filter(k => !ALLOWED_FIELDS.includes(k));
    if (extra.length) return fail(400, 'Field not allowed: ' + extra.join(', '));
    if (!ALLOWED_MODELS.includes(body.model)) return fail(400, 'Model not allowed');
    if (!(body.max_tokens > 0 && body.max_tokens <= MAX_TOKENS)) return fail(400, 'max_tokens out of range');

    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });

    return new Response(upstream.body, {
      status: upstream.status,
      headers: { ...cors, 'content-type': upstream.headers.get('content-type') || 'application/json' },
    });
  },
};
