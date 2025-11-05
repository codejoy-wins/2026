// visual.js — Vision Board + Tarot Deck (fixed card height + flip + compression)
// Favorite UX: outline ☆ ↔ filled ★, no badge bubble
const LS_KEY = "visualBoard.v2";
const AFFIRM_KEY = "visualBoard.v2.affirmations";

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
  // Focus modal
  focusModal: document.getElementById("focusModal"),
  closeFocus: document.getElementById("closeFocus"),
  prevBtn: document.getElementById("prevBtn"),
  nextBtn: document.getElementById("nextBtn"),
  playBtn: document.getElementById("playBtn"),
  toggleFavBtn: document.getElementById("toggleFavBtn"),
  focusImg: document.getElementById("focusImg"),
  focusCaption: document.getElementById("focusCaption"),
  focusTags: document.getElementById("focusTags"),
  focusNotes: document.getElementById("focusNotes"),
  editBtn: document.getElementById("editBtn"),
  // Edit modal
  editModal: document.getElementById("editModal"),
  editForm: document.getElementById("editForm"),
};

let state = loadState();
let mode = "grid";
let playing = false;
let playTimer = null;
let cursorIndex = 0;

/* ---------- Tarot dataset ---------- */
const TAROT_DECK = [
  { name: "The Fool", meaning: "A new journey begins. Trust the unknown." },
  { name: "The Magician", meaning: "You have the tools to manifest your vision." },
  { name: "The High Priestess", meaning: "Listen to your inner wisdom." },
  { name: "The Empress", meaning: "Creativity and abundance are blossoming." },
  { name: "The Emperor", meaning: "Take control; build your empire." },
  { name: "The Hierophant", meaning: "Spiritual guidance lights your path." },
  { name: "The Lovers", meaning: "A meaningful choice is before you." },
  { name: "The Chariot", meaning: "Drive and focus will carry you to victory." },
  { name: "Strength", meaning: "Courage within will tame the storm." },
  { name: "The Hermit", meaning: "Reflection will reveal the truth." },
  { name: "Wheel of Fortune", meaning: "Change spins in your favor." },
  { name: "Justice", meaning: "Balance and fairness restore order." },
  { name: "The Hanged Man", meaning: "Shift perspective; surrender to growth." },
  { name: "Death", meaning: "Transformation clears the path ahead." },
  { name: "Temperance", meaning: "Patience brings harmony." },
  { name: "The Devil", meaning: "Free yourself from illusions." },
  { name: "The Tower", meaning: "Old structures fall to reveal truth." },
  { name: "The Star", meaning: "Hope renews your faith in destiny." },
  { name: "The Moon", meaning: "Dreams and intuition guide you." },
  { name: "The Sun", meaning: "Joy and clarity illuminate your path." },
  { name: "Judgement", meaning: "Awakening leads to purpose." },
  { name: "The World", meaning: "Fulfillment — a cycle complete." },
  { name: "Two of Wands", meaning: "Your vision will soon manifest in reality." },
  { name: "Nine of Swords", meaning: "Release worry; dawn follows the night." },
  { name: "Ace of Cups", meaning: "New emotional beginnings overflow." },
  { name: "Ten of Pentacles", meaning: "Legacy and prosperity are building." },
];

/* ---------- Seed (first run) ---------- */
if (state.items.length === 0) {
  state.items.push({
    id: crypto.randomUUID(),
    src: "/static/img/DBS.jpeg",
    title: "Dream Car",
    tags: ["Lifestyle", "Wealth"],
    notes: "Freedom, reliability, status — a symbol but also a tool.",
    favorite: true,
    tarot: pickTarot(),
    dateAdded: Date.now(),
  });
  saveState();
}

renderAll();

/* ---------- Events ---------- */
els.fileInput.addEventListener("change", async e => {
  const files = [...e.target.files];
  if (files.length) await addFiles(files);
});

["dragenter","dragover"].forEach(ev => els.drop.addEventListener(ev,(e)=>{
  e.preventDefault(); e.stopPropagation(); els.drop.classList.add("drag");
}));
["dragleave","drop"].forEach(ev => els.drop.addEventListener(ev,(e)=>{
  e.preventDefault(); e.stopPropagation(); els.drop.classList.remove("drag");
}));
els.drop.addEventListener("drop", async (e)=>{
  const files=[...(e.dataTransfer?.files||[])].filter(f=>f.type.startsWith("image/"));
  if(files.length) await addFiles(files);
});

