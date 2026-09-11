"use client";

import { FormEvent, useState } from "react";

type SubmitResponse = {
  success: boolean;
  message: string;
  secret?: string;
  message2?: string;
};

type Feedback = {
  type: "error" | "success";
  message: string;
} | null;

function LockIcon({ open = false }: { open?: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path
        d={open ? "M16.5 8V6.5a4.5 4.5 0 0 0-8.64-1.78" : "M7.5 10V7.5a4.5 4.5 0 0 1 9 0V10"}
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <rect x="4.5" y="10" width="15" height="10.5" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 14.5v2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export default function Home() {
  const [answer, setAnswer] = useState("");
  const [secret, setSecret] = useState("");
  const [message2, setMessage2] = useState("");
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedAnswer = answer.trim();
    if (!normalizedAnswer || isSubmitting) return;

    setIsSubmitting(true);
    setFeedback(null);
    setIsCopied(false);

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer: normalizedAnswer }),
      });

      const data = (await response.json()) as SubmitResponse;

      if (!response.ok || !data.success) {
        setSecret("");
        setMessage2("");
        setFeedback({
          type: "error",
          message: data.message || "Jawaban belum tepat. Coba telusuri petunjuknya lagi.",
        });
        return;
      }

      setSecret(data.secret ?? "");
      setMessage2(data.message2 ?? "Selamat, kamu berhasil membuka akses.");
      setFeedback({ type: "success", message: data.message });
    } catch {
      setSecret("");
      setMessage2("");
      setFeedback({
        type: "error",
        message: "Koneksi ke server terputus. Periksa jaringan lalu coba lagi.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copySecret = async () => {
    if (!secret) return;

    try {
      await navigator.clipboard.writeText(secret);
      setIsCopied(true);
      window.setTimeout(() => setIsCopied(false), 1800);
    } catch {
      setFeedback({ type: "error", message: "Kunci belum dapat disalin otomatis." });
    }
  };

  return (
    <main className="challenge-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="grid-overlay" />

      <nav className="topbar" aria-label="Identitas tantangan">
        <a className="brand" href="#challenge" aria-label="Katanya Crypto, kembali ke tantangan">
          <span className="brand-mark" aria-hidden="true">K</span>
          <span>KATANYA<span>CRYPTO</span></span>
        </a>
        <div className="system-status">
          <span className="status-dot" />
          SYSTEM ONLINE
        </div>
      </nav>

      <section className="challenge-card" id="challenge">
        <div className="challenge-intro">
          <div>
            <div className="eyebrow">
              <span>MISSION / 01</span>
              <span className="eyebrow-line" />
            </div>

            <div className="lock-badge">
              <LockIcon />
            </div>

            <h1>
              Buka akses ke
              <span>kunci rahasia.</span>
            </h1>

            <p className="intro-copy">
              Satu petunjuk, satu jawaban. Pecahkan teka-tekinya untuk membuka pesan yang tersembunyi.
            </p>
          </div>

          <div className="mission-meta" aria-label="Informasi misi">
            <div>
              <span>TIPE</span>
              <strong>OSINT DIKIT GPP</strong>
            </div>
            <div>
              <span>STATUS</span>
              <strong>TERKUNCI</strong>
            </div>
          </div>
        </div>

        <div className="terminal-panel">
          <div className="terminal-bar">
            <div className="window-controls" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            <span>secure_access.exe</span>
            <span className="terminal-id">#KC-001</span>
          </div>

          <div className="terminal-content">
            <div className="clue-label">
              <span className="clue-icon">?</span>
              <span>PETUNJUK TERENKRIPSI</span>
            </div>

            <blockquote>
              “Gimana sih Madrid, udah beli mahal-mahal cuma jadi cadangan.”
            </blockquote>

            <div className="divider">
              <span />
              <small>MASUKKAN KREDENSIAL</small>
              <span />
            </div>

            <form onSubmit={submit} noValidate>
              <label htmlFor="answer">Jawaban kamu</label>
              <div className={`input-wrap ${feedback?.type === "error" ? "has-error" : ""}`}>
                <span aria-hidden="true">&gt;</span>
                <input
                  id="answer"
                  name="answer"
                  value={answer}
                  onChange={(event) => {
                    setAnswer(event.target.value);
                    if (feedback?.type === "error") setFeedback(null);
                  }}
                  placeholder="ketik jawaban di sini..."
                  autoComplete="off"
                  autoCapitalize="words"
                  spellCheck="false"
                  maxLength={100}
                  disabled={isSubmitting}
                  aria-describedby="form-feedback"
                />
                <span className="input-cursor" aria-hidden="true" />
              </div>

              <button className="submit-button" type="submit" disabled={!answer.trim() || isSubmitting}>
                <span>{isSubmitting ? "MEMVERIFIKASI..." : "VERIFIKASI JAWABAN"}</span>
                {isSubmitting ? (
                  <span className="spinner" aria-hidden="true" />
                ) : (
                  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10h11m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>

              <div
                id="form-feedback"
                className={`feedback ${feedback ? `feedback-${feedback.type}` : ""}`}
                role="status"
                aria-live="polite"
              >
                {feedback && (
                  <>
                    <span aria-hidden="true">{feedback.type === "success" ? "✓" : "!"}</span>
                    {feedback.message}
                  </>
                )}
              </div>
            </form>

            {secret && (
              <div className="success-card">
                <div className="success-heading">
                  <span className="success-icon"><LockIcon open /></span>
                  <div>
                    <small>ACCESS GRANTED</small>
                    <strong>Kunci berhasil ditemukan</strong>
                  </div>
                </div>
                <div className="secret-row">
                  <code>{secret}</code>
                  <button type="button" onClick={copySecret} aria-label="Salin kunci rahasia">
                    {isCopied ? "TERSALIN" : "SALIN"}
                  </button>
                </div>
                <p>{message2}</p>
              </div>
            )}

            <p className="attempt-note">
              <span aria-hidden="true">◇</span>
              Jawaban tidak peka huruf besar dan kecil
            </p>
          </div>
        </div>
      </section>

      <footer>
        <span>© 2026 KATANYA CRYPTO</span>
        <span>TRUST NOTHING. VERIFY EVERYTHING.</span>
      </footer>
    </main>
  );
}
