// app.jsx — PODARENA question-submission landing page.
// All state in one root component for simplicity. localStorage-persisted.

const { useState, useEffect, useRef, useCallback, useMemo } = React;

const SUPABASE_URL = 'https://bnuyslurompyavjbdjnm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJudXlzbHVyb21weWF2amJkam5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MzIwNDQsImV4cCI6MjA3NTUwODA0NH0.jO1bNrVmWU2LOkwnevi_y23DRPkUZeOc94CH6W-6XZQ';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ============================================================
   BLOCKS — the 3 themes the user asked for
   ============================================================ */
const BLOCKS = [
  {
    id: "avivamento",
    num: "01",
    title: "Avivamento",
    sub: "Sobre fogo, fome de Deus e o que move uma geração inteira a se levantar.",
    placeholders: [
      "Ex.: O que é avivamento de verdade pra você?",
      "Ex.: Como diferenciar emoção de presença de Deus?",
      "Ex.: O que precisa morrer em mim pra um avivamento começar?"
    ]
  },
  {
    id: "constancia",
    num: "02",
    title: "Como ser constante na vida com Jesus",
    sub: "Sobre a corrida longa: rotina, secreto, recaídas e como manter o passo quando ninguém está vendo.",
    placeholders: [
      "Ex.: Como ter constância na oração quando a vida tá pesada?",
      "Ex.: O que fazer quando o fogo esfria?",
      "Ex.: Existe vida cristã sem secreto?"
    ]
  },
  {
    id: "lideranca",
    num: "03",
    title: "Liderança, isso é pra mim?",
    sub: "Sobre chamado, medo, pressão e como entender se você foi separado pra liderar.",
    placeholders: [
      "Ex.: Como saber se Deus me chamou pra liderar?",
      "Ex.: E se eu não me sinto pronto?",
      "Ex.: Liderar fere a gente. Como não endurecer o coração?"
    ]
  }
];

/* ============================================================
   ICONS — minimal inline SVGs (Lucide-style)
   ============================================================ */
function IconTrash({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}
function IconArrow({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}
function IconCheck({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12.5l5 5L20 6" />
    </svg>
  );
}
function IconChevron({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

/* ============================================================
   STORAGE
   ============================================================ */
const STORAGE_KEY = "podarena_v1";
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch (e) { return null; }
}
function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
}

/* ============================================================
   TOP NAV
   ============================================================ */
function TopNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <nav className={"topnav " + (scrolled ? "scrolled" : "")}>
      <div className="brand">
        <span className="mark">
          <img src={(window.__resources && window.__resources.logo) || "assets/logo-arena-white-trim.png"} alt="Arena" />
        </span>
        <span className="wordmark">
          <span className="top">Arena Lifestyle</span>
          <span className="name">PODARENA</span>
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span className="chip chip-flame"><span className="dot"></span>Perguntas Abertas</span>
      </div>
    </nav>
  );
}

/* ============================================================
   HERO
   ============================================================ */
function Hero({ onScroll }) {
  return (
    <header className="hero has-grain">
      <div className="hero-stripes" />
      <div className="container hero-meta">
        <span>Arena — Sara Nossa Terra — Sergipe</span>
        <span className="hero-year">2K26</span>
      </div>

      <div className="container" style={{ position: "relative", zIndex: 2, width: "100%" }}>
        <div className="hero-eyebrow">
          <span className="pill">ARENA LIFESTYLE</span>
          <span>·</span>
          <span>PODARENA · PERGUNTAS DA GERAÇÃO</span>
        </div>

        <h1 className="hero-title">
          Manda<br/>
          a pergunta.<br/>
          <em>A gente debate.</em>
        </h1>

        <p className="hero-sub">
          Três blocos. Três temas que tão tirando o sono da geração.
          Escreve o que você quer ouvir no palco — sem nome, sem filtro,
          sem precisar se identificar. A gente leva pro debate.
        </p>

        <div className="hero-bottom">
          <button className="btn btn-primary btn-lg" onClick={onScroll}
                  style={{ background: "var(--ink-0)", color: "var(--bone)" }}>
            Quero perguntar <IconArrow size={14} />
          </button>
          <dl className="hero-spec">
            <dt>Bloco 01</dt>
            <dt>Bloco 02</dt>
            <dt>Bloco 03</dt>
            <dd>Avivamento</dd>
            <dd>Constância</dd>
            <dd>Liderança</dd>
          </dl>
        </div>
      </div>

      {/* scroll cue at the very bottom */}
      <button
        onClick={onScroll}
        aria-label="Rolar para perguntas"
        style={{
          position: "absolute", bottom: 18, left: "50%", transform: "translateX(-50%)",
          background: "transparent", border: 0, color: "var(--bone)", opacity: 0.85,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
          zIndex: 3, animation: "scrollcue 1.8s var(--ease-out) infinite"
        }}
      >
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase" }}>Role</span>
        <IconChevron size={22} />
      </button>
      <style>{`
        @keyframes scrollcue {
          0%,100% { transform: translate(-50%, 0); opacity: 0.85; }
          50% { transform: translate(-50%, 6px); opacity: 1; }
        }
      `}</style>
    </header>
  );
}

