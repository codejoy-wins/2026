// ********** Matrix Code Start **********
var c = document.getElementById("c");
var ctx = c.getContext("2d");
//toDataURL() canvas function almost works to make canvas a background
// document.getElementById("new3").style.background = "url(" + canvas.toDataURL() + ")";

//making the canvas full screen
// c.height = window.innerHeight;
// c.width = window.innerWidth;
// new height try
let maxheight;
if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
    // true for mobile device
    console.log("mobile device");
    maxheight=window.innerHeight*1.411;
  }else{
    // false for not mobile device
    console.log("not mobile device");
    maxheight=window.innerHeight*1.117;
  }
c.height = maxheight;
c.width = window.innerWidth;
//mobile


//chinese characters - taken from the unicode charset
var matrix2 = "elamahplacloudlandwhitebloodcellELAMAHPLACLOUDLANDWHITEBLOODCELL117$$$117}";

//converting the string into an array of single characters
matrix2 = matrix2.split("");

var font_size = 10;
var columns = c.width/font_size; //number of columns for the rain
//an array of drops - one per column
var drops = [];
//x below is the x coordinate
//1 = y co-ordinate of the drop(same for every drop initially)
for(var x = 0; x < columns; x++)
    drops[x] = 1; 

//drawing the characters
function draw()
{
    //Black BG for the canvas
    //translucent BG to show trail
    // ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
    ctx.fillStyle = "rgba(0, 0, 0, 0.117)";

    ctx.fillRect(0, 0, c.width, c.height);

    // ctx.fillStyle = "#f4427d";//green text
    ctx.fillStyle = "gold";//green text

    ctx.font = font_size + "px arial";
    //looping over drops
    for(var i = 0; i < drops.length; i++)
    {
        //a random chinese character to print
        var text = matrix2[Math.floor(Math.random()*matrix2.length)];
        //x = i*font_size, y = value of drops[i]*font_size
        ctx.fillText(text, i*font_size, drops[i]*font_size);

        //sending the drop back to the top randomly after it has crossed the screen
        //adding a randomness to the reset to make the drops scattered on the Y axis
        if(drops[i]*font_size > c.height && Math.random() > 0.975)
            drops[i] = 0;

        //incrementing Y coordinate
        drops[i]++;
    }
}

setInterval(draw, 35);
// ********** Matrix Code End **********

// ********** Oracle Code Start **********

// if user is on phone inject text " i see you're on your phone"
// if user is not on phone inject text "thank you for using your computer"
const maxwell = ()=>{
    const burger = document.querySelector('.burger');
    const navs = document.querySelector('.nav-links');
    // 'click'

    burger.addEventListener('click', ()=>{
        navs.classList.toggle('super');
        burger.classList.toggle('green');
    })
}

maxwell();

const deviceType = () => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        console.log('tab');
        return "tablet";
    }
    else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        console.log('mobile');
        return "mobile";
    }
    console.log("desktop");
    return "desktop";
};
deviceType();

const helloWorld = () => {
    if(deviceType()=="desktop"){
        document.getElementById("intro").innerHTML=`
            <p>
            <span id="goldfirst">W</span>elcome to Cloudland, I see you're on your computer.
            </p>
        `
        document.getElementById("flying").innerHTML=`
        <h3 class="insane">Fly through my  <a href="fly.html">interactive resume</a> </h3>
        
        `
        document.getElementById("maxster").innerHTML=`
        <iframe width="560" height="315" src="https://www.youtube.com/embed/E7cUM2CbXBs?si=5nsYowj-xc3nzzDe" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        `
    }
    if(deviceType()=="tablet"){
        document.getElementById("intro").innerHTML=`
            <p>
            <span id="goldfirst">W</span>elcome to Cloudland, I see you're on instagram.
            </p>
        `
        document.getElementById("maxster").innerHTML=`
        <iframe width="100%" height="315" src="https://www.youtube.com/embed/E7cUM2CbXBs?si=5nsYowj-xc3nzzDe" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        `
    }
    if(deviceType()=="mobile"){
        document.getElementById("intro").innerHTML=`
            <p>
            <span id="goldfirst">W</span>elcome to Cloudland, I see you're on your "cell" phone.
            </p>
        `
        // document.getElementById("maxster").innerHTML=`
        //     <iframe width="100%" height="315" src="https://www.youtube.com/embed/PLXK9t4X4Xg?si=bSVqwNMYdjr3FxUu" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        // `
    }
    
}
helloWorld();