els.addUrlBtn.addEventListener("click",()=>els.urlModal.showModal());
els.urlModal.addEventListener("close",()=>{
  if(els.urlModal.returnValue!=="add") return;
  const url=els.urlForm.elements.url.value.trim();
  const title=els.urlForm.elements.title.value.trim();
  const tags=parseTags(els.urlForm.elements.tags.value);
  if(url) addItem({src:url,title,tags});
  els.urlForm.reset();
});

els.shuffleBtn.addEventListener("click",()=>{ shuffle(state.items); renderGrid(); saveState(); });

// Live search & dropdown filter
els.searchInput.addEventListener("input", () => renderGrid());
els.filterSelect.addEventListener("change", () => renderGrid());

els.exportBtn.addEventListener("click",()=>{
  const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});
  const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="visual-board.json"; a.click(); URL.revokeObjectURL(a.href);
});

els.importInput.addEventListener("change",async(e)=>{
  const file=e.target.files?.[0]; if(!file) return;
  try{
    const data=JSON.parse(await file.text());
    if(Array.isArray(data.items)){ state=data; saveState(); renderAll(); }
    else alert("Invalid board file.");
  }catch{ alert("Failed to import JSON."); }
});

els.clearBtn.addEventListener("click",()=>{
  if(confirm("Clear all images and affirmations?")){
    state={items:[]};
    localStorage.removeItem(AFFIRM_KEY);
    saveState(); renderAll();
  }
});

els.segs.forEach(seg=>seg.addEventListener("click",()=>{
  els.segs.forEach(s=>s.classList.remove("active"));
  seg.classList.add("active");
  mode=seg.dataset.mode;
  handleModeChange();
}));

// Affirmations
els.addAffirmBtn.addEventListener("click",()=>{
  const txt=els.affirmInput.value.trim(); if(!txt) return;
  const aff=loadAffirmations(); aff.push({id:crypto.randomUUID(),text:txt,date:Date.now()});
  saveAffirmations(aff); els.affirmInput.value=""; renderAffirmations();
});
els.affirmations.addEventListener("click",(e)=>{
  const chip=e.target.closest(".chip"); if(!chip) return;
  if(e.target.matches("button")){
    const id=chip.dataset.id;
    const aff=loadAffirmations().filter(a=>a.id!==id);
    saveAffirmations(aff); renderAffirmations();
  }
});

// Focus modal controls
els.closeFocus.addEventListener("click",closeFocus);
els.prevBtn.addEventListener("click",()=>stepFocus(-1));
els.nextBtn.addEventListener("click",()=>stepFocus(1));
els.playBtn.addEventListener("click",togglePlay);
els.toggleFavBtn.addEventListener("click",toggleFavorite);
els.editBtn.addEventListener("click",openEdit);

els.editModal.addEventListener("close",()=>{
  if(els.editModal.returnValue!=="save") return;
  const {title,tags,notes}=Object.fromEntries(new FormData(els.editForm));
  const item=currentItem(); if(!item) return;
  item.title=title||""; item.tags=parseTags(tags); item.notes=notes||"";
  saveState(); renderGrid(); openFocusByIndex(cursorIndex);
});

// Keyboard shortcuts (don’t hijack while typing)
window.addEventListener("keydown",(e)=>{
  const el=document.activeElement;
  if(el && (el.tagName==="INPUT" || el.tagName==="TEXTAREA" || el.isContentEditable)) return;
  if(els.focusModal.open){
    if(e.key==="Escape") return closeFocus();
    if(e.key==="ArrowLeft") return stepFocus(-1);
    if(e.key==="ArrowRight") return stepFocus(1);
    if(e.key===" "){ e.preventDefault(); return togglePlay(); }
    if(e.key.toLowerCase()==="f") return toggleFavorite();
    if(e.key.toLowerCase()==="e") return openEdit();
  }
});

/* ---------- Rendering ---------- */
function renderAll(){ renderAffirmations(); renderGrid(); }

function handleModeChange(){
  if(mode==="grid") stopPlay();
  else if(mode==="focus"){ if(state.items.length) openFocusByIndex(0); }
  else if(mode==="slideshow"){ if(state.items.length){ openFocusByIndex(0); play(); } }
}

function renderAffirmations(){
  const aff=loadAffirmations();
  els.affirmations.innerHTML=aff.map(a=>`
    <span class="chip" data-id="${a.id}" title="${new Date(a.date).toLocaleString()}">
      ${escapeHTML(a.text)} <button class="icon-btn" title="Remove">✖</button>
    </span>`).join("");
}

