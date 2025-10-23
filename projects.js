document.addEventListener('DOMContentLoaded', function() {
    const projects = [
        { title: "Homepage",
         description: "The homepage to my personal website.  The index.html to maxjann.com.",
         imageUrl: "static/img/elamforever.png",
         linkURL:"index.html",
         videoembed:"",
         date:"2020+",

         },

         { title: "Prime Words", 
            description: "I just built this app with the latest model from openAI, mini o3 high, that finally was able to solve my anagram intelligence test.  I used Node.js and Express and Heroku", 
            imageUrl: "static/img/prime2.png",
            linkURL: "https://primewords-1ad95f96dc03.herokuapp.com/",
            videoembed:"",
            date:"2025",
         },
        
        
         { title: "Mewthree",
         description: "A single-page web application that uses artificial intelligence and a pokemon API to let you pick a team of any 6 pokemon and challenge Mewthree to a battle.  I actually just had to upgrade the AI model to gpt-4o because they discontinued 3.5 turbo so my app stopped working", 
         imageUrl: "static/img/mewthree.png",
         linkURL:"pokedex.html",
         videoembed:"",
         date:"2024+",
         },
         { title: "Blog",
         description: "A dynamically styled blog that automatically displays all my blog posts from that month", 
         imageUrl: "static/img/blogx.png",
         linkURL:"blog.html",
         videoembed:"",
         date:"2020+",
         },
         { title: "DJ Aliens",
         description: "An iPod type App that simulates 2 Alien DJ's for you, a male and a female with different tastes.  I recently updated the girl dj image but I'm still not sold on it, it is different from the picture here.  I could make another version of this but it is tricky.  I think the next full version would have to allow user uploads of songs and sort them, but people don't really have music files anymore as much as stream them on spotify",
        //  imageUrl: "static/img/alienapp.png",
         imageUrl: "static/img/alienz.png",

         linkURL:"alien.html",
         videoembed:"",
         date:"2021+",


         },
         { title: "OneDate",
            description: "A single-page web application that uses artificial intelligence to generate a date for you in between you and your date's current location.  I could still improve this app because it doesn't actually find a location in between, it kind of does, as part of the prompt, but it's not actually using geolocation or anything like that.  Simply upgrading to 4o is already providing good results though", 
            imageUrl: "static/img/1d.jpg",
            linkURL:"onedate.html",
            videoembed:"",
            date:"2024",
            },
            
         { title: "Starbros and other games",
         description: "A game with original assets / level design and mechanics.  Follow the link and it will take you to all my other games",
         imageUrl: "static/img/starclean.png",
         linkURL:"game.html",
         videoembed:"",
         date:"2018",

         },
     { title: "Fantasy Football Apps", 
        description: "The video is a demo of a fullstack web application I built with Python and the Django Framework. The 'Try App' Link will take you to my power rankings where I used a parallax effect to make a fun article for my league to read weekly. ", 
        imageUrl: "static/img/ak.jpg",
        linkURL: "fantasy.html",
        videoembed:"https://www.youtube.com/embed/0Lo2n8dznWY?si=0TGl5-Qkxk-GM36D",
        date:"2019",
     },
         { title: "Meme Creator",
         description: "A primitive app that let's you pair images with text... I should revisit this with A.I.s help and add functionality for users to download created custom memes.",
         imageUrl: "static/img/meme.jpg",
         linkURL:"meme.html",
         videoembed:"",
         date:"2022",

         },
         { title: "Facebook Clone",
         description: "A fully functional previously deployed fullstack web application that let's users log in, customize their wall background and colors, and post on other users walls.  Used Django / Python / AWS.  Eventually had to take it down due to complications with pythonanywhere.  This project best shows my actual backend skillset.",
         imageUrl: "static/img/fakebook.png",
         linkURL:"",
         videoembed:"https://www.youtube.com/embed/cGj6XZNMmQc?si=-ldn3nU6vq1L0pWK",
         date:"2020",

         },

         { title: "Cards",
         description: "A pokemon app where you choose moves and fight a non-ai enemy but it's a well balanced prototype.",
         imageUrl: "static/img/mew.jpg",
         linkURL:"cards.html",
         videoembed:"",
         date:"2023",

         },
         { title: "LuckyBid",
         description: "A fullstack web application where you can log on to bid on items for a chance to win them in a raffle",
         imageUrl: "static/img/luckybid.png",
         linkURL:"",
         videoembed:"https://www.youtube.com/embed/qEnke76S4pw?si=_y25WIuQir1co2Y6",
         date:"2019",
         },
         { title: "Unreal Cloudland", 
        description: "I'm learning Unreal Engine 5.3 with my new Macbook Pro M3.  Check maxjann.com/unreal for my latest project, an RTS game.", 
        imageUrl: "static/img/elamcloud.png",
        linkURL: "",
        videoembed:"https://www.youtube.com/embed/IJySvOjJwqI?si=67r2SfNbG8auAmmF",
        date:"2024",
     },

     { title: "Unreal Tournament Shock Rifle", 
        description: "I am using Unreal Engine 5.5 to reimagine the shock rifle from Unreal Tournament 2004.  I just added a lightmass effect to the shock combo explosion and I'm having so much fun with it! Check maxjann.com/unreal for my latest project, an RTS game.", 
        imageUrl: "static/img/madjoy.png",
        linkURL: "",
        videoembed:"https://www.youtube.com/embed/G1wV5d4H7eI?si=n4Wb4LUkVUWsjrwq",
        // videoembed:"https://www.youtube.com/embed/PLXK9t4X4Xg?si=bSVqwNMYdjr3FxUu",
        date:"2024+",
     },
     { title: "Next.JS Review App", 
        description: "After dabbling with Next.js documentation and tutorials I built this app with the help of ChatGPT.  I have much bigger plans with this project and it is ongoing.", 
        imageUrl: "static/img/auri.webp",
        linkURL: "https://reviewandme.netlify.app",
        videoembed:"",
        date:"2024+",
     },
        // I should also add video demos for each project, as well as a link
        // videos/ reviews / music  / homepage
    ];

    const sideprojects = [
        {
            title:"React Speed",
            description: "A React Application that lets you save and load states without reloading the webpage, and also can adjust the colors and speed of the logo",
            linkURL:"admiring-allen-88af04.netlify.app",
        },
        {
            title:"React Colors",
            description:"A React App that lets you type in and test out any HTML5 color.",
            linkURL:"kind-babbage-529fc.netlify.app",
        },
        {
            title:"Old Portfolio",
            description:"An old portfolio where I link to all of my apps I had built at the time, and an old resume",
            linkURL:"modest-poitras-0f59e2.netlify.app",
        }
    ]

    const projectsList = document.getElementById('projects-list');

    projects.forEach(project => {
        const item = document.createElement('div');
        item.classList.add('project-item');

        const image = document.createElement('img');
        image.src = project.imageUrl;
        image.classList.add('project-image');

        const date = document.createElement('div');
        date.classList.add('project-date');
        date.textContent = project.date;

        const title = document.createElement('div');
        title.classList.add('project-title');
        title.textContent = project.title;

        const description = document.createElement('div');
        description.classList.add('project-description');
        description.textContent = project.description;

        const linkButton = document.createElement('a');
        linkButton.href = project.linkURL;
        linkButton.textContent = "Try App";
        linkButton.classList.add('project-link', 'hidden');
        linkButton.target = "_blank"; // Opens the link in a new tab

        const video = document.createElement('div');
        video.innerHTML = `
        <iframe width="100%" height="315" src="${project.videoembed}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        `;
        video.classList.add('project-vid', 'hidden');
        item.appendChild(date);
        item.appendChild(image);
        item.appendChild(title);
        item.appendChild(description);

        if(project.linkURL){
            item.appendChild(linkButton);
        }
        if(project.videoembed){
            item.appendChild(video);
        }else{
            console.log("not");
        }

        item.addEventListener('click', function() {
            // Toggle the visibility of the description and link together
            const isDescriptionVisible = description.style.display === 'block';
            description.style.display = isDescriptionVisible ? 'none' : 'block';
            linkButton.style.display = isDescriptionVisible ? 'none' : 'inline-block'; // Toggle link visibility
            date.style.display = isDescriptionVisible ? 'none' : 'inline-block'; // Toggle link visibility

            video.style.display = isDescriptionVisible ? 'none' : 'inline-block';
        });

        projectsList.appendChild(item);
    });
});
