import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteIdentity, snapshotContent } from "@/lib/content";
import { editorial } from "@/lib/editorial";

const { name, role, location } = siteIdentity;

export const dynamic = "force-static";
export const alt = `${name} | ${role} — ${editorial.headline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Match the homepage's light theme and portrait treatment. Bundle the font
// and portrait so the exported card does not depend on remote image services.
export default async function Image() {
  const [regular, bold, portrait] = await Promise.all([
    readFile(join(process.cwd(), "src/assets/fonts/Inter-Regular.woff")),
    readFile(join(process.cwd(), "src/assets/fonts/Inter-Bold.woff")),
    readFile(join(process.cwd(), "public/images/profile.jpg")),
  ]);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "42px 60px", background: "#f6f8f5", color: "#1b2821", fontFamily: "Inter" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 24, borderBottom: "1px solid #d6dfd6" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <span style={{ fontSize: 42, fontWeight: 700, letterSpacing: "-4px", color: "#17694e" }}>m.</span>
            <span style={{ fontSize: 23, fontWeight: 700 }}>{name}</span>
          </div>
          <span style={{ fontSize: 18, color: "#5e7064" }}>cloud-007.github.io</span>
        </div>

        <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "space-between", gap: 64 }}>
          <div style={{ display: "flex", flexDirection: "column", width: 690 }}>
            <div style={{ fontSize: 22, color: "#5e7064", marginBottom: 22 }}>{role}</div>
            <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: "-4px", lineHeight: 1.06 }}>{editorial.headline}</div>
            {snapshotContent.profile?.open_to_work && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 30, color: "#47584d", fontSize: 17 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#17694e", flexShrink: 0 }} />
                {editorial.availability}
              </div>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", width: 286, flexShrink: 0, gap: 16 }}>
            {/* The existing .jpg asset contains PNG bytes. */}
            <img src={`data:image/png;base64,${portrait.toString("base64")}`} alt={name} width={286} height={322} style={{ objectFit: "cover", borderRadius: "3px 3px 60px 3px" }} />
            <div style={{ color: "#5e7064", fontSize: 17 }}>{location}</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: Uint8Array.from(regular).buffer, weight: 400, style: "normal" },
        { name: "Inter", data: Uint8Array.from(bold).buffer, weight: 700, style: "normal" },
      ],
    },
  );
}