function renderGrid(){
  const q=els.searchInput?.value?.trim().toLowerCase()||"";
  const filter=(els.filterSelect?.value||"").toLowerCase();
  const items=state.items.filter(it=>{
    const hay=`${(it.title||"")} ${(it.tags||[]).join(" ")} ${(it.notes||"")}`.toLowerCase();
    const passQ=!q||hay.includes(q);
    const passF=!filter||(it.tags||[]).map(t=>t.toLowerCase()).includes(filter);
    return passQ&&passF;
  });

  els.grid.innerHTML=items.map((it,i)=>cardTemplate(it,i)).join("");

  // Wire card buttons + flip
  els.grid.querySelectorAll(".card").forEach(card=>{
    const idx=Number(card.dataset.index);

    // stop flip when icon clicked
    card.querySelectorAll(".icon-btn").forEach(btn=>{
      btn.addEventListener("click",e=>e.stopPropagation());
    });

    // click card to flip
    card.addEventListener("click",(e)=>{
      if(e.target.closest(".icon-btn")) return;
      card.classList.toggle("flipped");
    });

    // open focus
    card.querySelector(".open").addEventListener("click",()=>openFocus(items[idx].id));

    // favorite toggle (no badge, star updates in-place)
    const favBtn = card.querySelector(".fav");
    favBtn.addEventListener("click",(e)=>{
      e.stopPropagation();
      const real=state.items.find(x=>x.id===items[idx].id);
      if(!real) return;
      real.favorite = !real.favorite;
      favBtn.classList.toggle("on", real.favorite);
      favBtn.setAttribute("aria-pressed", real.favorite);
      favBtn.textContent = real.favorite ? "★" : "☆";
      saveState();
    });

    // edit
    card.querySelector(".edit").addEventListener("click",()=>openEditById(items[idx].id));

    // delete
    card.querySelector(".del").addEventListener("click",()=>{
      if(!confirm("Remove this item?")) return;
      state.items=state.items.filter(x=>x.id!==items[idx].id);
      saveState(); renderGrid();
    });
  });
}

function cardTemplate(it,i){
  const favOn = !!it.favorite;
  const favClass = favOn ? "on" : "";
  const favChar  = favOn ? "★" : "☆";
  const tags=(it.tags||[]).map(t=>`<span class="tag">${escapeHTML(t)}</span>`).join("");
  const tarot=it.tarot||pickTarot();

  const front=`
    <div class="card-front">
      <img src="${it.src}" alt="${escapeAttr(it.title||'Vision image')}" loading="lazy">
      <div class="tools">
        <button class="icon-btn open" title="Open">🔍</button>
        <button class="icon-btn fav ${favClass}" title="Toggle favorite" aria-pressed="${favOn}">${favChar}</button>
        <button class="icon-btn edit" title="Edit">✏️</button>
        <button class="icon-btn del" title="Delete">🗑️</button>
      </div>
      <div class="meta">
        <div class="caption">${escapeHTML(it.title||"Untitled")}</div>
        <div class="tags">${tags}</div>
      </div>
    </div>`;

    // choose gold or purple
  const backImg = Math.random() < 0.5 
    ? "/static/img/cywiz.png"
    : "/static/img/cywiz-purple.png";

  const back = `
    <div class="card-back" style="background-image: url('${backImg}')">
      <h3 class="tarot-name">${tarot.name}</h3>
      <p class="tarot-meaning">${tarot.meaning}</p>
    </div>`;


  // const back=`
  //   <div class="card-back">
  //     <h3 class="tarot-name">${tarot.name}</h3>
  //     <p class="tarot-meaning">${tarot.meaning}</p>
  //   </div>`;

  return `<article class="card" data-index="${i}">
    <div class="card-inner">${front}${back}</div>
  </article>`;
}

