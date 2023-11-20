function goTo(toPage) {
  window.location.href = toPage;
}

function changeState(element) {
  element.classList.toggle("liked");
}

function changeColor(element) {
  element.classList.toggle("liked");
  element.style.color = "blue"
}

// Disable or enable Treex button based on this input
const treex = document.getElementById("treex");

function treexInputChanged(element) {
  if (element.value !== "") {
    // Activate Treex
    treex.classList.remove("disabled");
  } else {
    // Disable Treex
    treex.classList.add("disabled");
  }
  growTreexInput(element); // Resize rows
}

function growTreexInput(element) {
  element.style.height = "5px";
  element.style.height = element.scrollHeight + "px";
}

