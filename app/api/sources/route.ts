import { db } from "@/lib/db";

export async function GET() {
  const sources =
    await db.source.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

  return Response.json(sources);
}

export async function POST(
  req: Request
) {
  const body = await req.json();

  const source =
    await db.source.create({
      data: {
        name: body.name,
        url: body.url,
      },
    });

  return Response.json(source);
}

export async function DELETE(
  req: Request
) {
  const body = await req.json();

  await db.source.delete({
    where: {
      id: body.id,
    },
  });

  return Response.json({
    success: true,
  });
}

export async function PATCH(
  req: Request
) {
  const body = await req.json();

  const source =
    await db.source.update({
      where: {
        id: body.id,
      },

      data: {
        enabled: body.enabled,
      },
    });

  return Response.json(source);
}