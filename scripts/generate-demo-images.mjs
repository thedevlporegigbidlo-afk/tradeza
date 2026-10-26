// Generates the local demo artwork used by supabase/seed/demo_data.sql.
// Run with: node scripts/generate-demo-images.mjs
import { mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const outRoot = join(process.cwd(), "public", "demo")

const businesses = [
  { slug: "sunrise-basmati-exports", initials: "SB", emoji: "🌾", hue: [96, 145], photos: ["1121 Basmati Rice", "Whole Spices"] },
  { slug: "shree-balaji-textiles", initials: "ST", emoji: "🧵", hue: [330, 275], photos: ["Cotton Fabric", "Saree Collection"] },
  { slug: "rajputana-gems", initials: "RG", emoji: "💎", hue: [210, 260], photos: ["Kundan Jewellery", "Loose Gemstones"] },
  { slug: "greenroot-organics", initials: "GO", emoji: "🌿", hue: [120, 160], photos: ["Organic Pulses", "Cold-Pressed Oils"] },
  { slug: "apex-packaging", initials: "AP", emoji: "📦", hue: [30, 12], photos: ["Corrugated Boxes", "Printed Labels"] },
  { slug: "skyline-interiors", initials: "SI", emoji: "🏠", hue: [195, 225], photos: ["Modular Kitchen", "Office Interior"] },
  { slug: "nimbus-it-labs", initials: "NI", emoji: "💻", hue: [245, 285], photos: ["Web Dashboard", "Mobile App"] },
  { slug: "shree-ram-logistics", initials: "SR", emoji: "🚚", hue: [20, 45], photos: ["Fleet Operations", "Warehouse"] },
  { slug: "global-visa-point", initials: "GV", emoji: "✈️", hue: [200, 170], photos: ["Visa Consultancy", "Travel Desk"] },
  { slug: "fortune-wealth-advisors", initials: "FW", emoji: "💰", hue: [45, 25], photos: ["Loan Advisory", "Tax Planning"] },
  { slug: "nova-machinery", initials: "NM", emoji: "⚙️", hue: [215, 190], photos: ["CNC Spares", "Industrial Tools"] },
  { slug: "heritage-events", initials: "HE", emoji: "🎉", hue: [340, 20], photos: ["Wedding Stage", "Expo Booth"] },
  { slug: "gokulpura-realty", initials: "GR", emoji: "🏢", hue: [175, 205], photos: ["Shop For Rent", "Residential Plot"] },
  { slug: "skillbridge-academy", initials: "SB", emoji: "🎓", hue: [255, 315], photos: ["Classroom Training", "Online Courses"] },
  { slug: "pixel-pulse-media", initials: "PP", emoji: "📣", hue: [300, 340], photos: ["Brand Campaign", "Social Media"] },
  { slug: "metro-fmcg", initials: "MF", emoji: "🛒", hue: [140, 100], photos: ["Distribution Network", "Retail Range"] },
  { slug: "shakti-precision", initials: "SP", emoji: "🔧", hue: [205, 235], photos: ["Precision Components", "CNC Machining"] },
  { slug: "meridian-trade-advisory", initials: "MT", emoji: "🤝", hue: [35, 55], photos: ["Market Entry", "Trade Documentation"] },
  { slug: "sahara-dates", initials: "SD", emoji: "🌴", hue: [80, 40], photos: ["Medjool Dates", "Dry Fruits"] },
]

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

function gradient(id, first) {
  const [h1, h2] = first
  return `<defs>
  <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="hsl(${h1} 48% 44%)"/>
    <stop offset="1" stop-color="hsl(${h2} 52% 26%)"/>
  </linearGradient>
</defs>`
}

function logo(business) {
  const { initials, hue, slug } = business
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400" role="img" aria-label="${escapeXml(initials)} logo">
${gradient("bg", hue)}
<rect width="400" height="400" fill="url(#bg)"/>
<circle cx="200" cy="200" r="152" fill="none" stroke="rgba(255,255,255,0.28)" stroke-width="2"/>
<circle cx="200" cy="200" r="176" fill="none" stroke="rgba(255,255,255,0.14)" stroke-width="1"/>
<text x="200" y="208" text-anchor="middle" dominant-baseline="central" font-family="Segoe UI, Arial, sans-serif" font-size="136" font-weight="700" fill="#ffffff" letter-spacing="-2">${escapeXml(initials)}</text>
<text x="200" y="300" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="22" fill="rgba(255,255,255,0.72)" letter-spacing="3">TRADEZA DEMO</text>
<!-- ${escapeXml(slug)} -->
</svg>
`
}

function photo(business, index, label) {
  const { emoji, hue, slug } = business
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900" role="img" aria-label="${escapeXml(label)}">
${gradient("bg", hue)}
<rect width="1200" height="900" fill="url(#bg)"/>
<circle cx="1040" cy="120" r="260" fill="rgba(255,255,255,0.08)"/>
<circle cx="120" cy="820" r="220" fill="rgba(0,0,0,0.10)"/>
<circle cx="600" cy="370" r="190" fill="rgba(255,255,255,0.12)"/>
<text x="600" y="420" text-anchor="middle" dominant-baseline="central" font-family="Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji, sans-serif" font-size="210">${emoji}</text>
<text x="600" y="670" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="60" font-weight="600" fill="#ffffff">${escapeXml(label)}</text>
<text x="600" y="740" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="26" fill="rgba(255,255,255,0.7)" letter-spacing="2">SAMPLE PHOTO · ${escapeXml(slug.toUpperCase())} · ${index}</text>
</svg>
`
}

mkdirSync(join(outRoot, "logos"), { recursive: true })
mkdirSync(join(outRoot, "photos"), { recursive: true })

for (const business of businesses) {
  writeFileSync(join(outRoot, "logos", `${business.slug}.svg`), logo(business))
  business.photos.forEach((label, index) => {
    writeFileSync(
      join(outRoot, "photos", `${business.slug}-${index + 1}.svg`),
      photo(business, index + 1, label)
    )
  })
}

console.log(`Generated ${businesses.length} logos and ${businesses.length * 2} photos in public/demo`)
