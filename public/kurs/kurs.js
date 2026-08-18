/* REQ AI Bootcamp - interaktive kurssider: data + oppførsel.
   Ingen avhengigheter. Sidene er lesbare uten dette skriptet;
   JS legger til utforskningen (progressive enhancement).

   Innhold som vokser over kurset ligger som data (WEEKS, GLOSSARY,
   PROMPTS). Å legge til en uke = legge til oppføringer her + kopiere
   _mal.html - ingen omskriving av rammeverket. */

// ── Uker og faser ────────────────────────────────────────────────
const FASER = [
  { nr: 1, kicker: "Fase 1 · Uke 1–4",  tittel: "Grunnlaget",
    caption: "Fra null til trygg daglig bruk" },
  { nr: 2, kicker: "Fase 2 · Uke 5–7",  tittel: "Bygge og automatisere",
    caption: "Vendepunktet: fra bruk til bygging" },
  { nr: 3, kicker: "Fase 3 · Uke 8–10", tittel: "Forankring og leveranse",
    caption: "Alle har bygget noe eget" },
];

const WEEKS = [
  { nr: 1,  fase: 1, status: "live",   href: "uke-01.html",
    tittel: "Fundament I",        tema: "Introduksjon, landskapet og modellvalg" },
  { nr: 2,  fase: 1, status: "kommer", href: "uke-02.html",
    tittel: "Fundament II",       tema: "Strukturert prompting, Projects, Artifacts og Memory" },
  { nr: 3,  fase: 1, status: "kommer", href: "uke-03.html",
    tittel: "Skriving & Office",  tema: "Claude i Word og PowerPoint, REQ-malen" },
  { nr: 4,  fase: 1, status: "kommer", href: "uke-04.html",
    tittel: "Research & kilder",  tema: "Websøk, dokumentverktøy, connectors og RAG" },
  { nr: 5,  fase: 2, status: "kommer", href: "uke-05.html",
    tittel: "Repeterbar analyse", tema: "Gjentakbare analyser, JSON/Excel, widgets" },
  { nr: 6,  fase: 2, status: "kommer", href: "uke-06.html",
    tittel: "Deres use-cases",    tema: "Egne bruksområder - alle leverer minst én skill" },
  { nr: 7,  fase: 2, status: "kommer", href: "uke-07.html",
    tittel: "MCP & agenter",      tema: "Slik bygges en server, intern kobling, ukas agent" },
  { nr: 8,  fase: 3, status: "kommer", href: "uke-08.html",
    tittel: "Trygg bruk",         tema: "Egne MCP-er og skills, datatilgang, grenser for agenter" },
  { nr: 9,  fase: 3, status: "kommer", href: "uke-09.html",
    tittel: "Forankring",         tema: "Champions og rollefordeling" },
  { nr: 10, fase: 3, status: "kommer", href: "uke-10.html",
    tittel: "Leveranse",          tema: "Alle har levert en fungerende skill, MCP eller widget" },
];

