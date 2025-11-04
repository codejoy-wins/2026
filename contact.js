document.querySelector('.card-container').addEventListener('click', function() {
    this.querySelector('.card').classList.toggle('is-flipped');
    document.getElementById("xp").innerHTML=`
         <a href="mailto:maxwellljann@gmail.com">Email Me</a>
    `;
});