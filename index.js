
const container = document.getElementById('container');
let isOpBot = true;
let timer = null;
let botTimer = null;

const startPage = {
    title: 'Ping Pong',
    create() {
        let div = document.createElement("div");
        div.id = "start-page";
        div.innerHTML = `<h1>${this.title}</h1>
        <div class="btns">
            <button ${isOpBot ? 'class="selected"' : ''} id="bot" onclick="changePlayer(this)">Bot</button>
            <button ${isOpBot ? '': 'class="selected"'} id="ply" onclick="changePlayer(this)">Player</button>
        </div>
        <button class="btn" onclick="startGame()">Play</button>`;
        container.append(div);
        this.elem = document.getElementById("start-page");
    }
}

const game = {
    create() {
        let div = document.createElement("div")
        div.id = "game"
        container.append(div)
        this.elem = document.getElementById("game")
    }
}

const player = {
    userName1: '',
    userName2: 'Player 2',
    score: 10,
    create() {
        player.userName1 = isOpBot ? "Bot" : 'Player 1';
        let div = document.createElement("div");
        div.id = "player";
        div.innerHTML = `<h2>${this.userName1}</h2> <h2>Score ${this.score}</h2> <h2>${this.userName2}</h2>`;
        game.elem.append(div);
        this.elem = document.getElementById("player");
    }
}

const board = {
    w: 900,
    h: 600,
    color: '#000',
    show() {
        this.elem = document.getElementById("board");
        this.elem.style.width = this.w + "px";
        this.elem.style.height = this.h + "px";
        this.elem.style.border = "1px solid #fff";
        this.elem.style.background = this.color;
    },
    create() {
        let div = document.createElement("div");
        div.id = "board";
        game.elem.append(div);
        this.show();
    }
}

const inside = {
    score1: 0,
    score2: 0,
    show() {
        this.elem = document.getElementById("inside");
        this.elem.innerHTML = `<p>${this.score1}</p> <div id="line"></div> <p>${this.score2}</p>`;
    },
    create() {
        let div = document.createElement("div");
        div.id = "inside";
        board.elem.append(div);
        this.show();
    }
}

const bar1 = {
    x: 5,
    y: 0,
    w: 10,
    h: 150,
    color: '#fff',
    move(e) {
        if(e.keyCode == 87) bar1.y -= 20;
        if(e.keyCode == 83) bar1.y += 20;

        if(bar1.y < 0) bar1.y = 0;
        if(bar1.y + bar1.h > board.h) bar1.y = board.h - bar1.h;
        bar1.show();
    },
    bot() {
        if(ball.x <= board.w / 2) {
            if(ball.y > bar1.y + bar1.h) 
                bar1.y += rand(9,15);
            else if(ball.y < bar1.y)
                bar1.y -= rand(9,15);
        }

        if(bar1.y < 0) bar1.y = 0;
        if(bar1.y + bar1.h > board.h) bar1.y = board.h - bar1.h;
        bar1.show();
    },
    show(state = 0) {
        if(state) {
            bar1.elem = document.getElementById("bar1");
            bar1.elem.style.width = bar1.w + "px";
            bar1.elem.style.height = bar1.h + "px";
            bar1.elem.style.background = bar1.color;
            bar1.elem.style.position = "absolute";
        }
        bar1.elem.style.left = bar1.x + "px";
        bar1.elem.style.top = bar1.y + "px";
    },
    create() {
        let div = document.createElement("div");
        div.id = "bar1";
        board.elem.append(div);
        this.show(1);
    }
}

