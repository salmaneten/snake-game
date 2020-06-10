window.onload = function()
{
    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize = 30;
    var ctx;
    var delay =100; // délai de 100 ms
    var snakee;
    var applee;
    var widthInBlocks = canvasWidth/blockSize;
    var heightInBlocks = canvasHeight/blockSize;
    var score;
    var timeout;
    

    init();
    function init()
    {
        canvas = document.createElement('canvas');          // création du canvas (la grille)
        canvas.width = canvasWidth;                         // la largeur du canvas 
        canvas.height = canvasHeight;                       // la hauteur du canvas
        canvas.style.border = "30px solid gray";                  // taille de bordure 
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#ddd";
        document.body.appendChild(canvas);                  // Pour joindre le canvas au body du site html
        ctx = canvas.getContext('2d');                      
        snakee = new Snake([[6,4], [5,4], [4,4], [3,4], [2,4]] , "right"); // appel du constructeur Snake
        applee = new Apple([10,10]);
        score = 0;
        refreshCanvas(); 
    }

    function refreshCanvas()
    {   
        snakee.advance();
        if(snakee.checkCollision())
        {
            gameOver();
        }
        else
        {   
            if(snakee.isEatingApple(applee))
            {
                score++;
                 snakee.ateApple = true; 
                do
                {
                    applee.setNewPosition();
                }
                while(applee.isOnSnake(snakee))
                 
            }   
            ctx.clearRect(0,0,canvasWidth, canvasHeight);       // Pour mettre à jour le rect                        
            drawScore();
            snakee.draw();
            applee.draw();
            timeout = setTimeout(refreshCanvas,delay);                    // Pour rappeler la fanction refreshCanvas apres chaque délai
        }
       
    }

    function gameOver()
    {
        ctx.save();
        ctx.font = "bold 70px sans-serif";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;                             // epesseur de stroke
        var centerX = canvasWidth / 2;
        var centerY = canvasHeight / 2;
        ctx.strokeText("Game Over", centerX, centerY - 180);
        ctx.fillText("Game Over", centerX, centerY - 180);
        ctx.font = "bold 30px sans-serif";
        ctx.strokeText("Appuyer sur Espace pour rejouer", centerX, centerY - 120);
        ctx.fillText("Appuyer sur Espace pour rejouer", centerX, centerY - 120);
        ctx.restore();
    }
    
    function restart()
    {
        snakee = new Snake([[6,4], [5,4], [4,4], [3,4], [2,4]] , "right"); // appel du constructeur Snake
        applee = new Apple([10,10]);
        score = 0;
        clearTimeout(timeout);
        refreshCanvas();
    }
    
    function drawScore()
    {
        ctx.save();
        ctx.font = "bold 200px sans-serif";
        ctx.fillStyle = "gray";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        var centerX = canvasWidth / 2;
        var centerY = canvasHeight / 2; 
        ctx.fillText(score.toString(), centerX, centerY);
        ctx.restore()
    }
    function drawBlock(ctx, position)
    {
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x, y, blockSize, blockSize);          // dessiner les rectangles de sanke
    }
    function Snake(body, direction)
    {
        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        this.draw = function()
        {
            ctx.save();
            ctx.fillStyle = "#ff0000";
            for( var i = 0; i< this.body.length; i++)
            {
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();
        };
        this.advance = function()
        {
            var nextPosition = this.body[0].slice();
            switch(this.direction)
            {
                case "left":
                    nextPosition[0] -= 1;
                    break;
                case "right":
                    nextPosition[0] += 1;
                    break;
                case "down":
                    nextPosition[1] += 1;
                    break;
                case "up":
                    nextPosition[1] -= 1;
                    break;
                default:
                    throw("Invalid Direction") ;
            }

            this.body.unshift(nextPosition);          // cette fnct permette d'ajouter à la premiere place du Array(body) (snake's head)        
            if(!this.ateApple)
                this.body.pop();                          // supprimer le dernier élément du Array (body)
            else
                this.ateApple = false;    
        };
        this.setDirection = function(newDirection)
        {
            var allowedDirections;
            switch(this.direction)
            {
                case "left":
                case "right":
                    allowedDirections = ["up", "down"];
                    break;
                case "down":
                case "up":
                    allowedDirections = ["left", "right"];
                    break;
                default:
                    throw("Invalid Direction")
            }
            if(allowedDirections.indexOf(newDirection) > -1) // Pour que la direction soit permise du Array
            {
                this.direction = newDirection;

            }
        };
            this.checkCollision = function()
            {
                var wallCollision = false;
                var snakeCollision = false;
                var head = this.body[0];
                var rest = this.body.slice(1);
                var snakeX = head[0];
                var snakeY = head[1];
                var minX = 0;
                var minY = 0;
                var maxX = widthInBlocks -1;
                var maxY = heightInBlocks -1;
                var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
                var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;
                
                if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls)
                {
                    wallCollision = true;
                }
                for( var i = 0; i < rest.length ; i++)
                {
                    if(snakeX === rest[i][0] && snakeY === rest[i][1])
                    {
                        snakeCollision = true;
                    }
                    
                }
                return wallCollision || snakeCollision; 

            };
            this.isEatingApple = function(appleToEat)
            {
                var head = this.body[0];
                if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
                    return true;
                else
                    return false;
            };

      
    }
    
    function Apple(position)
    {
        this.position = position;
        this.draw = function()
        {
            ctx.save();                                      // enregistrer les conviguration du canvas
            ctx.fillStyle = "#33cc33";                       // ajustement sur les configs du canvas 
            ctx.beginPath();
            var radius = blockSize/2;
            var x = this.position[0]*blockSize + radius;
            var y = this.position[1]*blockSize + radius;
            ctx.arc(x,y, radius, 0, Math.PI*2, true);
            ctx.fill(); 
            ctx.restore();                                   // restaurer les anciennes configs enregitrés du canvas
        };
        this.setNewPosition = function()
        {
            var newX = Math.round(Math.random() * (widthInBlocks- 1));
            var newY = Math.round(Math.random() *(heightInBlocks - 1));
            this.position = [newX, newY];
        };
        this.isOnSnake = function(snakeToCheck)
        {
            var isOnSnake = false;
            for(var i = 0; i < snakeToCheck.body.length; i++)
            {
                if(this.position[0] === snakeToCheck.body[i][0] && 
                    this.position[1] === snakeToCheck.body[i][1] )
                    {
                        isOnSnake = true;
                    }
            }
            return isOnSnake; 
        };
    }

    this.document.onkeydown = function handlekeyDown(e)
    {
        var key = e.keyCode;
        var newDirection;
        switch(key)
        {
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up";
                break;
            case 39 :
                newDirection = "right";
                break;
            case 40 :
                newDirection = "down"
                break;
            case 32 :
                 restart();
                 return;   
            default:
                return;
        }
        snakee.setDirection(newDirection);
    }
    
    
    
}

