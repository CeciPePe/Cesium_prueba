window.viewer = viewer;
const toolbar = document.querySelector("div.cesium-viewer-toolbar");
const modeButton = document.querySelector("span.cesium-sceneModePicker-wrapper");
const myButton = document.createElement("button");
myButton.classList.add("cesium-button", "cesium-toolbar-button");
myButton.innerHTML = "Open File";
toolbar.insertBefore(myButton, modeButton);
myButton.addEventListener("click", function(){
  openFile();
});

function openFile(){
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".gml";
  input.click();
};