// let btn = document.querySelector("button")
let inp =document.querySelector("input")
let heading = document.querySelector("h1")
let body = document.querySelector("body")
let div = document.querySelector("div")

document.addEventListener("keydown",function(event){
    console.log(event.key)
    heading.innerText = `key:${event.key}`
})

function getrandomcolor(){
    let red = Math.floor(Math.random()*255)
    let green = Math.floor(Math.random()*255)
    let blue = Math.floor(Math.random()*255)

    let color = `rgb(${red},${green},${blue})`
    return color
}

body.addEventListener("keydown",function(){
    let random = getrandomcolor()
    body.style.transition ="0.5s"
    body.style.backgroundColor = random
})


