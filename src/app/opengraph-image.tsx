import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Elnatal Debebe — Lead Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SKILLS = ["Go", "TypeScript", "Node.js", "Next.js", "PostgreSQL", "Docker", "Kubernetes"];

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#09090b",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px 90px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Radial purple glow — top center */}
        <div
          style={{
            position: "absolute",
            top: "-160px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "900px",
            height: "500px",
            background:
              "radial-gradient(ellipse at center, rgba(124,58,237,0.30) 0%, rgba(124,58,237,0.08) 50%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Subtle grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(124,58,237,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Purple accent line */}
        <div
          style={{
            width: "56px",
            height: "4px",
            background: "linear-gradient(90deg, #7c3aed, #a78bfa)",
            borderRadius: "2px",
            marginBottom: "36px",
          }}
        />

        {/* Name */}
        <div
          style={{
            fontSize: "76px",
            fontWeight: 700,
            color: "#fafafa",
            lineHeight: 1.05,
            letterSpacing: "-2px",
            marginBottom: "18px",
          }}
        >
          Elnatal Debebe
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "30px",
            fontWeight: 400,
            color: "#a1a1aa",
            marginBottom: "52px",
            letterSpacing: "-0.5px",
          }}
        >
          Lead Software Engineer · Full-Stack Developer
        </div>

        {/* Tech badges */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {SKILLS.map((skill) => (
            <div
              key={skill}
              style={{
                background: "rgba(124,58,237,0.12)",
                border: "1px solid rgba(124,58,237,0.35)",
                color: "#c4b5fd",
                padding: "8px 18px",
                borderRadius: "6px",
                fontSize: "19px",
                fontWeight: 500,
                letterSpacing: "0.2px",
              }}
            >
              {skill}
            </div>
          ))}
        </div>

        {/* Bottom-right: website */}
        <div
          style={{
            position: "absolute",
            bottom: "56px",
            right: "90px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#7c3aed",
            }}
          />
          <div style={{ fontSize: "20px", color: "#52525b", letterSpacing: "0.5px" }}>
            elnatal.com
          </div>
        </div>

        {/* Bottom-left: location */}
        <div
          style={{
            position: "absolute",
            bottom: "56px",
            left: "90px",
            fontSize: "20px",
            color: "#3f3f46",
            letterSpacing: "0.5px",
          }}
        >
          Addis Ababa, Ethiopia
        </div>
      </div>
    ),
    { ...size }
  );
}
