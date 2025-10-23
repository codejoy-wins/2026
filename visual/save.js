// visual.js — Vision Board (client-side, no deps)
const LS_KEY = "visualBoard.v1";
const AFFIRM_KEY = "visualBoard.v1.affirmations";

const els = {
  grid: document.getElementById("grid"),
  drop: document.getElementById("dropzone"),
  fileInput: document.getElementById("fileInput"),
  addUrlBtn: document.getElementById("addUrlBtn"),
  urlModal: document.getElementById("urlModal"),
  urlForm: document.getElementById("urlForm"),
  filterSelect: document.getElementById("filterSelect"),
  searchInput: document.getElementById("searchInput"),
  shuffleBtn: document.getElementById("shuffleBtn"),
  exportBtn: document.getElementById("exportBtn"),
  importInput: document.getElementById("importInput"),
  clearBtn: document.getElementById("clearBtn"),
  segs: [...document.querySelectorAll(".segmented .seg")],
  affirmInput: document.getElementById("affirmInput"),
  addAffirmBtn: document.getElementById("addAffirmBtn"),
  affirmations: document.getElementById("affirmations"),
  focusModal: document.getElementById("focusModal"),
  closeFocus: document.getElementById("closeFocus"),
  prevBtn: document.getElementById("prevBtn"),
  nextBtn: document.getElementById("nextBtn"),
  playBtn: document.getElementById("playBtn"),
  toggleFavBtn: document.getElementById("toggleFavBtn"),
  focusImg: document.getElementById("focusImg"),
  focusCaption: document.getElementById("focusCaption"),
  editBtn: document.getElementById("editBtn"),
  editModal: document.getElementById("editModal"),
  editForm: document.getElementById("editForm"),
};

let state = loadState();
let mode = "grid";
let playing = false;
let playTimer = null;
let cursorIndex = 0;

// ---------- Seed image ----------
if (state.items.length === 0) {
  state.items.push({
    id: crypto.randomUUID(),
    src: "/static/img/DBS.jpeg",
    title: "Dream Car",
    tags: ["Lifestyle", "Wealth"],
    notes: "Freedom, reliability, status — a symbol but also a tool.",
    favorite: true,
    dateAdded: Date.now(),
  });
  saveState();
}

renderAll();

/* ---------------- Events ------------------ */
els.fileInput.addEventListener("change", async (e) => {
  const files = [...e.target.files];
  if (!files.length) return;
  await addFiles(files);
});

["dragenter", "dragover"].forEach(ev =>
  els.drop.addEventListener(ev, (e) => {
    e.preventDefault(); e.stopPropagation(); els.drop.classList.add("drag");
  })
);
["dragleave", "drop"].forEach(ev =>
  els.drop.addEventListener(ev, (e) => {
    e.preventDefault(); e.stopPropagation(); els.drop.classList.remove("drag");
  })
);
els.drop.addEventListener("drop", async (e) => {
  const files = [...(e.dataTransfer?.files || [])].filter(f => f.type.startsWith("image/"));
  if (!files.length) return;
  await addFiles(files);
});

els.addUrlBtn.addEventListener("click", () => els.urlModal.showModal());
els.urlModal.addEventListener("close", () => {
  if (els.urlModal.returnValue !== "add") return;
  const url = els.urlForm.elements.url.value.trim();
  const title = els.urlForm.elements.title.value.trim();
  const tags = parseTags(els.urlForm.elements.tags.value);
  if (url) addItem({ src: url, title, tags });
  els.urlForm.reset();
});

els.filterSelect.addEventListener("change", renderGrid);
els.searchInput.addEventListener("input", debounce(renderGrid, 120));
els.shuffleBtn.addEventListener("click", () => { shuffle(state.items); renderGrid(); saveState(); });

els.exportBtn.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "visual-board.json";
  a.click();
  URL.revokeObjectURL(a.href);
});

els.importInput.addEventListener("change", async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  const text = await file.text();
  try {
    const data = JSON.parse(text);
    if (Array.isArray(data.items)) {
      state = data;
      saveState(); renderAll();
    } else alert("Invalid board file.");
  } catch {
    alert("Failed to import JSON.");
  }
});

els.clearBtn.addEventListener("click", () => {
  if (confirm("Clear all images and affirmations?")) {
    state = { items: [] };
    localStorage.removeItem(AFFIRM_KEY);
    saveState(); renderAll();
  }
});

els.segs.forEach(seg => seg.addEventListener("click", () => {
  els.segs.forEach(s => s.classList.remove("active"));
  seg.classList.add("active");
  mode = seg.dataset.mode;
  handleModeChange();
}));

// ----- Affirmations -----
els.addAffirmBtn.addEventListener("click", () => {
  const txt = els.affirmInput.value.trim();
  if (!txt) return;
  const affirmations = loadAffirmations();
  affirmations.push({ id: crypto.randomUUID(), text: txt, date: Date.now() });
  saveAffirmations(affirmations);
  els.affirmInput.value = "";
  renderAffirmations();
});
els.affirmations.addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  if (e.target.matches("button")) {
    const id = chip.dataset.id;
    const aff = loadAffirmations().filter(a => a.id !== id);
    saveAffirmations(aff);
    renderAffirmations();
  }
});