// ── Begrepsbank (vokser hver uke; «uke» = når begrepet dekkes) ────
const GLOSSARY = [
  { term: "LLM (språkmodell)", uke: 1, def: "Modellen som resonnerer, skriver og sammenstiller. Motoren under Claude, GPT og Gemini - den genererer svar, som må verifiseres." },
  { term: "Token", uke: 1, def: "Minste tekstbit modellen regner i, omtrent en orddel. Alt du sender inn og får tilbake måles i tokens." },
  { term: "Kontekstvindu", uke: 1, def: "Alt modellen ser i ett kall: instruks, verktøy, prosjekt, hentet materiale, historikk og meldingen din. Et fast budsjett som bygges på nytt hver gang." },
  { term: "Plugin", uke: 1, def: "En ferdig pakke Claude kan bruke - kommandoer, skills, MCP-koblinger og mer, samlet så hele teamet kan installere det med ett klikk." },
  { term: "Kommando", uke: 1, def: "En snarvei du kaller på selv, som /kurs. Du starter den; Claude svarer." },
  { term: "Skill", uke: 1, def: "En fast oppskrift Claude tar i bruk selv når du spør om noe den passer til. Du kaller den ikke direkte." },
  { term: "Sub-agent", uke: 1, def: "En spesialisert hjelper som løser én avgrenset oppgave selvstendig, ofte på vegne av en større arbeidsflyt." },
  { term: "MCP", uke: 1, def: "Model Context Protocol - en åpen standard som kobler Claude til dine data og systemer. Samme kobling virker på tvers av leverandører." },
  { term: "Hooks", uke: 1, def: "Automatikk som utløses av en hendelse - kjør noe fast før eller etter et bestemt steg." },
  { term: "Agent", uke: 1, def: "Et verktøy som jobber selvstendig mot et mål over flere steg, ikke bare svarer på ett spørsmål." },
  { term: "Cowork", uke: 1, def: "Claude med tilgang til filene dine, som en kollega som jobber ved siden av deg." },
  { term: "Claude Code", uke: 1, def: "Claude i terminalen - bygger og endrer verktøy og kode direkte." },
  { term: "API", uke: 1, def: "Programmatisk tilgang til modellen, så egne skript og systemer kan bruke Claude uten chatvinduet." },
  { term: "Modellvalg", uke: 1, def: "Å velge riktig modell til oppgaven - balansen mellom kvalitet, hastighet og kostnad." },
  { term: "Haiku", uke: 1, def: "Den raske og rimelige Claude-modellen. Bra til korte svar, klassifisering og førsteutkast." },
  { term: "Sonnet", uke: 1, def: "Arbeidshesten. Sterk på de fleste oppgaver til fornuftig pris - start alltid her." },
  { term: "Opus", uke: 1, def: "Den tyngste modellen. Løft hit når oppgaven faktisk krever mer resonnering." },
  { term: "Projects", uke: 2, def: "Et arbeidsrom i Claude med fast kontekst - filer, instrukser og historikk samlet ett sted." },
  { term: "Artifacts", uke: 2, def: "Egne dokumenter og småapper Claude lager ved siden av samtalen, som du kan redigere videre." },
  { term: "Memory", uke: 2, def: "Det Claude husker på tvers av samtaler, så du slipper å gjenta konteksten hver gang." },
];

// ── Prompt-oppskrifter (kopierbare «prøv selv») ──────────────────
const PROMPTS = [
  { tittel: "Forklar MCP enkelt", konsept: "MCP", uke: 1,
    prompt: "Forklar MCP for meg - helt enkelt, som om jeg aldri har hørt om det. Bruk en analogi fra finansbransjen." },
  { tittel: "Oppsummer økta for en kollega", konsept: "Recap", uke: 1,
    prompt: "Lag en kort oppsummering av det vi gikk gjennom i økt 1, skrevet til en kollega som ikke var til stede. Maks fem punkter." },
  { tittel: "REQ-profilert presentasjon", konsept: "Plugin", uke: 1,
    prompt: "Lag en REQ-profilert presentasjon om det vi nettopp gikk gjennom - med riktige farger, logo og typografi." },
  { tittel: "Sammenlign to modeller", konsept: "Modellvalg", uke: 1,
    prompt: "Her er en oppgave jeg bruker mer enn én time i uken på: [beskriv den]. Løs den, og si hvilken Claude-modell du ville valgt og hvorfor." },
  { tittel: "Finn dine use-cases", konsept: "Use-cases", uke: 1,
    prompt: "Jeg jobber med [rolle og typiske oppgaver]. Foreslå tre konkrete oppgaver i hverdagen min der Claude kan spare meg minst én time i uken." },
  { tittel: "Spør kurset", konsept: "Kurspluginen", uke: 1,
    prompt: "Hva er forarbeidet til neste økt i REQ AI Bootcamp?" },
  { tittel: "Kildekritikk på et svar", konsept: "Verifisering", uke: 1,
    prompt: "Gå gjennom svaret ditt over og marker hvert tall, sitat og kildehenvisning jeg bør dobbeltsjekke mot originalkilden." },
];

