  function selectorQuiz(){
    //GAME CODE
    var gameActive = true;
    var health = 3;
    var score = 0;
    var currentTarget;
    var listElements = [];
    var usedElements = [];
    var heartFlasher1;
    var heartFlasher2;
    var heartFlasher3;
    var hudInterval;

    //Hud update strings
    var beginText = "Please make a selection.";
    var correctText = "Correct!";
    var wrongText = "Wrong!";
    var currentTargetText = "Your current target is: "
    //var gameOverText = "G A M E  O ウ E R!";
    var gameOverText = "Game Over!";
    var finalScoreText = "Your final score is: ";

  this.startGame = function () {
        
        $("#playAgainBox").click(function(){
            resetGame();
        })

        $('#van li').each(function (i, obj) {
            if (i != 0) {
                listElements[i + 1] = obj.textContent;
                obj.textContent = "";
            }
        });

        currentTarget = getRandomInt(2, listElements.length);
        updateQuizDisplay(currentTargetText + listElements[currentTarget]);
        updateScoreDisplay();
        staticHud(beginText);

        window.addEventListener("mousedown", mouseDown);

        function mouseDown() {
            if (gameActive) {
                if(currentSelection != 1){
                    if (listElements[currentSelection] == listElements[currentTarget]) {
                        updateHud(correctText);
                        ++score;

                        document.getElementById(currentSelection).textContent = listElements[currentSelection];
                        usedElements[currentTarget] = 1;
                        chooseNextTarget();
                        updateScoreDisplay();
                    } else {
                        updateHud(wrongText);
                        beginHeartFlash(health);
                        --health;
                    }

                    if(health <= 0){
                        endGame();
                    }
                }
            }
        }
    }

    var chooseNextTarget = function () {
        for (var i = 2; i < listElements.length; i++) {
            if (usedElements[i] != 1) {
                break;
            }
            if (i == listElements.length - 1) {
                endGame();
            }
        }
        if (gameActive) {
            while (true) {
                currentTarget = getRandomInt(2, listElements.length);
                if (!usedElements[currentTarget]) {
                    updateQuizDisplay(currentTargetText + listElements[currentTarget]);
                    break;
                }
            }
        }
    }

    var beginHeartFlash = function(heartIndex){
        var i = 0;
        var j = 0;

        //Hacky asynchronosity don't laugh
        if(heartIndex === 3){
            heartFlasher3 = setInterval(function(){
                if (i < 4){
                    $('#heart' + heartIndex).attr("src", "../HeartContainer.svg");
                }
                else if(i >= 15){
                    i=0;
                    ++j;
                }
                else{
                    $('#heart' + heartIndex).attr("src", "../Heart.svg");
                }

                if(j === 7){
                    $('#heart' + heartIndex).attr("src", "../HeartContainer.svg");
                    clearInterval(heartFlasher3);
                }

                ++i;
            }, 1000/60);
        }
        else if (heartIndex === 2){
            heartFlasher2 = setInterval(function(){
                if (i < 4){
                    $('#heart' + heartIndex).attr("src", "../HeartContainer.svg");
                }
                else if(i >= 15){
                    i=0;
                    ++j;
                }
                else{
                    $('#heart' + heartIndex).attr("src", "../Heart.svg");
                }

                if(j === 7){
                    $('#heart' + heartIndex).attr("src", "../HeartContainer.svg");
                    clearInterval(heartFlasher2);
                }

                ++i;
            }, 1000/60);
        }
        else{
            heartFlasher1 = setInterval(function(){
                if (i < 4){
                    $('#heart' + heartIndex).attr("src", "../HeartContainer.svg");
                }
                else if(i >= 15){
                    i=0;
                    ++j;
                }
                else{
                    $('#heart' + heartIndex).attr("src", "../Heart.svg");
                }

                if(j === 7){
                    $('#heart' + heartIndex).attr("src", "../HeartContainer.svg");
                    clearInterval(heartFlasher1);
                }

                ++i;
            }, 1000/60);
        }

    }

    var endGame = function () {
        gameActive = false;
        clearInterval(hudInterval);
        updateQuizDisplay(gameOverText);
        staticHud(finalScoreText + score);
        $('#playAgainBox').css("visibility", "visible");
        $('#playAgainBox').css("pointer-events", "all");
    }

    var resetGame = function () {
        gameActive = true;
        health = 3;
        score = 0;
        currentTarget = null;
        usedElements = [];
        $('#van li').each(function (i, obj) {
            if (i != 0) {
                obj.textContent = "";
            }
        });

        clearInterval(heartFlasher1);
        clearInterval(heartFlasher2);
        clearInterval(heartFlasher3);
        
        $("#playAgainBox").css("visibility", "hidden");
        $('#playAgainBox').css("pointer-events", "none");
        $("#heart1").attr("src", "../Heart.svg");
        $("#heart2").attr("src", "../Heart.svg");
        $("#heart3").attr("src", "../Heart.svg");

        currentTarget = getRandomInt(2, listElements.length);
        updateQuizDisplay(currentTargetText + listElements[currentTarget]);
        updateScoreDisplay();
        staticHud(beginText);
    }

    var updateQuizDisplay = function (string) {
        $('#quizDisplay').html(string);
    }

    var updateScoreDisplay = function () {
        $('#scoreDisplay').html("Score: " + score);
    }

    //Sends a message to be displayed on the hud, goes away after two seconds
    var updateHud = function (inputString) {
        clearInterval(hudInterval);

        var i = 0;
        var displayString = "";
        var waitTime = 20;
        var passTime = 10;
        hudInterval = setInterval(function(){
            if(waitTime === 20){
                displayString += inputString.charAt(0);
                $('#hud').html(displayString);
                inputString = inputString.substr(1, inputString.length);
            }

            if(inputString == ""){
                --waitTime;
            }

            if(waitTime <= 0){
                displayString = displayString.substr(0, displayString.length-1);
                $('#hud').html(displayString);

                if(displayString == ""){
                    if(passTime <= 0){
                        staticHud(beginText);
                    }
                    --passTime;
                }
            }
        }, 1000/15);
    }

    //Sends a message to be displayed on the hud, stays until another message is sent
    var staticHud = function (inputString) {
        clearInterval(hudInterval);

        var i = 0;
        var displayString = "";
        var waitTime = 20;
        hudInterval = setInterval(function(){
            if(waitTime === 20){
                displayString += inputString.charAt(0);
                $('#hud').html(displayString);
                inputString = inputString.substr(1, inputString.length);
            }

            if(inputString == ""){
                clearInterval(hudInterval);
            }
        }, 1000/15);
    }

    var why;
    var randomColor = function (x){
        why = setInterval(function (){
            $("#stage").css("background-color", "#"+getRandomInt(0, 16777215).toString(16));
        }, 1000/60);

    }

    var getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
}