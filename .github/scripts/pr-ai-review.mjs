#!/usr/bin/env node
/**
 * Free PR review via Google Gemini (AI Studio free tier).
 * Requires repo secret: GEMINI_API_KEY
 * Get a key: https://aistudio.google.com/apikey
 */

const TOKEN = process.env.GITHUB_TOKEN;
const GEMINI_KEY = process.env.GEMINI_API_KEY;
const REPO = process.env.REPO;
const PR_NUMBER = process.env.PR_NUMBER;
const BASE_SHA = process.env.BASE_SHA;
const HEAD_SHA = process.env.HEAD_SHA;
const MARKER = '<!-- uno-arco-ai-review -->';
const MAX_DIFF_CHARS = 120_000;

async function gh(path, init = {}) {
  const res = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API ${res.status}: ${text}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

async function main() {
  if (!GEMINI_KEY) {
    console.log(
      'GEMINI_API_KEY secret is not set — skipping AI review. Add it at: Settings → Secrets → Actions'
    );
    return;
  }
  if (!TOKEN || !REPO || !PR_NUMBER) {
    throw new Error('Missing GITHUB_TOKEN / REPO / PR_NUMBER');
  }

  const [owner, repo] = REPO.split('/');
  const compare = await gh(
    `/repos/${owner}/${repo}/compare/${BASE_SHA}...${HEAD_SHA}`
  );
  const files = (compare.files || [])
    .filter((f) => !f.filename.includes('__snapshots__/'))
    .slice(0, 40);

  let diffText = files
    .map((f) => {
      const patch = f.patch || '(binary or too large — no patch)';
      return `### ${f.filename} (${f.status})\n\`\`\`diff\n${patch}\n\`\`\``;
    })
    .join('\n\n');

  if (diffText.length > MAX_DIFF_CHARS) {
    diffText = `${diffText.slice(0, MAX_DIFF_CHARS)}\n\n…(diff truncated)`;
  }

  if (!diffText.trim()) {
    console.log('No reviewable file patches — skip');
    return;
  }

  const prompt = `You are reviewing a pull request for Uno Arco (@uno-arco/web-vue), a community fork of Arco Design Vue.
Focus on: bugs, regressions, API/types mistakes, missing tests, and Vue/component pitfalls.
Ignore pure snapshot noise and formatting-only noise.
Reply in **简体中文**, concise markdown:
1. **总结** (2-4 bullets)
2. **风险 / 问题** (if none, say 未发现明显问题)
3. **建议** (optional, short)

PR files/diff:
${diffText}`;

  const model = 'gemini-2.0-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`;
  const aiRes = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 2048 },
    }),
  });

  if (!aiRes.ok) {
    const text = await aiRes.text();
    throw new Error(`Gemini API ${aiRes.status}: ${text}`);
  }

  const aiJson = await aiRes.json();
  const review =
    aiJson?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('')?.trim() ||
    '（模型未返回内容）';

  const body = `${MARKER}
## 🤖 AI PR Review（Gemini 免费额度）

${review}

---
<sub>Uno Arco auto review · 需 repo secret \`GEMINI_API_KEY\` · 仅供参考，不替代人工</sub>
`;

  const comments = await gh(
    `/repos/${owner}/${repo}/issues/${PR_NUMBER}/comments?per_page=100`
  );
  const existing = (comments || []).find((c) =>
    String(c.body || '').includes(MARKER)
  );

  if (existing) {
    await gh(`/repos/${owner}/${repo}/issues/comments/${existing.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ body }),
    });
    console.log(`Updated review comment ${existing.id}`);
  } else {
    await gh(`/repos/${owner}/${repo}/issues/${PR_NUMBER}/comments`, {
      method: 'POST',
      body: JSON.stringify({ body }),
    });
    console.log('Posted new review comment');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