const bar2 = {
    x: board.w - 15,
    y: 0,
    w: 10,
    h: 150,
    color: '#fff',
    move(e) {
        if(e.keyCode == 38 && bar2.y > 0) bar2.y -= 20;
        if(e.keyCode == 40 && bar2.y < board.h - bar2.h ) bar2.y += 20;

        if(bar2.y < 0) bar2.y = 0;
        if(bar2.y + bar2.h > board.h) bar2.y = board.h - bar2.h;
        bar2.show();
    },
    show(state = 0) {
        if(state) {
            bar2.elem = document.getElementById("bar2");
            bar2.elem.style.width = bar2.w + "px";
            bar2.elem.style.height = bar2.h + "px";
            bar2.elem.style.background = bar2.color;
            bar2.elem.style.position = "absolute";
        }
        bar2.elem.style.left = bar2.x + "px";
        bar2.elem.style.top = bar2.y + "px";
    },
    create() {
        let div = document.createElement("div");
        div.id = "bar2";
        board.elem.append(div);
        this.show(1);
    }
}

const ball = {
    d: 20,
    color: '#fff',
    x: board.w/2,
    y: board.h/2,
    dx: 15,
    dy: 12,
    move() {
        if (ball.x + ball.d >= board.w) winner(true);
        if (ball.x <= 0) winner(false);

        if( ball.y <= 5 || ball.y >= board.h - ball.d - 5) ball.dy *= -1;

        if((ball.x <= bar1.x + bar1.w && ball.y + ball.d > bar1.y && ball.y <bar1.y + bar1.h) ||
            (ball.x + ball.d >= bar2.x && ball.y + ball.d > bar2.y && ball.y < bar2.y + bar2.h)) ball.dx *= -1;
       
        ball.x += ball.dx;
        ball.y += ball.dy;
        
        ball.show();
    },
    show(state = 0) {
        if(state){
            ball.elem = document.getElementById("ball");
            ball.elem.style.width = ball.d + "px";
            ball.elem.style.height = ball.d + "px";
            ball.elem.style.borderRadius = '50%';
            ball.elem.style.position = "absolute";
            ball.elem.style.background = ball.color;
        }
        ball.elem.style.left = ball.x + "px";
        ball.elem.style.top = ball.y + "px";
    },
    create() {
        let div = document.createElement("div");
        div.id = "ball";
        board.elem.append(div);
        this.show(1);
    }
}

function create() {
    bar1.y = (board.h - bar1.h ) / 2;
    bar2.y = (board.h - bar2.h ) / 2;
    ball.x = board.w/2;
    ball.y = board.h/2;
    inside.score1 = 0;
    inside.score2 = 0;
    game.create();
    player.create(isOpBot);
    board.create();
    inside.create();
    bar1.create();
    bar2.create();
    ball.create();
    bar1.show();
    bar2.show();
    if(!isOpBot)
        document.addEventListener('keydown', bar1.move);
    else 
        botTimer = setInterval(bar1.bot, 40);
    document.addEventListener('keydown', bar2.move);
    timer = setInterval(ball.move, 40)   
}

function winner(isOne) {
    if(inside.score1 == player.score - 1) 
        startPage.title = player.userName1 + " Won!!";
    else if(inside.score2 == player.score - 1) 
        startPage.title = player.userName2 + " Won!!";
    else {
        if(isOne) {
            inside.score1 += 1;
            ball.x = 100;
            ball.y = 100;
            ball.dy = Math.abs(ball.dy) * -1.
        }
        else {
            inside.score2 += 1;
            ball.x = board.w - 100;
            ball.y = board.h - 100;
            ball.dy = Math.abs(ball.dy);
        }
        bar1.y = (board.h - bar1.h ) / 2;
        bar2.y = (board.h - bar2.h ) / 2;
        ball.show()
        bar1.show()
        bar2.show()
        inside.show();
        return;
    }
    clearInterval(timer);
    game.elem.remove();
    if(botTimer != null)
        clearInterval(botTimer);
    startPage.create();
}

startPage.create();

function startGame() {
    startPage.elem.remove();
    create();
}

function changePlayer(btn) {
    btns = document.getElementsByClassName('selected');
    for(bt of btns) { bt.classList.remove('selected'); }
    isOpBot = btn.id == 'bot';
    btn.classList.add('selected')
}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}