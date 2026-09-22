/* REQ AI Bootcamp - interaktive kurssider: data + oppførsel.
   Ingen avhengigheter. Sidene er lesbare uten dette skriptet;
   JS legger til utforskningen (progressive enhancement).

   Innhold som vokser over kurset ligger som data (WEEKS, GLOSSARY,
   PROMPTS). Å legge til en uke = legge til oppføringer her + kopiere
   _mal.html - ingen omskriving av rammeverket. */

// ── Uker og faser ────────────────────────────────────────────────
const FASER = [
  { nr: 1, kicker: "Fase 1 · Uke 1–3",  tittel: "Kom i gang og bygg de første delene",
    caption: "Fra intro til din egen skill og MCP-kobling" },
  { nr: 2, kicker: "Fase 2 · Uke 4–7",  tittel: "Bruk Claude i arbeidet",
    caption: "Egen arbeidsøkt, Claude Code, research og analyse på ekte oppgaver" },
  { nr: 3, kicker: "Fase 3 · Uke 8–10",  tittel: "Bygg videre og forankre",
    caption: "Bygg en MCP, trygg bruk, og del det du har laget" },
];

const WEEKS = [
  { nr: 1,  fase: 1, status: "live",   href: "uke-01.html",
    tittel: "Fundament I",        tema: "Introduksjon, landskapet og modellvalg",
    slides: { file: "slides/REQ-bootcamp-uke01.pptx", format: "PowerPoint", storrelse: "4,3 MB" } },
  { nr: 2,  fase: 1, status: "live",   href: "uke-02.html",
    tittel: "Skills",             tema: "Ekte skills i praksis, og bygg din egen",
    slides: { file: "slides/uke-02.html", format: "HTML", storrelse: "som brukt i økta", open: true } },
  { nr: 3,  fase: 1, status: "kommer", href: "uke-03.html",
    tittel: "Projects, dokumenter og offentlige data",
    tema: "Vedvarende kontekst, Word, PPT og Excel, og SSB, Brreg, Kartverket og Oslo Planinnsyn" },
  { nr: 4,  fase: 2, status: "kommer", href: "uke-04.html",
    tittel: "Arbeidsøkt",         tema: "Du bygger din egen ting; to innsendte caser løses i plenum" },
  { nr: 5,  fase: 2, status: "kommer", href: "uke-05.html",
    tittel: "Avansert Claude Code-flow", tema: "Live ~20 min på et markedsføringsside-eksempel, deretter arbeidsøkt i din Claude Code" },
  { nr: 6,  fase: 2, status: "kommer", href: "uke-06.html",
    tittel: "Research & kilder",  tema: "Websøk, dokumentverktøy, verifikasjon, connectors og RAG" },
  { nr: 7,  fase: 2, status: "kommer", href: "uke-07.html",
    tittel: "Repeterbar analyse", tema: "Gjentakbare analyser, JSON/Excel, widgets" },
  { nr: 8,  fase: 3, status: "kommer", href: "uke-08.html",
    tittel: "Bygge en MCP",       tema: "Slik bygges en server, intern kobling, ukas agent" },
  { nr: 9,  fase: 3, status: "kommer", href: "uke-09.html",
    tittel: "Trygg bruk",         tema: "Egne MCP-er og skills, datatilgang, grenser for agenter" },
  { nr: 10, fase: 3, status: "kommer", href: "uke-10.html",
    tittel: "Oppsummering og veien videre", tema: "Del det du har laget, champions og roller" },
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
  { term: "Trigger", uke: 2, def: "Description-feltet i SKILL.md: når skillen skal slå inn, og når den ikke skal. Les den høyt - det er det Claude bruker til å velge." },
  { term: "SKILL.md", uke: 2, def: "Selve skill-filen: en kort YAML-topp (navn og trigger) og en kropp som er oppskriften. Markdown i en mappe, ikke et eget format." },
  { term: "Målestokk", uke: 2, def: "Det skillen vurderer mot - i økta et eksempelmandat i references/. Uten målestokk blir svaret en høflig oppsummering." },
  { term: "Røde flagg", uke: 2, def: "Sjekklisten for svakheter folk overser. Ligger i references/ ved siden av målestokken." },
  { term: "Quick wins", uke: 2, def: "Høy verdi og lav kompleksitet i prioriteringsmatrisen. Disse går først når du velger hva du skal lage en skill for." },
  { term: "Store satsinger", uke: 2, def: "Høy verdi og høy kompleksitet. Ofte fordi data mangler - en bit til uke 3, ikke hele oppgaven i uke 2." },
  { term: "Projects", uke: 3, def: "Et arbeidsrom i Claude med fast kontekst - filer, instrukser og historikk samlet ett sted." },
  { term: "Artifacts", uke: 3, def: "Egne dokumenter og småapper Claude lager ved siden av samtalen, som du kan redigere videre." },
  { term: "Memory", uke: 3, def: "Det Claude husker på tvers av samtaler, så du slipper å gjenta konteksten hver gang." },
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
  { tittel: "Stresstest uten skill", konsept: "Prompt alene", uke: 2,
    prompt: "Stresstest dette prospektet." },
  { tittel: "Skriv en enkel skill", konsept: "SKILL.md", uke: 2,
    prompt: "Lag en enkel skill for denne oppgaven: [beskriv den du satte ring rundt]. Filen skal hete SKILL.md. description skal si når den slår inn og når den ikke skal. Kroppen skal være kort: holdning, rekkefølge, og hva den ikke skal gjøre. Ikke kopier stresstest-innholdet - bare formen." },
  { tittel: "Test triggeren", konsept: "Mikrooppgave", uke: 2,
    prompt: "Jeg har denne skillen:\n\n[lim inn SKILL.md]\n\nHer er to ekte oppgaver:\n1. [oppgave A]\n2. [oppgave B]\n\nFor hver: ville triggeren slått inn? Si hvorfor, og hva du ville endret i description hvis den bommet." },
  { tittel: "God mot dårlig skill", konsept: "Kontrast", uke: 2,
    prompt: "Her er et utkast til skill:\n\n[lim inn SKILL.md]\n\nMarker det som gjør den god (trigger med når-ikke, struktur, målestokk, regler, eksempel) og det som gjør den dårlig (vag trigger, tvungen balanse, positiv tone, ingen målestokk)." },
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
    const clickable = live || w.nr === 3;
    const node = el(clickable ? "a" : "div", "week-node" + (live ? "" : " kommer"));
    if (clickable) { node.href = w.href; }
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

// ── Lysbilder: nedlastbare presentasjoner ────────────────────────
function renderSlides(mount) {
  const table = el("table", "slides-table");
  table.innerHTML =
    "<thead><tr>" +
    "<th class=\"st-num\">Uke</th>" +
    "<th>Presentasjon</th>" +
    "<th class=\"st-dl\">Lysbilder</th>" +
    "</tr></thead>";
  const tbody = el("tbody");
  WEEKS.forEach(w => {
    const tr = el("tr", w.slides ? null : "slides-row-kommer");
    const open = w.slides && w.slides.open;
    const handling = w.slides
      ? `<a class="dl-btn" href="${w.slides.file}"${open ? ' target="_blank" rel="noopener"' : " download"}>` +
        `<span class="dl-ico" aria-hidden="true">${open ? "→" : "↓"}</span> ${open ? "Åpne" : "Last ned"}</a>` +
        `<div class="dl-meta">${esc(w.slides.format)} · ${esc(w.slides.storrelse)}</div>`
      : `<span class="pill">Kommer</span>`;
    tr.innerHTML =
      `<td class="st-num">${w.nr}</td>` +
      `<td><span class="st-title">${esc(w.tittel)}</span>` +
      `<span class="st-tema">${esc(w.tema)}</span></td>` +
      `<td class="st-dl">${handling}</td>`;
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  mount.appendChild(table);
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
  const uke = Number(mount.dataset.uke);
  const items = Number.isFinite(uke) ? PROMPTS.filter(p => p.uke === uke) : PROMPTS;
  items.forEach(p => {
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

// ── Skill-anatomi: klikk i fil-treet ─────────────────────────────
function wireFileTree(root) {
  const items = root.querySelectorAll(".ft-item[data-file]");
  const views = root.querySelectorAll(".file-view[data-file]");
  items.forEach(item => {
    item.addEventListener("click", () => {
      items.forEach(i => {
        i.classList.toggle("active", i === item);
        i.setAttribute("aria-pressed", String(i === item));
      });
      views.forEach(v => {
        const on = v.dataset.file === item.dataset.file;
        v.classList.toggle("active", on);
        v.hidden = !on;
      });
    });
  });
}

// ── Stresstest: bytt mellom de tre kjøringene ────────────────────
function wireRunToggle(control) {
  const panels = document.querySelectorAll(".run-panel[data-run]");
  control.querySelectorAll("button[data-run]").forEach(b => {
    b.addEventListener("click", () => {
      control.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", "false"));
      b.setAttribute("aria-pressed", "true");
      panels.forEach(p => { p.hidden = p.dataset.run !== b.dataset.run; });
    });
  });
}

// ── Prioriteringsmatrise: klikk, skriv, dra ──────────────────────
function wireMatrix(grid) {
  const makeDraggable = label => {
    label.addEventListener("pointerdown", e => {
      e.preventDefault();
      const rect = grid.getBoundingClientRect();
      const scaleX = grid.offsetWidth / rect.width;
      const scaleY = grid.offsetHeight / rect.height;
      const startLeft = parseFloat(label.style.left);
      const startTop = parseFloat(label.style.top);
      let moved = false;
      const onMove = ev => {
        const dx = (ev.clientX - e.clientX) * scaleX;
        const dy = (ev.clientY - e.clientY) * scaleY;
        if (!moved && Math.hypot(dx, dy) < 5) return;
        moved = true;
        label.classList.add("dragging");
        label.style.left = Math.max(0, Math.min(grid.offsetWidth, startLeft + dx)) + "px";
        label.style.top = Math.max(0, Math.min(grid.offsetHeight, startTop + dy)) + "px";
      };
      const onUp = () => {
        label.releasePointerCapture(e.pointerId);
        label.removeEventListener("pointermove", onMove);
        label.removeEventListener("pointerup", onUp);
        label.classList.remove("dragging");
        if (moved) label.dataset.dragged = "1";
      };
      label.setPointerCapture(e.pointerId);
      label.addEventListener("pointermove", onMove);
      label.addEventListener("pointerup", onUp);
    });
  };

  grid.addEventListener("click", e => {
    const pin = e.target.closest(".quad-pin");
    if (pin) {
      if (pin.dataset.dragged === "1") { delete pin.dataset.dragged; return; }
      pin.remove();
      return;
    }
    if (e.target.closest(".quad-input")) return;
    const rect = grid.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (grid.offsetWidth / rect.width);
    const y = (e.clientY - rect.top) * (grid.offsetHeight / rect.height);
    const input = el("input", "quad-input");
    input.type = "text";
    input.placeholder = "Skriv, så Enter";
    input.style.left = x + "px";
    input.style.top = y + "px";
    grid.appendChild(input);
    input.focus();
    let done = false;
    const commit = () => {
      if (done) return;
      done = true;
      const text = input.value.trim();
      if (text) {
        const label = el("span", "quad-pin", esc(text));
        label.title = "Dra for å flytte, klikk for å fjerne";
        label.style.left = x + "px";
        label.style.top = y + "px";
        makeDraggable(label);
        grid.appendChild(label);
      }
      input.remove();
    };
    input.addEventListener("keydown", ev => {
      ev.stopPropagation();
      if (ev.key === "Enter") commit();
      if (ev.key === "Escape") { done = true; input.remove(); }
    });
    input.addEventListener("blur", commit);
  });
}

// ── Init ─────────────────────────────────────────────────────────
ready(() => {
  wireExpanders(document);

  const map = document.getElementById("kart-mount");
  if (map) renderMap(map);

  const slides = document.getElementById("slides-mount");
  if (slides) renderSlides(slides);

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

  const tree = document.getElementById("skill-tree");
  if (tree) wireFileTree(tree);

  const runs = document.getElementById("run-toggle");
  if (runs) wireRunToggle(runs);

  const matrix = document.getElementById("matrix-grid");
  if (matrix) wireMatrix(matrix);
});
