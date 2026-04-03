let cards = document.querySelectorAll(".card");

cards.forEach((current) => {
  current.onmousedown = function (e) {
    current.classList.add("selected");
    let shiftX = e.clientX - current.getBoundingClientRect().left;
    let shiftY = e.clientY - current.getBoundingClientRect().top;

    let droppableBelow = null;
    let elemBelow = null;
    let lastDroppable = null;
    // move to body for free movement

    function moveAt(pageX, pageY) {
      let newX = pageX - shiftX;
      let newY = pageY - shiftY;
      //restrict the drag to the window if not scroll .
      // let maxY = document.documentElement.clientHeight - current.offsetHeight;
      // newY = Math.max(0, Math.min(newY, maxY));
      let maxX = document.documentElement.clientWidth - current.offsetWidth;
      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, newY);
      current.style.left = newX + "px";
      current.style.top = newY + "px";
    }

    function onMouseMove(e) {
      current.style.position = "absolute";
      current.style.zIndex = 1000;
      document.body.append(current);
      moveAt(e.pageX, e.pageY);

      let edgeThreshold = 50;
      let scrollSpeed = 20;

      let container = document.querySelector(".board__wrapper");

      //scroll the page when
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
      console.log(elemBelow);
      if (!elemBelow) return;
      // get nearest droppable container
      droppableBelow = elemBelow.closest(".droppable");
      if (!droppableBelow) {
        return ;
      }

      //add and remove classlist of selected status 
      if (lastDroppable != elemBelow) {
        if (lastDroppable) {
          lastDroppable.classList.remove("selected__status");
        }
        if (elemBelow) {
          elemBelow.classList.add("selected__status");
        }
        lastDroppable = elemBelow;
      }
    }

    document.addEventListener("mousemove", onMouseMove);

    function mouseUpHandler() {
      current.classList.remove("selected");

      document.removeEventListener("mousemove", onMouseMove);
      // if dropped inside a column
      if (droppableBelow) {
        droppableBelow.append(current);

        // reset styles
        current.style.position = "static";
        current.style.left = "";
        current.style.top = "";
        current.style.zIndex = "";
      }
    }
    document.addEventListener("mouseup", mouseUpHandler, { once: true });

    // disable default drag behavior
    current.ondragstart = () => false;
  };
});
