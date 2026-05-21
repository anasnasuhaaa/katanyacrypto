import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { answer } = await req.json();

  const correct = process.env.ANSWER;
  const secret = process.env.SECRET;
  const message2 = process.env.MESSAGE2;

  if (!answer) {
    return NextResponse.json(
      { success: false, message: "Jawaban kosong" },
      { status: 400 },
    );
  }

  if (answer.trim().toLowerCase() === correct?.toLowerCase()) {
    return NextResponse.json({
      success: true,
      message: "Jawaban benar!",
      secret,message2
    });
  }

  return NextResponse.json({
    success: false,
    message: "Jawaban salah",
  });
}
