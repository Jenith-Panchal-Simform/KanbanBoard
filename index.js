import { initCreateTask } from "./createTask.js";
import { render } from "./render.js";
import { updateDataAfterDrop } from "./updateAfterDrop.js";
window.addEventListener("load", () => {
  render();
  initCreateTask();
});

let dragged = null;
document.addEventListener("mousedown", function (e) {
  //prevent dragging when clicking on input or button
  if (e.target.tagName === "INPUT" || e.target.tagName === "BUTTON") return;
  const current = e.target.closest(".card");

  if (!current) return;
  current.classList.add("selected");
  let shiftX = e.clientX - current.getBoundingClientRect().left;
  let shiftY = e.clientY - current.getBoundingClientRect().top;

  let droppableBelow = null;
  let elemBelow = null;
  let previousDroppable = null;
  let container = document.querySelector(".board__wrapper");
  let startContainer = current.closest(".droppable");

  let placeholder = document.createElement("div");
  placeholder.classList.add("placeholder");
  dragged = current;
  current.classList.add("dragging");

  // Insert placeholder
  current.parentNode.insertBefore(placeholder, current.nextSibling);
  // move to body for free movement

  function moveAt(pageX, pageY) {
    let activeContainer = droppableBelow || previousDroppable || startContainer;
    if (!activeContainer) return;
    let rect = activeContainer.getBoundingClientRect();
    let newX = pageX - shiftX;
    let newY = pageY - shiftY;
    //restrict the drag to the window if not scroll .
    let minY = rect.top + window.scrollY;
    let maxY = rect.bottom + window.scrollY - current.offsetHeight;
    let maxX = document.documentElement.clientWidth - current.offsetWidth;
    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(minY, Math.min(newY, maxY));
    current.style.left = newX + "px";
    current.style.top = newY + "px";
  }

  current.style.position = "absolute";
  current.style.zIndex = 1000;
  current.style.opacity = "0.5";
  function onMouseMove(e) {
    if (!dragged) return;

    updatePlaceholder(e.clientY, droppableBelow || startContainer);
    moveAt(e.pageX, e.pageY);

    let edgeThreshold = 50;
    let scrollSpeed = 20;

    //scroll the page when horizontal scroll
    // Right edge
    if (e.clientX > window.innerWidth - edgeThreshold) {
      container.scrollLeft += scrollSpeed;
    }

    // Left edge
    if (e.clientX < edgeThreshold) {
      container.scrollLeft -= scrollSpeed;
    }
    //  hide element to detect what's below it
    current.hidden = true;
    elemBelow = document.elementFromPoint(e.clientX, e.clientY);
    current.hidden = false;
    if (!elemBelow) return;

    // get nearest droppable container
    droppableBelow = elemBelow.closest(".droppable");
    if (!droppableBelow) {
      return;
    }
    //add and remove classlist of selected status
    if (previousDroppable != droppableBelow) {
      if (previousDroppable) {
        previousDroppable.classList.remove("selected__status");
      }
      if (droppableBelow) {
        droppableBelow.classList.add("selected__status");
      }
      previousDroppable = droppableBelow;
    }

    //get nearest card
    let cardBelow = elemBelow.closest(".card");
    if (!cardBelow && current.parentNode !== droppableBelow) {
      droppableBelow.append(current);
      return;
    }
  }
  document.addEventListener("mousemove", onMouseMove);

  function mouseUpHandler() {
    if (!dragged) return;
    if (placeholder.parentNode) {
      placeholder.parentNode.insertBefore(dragged, placeholder);
      updateDataAfterDrop(dragged, placeholder.parentNode);
    }
    dragged.classList.remove("dragging");
    dragged.style = "";

    placeholder.remove();
    dragged = null;
    current.classList.remove("selected");
    if (previousDroppable) {
      previousDroppable.classList.remove("selected__status");
    }
    document.removeEventListener("mousemove", onMouseMove);
    // if dropped inside a column
    if (droppableBelow) {
      // reset styles
      current.style.position = "static";
      current.style.left = "";
      current.style.top = "";
      current.style.zIndex = "";
      current.style.opacity = "";
    }
  }
  function updatePlaceholder(mouseY, container) {
    if (!container) return;

    const cards = [...container.querySelectorAll(".card:not(.dragging)")];

    for (let card of cards) {
      const rect = card.getBoundingClientRect();
      const middle = rect.top + rect.height / 2;

      if (mouseY < middle) {
        container.insertBefore(placeholder, card);
        return;
      }
    }

    container.appendChild(placeholder);
  }
  document.addEventListener("mouseup", mouseUpHandler, { once: true });

  // disable default drag behavior
  current.ondragstart = () => false;
});