// ----- Focus modal controls -----
els.closeFocus.addEventListener("click", closeFocus);
els.prevBtn.addEventListener("click", () => stepFocus(-1));
els.nextBtn.addEventListener("click", () => stepFocus(1));
els.playBtn.addEventListener("click", togglePlay);
els.toggleFavBtn.addEventListener("click", toggleFavorite);
els.editBtn.addEventListener("click", openEdit);

els.editModal.addEventListener("close", async () => {
  if (els.editModal.returnValue !== "save") return;
  const form = els.editForm;
  const { title, tags, notes } = Object.fromEntries(new FormData(form));
  const item = currentItem();
  if (!item) return;
  item.title = title || "";
  item.tags = parseTags(tags);
  item.notes = notes || "";
  saveState();
  renderGrid();
  openFocusByIndex(cursorIndex);
});

// ----- Keyboard shortcuts -----
window.addEventListener("keydown", (e) => {
  const el = document.activeElement;
  if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) return;
  if (els.focusModal.open) {
    if (e.key === "Escape") return closeFocus();
    if (e.key === "ArrowLeft") return stepFocus(-1);
    if (e.key === "ArrowRight") return stepFocus(1);
    if (e.key === " ") { e.preventDefault(); return togglePlay(); }
    if (e.key.toLowerCase() === "f") return toggleFavorite();
    if (e.key.toLowerCase() === "e") return openEdit();
  } else {
    if (e.key.toLowerCase() === "g") setMode("grid");
    if (e.key.toLowerCase() === "s") setMode("slideshow");
    if (e.key.toLowerCase() === "o") setMode("focus");
    if (e.key === "/") { e.preventDefault(); els.searchInput.focus(); }
  }
});

/* ---------------- Logic ------------------ */
function renderAll(){ renderAffirmations(); renderGrid(); }
function handleModeChange(){
  if (mode === "grid") stopPlay();
  else if (mode === "focus" && state.items.length) openFocusByIndex(0);
  else if (mode === "slideshow" && state.items.length){ openFocusByIndex(0); play(); }
}
function renderAffirmations(){
  const aff = loadAffirmations();
  els.affirmations.innerHTML = aff.map(a => `
    <span class="chip" data-id="${a.id}" title="${new Date(a.date).toLocaleString()}">
      ${escapeHTML(a.text)} <button class="icon-btn" title="Remove">✖</button>
    </span>`).join("");
}

function renderGrid(){
  const q = els.searchInput.value.trim().toLowerCase();
  const filter = (els.filterSelect.value || "").toLowerCase();
  const items = state.items.filter(it => {
    const hay = `${(it.title||"")} ${(it.tags||[]).join(" ")} ${(it.notes||"")}`.toLowerCase();
    const passQ = !q || hay.includes(q);
    const passF = !filter || (it.tags||[]).map(t=>t.toLowerCase()).includes(filter);
    return passQ && passF;
  });
  els.grid.innerHTML = items.map((it,i)=>cardTemplate(it,i)).join("");
  els.grid.querySelectorAll(".card").forEach(card=>{
    const idx = Number(card.dataset.index);
    card.querySelector(".open").addEventListener("click",()=>openFocus(items[idx].id));
    card.querySelector(".fav").addEventListener("click",()=>{
      const real = state.items.find(x=>x.id===items[idx].id);
      real.favorite=!real.favorite; saveState(); renderGrid();
    });
    card.querySelector(".edit").addEventListener("click",()=>openEditById(items[idx].id));
    card.querySelector(".del").addEventListener("click",()=>{
      if(!confirm("Remove this item?"))return;
      state.items=state.items.filter(x=>x.id!==items[idx].id);
      saveState(); renderGrid();
    });
  });
}

function cardTemplate(it,displayIndex){
  const fav=it.favorite?"on":"";
  const tags=(it.tags||[]).map(t=>`<span class="tag">${escapeHTML(t)}</span>`).join("");
  const badge=it.favorite?`<span class="badge">⭐ Favorite</span>`:"";
  return `
    <article class="card" data-index="${displayIndex}">
      ${badge}
      <img src="${it.src}" alt="${escapeAttr(it.title||'Vision image')}" loading="lazy">
      <div class="tools">
        <button class="icon-btn open" title="Open">🔍</button>
        <button class="icon-btn fav ${fav}" title="Favorite">⭐</button>
        <button class="icon-btn edit" title="Edit">✏️</button>
        <button class="icon-btn del" title="Delete">🗑️</button>
      </div>
      <div class="meta">
        <div class="caption">${escapeHTML(it.title||"Untitled")}</div>
        <div class="tags">${tags}</div>
      </div>
    </article>`;
}

