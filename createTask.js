export function initCreateTask()
{
    console.log("init")
    let btn=document.querySelector(".board__button")
   btn.addEventListener("click",()=>{
    
    let status = document.querySelector(".droppable")
    console.log(status)
    const newDiv=document.createElement("div")
    newDiv.classList.add("card")
    newDiv.textContent="Counter"
    status.append(newDiv);
   })
}
