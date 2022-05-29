const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

function drawRect(x,y,w,h,color){
  ctx.fillStyle=color;
  ctx.fillRect(x,y,w,h);
}

function drawText(text,x,y,color){
  ctx.fillStyle=color;
  ctx.font="75px fantasy";
  ctx.fillText(text,x,y);
}

function drawTexts(text,x,y,color){
  ctx.fillStyle=color;
  ctx.font="15px fantasy";
  ctx.fillText(text,x,y);
}

function drawCircle(x,y,r,color){
  ctx.fillStyle=color;
  ctx.beginPath();
  ctx.arc(x,y,r,0, Math.PI*2, false);
  ctx.closePath();
  ctx.fill();
}

const user = {
  x: 0,
  y: (canvas.height - 100)/2,
  width: 10,
  height: 100,
  color: "WHITE",
  score: 0,
  status: 0,
}

const com = {
  x: canvas.width-10,
  y: (canvas.height - 100)/2,
  width: 10,
  height: 100,
  color: "WHITE",
  score: 0,
  status: 0,
}

const net = {
  x: (canvas.width - 2)/2,
  y: 0,
  width: 2,
  height: 10,
  color: "WHITE",
}

const ball = {
  x: canvas.width/2,
  y: canvas.height/2,
  radius: 10,
  speed : 5,
  velocityX : 5,
  velocityY : 5,
  color: "WHITE",
}

const laser1 = {
  x: 11,
  y: user.y + (user.height/2) - 3,
  width: 10,
  height: 5,
  speed: 7,
  status: 1,
  color: "WHITE",
}

const laser2 = {
  x: canvas.width-15,
  y: com.y + (com.height/2) - 3,
  width: 10,
  height: 5,
  speed: 7,
  status: 1,
  color: "WHITE",
}

canvas.addEventListener("mousemove", movePaddle)

