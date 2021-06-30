

const dogList = () => document.getElementById("dog-bar")
const dogProfile = () => document.getElementById("dog-info")
const filterButton = () => document.getElementById("good-dog-filter")


const displayDogList = () => {
  fetch("http://localhost:3000/pups")
  .then(resp => resp.json())
  .then(data => {
    //console.log(data)
    data.forEach(dog => displayDogItem(dog))
  })
}

const displayDogItem = (dog) => {
  const span = document.createElement("span")
  span.setAttribute("id", dog.id)
  span.innerText = dog.name
  dogList().appendChild(span)

  span.addEventListener("click", (e) => {
    console.log(e.target)
    displayDogProfile(e.target.id)
  })
}


const aboutDogs = (dog) => {
  const img = document.createElement("img")
  const header = document.createElement("h2")
  const btn = document.createElement("button")
  
  img.src = dog.image
  header.innerText = dog.name
  btn.innerText = dog.isGoodDog ? "Good Dog" : "Bad Dog"
  
  btn.addEventListener("click", (e) => {
    const condition = {isGoodDog: e.target.innerText === "Good Dog" ? false : true}
    //bonkers true => false
    fetch(("http://localhost:3000/pups/" + dog.id), {
      method:"PATCH",
      headers:{
        "Content-Type":"application/json",
        "Accept":"application/json"
      },
      body:JSON.stringify(condition)
    })
    .then(resp => resp.json())
    .then(data => {
      //bonkers false => Bad dog
      e.target.innerText = data.isGoodDog ? "Good Dog" : "Bad Dog"
      console.log(data)
    })
  })

  dogProfile().append(img, header, btn)
}

const displayDogProfile = (id) => {
  dogProfile().innerHTML =""
  fetch("http://localhost:3000/pups/" + id)
  .then(resp => resp.json())
  .then(data => aboutDogs(data))
}

document.addEventListener("DOMContentLoaded", () => {
  displayDogList()
  dogFilter()
})


const dogFilter = () => {
  filterButton().addEventListener("click", () => {

    const filter = filterButton().innerText === "Filter good dogs: OFF" ? "?isGoodDog=true" : ""
    filterButton().innerText = filterButton().innerText === "Filter good dogs: ON" ? "Filter good dogs: OFF" : "Filter good dogs: ON"
    console.log(filter)
    dogList().innerHTML = ""
    fetch("http://localhost:3000/pups" + filter)
      .then(resp => resp.json())
      .then(data => {
        //console.log(data)
      data.forEach(dog => displayDogItem(dog))
  })
  }) 
}
