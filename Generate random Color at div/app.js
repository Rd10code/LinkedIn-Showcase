let btn = document.querySelector("button")

btn.addEventListener("click", function(){
    let h3 =document.querySelector("h3")
   
    console.log("generated a new color")
    let randomColor = getRandomColor()
    h3.innerHTML =` ${randomColor}`;

    let div = document.querySelector("div")
    div.style.backgroundColor=randomColor;

    console.log("color uodated")
})

function getRandomColor(){
    let red = Math.floor(Math.random()*255)
    let green = Math.floor(Math.random()*255)
    let blue = Math.floor(Math.random()*255)

    let color = `rgb(${red} ,${green},${blue})`
    // console.log(color)
    return color
}