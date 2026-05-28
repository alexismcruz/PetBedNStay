/**
 * Seed script — pulls pet boarding data from OpenStreetMap Overpass API
 * Usage: npx tsx scripts/seed.ts [--state CA] [--dry-run]
 *
 * Run state by state to avoid Overpass rate limits.
 * Full US seed: run once per state with a ~5s delay between.
 */

import { PrismaClient } from "@prisma/client";
import slugify from "slugify";
import { execSync } from "child_process";
import { writeFileSync, readFileSync, unlinkSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

const db = new PrismaClient();

const US_STATES = [
  { name: "Alabama", slug: "alabama", abbr: "AL" },
  { name: "Alaska", slug: "alaska", abbr: "AK" },
  { name: "Arizona", slug: "arizona", abbr: "AZ" },
  { name: "Arkansas", slug: "arkansas", abbr: "AR" },
  { name: "California", slug: "california", abbr: "CA" },
  { name: "Colorado", slug: "colorado", abbr: "CO" },
  { name: "Connecticut", slug: "connecticut", abbr: "CT" },
  { name: "Delaware", slug: "delaware", abbr: "DE" },
  { name: "Florida", slug: "florida", abbr: "FL" },
  { name: "Georgia", slug: "georgia", abbr: "GA" },
  { name: "Hawaii", slug: "hawaii", abbr: "HI" },
  { name: "Idaho", slug: "idaho", abbr: "ID" },
  { name: "Illinois", slug: "illinois", abbr: "IL" },
  { name: "Indiana", slug: "indiana", abbr: "IN" },
  { name: "Iowa", slug: "iowa", abbr: "IA" },
  { name: "Kansas", slug: "kansas", abbr: "KS" },
  { name: "Kentucky", slug: "kentucky", abbr: "KY" },
  { name: "Louisiana", slug: "louisiana", abbr: "LA" },
  { name: "Maine", slug: "maine", abbr: "ME" },
  { name: "Maryland", slug: "maryland", abbr: "MD" },
  { name: "Massachusetts", slug: "massachusetts", abbr: "MA" },
  { name: "Michigan", slug: "michigan", abbr: "MI" },
  { name: "Minnesota", slug: "minnesota", abbr: "MN" },
  { name: "Mississippi", slug: "mississippi", abbr: "MS" },
  { name: "Missouri", slug: "missouri", abbr: "MO" },
  { name: "Montana", slug: "montana", abbr: "MT" },
  { name: "Nebraska", slug: "nebraska", abbr: "NE" },
  { name: "Nevada", slug: "nevada", abbr: "NV" },
  { name: "New Hampshire", slug: "new-hampshire", abbr: "NH" },
  { name: "New Jersey", slug: "new-jersey", abbr: "NJ" },
  { name: "New Mexico", slug: "new-mexico", abbr: "NM" },
  { name: "New York", slug: "new-york", abbr: "NY" },
  { name: "North Carolina", slug: "north-carolina", abbr: "NC" },
  { name: "North Dakota", slug: "north-dakota", abbr: "ND" },
  { name: "Ohio", slug: "ohio", abbr: "OH" },
  { name: "Oklahoma", slug: "oklahoma", abbr: "OK" },
  { name: "Oregon", slug: "oregon", abbr: "OR" },
  { name: "Pennsylvania", slug: "pennsylvania", abbr: "PA" },
  { name: "Rhode Island", slug: "rhode-island", abbr: "RI" },
  { name: "South Carolina", slug: "south-carolina", abbr: "SC" },
  { name: "South Dakota", slug: "south-dakota", abbr: "SD" },
  { name: "Tennessee", slug: "tennessee", abbr: "TN" },
  { name: "Texas", slug: "texas", abbr: "TX" },
  { name: "Utah", slug: "utah", abbr: "UT" },
  { name: "Vermont", slug: "vermont", abbr: "VT" },
  { name: "Virginia", slug: "virginia", abbr: "VA" },
  { name: "Washington", slug: "washington", abbr: "WA" },
  { name: "West Virginia", slug: "west-virginia", abbr: "WV" },
  { name: "Wisconsin", slug: "wisconsin", abbr: "WI" },
  { name: "Wyoming", slug: "wyoming", abbr: "WY" },
];

function toSlug(str: string) {
  return slugify(str, { lower: true, strict: true });
}

function buildQuery(stateAbbr: string): string {
  return `
[out:json][timeout:120];
area["ISO3166-2"="US-${stateAbbr}"][admin_level=4]->.state;
(
  node["amenity"="animal_boarding"](area.state);
  way["amenity"="animal_boarding"](area.state);
  node["amenity"="animal_shelter"]["name"](area.state);
);
out body;
>;
out skel qt;
  `.trim();
}

async function queryOverpass(query: string) {
  // Node.js fetch is blocked by Windows Firewall for Hetzner IPs.
  // Workaround: write a .ps1 script + body to temp files, execute via PowerShell -File
  // (avoids all inline-string escaping issues).
  const ts = Date.now();
  const bodyFile = join(tmpdir(), `overpass_body_${ts}.txt`);
  const outFile  = join(tmpdir(), `overpass_out_${ts}.json`);
  const psFile   = join(tmpdir(), `overpass_${ts}.ps1`);

  writeFileSync(bodyFile, `data=${encodeURIComponent(query)}`, "utf8");

  writeFileSync(psFile, `
$body = Get-Content -Path '${bodyFile.replace(/\\/g, "\\\\")}' -Raw
$headers = @{
  'User-Agent' = 'PetBedNStay/1.0 (petbednstay.com)'
}
$r = Invoke-WebRequest \`
  -Uri 'https://overpass-api.de/api/interpreter' \`
  -Method POST \`
  -Body $body \`
  -ContentType 'application/x-www-form-urlencoded' \`
  -Headers $headers \`
  -UseBasicParsing \`
  -TimeoutSec 90
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText('${outFile.replace(/\\/g, "\\\\")}', $r.Content, $utf8NoBom)
`.trimStart(), "utf8");

  try {
    execSync(`powershell -NoProfile -ExecutionPolicy Bypass -File "${psFile}"`, {
      timeout: 300_000, // 5 minutes
    });
    const content = readFileSync(outFile, "utf8").replace(/^﻿/, ""); // strip BOM if any
    return JSON.parse(content);
  } finally {
    for (const f of [bodyFile, outFile, psFile]) {
      try { unlinkSync(f); } catch {}
    }
  }
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function seedState(
  stateMeta: { name: string; slug: string; abbr: string },
  dryRun: boolean
) {
  console.log(`\n[${stateMeta.abbr}] Querying Overpass…`);

  let data: any;
  try {
    data = await queryOverpass(buildQuery(stateMeta.abbr));
  } catch (e: any) {
    console.error(`  Failed: ${e?.message ?? e}`);
    if (e?.cause) console.error(`  Cause:`, e.cause);
    return 0;
  }

  const elements = data.elements ?? [];
  console.log(`  Found ${elements.length} raw elements`);

  let inserted = 0;
  let skipped = 0;

  for (const el of elements) {
    const tags = el.tags ?? {};
    const name: string = tags.name ?? tags["name:en"];
    if (!name || name.trim().length < 2) { skipped++; continue; }

    const lat: number | undefined = el.lat ?? el.center?.lat;
    const lon: number | undefined = el.lon ?? el.center?.lon;
    const osmId = String(el.id);

    // Try multiple OSM fields for city — many nodes lack addr:city but have others
    const rawCity: string =
      tags["addr:city"] ??
      tags["is_in:city"] ??
      tags["addr:suburb"] ??
      tags["addr:county"] ??
      tags["is_in"] ??
      "";
    // is_in can be "CityName, State, USA" — take the first comma-segment
    const city = rawCity.includes(",") ? rawCity.split(",")[0].trim() : rawCity.trim();
    if (!city) { skipped++; continue; }

    const citySlug = toSlug(city);
    const address = tags["addr:street"]
      ? `${tags["addr:housenumber"] ?? ""} ${tags["addr:street"]}`.trim()
      : undefined;

    const listing = {
      osmId,
      name: name.trim(),
      slug: `${toSlug(name)}-${toSlug(city)}-${osmId.slice(-6)}`,
      type: "HOTEL" as const,
      city: city.trim(),
      state: stateMeta.name,
      stateSlug: stateMeta.slug,
      citySlug,
      address,
      zip: tags["addr:postcode"] ?? undefined,
      lat: lat ?? undefined,
      lng: lon ?? undefined,
      phone: tags.phone ?? tags["contact:phone"] ?? undefined,
      email: tags.email ?? tags["contact:email"] ?? undefined,
      website: tags.website ?? tags["contact:website"] ?? tags.url ?? undefined,
      source: "overpass",
    };

    if (dryRun) {
      console.log(`  [DRY] Would insert: ${listing.name} — ${city}`);
      inserted++;
      continue;
    }

    try {
      await db.listing.upsert({
        where: { osmId },
        create: listing,
        update: {
          name: listing.name,
          city: listing.city,
          phone: listing.phone,
          website: listing.website,
          lat: listing.lat,
          lng: listing.lng,
        },
      });
      inserted++;
    } catch (err: any) {
      // Duplicate slug — append extra chars and retry once
      if (err.code === "P2002" && err.meta?.target?.includes("slug")) {
        try {
          await db.listing.upsert({
            where: { osmId },
            create: { ...listing, slug: `${listing.slug}-${Math.random().toString(36).slice(2, 5)}` },
            update: { name: listing.name },
          });
          inserted++;
        } catch { skipped++; }
      } else {
        skipped++;
      }
    }
  }

  console.log(`  Inserted/updated: ${inserted} | Skipped: ${skipped}`);
  return inserted;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const stateArg = args.find((a) => a.startsWith("--state="))?.split("=")[1]?.toUpperCase();

  const targets = stateArg
    ? US_STATES.filter((s) => s.abbr === stateArg)
    : US_STATES;

  if (targets.length === 0) {
    console.error("No matching state found. Use --state=CA format.");
    process.exit(1);
  }

  console.log(`Starting seed | dry-run: ${dryRun} | states: ${targets.map((s) => s.abbr).join(", ")}`);

  let total = 0;
  for (const state of targets) {
    total += await seedState(state, dryRun);
    if (!dryRun && targets.length > 1) await sleep(5000); // respect Overpass rate limit
  }

  console.log(`\nDone. Total inserted/updated: ${total}`);
  await db.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
