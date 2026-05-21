"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Home() {
  const [answer, setAnswer] = useState("");
  const [secret, setSecret] = useState("");
  const [message2, setMessage2] = useState("")

  const submit = async () => {
    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer }),
    });

    const data = await res.json();

    if (data.success) {
      toast.success("Jawaban Benar!");
      setSecret(data.secret);
      setMessage2(data.message2)
    } else {
      toast.error("Jawaban Salah!");
    }
  };

  return (
    // Menggunakan min-h-screen agar bisa menengahkan, tetapi tetap bisa scroll jika konten lebih tinggi dari layar (misal di HP)
    // Menghapus overflow-hidden agar halaman bisa merespons konten yang membesar.
    <div className="max-h-screen max-w-screen flex items-center justify-center bg-[#05060a] relative p-4 sm:p-8">
      <Toaster />

      {/* glow background */}
      <div className="absolute w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-cyan-500/20 blur-[80px] sm:blur-[120px] rounded-full animate-pulse pointer-events-none" />

      {/* card: 
          Dihapus max-h-full dan overflow-y-auto.
          Sekarang tinggi card fleksibel sesuai isi kontennya.
      */}
      <div className="relative w-full max-w-[520px] p-6 sm:p-8 rounded-2xl border border-cyan-500/20 bg-white/5 backdrop-blur-xl shadow-[0_0_20px_rgba(0,255,255,0.15)] transition-all duration-300 mt-16">

        <h1 className="text-center text-cyan-300 font-bold tracking-[2px] sm:tracking-[4px] text-xl sm:text-3xl font-mono">
          🔒 KUNCI RAHASIA 🔒
        </h1>
        <h3 className="text-center text-cyan-300 font-medium text-base sm:text-lg font-mono mt-2">
          Jawab Benar Untuk Mendapatkan Kunci
        </h3>

        <p className="text-justify text-gray-400 text-xs sm:text-sm mt-2 font-mono">
          Pas kemarin nonton Persib menang lawan Persija, ada 1 pemain yang bikin author takjub, tolong cari tau dong klub yang pernah dia bela di tahun rilisnya Samsung J2 Prime, author lupa nama pemainnya :)
        </p>

        <input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="> type answer..."
          // Mengganti py-3 menjadi h-12 agar tingginya fixed 48px
          className="mt-6 sm:mt-4 w-full px-4 h-12 rounded-lg bg-black/40 border border-cyan-500/30 text-cyan-200 font-mono outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all"
        />

        <button
          onClick={submit}
          // Mengganti py-3 menjadi h-12 agar serasi dengan input
          className="mt-5 w-full h-12 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold tracking-[3px] hover:shadow-[0_0_15px_rgba(0,255,255,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          EXECUTE
        </button>



        {secret && (
          <div className="mt-6 p-4 border border-cyan-500/30 rounded-lg bg-cyan-500/10 font-mono text-cyan-300 text-center break-all whitespace-pre-wrap text-sm sm:text-base">
            <p>🔐 {secret}</p>
            <p>{message2}</p>
          </div>
        )}
      </div>
    </div>
  );
}