// ── Modellvelger ─────────────────────────────────────────────────
const CHOICES = [
  { task: "Raskt oppslag eller utkast", model: "Haiku",
    why: "Rask og rimelig. Bra til korte svar, klassifisering og førsteutkast der presisjon ikke er kritisk." },
  { task: "Daglig analyse og skriving", model: "Sonnet",
    why: "Arbeidshesten. Sterk på de fleste oppgaver til fornuftig pris - start alltid her." },
  { task: "Tung analyse og resonnering", model: "Opus",
    why: "Løft hit når oppgaven faktisk krever mer: flertrinns resonnering, kompliserte vurderinger, høy innsats." },
  { task: "Store dokumenter", model: "Sonnet",
    why: "Håndterer lange dokumenter godt til lav kostnad. Løft til Opus hvis konklusjonene er høy-risiko." },
  { task: "Idémyldring og utforsking", model: "Sonnet",
    why: "Rask nok til dialog, god nok til dybde. Bytt til Opus når du vil presse kvaliteten." },
];

// ── Hjelpere ─────────────────────────────────────────────────────
function ready(fn) {
  if (document.readyState !== "loading") fn();
  else document.addEventListener("DOMContentLoaded", fn);
}
function el(tag, cls, html) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
}
function esc(s) {
  return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

// ── Generell expander (delt av alle moduler) ─────────────────────
function wireExpanders(root) {
  root.querySelectorAll(".expander[data-target]").forEach(btn => {
    btn.addEventListener("click", () => {
      const panel = document.getElementById(btn.dataset.target);
      if (!panel) return;
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      panel.hidden = open;
    });
  });
}

// ── Hub: 10-ukerskartet ──────────────────────────────────────────
function renderMap(mount) {
  FASER.forEach(f => {
    const col = el("div", `phase phase-${f.nr}`);
    col.appendChild(el("div", "ph-kicker", esc(f.kicker)));
    col.appendChild(el("div", "ph-title", esc(f.tittel)));
    col.appendChild(el("div", "ph-caption", esc(f.caption)));
    const wks = el("div", "phase-weeks");
    WEEKS.filter(w => w.fase === f.nr).forEach(w => {
      const live = w.status === "live";
      const node = el(live ? "a" : "div", "week-node" + (live ? "" : " kommer"));
      if (live) { node.href = w.href; }
      node.setAttribute("title", w.tema);
      node.innerHTML =
        `<span class="wn-num">${w.nr}</span>` +
        `<span class="wn-body"><span class="wn-title">${esc(w.tittel)}</span>` +
        `<span class="wn-tema">${esc(w.tema)}</span></span>` +
        `<span class="wn-flag">${live
          ? '<span class="pill pill-live">Åpen</span>'
          : '<span class="pill">Kommer</span>'}</span>`;
      wks.appendChild(node);
    });
    col.appendChild(wks);
    mount.appendChild(col);
  });
}

// ── Begrepsbank ──────────────────────────────────────────────────
function renderGlossary(listMount, searchInput) {
  const draw = (q = "") => {
    const needle = q.trim().toLowerCase();
    listMount.innerHTML = "";
    const hits = GLOSSARY
      .filter(g => !needle || (g.term + " " + g.def).toLowerCase().includes(needle))
      .sort((a, b) => a.term.localeCompare(b.term, "nb"));
    if (!hits.length) {
      listMount.appendChild(el("div", "gloss-empty", "Ingen treff. Prøv et annet ord."));
      return;
    }
    hits.forEach(g => {
      const row = el("div", "gloss-item");
      row.innerHTML =
        `<span class="term">${esc(g.term)}</span>` +
        `<span class="def">${esc(g.def)}</span>` +
        `<span class="flag-wrap"><span class="pill">Uke ${g.uke}</span></span>`;
      listMount.appendChild(row);
    });
  };
  draw();
  if (searchInput) searchInput.addEventListener("input", e => draw(e.target.value));
}

// ── Prompt-oppskrifter ───────────────────────────────────────────
function renderPrompts(mount) {
  PROMPTS.forEach(p => {
    const card = el("div", "card prompt-card");
    card.innerHTML =
      `<div class="pc-head"><h3>${esc(p.tittel)}</h3><span class="pill">${esc(p.konsept)}</span></div>` +
      `<pre>${esc(p.prompt)}</pre>` +
      `<button class="copy-btn" type="button">Kopier</button>`;
    const btn = card.querySelector(".copy-btn");
    btn.addEventListener("click", () => copyText(p.prompt, btn));
    mount.appendChild(card);
  });
}
function copyText(text, btn) {
  const done = () => {
    btn.textContent = "Kopiert";
    btn.classList.add("copied");
    setTimeout(() => { btn.textContent = "Kopier"; btn.classList.remove("copied"); }, 1500);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(() => selectFallback(text, done));
  } else {
    selectFallback(text, done);
  }
}
function selectFallback(text, done) {
  const ta = el("textarea");
  ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
  document.body.appendChild(ta); ta.select();
  try { document.execCommand("copy"); done(); } catch (e) { /* stille */ }
  document.body.removeChild(ta);
}

// ── Modellvelger ─────────────────────────────────────────────────
function wireChooser(optsMount, resultMount) {
  CHOICES.forEach((c, i) => {
    const b = el("button", null, esc(c.task));
    b.type = "button";
    b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", () => {
      optsMount.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", "false"));
      b.setAttribute("aria-pressed", "true");
      resultMount.innerHTML =
        `<div class="model">${esc(c.model)}</div><p class="why">${esc(c.why)}</p>`;
    });
    optsMount.appendChild(b);
  });
}