function movePaddle(evt){
  let rect = canvas.getBoundingClientRect();
  user.y = evt.clientY - rect.top - user.height/2;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function click(){
  if(user.width == 0){ 
    user.status = 1;
    user.height = 50;
    user.width = 10;
  }
}

function shoot1(){
  if(user.status == 1){
    laser1.width = 10
    laser1.x = user.x;
    drawRect(laser1.x, laser1.y, laser1.width, laser1.height, laser1.color);
    while((laser1.x-11)<canvas.width){
      laser1.x += laser1.speed;
      drawRect(laser1.x, laser1.y, laser1.width, laser1.height, laser1.color);
      if(((laser1.x+laser1.width)>= canvas.width)){
        laser1.width = 0
        laser1.x = canvas.width/1;
        break
      }
      if(collision1(laser1,com)){
        laser1.width = 0
        laser1.x = canvas.width/2;
        laser1.status = 0;
        com.status = 0;
        com.height = 0;
        com.width = 0
        break
      }
    }
    drawRect(laser1.x, laser1.y, laser1.width, laser1.height, "BLACK");
  }
}

function shoot2(){
  if(com.status == 1){
    laser2.width = 10
    laser2.x = com.x;
    drawRect(laser2.x, laser2.y, laser2.width, laser2.height, laser2.color);
    while((laser2.x+15)> -canvas.width){
      laser2.x -= laser2.speed;
      drawRect(laser2.x, laser2.y, laser2.width, laser2.height, laser2.color);
      if(((laser2.x+laser2.width)<= -canvas.width)){
        laser2.width = 0
        laser2.x = canvas.width/2;
        break
      }
      if(collision2(laser2,user)){
        laser2.width = 0
        laser2.x = canvas.width/2;
        laser2.status = 0;
        user.status = 0;
        user.height = 0;
        user.width = 0;
        boxx = getRandomInt(100);
        boxy = getRandomInt(100);
        break
      }
    }
    drawRect(laser2.x, laser2.y, laser2.width, laser2.height, "BLACK");
  }
}

function update(){
  laser1.y = user.y + (user.height/2) - 3;
  laser2.y = com.y + (com.height/2) - 3;
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;
  document.addEventListener("mousemove", () => {
    let mousex = event.clientX; // Gets Mouse X
    let mousey = event.clientY; // Gets Mouse Y
  })
  
  let computerlevel = 0.1;
  com.y += (ball.y -(com.y + com.height/2)) * computerlevel;
  
  if(ball.y + ball.radius > canvas.height || ball.y-ball.radius<0 ){
    ball.velocityY = -ball.velocityY;
  }

  let player = (ball.x < canvas.width/2) ? user:com;
  
  if(collision(ball,player)){
    let collidePoint = (ball.y-(player.y + player.height/2));
    collidePoint = collidePoint/ (player.height/2);
    let angleRad = (Math.PI/4) * collidePoint;
    
    let direction = (ball.x<canvas.width/2) ? 1:-1;

    ball.velocityX = direction * ball.speed* Math.cos(angleRad);
    ball.velocityY = direction * ball.speed* Math.sin(angleRad);

    ball.speed += 0.1;
  }
  
  if(collision1(laser1,com)){
    laser1.width = 0
    laser1.x = canvas.width/2;
    laser1.status = 0;
    laser1.status = 0;
    com.status = 0;
    com.height = 0;
    com.width = 0
  }

  if(collision2(laser2,user)){
    laser2.width = 0
    laser2.x = canvas.width/2;
    laser2.status = 0;
    laser2.status = 0;
    user.status = 0;
    user.height = 0;
    user.width = 0
  }


  if(ball.x - ball.radius<0){
    com.score++;
    resetBall();
  }else if(ball.x + ball.radius > canvas.width){
    user.score++;
    resetBall();
  }
}

function resetBall(){
  ball.x = canvas.width/2;
  ball.y = canvas.height/2;
  ball.speed = 5;
  ball.velocityX = -ball.velocityX;
  com.status = 1;
  user.status = 1;
  com.height = 100;
  com.width = 10;
  user.height = 100;
  user.width = 10;
}

function drawNet(){
  for(let i = 0; i<= canvas.height; i+=15){
    drawRect(net.x, net.y + i, net.width, net.height, net.color);
  }
}

function collision (b,p){
  p.top = p.y;
  p.bottom = p.y + p.height;
  p.left = p.x;
  p.right = p.x + p.width;

  b.top = b.y - b.radius;
  b.bottom = b.y + b.radius;
  b.left = b.x - b.radius;
  b.right = b.x + b.radius;

  return b.right> p.left && p.top < b.bottom && b.left < p.right && p.bottom > b.top && p.status == true;
}

function collision1 (l,p){
  p.top = p.y;
  p.bottom = p.y + p.height;
  p.left = p.x;
  p.right = p.x + p.width;

  l.top = l.y;
  l.bottom = l.y + l.height;
  l.left = l.x;
  l.right = l.x + l.width;

  return l.right> p.left && p.top < l.bottom && l.left < p.right && p.bottom > l.top && p.status == true;
}

function collision2 (l,p){
  p.top = p.y;
  p.bottom = p.y + p.height;
  p.left = p.x;
  p.right = p.x + p.width;

  l.top = l.y;
  l.bottom = l.y + l.height;
  l.left = l.x;
  l.right = l.x + l.width;

  return l.right< p.left && p.top < l.bottom && l.left < p.right && p.bottom> l.top && p.status == true;
}

let numnum = 1
function render(){
  if(numnum==1){
    com.status = 1;
    user.status = 1;
    com.height = 100;
    com.width = 10;
    user.height = 100;
    user.width = 10;
    numnum = 0
  }
  drawRect(0,0, canvas.width, canvas.height, "BLACK");
  drawTexts("You fire every 1.7 seconds", 20, canvas.height-10, "WHITE")
  drawTexts("NPC fires every 1.3 seconds", canvas.width-175, canvas.height-10, "WHITE")
  drawText(user.score, canvas.width/4, canvas.height/5, "WHITE");
  drawText(com.score, 3*canvas.width/4, canvas.height/5, "WHITE");
  drawNet();
  drawRect(user.x, user.y, user.width, user.height, user.color);
  drawRect(com.x, com.y, com.width, com.height, com.color);
  drawCircle(ball.x, ball.y, ball.radius, ball.color);
  if (user.width == 0){
    drawTexts("CLICK THE BOX TO RESPAWN", canvas.width/2 - 80, canvas.height-10, "WHITE")
    drawRect(canvas.width/2 + 50 - boxx, canvas.height/2 - boxy, 40, 40, "RED")
    canvas.addEventListener("click", click)
  }
}

function game(){
  update(); // Movements, collisions, score upd etc
  render();
}

const framePerSecond = 50;
setInterval(game, 1000/framePerSecond); // 1000ms per sec
setInterval(shoot2, 1700);
setInterval(shoot2, 1300);