/* ---------- Focus / slideshow ---------- */
function openFocus(id){
  const idx=state.items.findIndex(x=>x.id===id);
  if(idx===-1) return;
  openFocusByIndex(idx);
}
function openFocusByIndex(idx){
  cursorIndex=clamp(idx,0,state.items.length-1);
  const item=state.items[cursorIndex];
  els.focusImg.src=item.src;
  els.focusCaption.textContent=item.title||"";
  els.toggleFavBtn.classList.toggle("on", !!item.favorite);
  els.toggleFavBtn.setAttribute("aria-pressed", !!item.favorite);
  els.toggleFavBtn.textContent = item.favorite ? "★" : "☆";
  if(els.focusTags) els.focusTags.innerHTML=(item.tags||[]).map(t=>`<span class="tag">${escapeHTML(t)}</span>`).join("");
  if(els.focusNotes) els.focusNotes.textContent=item.notes||"";
  if(!els.focusModal.open) els.focusModal.showModal();
}
function closeFocus(){ stopPlay(); els.focusModal.close(); }
function stepFocus(d){ const n=(cursorIndex+d+state.items.length)%state.items.length; openFocusByIndex(n); }
function play(){ playing=true; els.playBtn.textContent="⏸ Pause"; playTimer=setInterval(()=>stepFocus(1),2800); }
function stopPlay(){ playing=false; els.playBtn.textContent="▶ Play"; if(playTimer) clearInterval(playTimer); playTimer=null; }
function togglePlay(){ playing?stopPlay():play(); }
function toggleFavorite(){
  const it=currentItem(); if(!it) return;
  it.favorite=!it.favorite;
  els.toggleFavBtn.classList.toggle("on", it.favorite);
  els.toggleFavBtn.setAttribute("aria-pressed", it.favorite);
  els.toggleFavBtn.textContent = it.favorite ? "★" : "☆";
  saveState();
  renderGrid(); // keep card stars in sync
}
function openEdit(){
  const it=currentItem(); if(!it)return;
  els.editForm.elements.title.value=it.title||"";
  els.editForm.elements.tags.value=(it.tags||[]).join(", ");
  els.editForm.elements.notes.value=it.notes||"";
  els.editModal.returnValue=""; els.editModal.showModal();
}
function openEditById(id){
  const idx=state.items.findIndex(x=>x.id===id);
  if(idx===-1)return;
  openFocusByIndex(idx); openEdit();
}
function currentItem(){ return state.items[cursorIndex]||null; }

/* ---------- Add files (compression) ---------- */
async function addFiles(files){
  const added=[];
  for(const file of files){
    try{
      const src=await fileToCompressedDataURL(file,{maxW:1600,maxH:1600,quality:0.85});
      const title=file.name.replace(/\.[^.]+$/,'');
      const tarot=pickTarot();
      const item={id:crypto.randomUUID(),src,title,tags:[],notes:"",favorite:false,tarot,dateAdded:Date.now()};
      state.items.unshift(item); added.push(item);
    }catch(err){ console.warn("Skipped file",file?.name,err); }
  }
  if(added.length){ saveState(); renderGrid(); }
}

/* ---------- Helpers ---------- */
/* ---------- Add item from URL ---------- */
function addItem({src, title="", tags=[]}){
  const tarot = pickTarot();
  const item = {
    id: crypto.randomUUID(),
    src,
    title,
    tags,
    notes: "",
    favorite: false,
    tarot,
    dateAdded: Date.now()
  };
  state.items.unshift(item);
  saveState();
  renderGrid();
}

function pickTarot(){ return TAROT_DECK[Math.floor(Math.random()*TAROT_DECK.length)]; }

async function fileToCompressedDataURL(file,{maxW=1600,maxH=1600,quality=0.85}={}){
  const raw=await fileToDataURL(file);
  const img=await createImageBitmap(await (await fetch(raw)).blob());
  const {width,height}=img;
  let tw=width,th=height;
  if(width>maxW||height>maxH){const r=Math.min(maxW/width,maxH/height);tw=Math.round(width*r);th=Math.round(height*r);}
  const canvas=document.createElement("canvas");canvas.width=tw;canvas.height=th;
  const ctx=canvas.getContext("2d",{alpha:false});ctx.drawImage(img,0,0,tw,th);
  const dataUrl=canvas.toDataURL("image/jpeg",quality);img.close?.();return dataUrl;
}
function fileToDataURL(file){
  return new Promise((res,rej)=>{
    const r=new FileReader();
    r.onerror=()=>rej(new Error("read fail"));
    r.onload=()=>res(r.result);
    r.readAsDataURL(file);
  });
}
function saveState(){ try{ localStorage.setItem(LS_KEY,JSON.stringify(state)); }catch(e){ console.warn("Save fail",e); } }
function loadState(){ try{const raw=localStorage.getItem(LS_KEY); if(!raw) return {items:[]}; const parsed=JSON.parse(raw); return Array.isArray(parsed.items)?parsed:{items:[]}; }catch{ return {items:[]}; } }
function loadAffirmations(){ try{ const raw=localStorage.getItem(AFFIRM_KEY); return raw?JSON.parse(raw):[]; }catch{ return []; } }
function saveAffirmations(list){ localStorage.setItem(AFFIRM_KEY,JSON.stringify(list)); }
function parseTags(s){ return (s||"").split(",").map(t=>t.trim()).filter(Boolean).slice(0,8); }
function clamp(n,a,b){ return Math.max(a,Math.min(b,n)); }
function escapeHTML(s){ return (s||"").replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function escapeAttr(s){ return escapeHTML(s).replace(/"/g,'&quot;'); }
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }

console.info("✨ Tarot Vision Board loaded. Favorites use ☆/★ and no bubble — click to toggle.");
