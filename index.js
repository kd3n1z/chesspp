const loader = '<span id="chessPPLoader"><span class="icon-font-chess profile-card-info-item-icon spin">L</span></span>';

let hoursElement;
let textElement;
let statusElement;

let time = 0;
let totalGames = 0;
let wonGames = 0;


async function load() {
    console.log('kd3n1z was here :)');
    document.querySelector('.v5-section-content-wide').innerHTML += '<h2 id="hoursPlayed">' + loader + '<span class="text">loading...</span><span id="chessPPstatus"></span></h2>';
    //document.querySelector('head').innerHTML += '<link rel="stylesheet" href="chrome-extension://' + chrome.runtime.id + '/style.css">';
    hoursElement = document.getElementById("hoursPlayed");
    textElement = hoursElement.querySelector(".text");
    statusElement = document.getElementById("chessPPstatus");
    
    let username = window.location.href;
    while(username.endsWith('/')) {
        username = username.slice(-0, 1);
    }
    username = window.location.href.split('/').slice(-1)[0].trim();

    let data = await fetch('https://api.chess.com/pub/player/' + username + '/games/archives').then(resp => resp.json());
    
    let ind = 0;

    for(const element of data.archives) {
        ind++;
        document.getElementById('chessPPstatus').textContent = ind + "/" + data.archives.length;
        const archive = await fetch(element).then(resp2 => resp2.json());
        
        archive.games.forEach(game => {
            let startTime = '';
            let endTime = '';
            let endDate = '';
            let startDate = '';
            
            game.pgn.split('\n').forEach(str => {
                if(str.startsWith("[EndTime")) {
                    endTime = str.split('"')[1];
                }else if(str.startsWith("[StartTime")) {
                    startTime = str.split('"')[1];
                }else if(str.startsWith("[EndDate")) {
                    endDate = str.split('"')[1];
                }else if(str.startsWith("[UTCDate")) {
                    startDate = str.split('"')[1];
                }
            }); 

            if(game.rated) {
                totalGames++;
                if((game.black.username == username) == (game.black.result == "win")) {
                    wonGames++;
                }
            }

            let s = (toDate(endDate, endTime) - toDate(startDate, startTime)) / 1000;

            if(s < 24 * 60 * 60) {
                time += s;
            }

            UpdateText();
        });
    }

    document.getElementById('chessPPLoader').classList.add("hidden");
    document.getElementById('chessPPstatus').classList.add("hidden");
}

function toDate(date, time) {
    return Date.parse(date.replaceAll(".", "-") + "T" + time);
}

function formatTime(secs) {
    return Math.floor(secs / 60 / 60);
}

function UpdateText() {
    textElement.textContent = formatTime(time) + " hours, " + totalGames + " games, " + Math.floor(wonGames / totalGames * 100) + "% winrate";
}

if( window.location.href.startsWith('https://www.chess.com/member/') || 
    window.location.href.startsWith('http://www.chess.com/member/') || 
    window.location.href.startsWith('https://chess.com/member/') || 
    window.location.href.startsWith('http://chess.com/member/')) {
    load();
}