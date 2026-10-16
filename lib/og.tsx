import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

// OG renders use literal colours: they are rasterised by Satori, outside the CSS tokens.
const palette = { void: "#051330", text: "#f3f6fb", muted: "#a4b2cc", lumen: "#f8b810", line: "#16305e" };

async function loadFonts() {
  const dir = join(process.cwd(), "fonts", "og");
  const [display, regular] = await Promise.all([
    readFile(join(dir, "archivo-expanded-bold.ttf")),
    readFile(join(dir, "archivo-regular.ttf")),
  ]);
  return [
    { name: "Archivo Expanded", data: display, weight: 700 as const, style: "normal" as const },
    { name: "Archivo", data: regular, weight: 400 as const, style: "normal" as const },
  ];
}

/**
 * Dark Open Graph card: LED-matrix wordmark, a lumen line and the page title.
 * Text is Latin only — Satori has no Arabic shaping — so Arabic pages share the
 * English card while their og:title / og:description stay Arabic.
 */
export async function renderOgImage({ kicker, title }: { kicker: string; title: string }) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        backgroundColor: palette.void,
        backgroundImage: "radial-gradient(circle at 82% 8%, rgba(255,194,71,0.28), rgba(255,194,71,0) 46%)",
        color: palette.text,
        fontFamily: "Archivo",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ display: "flex", flexWrap: "wrap", width: 34, gap: 6 }}>
          {[1, 1, 1, 0.55].map((opacity, index) => (
            <div key={index} style={{ width: 14, height: 14, borderRadius: 7, background: palette.lumen, opacity }} />
          ))}
        </div>
        <div style={{ fontFamily: "Archivo Expanded", fontSize: 30, letterSpacing: 3 }}>AL BAYAN</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div style={{ display: "flex", fontSize: 26, color: palette.muted }}>{kicker}</div>
        <div
          style={{
            display: "flex",
            fontFamily: "Archivo Expanded",
            fontSize: title.length > 34 ? 60 : 74,
            lineHeight: 1.04,
            letterSpacing: -1.5,
            maxWidth: 980,
          }}
        >
          {title}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ width: 220, height: 3, background: palette.lumen }} />
          <div style={{ display: "flex", fontSize: 24, color: palette.muted }}>
            Engineered and manufactured in Qatar
          </div>
        </div>
      </div>
    </div>,
    { ...ogSize, fonts: await loadFonts() },
  );
}
