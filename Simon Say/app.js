let gameSeq = [];
let userSeq =[];

let btns=["yellow","red","purple","green"];

let start =false;
let level = 0;

let h2 =document.querySelector("h2")

document.addEventListener("keypress",function(){
    if(start==false){
        console.log("Game is started")
        start=true;

        levelUp()
    }
})

function btnFlash(btn){
    btn.classList.add("flash")
    setTimeout(function(){
        btn.classList.remove("flash")
    },250);
}

function userFlash(btn){
    btn.classList.add("userflash")
    setTimeout(function(){
        btn.classList.remove("userflash")
    },250);
}
 
function levelUp(){
    userSeq=[];
    level++
    h2.innerText =`Level ${level}`

    //random buttoh choose
    let randIdx = Math.floor(Math.random() *4)
    let randcolor =btns[randIdx];
    let randbtn =document.querySelector(`.${randcolor}`)
    gameSeq.push(randcolor)
    console.log(gameSeq)
    btnFlash(randbtn);
}

function checkAns(idx){
    // console.log("current level",level)
    
    if(gameSeq[idx] ===userSeq[idx]){
        if(userSeq.length == gameSeq.length){
         setTimeout(levelUp,1000)
        }
        console.log("same value")
    }else{
        h2.innerHTML =`Game over! Your score was <b>${level}</b> <br> press any key to Restart.`
        document.querySelector("body").style.backgroundColor="red"
        setTimeout(function(){
            document.querySelector("body").style.backgroundColor="white"

        },150)
        reset() 
    }
}


function btnPress(){
    let btn = this;
    // console.log(this)
   userFlash(btn)

   userColor = btn.getAttribute("id")
//    console.log(userColor)   
   userSeq.push(userColor)
//    console.log(userSeq)

checkAns(userSeq.length-1)
}

let allBtns = document.querySelectorAll(".btn")
for(btn of allBtns){
    btn.addEventListener("click",btnPress)
}

function reset(){
    start = false;
    gameSeq =[]
    userSeq=[]
    level=0
}


// track the highest score
