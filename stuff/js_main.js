var programCode = function(processingInstance) {
    with (processingInstance) {
        
    // nastavení poměru stran canvasu 
    var canvasWidth = window.innerWidth;
    var canvasHeight = window.innerHeight/2;
    // regulace rozměrů (kvůli hratelnosti)
    if (canvasHeight <= 200) {
        canvasWidth = canvasWidth * 0.9;
        canvasHeight = canvasHeight * 4;
    } else if (canvasHeight > 150) {
        var k = canvasWidth/canvasHeight;
        while (canvasHeight < 500) {
            canvasHeight = canvasHeight + 30;
            canvasWidth = canvasWidth + 30*k;
        }
    } 

    size(canvasWidth,canvasHeight);
    frameRate(50);
        
        // konstruktor nové třídy (postava)
        var Character = function(x, y) {
          this.x = x;
          this.y = y;
        };

        // přidání vlastnosti "draw" 
        Character.prototype.draw = function() {
            this.y = constrain(this.y, 0, height*0.85 - 50);
            fill(255, 213, 0);
            rect(this.x, this.y, 50, 50);
            fill(255, 255, 255);
            rect(this.x + 30, this.y + 5, 15, 15);
            rect(this.x + 5, this.y + 5, 15, 15);
            fill(0, 0, 0);
            rect(this.x + 35, this.y + 10, 4, 4);
            rect(this.x + 10, this.y + 10, 4, 4);
            fill(255, 0, 0);
            rect(this.x + 5, this.y + 30, 40, 12);
            fill(255, 255, 255);
            rect(this.x + 20, this.y + 30, 5, 5);
            rect(this.x + 25, this.y + 30, 5, 5);
        };

        // přidání vlastnosti "jump"
        Character.prototype.jump = function() {
            this.y -= 1 * 5.5;
        };

        // přidání vlastnosti "fall"
        Character.prototype.fall = function() {
            this.y += 1 * 1.5;
        };

        // přidání vlastnosti "crash"
        // argument "obstacle" deklarován níže
        Character.prototype.crash = function(obstacle) {
            if( // naraz do vrchni prekazky kolmo
                ((this.x + 50 === obstacle.x) && (this.y <= obstacle.height))||
                // naraz do vrchni prekazky
                ((this.x + 50 >= obstacle.x) && (this.x <= obstacle.x + 40) && 
                (this.y <= obstacle.height))||
                // naraz do spodni prekazky kolmo
                ((this.x + 50 === obstacle.x) && (this.y + 50 >= height*0.85 + obstacle.height))||
                // naraz do spodni prekazky
                ((this.x + 50 >= obstacle.x) && (this.x <= obstacle.x + 40) && 
                (this.y + 50 >= height*0.85 + obstacle.height))) 
            {
                window.location.reload();
            }
        };

        // konstruktor nové třídy (překážky)
        var Obstacle = function(x, y, height) {
            this.x = x;
            this.y = y;
            this.height = height;
        };

        // přidání vlastnosti "draw"
        Obstacle.prototype.draw = function() {
            fill(130, 30, 176);
            rect(this.x, this.y, 40, this.height);
            if (this.height > 0){
                rect(this.x - 3, this.height - 10, 45, 10);
                rect(this.x - 3, this.y, 45, 10);
            }
            else {
                rect(this.x - 3, this.height + height*0.85, 45, 10);
                rect(this.x - 3, this.y - 10, 45, 10);
            }
        };

        // deklarace objektu herni postavy
        var Bob = new Character(40, 280);

        // deklarace pole (velikosti) pro trávu
        var grass = [];
        for (var i = 0; i < width/19; i++) {
            // začátek nového bloku trávy je o 20px posunut (= šířka)
            grass.push(i*20);
        }
        
        // deklarace pole překážek
        var obstacle = [];
        for (var i = 0; i < width/50; i++) {  
            // nahodna velikost prekazek
            var delka = random(height*0.2, height*0.5);
            // horni prekazky
            obstacle.push(new Obstacle(i*120 + 400, 0, delka));
            // dolni prekazky
            obstacle.push(new Obstacle(i*120 + 400, height*0.85, delka - height*0.5));
        }


    // hlavní kreslící funkce, frekvence 50fps

        // proměnná Count slouží k plynulým pohybým 
        var Count = 0;
        draw = function() {
            
            // obloha
            background(227, 254, 255);
            // mrak
            fill(255, 255, 255);
            ellipse(200, 100, 50, 50);
            ellipse(235, 100, 50, 50);
            ellipse(270, 100, 50, 50);
            ellipse(305, 100, 50, 50);
            noStroke();
            rect(206, 82, 88, 36);
            stroke(0, 0, 0);
            // slunce
            fill(255, 250, 94);
            ellipse(0, 0, 200, 200);
            // země
            fill(130, 79, 43);
            rect(0, height*0.85, width, height*0.15);
            
            // animace trávy
            for (var i = 0; i < grass.length; i++) {
                fill(67, 186, 79);
                rect(grass[i], height*0.85, 20, 20);
                // rychlost posouvání trávy
                grass[i] -= 2;
                // přesunutí trávy zpět na začátek
                if (grass[i] <= -20) {
                    grass[i] = width;
                }
            }
            
            // animace překážek
            for (var i = 0; i < obstacle.length; i++) {
                obstacle[i].draw();
                // rychlost překážek
                obstacle[i].x -= 2;
                if (obstacle[i] <= -40) {
                    obstacle[i] = width;
                }
                // volání funkce "Bob.crash"
                Bob.crash(obstacle[i]);
            }

            // zjištění vstupu z myši
            mouseClicked = function() {
                Count = 10;
            };
            // zjištění vstupu z klávesnice
            keyPressed = function() {
                Count = 10;
            };
            // pro plynulý skok
            if (Count > 0) {
                Bob.jump();
            }

            Count = Count - 1;
            Bob.fall();
            Bob.draw();
        };


    }};
    var canvas = document.getElementById("canvas"); 


    // deklarace časovače
    var seconds = document.getElementById("seconds");
    var currentTime;
    // funkce časovače při každé implementaci sníží čas o "1"
    var timeOut = function() {
                currentTime = parseFloat(seconds.textContent);
                seconds.textContent = currentTime - 1;
                if (seconds.textContent == "-1") {
                    alert('Nestihl jsi odpovědět, konečné score: ' + scoreEl.textContent);
                    window.location.reload();
                }
            }
    // metoda pro volání funkce timeOut každých 1000ms
    var secondsTimer = window.setInterval(timeOut, 1000);


    // deklarace skóre (podobné jako časovač)
    var scoreEl = document.getElementById("score");
    var currentScore;
    // funkce scoreUp při každé implementaci zvýší skóre o "1"
    var scoreUp = function() {
        currentScore = parseFloat(scoreEl.textContent);
        scoreEl.textContent = currentScore + 1;
    };
    // metoda pro volání funkce scoreUp každých 100ms
    var scoreTimer = window.setInterval(scoreUp, 100);


    // deklarace otázek
    var questionEl = document.getElementById("otazka");
    var leftButtonEl = document.getElementById("leftButton");
    var rightButtonEl = document.getElementById("rightButton");
    var correctButton;

    var questions = function(selectButton) {
        // náhodně generované operandy (ineteger)
        var op1 = Math.round(Math.random() * (30 - 2) + 2);
        var op2 = Math.round(Math.random() * (30 - 2) + 2);;
        // náhodně generovaný chybný faktor
        var blunder = Math.round(Math.random() * (6,9 - 1) + 1);
        // náhodný výběr otázek
        var i = Math.round(Math.random(0)*4);

        // seřazení čísel (pro lehčí výpočty)
        if (op2 > op1) {
            var pom = op2;
            op2 = op1;
            op1 = pom;
        };

        // deklarace pole otázek
        var questionArray = [
            op1+" + "+op2, 
            op1+" - "+op2, 
            op1+" * "+op2, 
            op1+" mod "+op2, 
            op1+"^2"
        ];

        // deklarace pole správných odpovědí
        var correctAnswer = [
            op1+op2,
            op1-op2, 
            op1*op2, 
            Math.floor(op1/op2), 
            op1*op1
        ];

        // deklarace pole špatných odpovědí
        var wrongAnswer = [
            op1+op2+blunder,
            op1-op2-blunder,
            (op1*op2)-blunder,
            Math.round(op1/op2)+blunder,
            (op1*op1)+blunder
        ]; 

        // zjištění zda se vybrala správná odpověď
        if (selectButton === correctButton) {
            seconds.textContent = "10";
            correctButton = Math.round(Math.random(0)*1);
            questionEl.textContent = questionArray[i];
            if (correctButton == 0) {
                leftButtonEl.textContent = correctAnswer[i];
                rightButtonEl.textContent = wrongAnswer[i];
            }
            if (correctButton == 1) {
                leftButtonEl.textContent = wrongAnswer[i];
                rightButtonEl.textContent = correctAnswer[i];
            }
        } else {
            alert('Špatná odpověď, konečné score: ' + scoreEl.textContent);
            window.location.reload();
        }
    }

    // "nastartování" generátoru otázek 
    correctButton = 1;
    questions(1);

    // funkce levého tlačítka (selectButton = 0)
    var leftButton = function() {
        questions(0);
    }

    // funkce pravého tlačítka (selectButton = 1)
    var rightButton = function() {
        questions(1);
    }
    
    var processingInstance = new Processing(canvas, programCode);
