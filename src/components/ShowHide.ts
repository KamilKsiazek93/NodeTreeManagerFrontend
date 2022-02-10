export const handleShowHide = (name:string) => {
    let items = document.querySelectorAll(`.${name}`)
    for(let i = 0; i < items.length; i++) {
      let element = items[i]
      if(!element.hasAttribute("style") || element.getAttribute("style")==="display:list-item") {
        element.setAttribute("style", "display:none")
      } else {
        element.setAttribute("style", "display:list-item")
      }
     
    }
  }