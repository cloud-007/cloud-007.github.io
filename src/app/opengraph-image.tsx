import { ImageResponse } from "next/og";
import { siteIdentity, snapshotContent } from "@/lib/content";
import { editorial } from "@/lib/editorial";

// Use the same reviewed profile and copy as the homepage at build time.
const { name, role, location } = siteIdentity;
const profile = snapshotContent.profile;

export const dynamic = "force-static";
export const alt = `${name} | ${role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const techStack = profile?.core_stack ?? [];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#09090b",
          padding: "60px",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(52,211,153,0.07) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Top bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "36px",
          }}
        >
          <div
            style={{
              fontSize: "22px",
              color: "#34d399",
              fontWeight: "700",
              letterSpacing: "0.04em",
            }}
          >
            {"<cloud_007/>"}
          </div>
          <div style={{ fontSize: "16px", color: "#52525b" }}>
            cloud-007.github.io
          </div>
        </div>

        {/* Separator */}
        <div
          style={{
            height: "1px",
            width: "100%",
            background:
              "linear-gradient(to right, #34d399, #2dd4bf, transparent)",
            marginBottom: "28px",
            display: "flex",
          }}
        />

        {/* Status badge */}
        {profile?.open_to_work && <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              width: "9px",
              height: "9px",
              borderRadius: "50%",
              backgroundColor: "#34d399",
              display: "flex",
            }}
          />
          <div
            style={{
              fontSize: "15px",
              color: "#34d399",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontWeight: "600",
            }}
          >
            {editorial.availability}
          </div>
        </div>}

        {/* Name */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "baseline",
            gap: "20px",
            marginBottom: "14px",
          }}
        >
          <span
            style={{
              fontSize: name.length > 24 ? "56px" : "72px",
              fontWeight: "800",
              color: "#fafafa",
              lineHeight: "1.1",
            }}
          >
            {name}
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "28px",
            color: "#a1a1aa",
            fontWeight: "400",
            marginBottom: "16px",
            letterSpacing: "0.01em",
          }}
        >
          {role}
        </div>

        <div style={{ fontSize: "30px", color: "#34d399", marginBottom: "18px" }}>
          {editorial.headline}
        </div>

        {/* Meta info */}
        <div
          style={{
            fontSize: "16px",
            color: "#52525b",
            marginBottom: "28px",
          }}
        >
          {location}
        </div>

        {/* Tech badges */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          {techStack.map((tech) => (
            <div
              key={tech}
              style={{
                padding: "7px 16px",
                borderRadius: "6px",
                backgroundColor: "#18181b",
                border: "1px solid #3f3f46",
                color: "#a1a1aa",
                fontSize: "15px",
                fontWeight: "500",
              }}
            >
              {tech}
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
