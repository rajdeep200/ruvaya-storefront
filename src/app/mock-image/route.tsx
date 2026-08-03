import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

/**
 * Generates a clearly-labelled placeholder image for mock-mode product
 * photography. Real product photography lives in Cloudinary once the admin
 * backend is connected — this route only exists so `NEXT_PUBLIC_USE_MOCK_API=true`
 * never renders broken images or unrelated stock photos.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const width = Math.min(Number(searchParams.get("w") ?? 800), 1600);
  const height = Math.min(Number(searchParams.get("h") ?? 1000), 1600);
  const bg = searchParams.get("bg") ?? "f3e3d8";
  const label = (searchParams.get("label") ?? "Ruvaya").slice(0, 40);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: `#${bg}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 32,
        }}
      >
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#3e2c20" strokeWidth="1">
          <path d="M9 3a3 3 0 1 0 6 0M6 8l6-3 6 3-2 3v9H8v-9z" />
        </svg>
        <div
          style={{
            marginTop: 20,
            fontSize: 24,
            color: "#3e2c20",
            textAlign: "center",
            maxWidth: "80%",
          }}
        >
          {label}
        </div>
        <div style={{ marginTop: 14, fontSize: 13, letterSpacing: 3, color: "#6b5847" }}>
          MOCK PRODUCT IMAGE
        </div>
      </div>
    ),
    { width, height },
  );
}
