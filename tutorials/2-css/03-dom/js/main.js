// console.log("hi");

// select html elements
const header = document.querySelector("#header");
const changeHeaderButton = document.querySelector("#change-header-button");
const changeThemeButtom = document.querySelector("#change-theme-button");
const img1 = document.querySelector('#img1');
const img2 = document.querySelector('#img2');
const img3 = document.querySelector('#img3');


// change header with button click

changeHeaderButton.addEventListener("click", () => {
    header.innerHTML = "POWW!!!!!!!!!"
})

// toggle color theme

// create function for changing button text
function changeButtonText() {
    if (document.body.classList.contains("dark")) {
        changeThemeButtom.textContent = "Switch to Light Theme";
    } else {
        changeThemeButtom.textContent = "Switch to Dark Theme";
    }
}

// click event on button
changeThemeButtom.addEventListener("click", () => {
    // add/remove dark class to body
    document.body.classList.toggle("dark");
    changeButtonText();
})


// toggle image visibility

img1.addEventListener("click", () => {
    img2.classList.remove("hidden");
})
img2.addEventListener("click", () => {
    img3.classList.remove("hidden");
    
})