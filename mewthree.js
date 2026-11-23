"use strict";

const $ = id => document.getElementById(id);
const teamKey = "mewthree.arena.team.v1";
const logKey = "mewthree.arena.log.v1";
const capacity = 6;
let recruiting = false;
let fighting = false;

function read(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function pokemon(data) {
  if (typeof data?.name !== "string" || !data.name.trim()) return null;
  const types = Array.isArray(data.types) ? data.types.map(t => typeof t === "string" ? t : t?.type?.name).filter(t => typeof t === "string") : [];
  const sprite = data.sprite || data.sprites?.front_default;
  return { name: data.name, types, sprite: typeof sprite === "string" && sprite.startsWith("https://") ? sprite : "" };
}

// Seed the arena once from the original Pokédex. All subsequent writes use arena keys.
const saved = read(teamKey);
const initial = Array.isArray(saved) ? saved : read("pokemonTeam");
const team = Array.isArray(initial) ? initial.map(pokemon).filter(Boolean).slice(0, capacity) : [];
if (!Array.isArray(saved) && team.length) save(teamKey, team);
const historyData = read(logKey);
const battles = Array.isArray(historyData) ? historyData.filter(b =>
  Array.isArray(b?.names) && b.names.every(n => typeof n === "string") && typeof b.reply === "string"
).slice(0, 3) : [];

function displayName(value) {
  return value.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function controls() {
  const locked = recruiting || fighting;
  const full = team.length === capacity;
  $("challenge").disabled = locked || !team.length;
  $("add").disabled = locked || full;
  $("query").disabled = locked || full;
  document.querySelectorAll("#picks button").forEach(b => { b.disabled = locked || full; });
  document.querySelectorAll(".remove").forEach(b => { b.disabled = locked; });
  $("challenge").firstChild.textContent = fighting ? "Mewthree is reading your team… " : "Challenge Mewthree ";
}

function renderTeam() {
  const list = $("team");
  list.replaceChildren();
  for (let i = 0; i < capacity; i++) {
    const member = team[i];
    const slot = element("li", undefined, member ? "slot" : "slot empty");
    slot.append(element("span", String(i + 1).padStart(2, "0"), "num"));
    if (member) {
      if (member.sprite) {
        const img = element("img");
        img.alt = "";
        img.src = member.sprite;
        img.onerror = () => img.remove();
        slot.append(img);
      }
      const info = element("div");
      info.append(element("strong", displayName(member.name)), element("small", member.types.map(displayName).join(" / ")));
      const remove = element("button", "×", "remove");
      remove.setAttribute("aria-label", "Remove " + displayName(member.name) + " from slot " + (i + 1));
      remove.onclick = () => {
        team.splice(i, 1);
        announceChange(displayName(member.name) + " removed.");
        $("query").focus();
      };
      slot.append(info, remove);
    } else {
      slot.append(element("span", "Open slot"));
    }
    list.append(slot);
  }
  $("count").textContent = team.length + " / " + capacity;
  const types = [...new Set(team.flatMap(p => p.types))];
  $("coverage").textContent = team.length ? "Team types · " + types.map(displayName).join(" / ") : "Recruit your first Pokémon to unlock the challenge.";
  controls();
}

function announceChange(message) {
  const stored = save(teamKey, team);
  renderTeam();
  $("note").textContent = message + (stored ? "" : " This browser could only keep the change for this session.");
}

async function timedFetch(url, options, ms, consume) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return await consume(response);
  } finally {
    clearTimeout(timer);
  }
}

async function recruit(value) {
  if (recruiting || fighting || team.length >= capacity) return;
  let query = value.trim().toLowerCase().replace(/^#/, "").replace(/\./g, "").replace(/[\s_]+/g, "-");
  if (/^\d+$/.test(query)) query = String(Number(query));
  if (!query) return;
  recruiting = true;
  controls();
  $("note").textContent = "Looking up " + query + "…";
  try {
    const member = await timedFetch("https://pokeapi.co/api/v2/pokemon/" + encodeURIComponent(query), {}, 12000, async response => {
      if (response.status === 404) throw new Error("No match. Try the Pokédex number or another spelling.");
      if (!response.ok) throw new Error("The Pokédex is unavailable. Try again shortly.");
      return pokemon(await response.json());
    });
    if (!member) throw new Error("The Pokédex returned an incomplete entry.");
    team.push(member);
    $("query").value = "";
    announceChange(displayName(member.name) + " joined." + (team.length === capacity ? " Your team is full. Challenge Mewthree or remove a member to swap." : ""));
  } catch (error) {
    $("note").textContent = error.name === "AbortError" ? "Lookup timed out. Try again." : (error instanceof TypeError ? "Couldn’t reach the Pokédex. Check your connection and try again." : error.message);
  } finally {
    recruiting = false;
    controls();
    (team.length === capacity ? $("challenge") : $("query")).focus();
  }
}

function renderRecords() {
  $("records").replaceChildren(...battles.map((battle, i) => {
    const entry = element("details");
    entry.open = i === 0;
    entry.append(element("summary", battle.names.map(displayName).join(" · ")), element("p", battle.reply, "reading"));
    return entry;
  }));
}

async function challenge() {
  if (fighting || recruiting || !team.length) return;
  const names = team.map(p => p.name);
  fighting = true;
  controls();
  $("battleStatus").textContent = "Mewthree is studying your lineup…";
  $("archive").scrollIntoView({ block: "nearest" });
  try {
    const reply = await timedFetch("/.netlify/functions/simp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ team: names })
    }, 90000, async response => {
      if (!response.ok) throw new Error("Mewthree couldn’t answer this challenge. You can retry with the same team.");
      const data = await response.json();
      const content = data?.summary?.message?.content;
      if (typeof content !== "string" || !content.trim()) throw new Error("The arena received an empty reading. Try the challenge again.");
      return content.trim();
    });
    battles.unshift({ names, reply });
    battles.splice(3);
    renderRecords();
    $("battleStatus").textContent = save(logKey, battles) ? "Mewthree answered." : "Mewthree answered. This reading is available for this session.";
  } catch (error) {
    $("battleStatus").textContent = error.name === "AbortError" ? "The challenge timed out. Your team is ready for a rematch." :
      error instanceof SyntaxError || error instanceof TypeError ? "The arena couldn’t reach the AI function. Try the deployed site or Netlify Dev." : error.message;
  } finally {
    fighting = false;
    controls();
  }
}

$("search").addEventListener("submit", event => {
  event.preventDefault();
  recruit($("query").value);
});
$("picks").addEventListener("click", event => {
  const button = event.target.closest("button");
  if (button) recruit(button.textContent);
});
$("challenge").addEventListener("click", challenge);
renderTeam();
renderRecords();
$("battleStatus").textContent = battles.length ? "" : "Your first reading will appear here after a challenge.";
