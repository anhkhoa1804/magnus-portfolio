import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const title = url.searchParams.get('title') ?? 'Magnus';
  const subtitle = url.searchParams.get('subtitle') ?? 'Engineer · Builder · Writer';

  return new ImageResponse(
    (
      <div
        tw="h-full w-full flex flex-col justify-between p-16 bg-black text-white"
      >
        <div tw="flex flex-col gap-4">
          <div tw="text-[18px] opacity-80">Magnus</div>
          <div tw="text-[56px] font-bold leading-[1.1]">{title}</div>
          <div tw="text-[22px] opacity-85">{subtitle}</div>
        </div>

        <div tw="flex justify-between opacity-80 text-[16px]">
          <div>blog • experiences • tech • self-growth • projects</div>
          <div>magnus</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