/* Focus/slideshow */
function openFocus(id){ const idx=state.items.findIndex(x=>x.id===id); if(idx!==-1) openFocusByIndex(idx); }
function openFocusByIndex(idx){
  cursorIndex=clamp(idx,0,state.items.length-1);
  const item=state.items[cursorIndex];
  els.focusImg.src=item.src; els.focusImg.alt=item.title||"Vision image";
  els.focusCaption.textContent=item.title||"";
  els.toggleFavBtn.classList.toggle("on",!!item.favorite);
  if(!els.focusModal.open) els.focusModal.showModal();
}
function closeFocus(){ stopPlay(); els.focusModal.close(); }
function stepFocus(d){ const n=(cursorIndex+d+state.items.length)%state.items.length; openFocusByIndex(n); }
function play(){ playing=true; els.playBtn.textContent="⏸ Pause"; playTimer=setInterval(()=>stepFocus(1),2800);}
function stopPlay(){ playing=false; els.playBtn.textContent="▶ Play"; if(playTimer)clearInterval(playTimer); playTimer=null;}
function togglePlay(){ playing?stopPlay():play(); }
function toggleFavorite(){ const it=currentItem(); if(!it)return; it.favorite=!it.favorite; els.toggleFavBtn.classList.toggle("on",it.favorite); saveState(); renderGrid();}
function openEdit(){ const it=currentItem(); if(!it)return;
  els.editForm.elements.title.value=it.title||"";
  els.editForm.elements.tags.value=(it.tags||[]).join(", ");
  els.editForm.elements.notes.value=it.notes||"";
  els.editModal.returnValue=""; els.editModal.showModal();
}
function openEditById(id){ const idx=state.items.findIndex(x=>x.id===id); if(idx===-1)return; openFocusByIndex(idx); openEdit();}
function currentItem(){ return state.items[cursorIndex]||null; }

/* ---------- File add with compression ---------- */
async function addFiles(files){
  const added=[];
  for(const file of files){
    try{
      const src=await fileToCompressedDataURL(file,{maxW:1600,maxH:1600,quality:0.85});
      const title=file.name.replace(/\.[^.]+$/,'');
      const item={id:crypto.randomUUID(),src,title,tags:[],notes:"",favorite:false,dateAdded:Date.now()};
      state.items.unshift(item); added.push(item);
    }catch(err){ console.warn("Skipped file",file?.name,err); }
  }
  if(added.length){
    const ok=trySaveState();
    if(!ok){
      const ids=new Set(added.map(a=>a.id));
      state.items=state.items.filter(it=>!ids.has(it.id));
      alert("⚠️ Storage full: image(s) shown temporarily but not saved. Try smaller images.");
    }
    renderGrid();
  }
}

async function fileToCompressedDataURL(file,{maxW=1600,maxH=1600,quality=0.85}={}){
  const raw=await fileToDataURL(file);
  const img=await createImageBitmap(await (await fetch(raw)).blob());
  const {width,height}=img;
  let tw=width,th=height;
  if(width>maxW||height>maxH){ const r=Math.min(maxW/width,maxH/height); tw=Math.round(width*r); th=Math.round(height*r);}
  const canvas=document.createElement("canvas"); canvas.width=tw; canvas.height=th;
  const ctx=canvas.getContext("2d",{alpha:false}); ctx.drawImage(img,0,0,tw,th);
  const dataUrl=canvas.toDataURL("image/jpeg",quality);
  img.close?.(); return dataUrl;
}

function fileToDataURL(file){
  return new Promise((res,rej)=>{
    const r=new FileReader(); r.onerror=()=>rej(new Error("read fail"));
    r.onload=()=>res(r.result); r.readAsDataURL(file);
  });
}

/* ---------- Storage helpers ---------- */
function trySaveState(){
  try{ localStorage.setItem(LS_KEY,JSON.stringify(state)); return true; }
  catch(e){ console.warn("localStorage save failed (quota?):",e); return false; }
}
function saveState(){ trySaveState(); }

function loadState(){
  try{ const raw=localStorage.getItem(LS_KEY);
    if(!raw) return {items:[]};
    const parsed=JSON.parse(raw);
    return Array.isArray(parsed.items)?parsed:{items:[]};
  }catch{return {items:[]};}
}
function loadAffirmations(){ try{const raw=localStorage.getItem(AFFIRM_KEY);return raw?JSON.parse(raw):[];}catch{return[];} }
function saveAffirmations(list){ localStorage.setItem(AFFIRM_KEY,JSON.stringify(list)); }

/* ---------- Utils ---------- */
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function parseTags(s){return(s||"").split(",").map(t=>t.trim()).filter(Boolean).slice(0,8);}
function clamp(n,a,b){return Math.max(a,Math.min(b,n));}
function debounce(fn,ms=150){let t;return(...args)=>{clearTimeout(t);t=setTimeout(()=>fn(...args),ms);};}
function escapeHTML(s){return(s||"").replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function escapeAttr(s){return escapeHTML(s).replace(/"/g,'&quot;');}
function setMode(m){mode=m;els.segs.forEach(s=>s.classList.toggle("active",s.dataset.mode===m));handleModeChange();}

console.info("Shortcuts: g(grid) s(slideshow) o(focus) / (search) ←/→ space(play) f(fav) e(edit)");
