import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#EF9F27",
        }}
      >
        <svg width="100" height="100" viewBox="0 0 14 14" fill="none">
          <rect x="3" y="1.5" width="3" height="10" rx="1" fill="#412402" />
          <rect x="3" y="9" width="8" height="3" rx="1" fill="#412402" />
          <line
            x1="7"
            y1="0"
            x2="7"
            y2="1.5"
            stroke="#412402"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <line
            x1="11"
            y1="1"
            x2="10"
            y2="2.2"
            stroke="#412402"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <line
            x1="12.5"
            y1="4.5"
            x2="11"
            y2="4.5"
            stroke="#412402"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
