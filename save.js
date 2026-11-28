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
        console.log("I see you're on a desktop");
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
        console.log("I see you're on a tablet");
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
        console.log("I see you're on your phone");
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

function craig(){
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

let songz = [
    `hates`,
    `Lying`,
    `cali`,
    `Afterlie`,
    `diamond`,
    `addvicewithafriend`,
    `AdoreYou`,
    `only`,
    `winter`,
    `herestoyou`,
    `fakebook`,
    `RidingTooHigh`,
    `KingOfParadise`,
    `Fly2`,
    `Alika`,
    `WrongSideOfTheSea`,
    `Jfc`,
    `notalone`,
    `Alone2`,
    `Alonev2`,
    `Sudoku`,
    `Fireg`,
    `bleedingoutpro`,
    `SuperFireMedley`,
    `Madly`,
    `Bleeding`,
    `711117`,
    `Eternalized`,
    `liquified`,
    `royaThaDestroya`,
    `lovelyRap`,
    `ruler`,
    `deadInternet`,
    `GreedyKing`,
    `GodStreetPark`,
    `coldSoul`,
]

let songs = [
       `This Town Hates Me`,
       `Lying`,
       `California`,
       `Afterli(f)e`,
       `Cold Diamond`,
       `Add Vice for a Friend`,
       `Adore You`,
       `If Only`,
       `Beautiful Winter`,
       `Here's to You`,
       `Fakebook`,
       `Riding Too High`,
       `King of Paradise`,
       `Fly`,
       `Alika and the Art of Zen Maintenance`,
       `Wrong Side of the Sea`,
       `JFC`,
       `Not Alone`,
       `Alone`,
       `All Alone`,
       `Sudoku`,
       `Fire Girl`,
       `Bleeding Out (pro version)`,
       `Super Fire Medley`,
       `Madly`,
       `Bleeding Out`,
       `Seven Eleven One One Seven`,
       `Eternalized`,
       `liquified`,
       `Roya Tha Destroya`,
       `Lovely Rap`,
       `Ruler`,
       `Dead Internet Theory`,
       `King of Greed`,
       `God's Street Park`,
       `Cold Soul`,
]

let smartSongs = [
    {
        title:`This Town Hates Me`,
        file:`hates.mp3`
    },
    {
        title:`Lying`,
        file:`Lying.mp3`
    },
    {
        title:`California`,
        file:`cali.mp3`
    },
    {
        title:`Afterli(f)e`,
        file:`Afterli.mp3`
    },
    {
        title:`Cold Diamond`,
        file:`diamond.mp3`
    },
    {
        title:`Add Vice for a Friend`,
        file:`addvicewithafriend.mp3`
    },
    {
        title:`Adore you`,
        file:`AdoreYou.mp3`
    },
    {
        title:`If Only`,
        file:`only.mp3`
    },
    {
        title:`Beautiful Winter`,
        file:`winter.mp3`
    },
    {
        title:`Here's to You`,
        file:`herestoyou.mp3`
    },
    {
        title:`Fakebook`,
        file:`fakebook.mp3`
    },
    {
        title:`Riding Too High`,
        file:`RidingTooHigh.mp3`
    },
    {
        title:`King of Paradise`,
        file:`KingOfParadise.mp3`
    },
    {
        title:`Fly`,
        file:`Fly2.mp3`
    },
    {
        title:`Alika and the Art of Zen Maintenance`,
        file:`Alika.mp3`
    },
    {
        title:`Wrong Side of the Sea`,
        file:`WrongSideOfTheSea.mp3`
    },
    {
        title:`Jesus Something Christ`,
        file:`Jfc.mp3`
    },
    {
        title:`Not Alone`,
        file:`notalone.mp3`
    },
    {
        title:`Alone`,
        file:`Alone2.mp3`
    },
    {
        title:`All Alone`,
        file:`Alonev2.mp3`
    },
    {
        title:`Sudoku`,
        file:`Sudoku`
    },
    {
        title:`Fire Girl`,
        file:`Fireg.mp3`
    },
    {
        title:`Bleeding Out (extended version)`,
        file:`bleedingoutpro.mp3`
    },
    {
        title:`Seven Eleven 117`,
        file:`711117.mp3`
    },
    {
        title:`Eternalized`,
        file:`Eternalized.mp3`
    },
    {
        title:`Liquified`,
        file:`liquified.mp3`
    },
    {
        title:`Roya Tha Destroya`,
        file:`royaThaDestroya.mp3`
    },
    {
        title:`Lovely Rap`,
        file:`lovelyRap.mp3`
    },
    {
        title:`Ruler`,
        file:`ruler.mp3`
    },
    {
        title:`Dead Internet Theory`,
        file:`deadInternet.mp3`,
    },
    {
        title:`King of Greed`,
        file:`GreedyKing.mp3`
    },
    {
        title:`God's Street Park`,
        file:`GodStreetPark.mp3`
    },
    {
        title:`Cold Soul`,
        file:`coldSoul.mp3`
    },
]

let playlist = [];      // current shuffled order
let history  = [];      // what we’ve already played
let current  = null;    // the song-object that’s playing now

// Fisher–Yates shuffle with ChatGPT
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
// initialize on page-load or first play
function startSession() {
  playlist = shuffle(songs);
  history  = [];
  playNext();
}


function randosong(){
    let ra = Math.floor(Math.random()*songz.length);
    let x = songz[ra];
    let y = songs[ra];
    console.log(`xxx is ${x}`);
    
    document.getElementById("introsong").innerHTML=`
    <audio id="player" onended="randosong()" src="/static/audio/${x}.mp3"></audio>
    `
    document.getElementById("descsong2").innerHTML=`
    <p>${y}</p>
    `
    document.getElementById("treeternal").innerHTML=`
        <img class="picalu" src="static/img/sensaplay.jpeg" alt="treeternal">
    `
}



randosong();

function freezefire(){
    let targ = document.getElementById("player");
    console.log("She can freeze fire from the Son");
    console.log(`targ.paused is ${targ.paused}`);
    if(targ.paused == true){
        console.log("trying to play");
        targ.play();
        document.getElementById("treeternal").innerHTML=`
        <img class="picalu" src="static/img/warright.jpeg" alt="warright">
        `
    }
    else if(targ.paused == false){
        console.log("trying to pause");
        targ.pause();
        document.getElementById("treeternal").innerHTML=`
        <img class="picalu" src="static/img/sensaplay.jpeg" alt="treeternal">
        `
    }
    console.log(`targ.paused is now ${targ.paused}`);

}
function water(){
    let targy = document.getElementById("player");
    console.log("water rewind");
    // document.getElementById("player").rewind();
    console.log(`targy time is ${targy.currentTime}`);
    targy.currentTime = 0;
}
function air(){
    console.log("air fast forward");
    randosong();
    freezefire();
}

// ********** Album Code End **********