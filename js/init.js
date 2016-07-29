var currentGame;
var typing;
var selector;

$(function () {
    // Font resize
    var sections = $("#van").children().length;
    var size = Math.floor(256/sections);
    for (var i = 1; i <= sections; i++) {
        $("#" + i).addClass("fs-" + size);
        setupHover(i);
    }
    $("#playAgainBox").mouseenter(function(){
        $("#playAgainBox").css("background-color", "#4e2a7f");
    });
    $("#playAgainBox").mouseleave(function(){
        $("#playAgainBox").css("background-color", "#3a3a3a");
    });
    
    resizeWindow();
    vanRoot = document.getElementById("van");
    navRoot = document.getElementById("nav");
    for (i = 0; i < navRoot.childNodes.length; i++) {
        node = navRoot.childNodes[i];
        popmousefunctions()
    }

    for (j = 0; j < vanRoot.childNodes.length; j++) {
        node = vanRoot.childNodes[j];
        popmousefunctions()
    }
    highlightInterval = setInterval("highlight()", 1000 / 60);
    
    window.addEventListener("mousedown", mouseDown);
    window.addEventListener("keypress", keyDown);
    
    typing = new typingQuiz();
    selector = new selectorQuiz();
    typing.startGame();
});

function mouseDown() {
    if(currentGame == "typing"){
        if (gameActive && !selectorLock) {
            if(currentSelection != 1){
                if(usedElements[currentSelection] == null){
                    clearInterval(highlightInterval);
                    typing.beginIRCQuiz(currentSelection, listElements[currentSelection]);
                    usedElements[currentSelection] = 1;

                    setTimeout(function(){
                        $("#textInput").get(0).focus();
                    }, 1);
                 }
             }
         }
     }
    else if(currentGame == "selector"){
        if (gameActive) {
            if(currentSelection != 1){
                    if (listElements[currentSelection] == listElements[currentTarget]) {
                        selector.updateHud(correctText);
                        ++score;

                        document.getElementById(currentSelection).textContent =     listElements[currentSelection];
                        usedElements[currentTarget] = 1;
                        selector.chooseNextTarget();
                        selector.updateScoreDisplay();
                    } 
                  else {
                      selector.updateHud(wrongText);
                      selector.beginHeartFlash(health);
                      --health;
                  }
                  
                    if(health <= 0){
                      selector.endGame();
                  }
              }
          }
    }   
}

function keyDown(event){
    if(currentGame == "typing"){
        if(event.keyCode === 13){
            if(typing.checkInput($("#textInput").val(), quizTarget)){
                clearInterval(quizInterval);
                clearInterval(scoreInterval);
                typing.updateHud(earnedScoreText1 + typing.calculatePossibleScore() + earnedScoreText2);
                typing.calculateScore();
                typing.updateScoreDisplay();
                document.getElementById(targetIndex).textContent = quizTarget;
                highlightInterval = setInterval(highlight, 1000/60);

                typing.checkAvailableChoices();
                selectorLock = false;
            } else{
                typing.updateHud(wrongText);
                typing.takeDamage();
            }

            $("#textInput").val("");
        }
    }
}

function changeGame(){
    if(currentGame == "typing"){
        typing.changeGame();
        selector.startGame();
    }
    else{
        selector.changeGame();
        typing.startGame();
    }
}

function setupHover(i) {
    $("#" + i).mouseenter(function () {
        hover(i);
    });
}

function hover(i) {
    currentSelection = i;
}

function ignoreEvents(e) {
    return false;
};
window.onclick = ignoreEvents;

var currentSelection = "1";
var highlightInterval;
var vanRoot; //= document.getElementById("van");
var navRoot; //= document.getElementById("nav");

function highlight() {
    var picEl = document.getElementById("picture")
    for (j = 2; j < vanRoot.childNodes.length + 1; j++) {
        if (j == currentSelection) {
            picname = "layer-" + currentSelection + ".png";
            picEl.src = picname;
            //picEl.style.left=offsetLeft[currentSelection]
            //picEl.style.top=offsetTop[currentSelection]
            backcol = "#4e2a7f";
        } else backcol = "#3a3a3a";
        if (document.getElementById(j)) document.getElementById(j).style.backgroundColor = backcol;
    }
}

function deselect() {
    currentSelection = 1;
}

function popmousefunctions() {
    if (node.nodeName == "LI" || node.nodeName == "AREA") {
        node.onmouseover = function () {
            currentSelection = (this.className.split(" ")[0]);
            //--currentSelection;
        }
        node.onmouseout = function () {
            deselect()
        }
    }
}
