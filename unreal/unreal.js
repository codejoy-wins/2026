const videoId = "f96Ta8fbQQo?si=Czbbg_MhDlvdVKKQ";
function demon(){
    document.getElementById("viper").innerHTML=`
    <div class="vid">
        <iframe width="100%" height="315" src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>
    `
}
demon();