const nextTime = () =>{
    let mytiming = new Date();
    let correcttime = mytiming.getHours();
    let pikachu = mytiming.getMinutes();
    let correctday = mytiming.getDay();
    let day = correctday;
    let mandela = false;
    let weekend = false;
    if(day>=5){
        weekend = true;
    }
    if(day==0){
        weekend = true;
    }

    if(correcttime>12){
        correcttime = correcttime -12;
    }
    if(correcttime == 0){
        correcttime = 12;
    }
    console.log('time');
    if(!weekend){
        document.getElementById("next").innerHTML=`
        <p>
            Is it ${correcttime} o'clock already?
        </p>
        <p>
            Only ${5-day} more days til the weekend
        </p>
        `
    }
    else{
        document.getElementById("next").innerHTML=`
        <p>
            Is it ${correcttime} o'clock already?
        </p>
        <p>Enjoy your weekend</p>
    `
    }
    
}
nextTime();
// ********** Oracle Code End **********
// let tokens = 0;
let token = 0;
function craig(){
    if(token>0){
      window.open('https://youtu.be/2vSqYtBBLkI?si=6-opTOogbijZoPhf', '_blank');
    }
    console.log("change for the good");
    let targetofteroh = document.getElementById("teroh");
    document.getElementById("teroh").classList.remove("parallaxnew");
    document.getElementById("teroh").classList.add("parallaxlight");
    document.getElementById("Elam").classList.remove("red");
    document.getElementById("Elam").classList.add("blue");
    document.getElementById("outr").innerHTML=`
    <div class="parallax5117"></div>
    `;
    freezefire();
    token++;
    // tokens >= 1 ?     window.location.href = "https://youtu.be/2vSqYtBBLkI?si=SiOHSWyLQdlA7VG_": console.log('token low');
    // tokens++;
}
function cyberelam(){
    console.log("change for the good");
    let targetofteroh = document.getElementById("teroh");
    document.getElementById("teroh").classList.remove("parallaxnew");
    document.getElementById("teroh").classList.add("parallaxlight");
    document.getElementById("Elam").classList.remove("red");
    document.getElementById("Elam").classList.add("blue");
    document.getElementById("outr").innerHTML=`
    <div class="parallax5117"></div>
    `;
    // freezefire();
}


// run craig again every 5 minutes?
// AmorFati , iDecay, cellPHone2, sinNoMo have been removed due to not being good enough for a first impression

// ********** Album Code Start **********

const smartSongs = [
    { title: "This Town Hates Me", file: "hates.mp3" },
    { title: "Lying",               file: "Lying.mp3" },
    { title: "California",          file: "cali.mp3" },
    { title: "Afterli(f)e",         file: "Afterlie.mp3" },
    { title: "Cold Diamond",        file: "diamond.mp3" },
    { title: "Add Vice for a Friend", file: "addvicewithafriend.mp3" },
    { title: "Adore you",           file: "AdoreYou.mp3" },
    { title: "If Only",             file: "only.mp3" },
    { title: "Beautiful Winter",    file: "winter.mp3" },
    { title: "Here's to You",       file: "herestoyou.mp3" },
    { title: "Fakebook",            file: "fakebook.mp3" },
    { title: "Riding Too High",     file: "RidingTooHigh.mp3" },
    { title: "King of Paradise",    file: "KingOfParadise.mp3" },
    { title: "Fly",                 file: "Fly2.mp3" },
    { title: "Alika and the Art of Zen Maintenance", file: "Alika.mp3" },
    { title: "Wrong Side of the Sea", file: "WrongSideOfTheSea.mp3" },
    { title: "Jesus Something Christ", file: "Jfc.mp3" },
    { title: "Not Alone",           file: "notalone.mp3" },
    { title: "Alone",               file: "Alone2.mp3" },
    { title: "All Alone",           file: "Alonev2.mp3" },
    { title: "Sudoku",              file: "Sudoku.mp3" },
    { title: "Fire Girl",           file: "Fireg.mp3" },
    { title: "Bleeding Out (extended version)", file: "bleedingoutpro.mp3" },
    { title: "Seven Eleven 117",    file: "711117.mp3" },
    { title: "Eternalized",         file: "Eternalized.mp3" },
    { title: "Liquified",           file: "liquified.mp3" },
    { title: "Roya Tha Destroya",   file: "royaThaDestroya.mp3" },
    { title: "Lovely Rap",          file: "lovelyRap.mp3" },
    { title: "Ruler",               file: "ruler.mp3" },
    { title: "Dead Internet Theory", file: "deadInternet.mp3" },
    { title: "King of Greed",       file: "GreedyKing.mp3" },
    { title: "God's Street Park",   file: "GodStreetPark.mp3" },
    { title: "Cold Soul",           file: "coldSoul.mp3" },
    { title: "Madly",           file: "Madly.mp3" },

  ];

  // 2) runtime state
  let playlist = [];
  let history  = [];
  let current  = null;

  // 3) DOM refs
  const player   = document.getElementById("player");
  const descEl   = document.getElementById("descsong2");
  const playIcon = document.querySelector("#treeternal img");
  const mainImg  = document.getElementById("main-img");
  const bottomBtns = document.querySelectorAll(".bottom-btn");

  // 4) Fisher–Yates shuffle
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // 5) load `current` into the player + update title
  function loadCurrent() {
    player.src = `static/audio/${current.file}`;
    descEl.textContent = current.title;
    // reset the icon to “tree”
    playIcon.src = "static/img/sensaplay.jpeg";
  }

  // helper to dump state
