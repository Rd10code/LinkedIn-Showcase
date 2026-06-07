console.log('Lets Write js');

let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs(folder) {
    currFolder = folder;

    let a = await fetch(`/${folder}/`);
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");

    console.log("Total links found:", as.length);

    songs = [];

    for (let i = 0; i < as.length; i++) {
        let href = as[i].href;

        if (href.toLowerCase().endsWith(".mp3")) {
            let songName = decodeURIComponent(
                href.substring(href.lastIndexOf("/") + 1)
            );

            songs.push(songName);
        }
    }

    console.log("Songs Found:", songs);

    // show all songs in playlist
    let songUl = document
        .querySelector(".songlist")
        .getElementsByTagName("ul")[0];

    songUl.innerHTML = "";

    for (const song of songs) {
        songUl.innerHTML += `
        <li>
            <img class="invert" src="img/music.svg" alt="">
            <div class="info">
                <div>${song}</div>
                <div>~.Rd.~®</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="img/play.svg" alt="">
            </div>
        </li>`;
    }

    // attach click listeners
    Array.from(
        document.querySelector(".songlist").getElementsByTagName("li")
    ).forEach((e) => {
        e.addEventListener("click", () => {
            playMusic(
                e.querySelector(".info").firstElementChild.innerHTML.trim()
            );
        });
    });

    return songs;
}

const playMusic = (track, pause = false) => {

    if (track.startsWith("/songs/")) {
        currentSong.src = track;
    } else {
        currentSong.src = `/${currFolder}/${track}`;
    }

    if (!pause) {
        currentSong.play();
        play.src = "img/pause.svg";
    }

    document.querySelector(".songinfo").innerHTML =
        decodeURIComponent(track.split("/").pop());

    document.querySelector(".songtime").innerHTML = "00:00";
}

async function displayAlbums() {
    console.log("displaying albums");
    let a = await fetch(`/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer");
    let array = Array.from(anchors);

    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            // decode to get the real folder name (handles any encoding from server)
            let folder = decodeURIComponent(e.href.split("/").slice(-2)[0]);

            try {
                let a = await fetch(`/songs/${folder}/info.json`);
                let response = await a.json();
                cardContainer.innerHTML += `<div data-folder="${folder}" class="card">
                    <div class="play">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                                stroke-linejoin="round" />
                        </svg>
                    </div>
                    <img src="/songs/${folder}/Cover.jpeg" alt="">
                    <h2>${response.title}</h2>
                    <p>${response.description}</p>
                </div>`;
            } catch (err) {
                console.log(`Skipping folder "${folder}" — could not load info.json`, err);
            }
        }
    }

    // load the playlist whenever a card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            let folderName = item.currentTarget.dataset.folder;
            songs = await getsongs(`songs/${folderName}`);
            playMusic(songs[0]);
        });
    });
}

async function main() {
    // get the list of all the songs
    await getsongs("songs/Raps");

console.log("Songs Array:", songs);

if (songs.length > 0) {
    playMusic(songs[0], true);
} else {
    console.error("No songs found!");
}

    // display all the albums on the page
    displayAlbums();

    // play / pause
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "img/pause.svg";
        } else {
            currentSong.pause();
            play.src = "img/play.svg";
        }
    });

    // time update
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML =
            `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left =
            (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    // seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration) * percent / 100;
    });

    // hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    // close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });

    // previous
    previous.addEventListener("click", () => {
        let index = songs.indexOf(decodeURIComponent(currentSong.src.split("/").slice(-1)[0]));
        if (index - 1 >= 0) {
            playMusic(songs[index - 1]);
        }
    });

    // next
    next.addEventListener("click", () => {
        let index = songs.indexOf(decodeURIComponent(currentSong.src.split("/").slice(-1)[0]));
        if (index + 1 < songs.length) {
            playMusic(songs[index + 1]);
        }
    });

    // volume slider
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
        if (currentSong.volume > 0) {
            document.querySelector(".volume>img").src =
                document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg");
        }
    });

    // mute toggle
    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        } else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            currentSong.volume = 0.10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    });
}

main();
