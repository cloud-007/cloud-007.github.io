import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export async function GET() {
  const techStack = [
    "Python",
    "Django",
    "Flutter",
    "FastAPI",
    "PostgreSQL",
    "Docker",
    "AWS",
    "Redis",
  ];

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
            marginBottom: "44px",
            display: "flex",
          }}
        />

        {/* Status badge */}
        <div
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
            Open to new opportunities
          </div>
        </div>

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
              fontSize: "76px",
              fontWeight: "800",
              color: "#fafafa",
              lineHeight: "1",
            }}
          >
            Mazharul
          </span>
          <span
            style={{
              fontSize: "76px",
              fontWeight: "800",
              lineHeight: "1",
              backgroundImage: "linear-gradient(135deg, #34d399, #2dd4bf)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Islam
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
          Senior Software Engineer
        </div>

        {/* Meta info */}
        <div
          style={{
            fontSize: "16px",
            color: "#52525b",
            marginBottom: "44px",
          }}
        >
          3+ years · EdTech / AI · Sylhet, Bangladesh
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
    {
      width: 1200,
      height: 630,
    }
  );
}