// function dumpState(ctx) {
//   console.group(`––– ${ctx} –––`);
//   console.log("Full album:", smartSongs.map(s => s.title));
//   console.log("Shuffled playlist:", playlist.map(s => s.title));
//   console.log("History:", history.map(s => s.title));
//   console.groupEnd();
// }

  // 6) initialize on page-load (no autoplay)
  function startSession() {
    playlist = shuffle(smartSongs);
    history  = [];
    current  = playlist.shift();
    loadCurrent();
    // dumpState("startSession");  // optional call for help
  }

  // 7) next track (reshuffle if needed)
  function playNext() {
    if (current) history.push(current);
    if (!playlist.length) {
      playlist = shuffle(smartSongs);
      history  = [];
      // console.log("➡️ playlist exhausted, reshuffling"); // optional console log
    }
    current = playlist.shift();
    loadCurrent();
    player.play();
    // dumpState("playNext"); // optional
  }

  // 8) previous (or restart if none)
  function playPrev() {
    if (history.length) {
      playlist.unshift(current);
      current = history.pop();
      loadCurrent();
    }
    player.play();
    // dumpState("playPrev"); // optional
  }

  // 9) rewind + double click logic

// restart current track
function rewindSong() {
  player.currentTime = 0;
  player.play();
  console.log("⏮️ single-click: restart current");
  // dumpState("rewindSong");
}


  let _clickTimer = null;
function waterHandler() {
  if (_clickTimer) {
    // second click within 300ms → cancel restart, go to prev
    clearTimeout(_clickTimer);
    _clickTimer = null;
    playPrev();
  } else {
    // first click → schedule a restart after 300ms
    _clickTimer = setTimeout(() => {
      rewindSong();
      console.log("⏮️ single-click: restart current");
      _clickTimer = null;
      // dumpState("rewindSong");
    }, 300);
  }
}


  // 10) toggle play/pause
  function togglePlay() {
    if (player.paused) player.play();
    else               player.pause();
  }

  // 11) expose globals so your inline `onclick="…"` still works
  window.water      = waterHandler;
  window.freezefire = togglePlay;
  window.air        = playNext;
  

  // 12) sync tree⇄fire on native events
  player.addEventListener("play",  () => playIcon.src = "static/img/warright.jpeg");
  player.addEventListener("pause", () => playIcon.src = "static/img/sensaplay.jpeg");
  player.addEventListener("ended", playNext);

  // 13) bottom-button behavior
  bottomBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      mainImg.src = `static/img/${btn.dataset.image}`;
      window.scrollTo({ top: 0, behavior: "smooth" });
      player.play();
    });
  });

  // 14) finally, kick it off
  window.addEventListener("DOMContentLoaded", startSession);

// ********** Album Code End **********