// ── Anatomi-toggle: du kaller selv / Claude bruker selv ──────────
function wireAnatToggle(control) {
  const parts = () => document.querySelectorAll("[data-invoke]");
  const apply = mode => {
    parts().forEach(p => {
      const match = mode === "all" || p.dataset.invoke === mode;
      p.classList.toggle("dim", !match);
      p.classList.toggle("lit", mode !== "all" && match);
    });
  };
  control.querySelectorAll("button[data-mode]").forEach(b => {
    b.addEventListener("click", () => {
      control.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", "false"));
      b.setAttribute("aria-pressed", "true");
      apply(b.dataset.mode);
    });
  });
}

// ── Økosystem: byttbar motor ─────────────────────────────────────
function wireEngineSwap(btn, label) {
  const engines = ["Claude", "GPT", "Gemini"];
  let i = 0;
  btn.addEventListener("click", () => {
    i = (i + 1) % engines.length;
    label.textContent = engines[i];
    label.classList.remove("swap"); void label.offsetWidth; label.classList.add("swap");
  });
}

// ── Kontekstvindu: slå segmenter av/på ───────────────────────────
function wireContext(section) {
  const toggles = section.querySelectorAll(".ctx-toggles button[data-seg]");
  toggles.forEach(t => {
    t.addEventListener("click", () => {
      const seg = section.querySelector(`.ctx-seg[data-seg="${t.dataset.seg}"]`);
      const on = t.getAttribute("aria-pressed") !== "false";
      t.setAttribute("aria-pressed", String(!on));
      if (seg) {
        seg.classList.toggle("off", on);
        seg.style.flexGrow = on ? "0" : seg.dataset.weight;
      }
    });
  });
}

// ── Init ─────────────────────────────────────────────────────────
ready(() => {
  wireExpanders(document);

  const map = document.getElementById("kart-mount");
  if (map) renderMap(map);

  const glossList = document.getElementById("gloss-list");
  if (glossList) renderGlossary(glossList, document.getElementById("gloss-search"));

  const promptMount = document.getElementById("prompt-list");
  if (promptMount) renderPrompts(promptMount);

  const chooserOpts = document.getElementById("chooser-opts");
  if (chooserOpts) wireChooser(chooserOpts, document.getElementById("chooser-result"));

  const anat = document.getElementById("anat-toggle");
  if (anat) wireAnatToggle(anat);

  const swap = document.getElementById("engine-swap");
  if (swap) wireEngineSwap(swap, document.getElementById("engine-label"));

  const ctx = document.getElementById("kontekst");
  if (ctx) wireContext(ctx);
});