/* ============================================================
   QUESTION ITEM
   ============================================================ */
function QuestionItem({ index, value, placeholder, onChange, onRemove, canRemove }) {
  const [removing, setRemoving] = useState(false);
  const handleRemove = () => {
    setRemoving(true);
    setTimeout(onRemove, 180);
  };
  return (
    <div className={"q-item" + (removing ? " removing" : "")}>
      <div className="q-index">{String(index + 1).padStart(2, "0")}</div>
      <textarea
        className="q-textarea"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
      />
      {canRemove ? (
        <button className="icon-btn" onClick={handleRemove} aria-label="Remover pergunta">
          <IconTrash />
        </button>
      ) : (
        <div className="q-spacer" />
      )}
    </div>
  );
}

/* ============================================================
   BLOCK
   ============================================================ */
function Block({ block, items, onUpdate, onAdd, onRemove }) {
  const filled = items.filter(q => q.trim().length > 0).length;
  return (
    <article className={"block-card" + (filled > 0 ? " active" : "")}
             id={"bloco-" + block.id}>
      <div className="block-head">
        <div className="block-numeral">{block.num}</div>
        <div className="block-title-stack">
          <div className="block-eyebrow">Bloco {block.num} — Tema</div>
          <h3 className="block-title">{block.title}</h3>
          <p className="block-sub">{block.sub}</p>
        </div>
        <div className="block-count">
          <div><strong>{filled}</strong> / {items.length}</div>
          <div style={{ marginTop: 4 }}>perguntas</div>
        </div>
      </div>

      <div className="block-body">
        {items.map((value, i) => (
          <QuestionItem
            key={i + "-" + items.length}
            index={i}
            value={value}
            placeholder={block.placeholders[i % block.placeholders.length]}
            onChange={(v) => onUpdate(i, v)}
            onRemove={() => onRemove(i)}
            canRemove={items.length > 1}
          />
        ))}
        <button className="add-btn" onClick={onAdd}>
          <span className="plus">+</span>
          Adicionar mais uma pergunta
        </button>
      </div>
    </article>
  );
}

/* ============================================================
   SUCCESS SCREEN
   ============================================================ */
function Success({ counts, onReset }) {
  const total = counts.reduce((a, b) => a + b, 0);
  return (
    <div className="success has-grain">
      <div className="container">
        <div className="success-eyebrow">[ ENVIADO · 06.JUN.26 · 19h30 ]</div>
        <h2 className="success-title">
          Tua voz<br/>chegou<br/>na arena.
        </h2>
        <p className="success-sub">
          {total === 1 ? "Recebemos a sua pergunta." : `Recebemos as suas ${total} perguntas.`}
          {" "}
          A gente leva o que mais ecoar pro palco do PODARENA.
          Cola lá na sexta, 19h30.
        </p>

        <div style={{
          display: "flex", gap: 14, alignItems: "stretch",
          marginBottom: 48, flexWrap: "wrap"
        }}>
          {BLOCKS.map((b, i) => (
            <div key={b.id} style={{
              background: "rgba(5,4,3,0.86)", color: "var(--bone)",
              padding: "18px 22px", minWidth: 180, flex: "1 1 200px",
              borderLeft: "2px solid var(--bone)"
            }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.6, marginBottom: 8 }}>
                Bloco {b.num}
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 36, lineHeight: 0.9, textTransform: "uppercase" }}>
                {counts[i]}
              </div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 13, opacity: 0.75, marginTop: 6 }}>
                {b.title}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <button className="btn btn-lg" style={{ background: "var(--ink-0)", color: "var(--bone)" }} onClick={onReset}>
            Enviar mais perguntas <IconArrow size={14} />
          </button>
          <a className="btn btn-ghost btn-lg" href="#"
             style={{ borderColor: "rgba(5,4,3,0.4)", color: "var(--ink-0)" }}
             onClick={(e) => e.preventDefault()}>
            Compartilhar com a galera
          </a>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   APP
   ============================================================ */
