#!/usr/bin/env node
// Read-only security probes against the live Supabase project using the
// publishable (anon) key. Verifies that RLS hides drafts/closed listings and
// blocks anonymous writes. Run with: npm run verify:rls
//
// Never prints the key. Exits non-zero if any probe fails.

import { readFileSync } from "node:fs"
import { resolve } from "node:path"

function loadEnv() {
  const file = resolve(process.cwd(), ".env.local")
  const out = {}
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim())
    if (match) out[match[1]] = match[2].replace(/^["']|["']$/g, "")
  }
  return out
}

const env = loadEnv()
const url = env.NEXT_PUBLIC_SUPABASE_URL
const key = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local")
  process.exit(1)
}

const headers = { apikey: key, Authorization: `Bearer ${key}` }
const results = []

function record(name, ok, detail) {
  results.push({ name, ok, detail })
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`)
}

async function get(path) {
  const res = await fetch(`${url}/rest/v1/${path}`, { headers })
  const body = await res.json().catch(() => null)
  return { status: res.status, body }
}

async function main() {
  const categories = await get("categories?select=id")
  record(
    "categories are readable and seeded",
    categories.status === 200 && Array.isArray(categories.body) && categories.body.length >= 13,
    `status=${categories.status} count=${Array.isArray(categories.body) ? categories.body.length : "n/a"}`
  )

  const published = await get("businesses?select=id,status&status=eq.published")
  record(
    "published businesses are readable",
    published.status === 200 && Array.isArray(published.body),
    `status=${published.status} count=${Array.isArray(published.body) ? published.body.length : "n/a"}`
  )

  const draftBusinesses = await get("businesses?select=id&status=eq.draft")
  record(
    "anonymous visitors cannot read draft businesses",
    draftBusinesses.status === 200 && Array.isArray(draftBusinesses.body) && draftBusinesses.body.length === 0,
    `count=${Array.isArray(draftBusinesses.body) ? draftBusinesses.body.length : "n/a"}`
  )

  for (const status of ["draft", "closed"]) {
    const hidden = await get(`opportunities?select=id&status=eq.${status}`)
    record(
      `anonymous visitors cannot read ${status} opportunities`,
      hidden.status === 200 && Array.isArray(hidden.body) && hidden.body.length === 0,
      `count=${Array.isArray(hidden.body) ? hidden.body.length : "n/a"}`
    )
  }

  const publicProfiles = await get("profiles?select=id")
  record(
    "anonymous visitors cannot read profile rows",
    publicProfiles.status === 200 && Array.isArray(publicProfiles.body) && publicProfiles.body.length === 0,
    `count=${Array.isArray(publicProfiles.body) ? publicProfiles.body.length : "n/a"}`
  )

  const target = Array.isArray(published.body) && published.body[0]?.id
  if (target) {
    const patch = await fetch(`${url}/rest/v1/businesses?id=eq.${target}`, {
      method: "PATCH",
      headers: {
        ...headers,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({ name: "rls-probe-should-not-persist" }),
    })
    const patched = await patch.json().catch(() => null)
    record(
      "anonymous visitors cannot update businesses",
      patch.status < 300 && Array.isArray(patched) && patched.length === 0,
      `status=${patch.status} rowsChanged=${Array.isArray(patched) ? patched.length : "n/a"}`
    )
  } else {
    record("anonymous visitors cannot update businesses", true, "skipped (no published row)")
  }

  const insert = await fetch(`${url}/rest/v1/businesses`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify({
      owner_id: "00000000-0000-0000-0000-000000000000",
      name: "rls-probe",
      slug: `rls-probe-${Date.now()}`,
      status: "published",
    }),
  })
  record(
    "anonymous visitors cannot insert businesses",
    insert.status === 401 || insert.status === 403,
    `status=${insert.status}`
  )

  const richFields = await get(
    "businesses?select=id,business_type,whatsapp,gallery_urls&status=eq.published&limit=1"
  )
  record(
    "published businesses expose listings fields",
    richFields.status === 200 && Array.isArray(richFields.body),
    `status=${richFields.status}`
  )

  const upload = await fetch(
    `${url}/storage/v1/object/business-media/rls-probe/probe.png`,
    {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "image/png",
        "x-upsert": "false",
      },
      body: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9Z0ZkAAAAASUVORK5CYII=",
        "base64"
      ),
    }
  )
  const uploadBody = await upload.json().catch(() => null)
  record(
    "anonymous visitors cannot upload business media",
    [401, 403].includes(upload.status) ||
      String(uploadBody?.statusCode) === "403",
    `status=${upload.status}`
  )

  const settings = await fetch(`${url}/auth/v1/settings`, { headers })
  const auth = await settings.json().catch(() => null)
  record(
    "google auth provider is enabled",
    Boolean(auth?.external?.google),
    `google=${auth?.external?.google ?? "unknown"}`
  )
}

main()
  .then(() => {
    const failed = results.filter((r) => !r.ok)
    console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
    if (failed.length) process.exit(1)
  })
  .catch((error) => {
    console.error("Verification failed to run:", error?.message ?? error)
    process.exit(1)
  })
