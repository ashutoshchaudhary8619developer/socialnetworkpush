
function checkCookies(){

function EL(id) { return document.getElementById(id); } // Get el by ID helper function

function readFile() {
  if (this.files && this.files[0]) {
    var FR= new FileReader();
    FR.onload = function(e) {
      EL("img").src       = e.target.result;
      EL("b64").innerHTML = e.target.result;
    };       
    FR.readAsDataURL( this.files[0] );
  }
}


if (document.readyState === 'complete') {
  // The page is fully loaded
  document.getElementById("inp").addEventListener("change", readFile, false);
}




}