function App() {
  // questions[i] is an array of strings for BLOCKS[i]
  const [questions, setQuestions] = useState(() => {
    const saved = loadState();
    if (saved && Array.isArray(saved.questions) && saved.questions.length === BLOCKS.length) {
      return saved.questions;
    }
    return BLOCKS.map(() => [""]);
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const formRef = useRef(null);

  // persist
  useEffect(() => { saveState({ questions }); }, [questions]);

  const filledCounts = useMemo(
    () => questions.map(arr => arr.filter(q => q.trim().length > 0).length),
    [questions]
  );
  const totalFilled = filledCounts.reduce((a, b) => a + b, 0);

  const updateQ = (blockIdx, qIdx, val) => {
    setError(false);
    setQuestions(prev => prev.map((arr, i) =>
      i === blockIdx ? arr.map((v, j) => j === qIdx ? val : v) : arr
    ));
  };
  const addQ = (blockIdx) => {
    setQuestions(prev => prev.map((arr, i) => i === blockIdx ? [...arr, ""] : arr));
  };
  const removeQ = (blockIdx, qIdx) => {
    setQuestions(prev => prev.map((arr, i) => {
      if (i !== blockIdx) return arr;
      if (arr.length <= 1) return [""];
      return arr.filter((_, j) => j !== qIdx);
    }));
  };

  const handleSubmit = async () => {
    if (totalFilled === 0) {
      setError(true);
      setTimeout(() => setError(false), 600);
      const el = document.getElementById("bloco-" + BLOCKS[0].id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const rows = [];
    BLOCKS.forEach((b, i) => {
      questions[i].map(q => q.trim()).filter(Boolean).forEach(texto => {
        rows.push({ tema: b.title, tema_id: b.id, texto });
      });
    });

    const { error: dbError } = await supabase.from('perguntas').insert(rows);
    if (dbError) {
      setSubmitting(false);
      setSubmitError('Erro ao enviar. Tenta de novo!');
      return;
    }

    localStorage.removeItem(STORAGE_KEY);
    setSubmitting(false);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const handleReset = () => {
    setQuestions(BLOCKS.map(() => [""]));
    saveState({ questions: BLOCKS.map(() => [""]) });
    setSubmitted(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (submitted) {
    return (
      <React.Fragment>
        <Success counts={filledCounts} onReset={handleReset} />
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <TopNav />
      <Hero onScroll={scrollToForm} />
      <div className="stripe-strip" />

      <section className="section dark" ref={formRef}>
        <div className="container">
          <div className="intro">
            <h2>
              Três<br/>
              <span className="flame">blocos.</span><br/>
              Suas perguntas.
            </h2>
            <p>
              Cada bloco é um tema do próximo episódio. Escreve quantas
              perguntas você quiser em cada um — pode ser uma, pode ser dez.
              <strong style={{ color: "var(--bone)" }}> Sem cadastro, sem nome.</strong>
              {" "}As que mais ecoarem viram pauta no palco.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}
               className={error ? "shake" : ""}>
            {BLOCKS.map((b, i) => (
              <Block
                key={b.id}
                block={b}
                items={questions[i]}
                onUpdate={(qIdx, v) => updateQ(i, qIdx, v)}
                onAdd={() => addQ(i)}
                onRemove={(qIdx) => removeQ(i, qIdx)}
              />
            ))}
          </div>

          <div className="submit-bar">
            <div className="submit-bar-inner">
              <div className="tally">
                {filledCounts.map((c, i) => (
                  <div key={i} className={"stat" + (c > 0 ? " has" : "")}>
                    <span className="num">{String(c).padStart(2, "0")}</span>
                    <span>Bloco {BLOCKS[i].num}</span>
                  </div>
                ))}
              </div>
              <button
                className="btn btn-primary btn-lg"
                onClick={handleSubmit}
                disabled={totalFilled === 0 || submitting}
                style={{ minWidth: 240 }}>
                {submitting ? "Enviando…" : totalFilled === 0 ? "Escreva ao menos uma" : `Enviar ${totalFilled} pergunta${totalFilled === 1 ? "" : "s"}`}
                {totalFilled > 0 && !submitting && <IconArrow size={14} />}
              </button>
            </div>
            {error && (
              <div style={{
                marginTop: 10,
                fontFamily: "var(--font-mono)", fontSize: 11,
                letterSpacing: "0.16em", textTransform: "uppercase",
                color: "var(--error)"
              }}>
                Pelo menos uma pergunta — em qualquer bloco.
              </div>
            )}
            {submitError && (
              <div style={{
                marginTop: 10,
                fontFamily: "var(--font-mono)", fontSize: 11,
                letterSpacing: "0.16em", textTransform: "uppercase",
                color: "var(--error)"
              }}>
                {submitError}
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-inner">
          <div>© Arena · Sara Nossa Terra · Mov. Jovem</div>
          <div style={{ display: "flex", gap: 28 }}>
            <span>PODARENA · Arena Lifestyle</span>
            <span>Brasília — DF</span>
            <span>Sexta · 19h30</span>
          </div>
        </div>
      </footer>
    </React.Fragment>
  );
}

window.App = App;
