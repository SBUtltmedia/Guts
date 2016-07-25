var typingQuiz = function(){
    //CONSTANTS
    var beginText = "Please make a selection.";
    var correctText = "Correct!";
    var wrongText = "Wrong!";
    var possibleScoreText = "Possible points: ";
    var earnedScoreText1 = "You earned ";
    var earnedScoreText2 = " points!";
    var guessText = "Guess: ";
    //var gameOverText = "G A M E  O ウ E R! GAME  OウER! GAME OVER! GAME OVER! GAME OVER! GAME OVER!";
    var gameOverText = "Game Over!";
    var finalScoreText = "Your final score is: ";

    //GLOBALS
    var gameActive = true;
    var health = 3;
    var score = 0;
    var listElements = [];
    var usedElements = [];
    var heartFlasher1;
    var heartFlasher2;
    var heartFlasher3;
    var hudInterval;
    var quizInterval;
    var scoreInterval;
    var selectorLock;
    var quizTarget;
    var targetIndex;

    //Hud update strings


    var totalTime = 0;
    var timeRemaining = 0;
    var usedCharArray = new Array();

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

        updateScoreDisplay();
        staticHud(beginText);

        window.addEventListener("mousedown", mouseDown);

        window.addEventListener("keypress", function(event){
            if(event.keyCode === 13){
                if(checkInput($("#textInput").val(), quizTarget)){
                    clearInterval(quizInterval);
                    clearInterval(scoreInterval);
                    updateHud(earnedScoreText1 + calculatePossibleScore() + earnedScoreText2);
                    calculateScore();
                    updateScoreDisplay();
                    document.getElementById(targetIndex).textContent = quizTarget;
                    highlightInterval = setInterval(highlight, 1000/60);

                    checkAvailableChoices();
                    selectorLock = false;
                } else{
                    updateHud(wrongText);
                    takeDamage();
                }

                $("#textInput").val("");
            }
        })

        function mouseDown() {
            if (gameActive && !selectorLock) {
                if(currentSelection != 1){
                    if(usedElements[currentSelection] == null){
                        clearInterval(highlightInterval);
                        beginIRCQuiz(currentSelection, listElements[currentSelection]);
                        usedElements[currentSelection] = 1;

                        setTimeout(function(){
                            $("#textInput").get(0).focus();
                        }, 1);
                    } else {

                    }
                }
            }
        }
    }

    var checkAvailableChoices = function(){
        for (var i = 2; i < listElements.length; i++) {
            if (usedElements[i] != 1) {
                break;
            }
            if (i == listElements.length - 1) {
                endGame();
            }
        }
    }

    var checkInput = function(input, target){
        input = input.toLowerCase();
        target = target.toLowerCase();
        if (input == target){
            return true;
        }
        else{
            return false;
        }
    }

    var calculateScore = function(){
        score += Math.round((timeRemaining/totalTime)*100);
        totalTime = 0;
        timeRemaining = 0;
    }

    var calculatePossibleScore = function(){
        return Math.round((timeRemaining/totalTime)*100);
    }

    var beginIRCQuiz = function(index, string){
        selectorLock = true;
        usedCharArray = new Array();

        //Set up quiz string so spaces appear in the blank lines
        var quizStringPieces = string.split(" ");
        var quizString = "";
        var blankString = "";
        var charArray = new Array();

        //fill in quiz and blank strings
        for (var i = 0; i < quizStringPieces.length; i++){
            if(i < quizStringPieces.length-1){
                quizString += quizStringPieces[i] + " ";
                for (var j = 0; j < quizStringPieces[i].length; j++){
                    blankString += "_";
                    ++totalTime;
                }
                blankString += " ";
            }
            else{
                quizString += quizStringPieces[i];
                for (var j = 0; j < quizStringPieces[i].length; j++){
                    blankString += "_";
                    ++totalTime;
                }
            }
        }

        var charCount = totalTime;
        //fill in charArray
        for (var i=0; i < string.length; i++){
            charArray[i] = string.charAt(i);
            if(string.charAt(i) === ' '){
                usedCharArray[i] = string.charAt(i);
            }
        }

        quizTarget = quizString;
        targetIndex = index;
        document.getElementById(index).textContent = blankString;

        var charIndex = 0;
        var animationChar = '-';
        var timeLimit = 120;
        var timer = timeLimit;
        var animationDelay = 4;
        var animationTimer = animationDelay;

        totalTime *= timeLimit;
        timeRemaining = totalTime;

        charIndex = chooseRandomChar(quizString);

        scoreInterval = setInterval(function(){
            scoreHud(possibleScoreText + calculatePossibleScore());
        }, 1000/60);

        quizInterval = setInterval(function (){
            //plays animation at current index
            blankString = setCharAt(blankString, charIndex, animationChar);

            if(animationTimer === 0){
                animationChar = getNextAnimationChar(animationChar);
                document.getElementById(index).textContent = blankString;
            }
            if(timer === 0){
                blankString = setCharAt(blankString, charIndex, quizString.charAt(charIndex));
                document.getElementById(index).textContent = blankString;

                charIndex = chooseRandomChar(quizString);

                if(selectorLock){
                    if(charIndex == -1){
                        selectorLock = false;
                        clearInterval(quizInterval);
                        clearInterval(scoreInterval);
                        highlightInterval = setInterval(highlight, 1000/60);

                        takeDamage();
                    }
                }
            }

            --timer;
            --animationTimer;
            --timeRemaining;

            if(timer < 0){
                timer = timeLimit;
            }

            if(animationTimer < 0){
                animationTimer = animationDelay;
            }
        }, 1000/60);
    }

    var chooseRandomChar = function(string){
        var i = 0;

        for(var j=0; j<string.length; j++){
            if (usedCharArray[j] == null){
                break;
            }

            if (j == string.length-1){
                return -1;
            }
        }

        while(true){
            i = getRandomInt(0, string.length);
            if(!(usedCharArray[i] != null || string.charAt(i) == ' ')){
                usedCharArray[i] = string.charAt(i);
                return i;
            }
        }
    }

    var takeDamage = function(){
        beginHeartFlash(health);
        --health;

        if(health <= 0){
            endGame();
        }
    }

    var animCharArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    var getNextAnimationChar = function(char){
        var outChar = char;
        while(outChar === char){
            outChar = animCharArray[getRandomInt(0, animCharArray.length)];
        }
        return outChar;
    }

    var setCharAt = function (string, index, char) {
        if(index > string.length-1){
            return string;
        }
        else{
            return string.substr(0,index) + char + string.substr(index+1);
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
        clearInterval(quizInterval);
        clearInterval(scoreInterval);
        staticHud(finalScoreText + score);
        $('#playAgainBox').css("visibility", "visible");
        $('#playAgainBox').css("pointer-events", "all");
    }

    var resetGame = function () {
        gameActive = true;
        health = 3;
        score = 0;
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

    var scoreHud = function (inputString){
        clearInterval(hudInterval);
        $('#hud').html(inputString);
    }

    var getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
}
