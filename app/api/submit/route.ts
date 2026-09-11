import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Format permintaan tidak valid." },
      { status: 400 },
    );
  }

  const answer =
    typeof body === "object" && body !== null && "answer" in body
      ? (body as { answer?: unknown }).answer
      : undefined;

  const correct = process.env.ANSWER;
  const secret = process.env.SECRET;
  const message2 = process.env.MESSAGE2;

  if (typeof answer !== "string" || !answer.trim()) {
    return NextResponse.json(
      { success: false, message: "Jawaban tidak boleh kosong." },
      { status: 400 },
    );
  }

  if (!correct || !secret) {
    console.error("ANSWER atau SECRET belum dikonfigurasi pada environment server.");
    return NextResponse.json(
      { success: false, message: "Tantangan belum dikonfigurasi. Hubungi penyelenggara." },
      { status: 500 },
    );
  }

  if (answer.trim().toLocaleLowerCase("id-ID") === correct.trim().toLocaleLowerCase("id-ID")) {
    return NextResponse.json(
      {
        success: true,
        message: "Jawaban benar. Akses berhasil dibuka!",
        secret,
        message2: message2 ?? "Selamat, kamu berhasil menemukan kunci rahasia!",
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  return NextResponse.json(
    { success: false, message: "Jawaban belum tepat. Coba telusuri petunjuknya lagi." },
    { status: 401 },
  );
}
