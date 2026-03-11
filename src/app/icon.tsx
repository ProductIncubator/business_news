import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: 'linear-gradient(135deg, #0f0728 0%, #1a1040 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        {/* Rope line */}
        <div
          style={{
            width: 2,
            height: 8,
            background: '#c8a06e',
            borderRadius: 2,
            marginBottom: 1,
          }}
        />
        {/* Candy ball */}
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #86efac, #16a34a)',
            border: '1.5px solid #4ade80',
          }}
        />
      </div>
    ),
    { ...size }
  );
}
