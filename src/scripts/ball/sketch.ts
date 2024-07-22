import p5 from 'p5';
import Ball from './ball';

const sketch = (p: p5) => {
  let speed = 10; // speed of the ball
  let balls: Ball[] = [], numBalls = 2;
  let frameRate = 60;
  let radFract = 8;
  
  p.setup = () => {
    const canvasElem = document.getElementById('procanim');
    const canvas = p.createCanvas(p.windowWidth * 0.8, p.windowWidth * 0.8, canvasElem!);
    p.frameRate(frameRate);

    let radius = p.width / radFract;
    let l = - p.width / 2 + radius;
    let r = p.width / 2 - radius;
    let t = - p.height / 2 + radius;
    let b = p.height / 2 - radius;

    for (let i = 0; i < numBalls; i++) {
      let overlapping = false;
      let x, y;
      const newBall = new Ball(p, 0, 0, 0, 0, radius);

      do {
        overlapping = false;
        newBall.setCoordinates(p.random(l, r), p.random(t, b));
        for (let j = 0; j < i; j++) {
          if (newBall.intersects(balls[j])) { 
            overlapping = true;
            break;
          }
        }
      } while (overlapping);
      
      const xSpeed = p.random(-speed, speed); 
      const ySpeed = p.random(-speed, speed);
      balls.push(new Ball(p, newBall.position.x, newBall.position.y, xSpeed, ySpeed, radius));
    }
  };

  p.draw = () => {
    p.background(220);
    p.translate(p.width / 2, p.height / 2);

    for (let i = 0; i < numBalls; i++) {
      for (let j = i + 1; j < numBalls; j++) {
        if (balls[i].intersects(balls[j])) {
          balls[i].handleCollision(balls[j]);
        }
      }
    }

    for (let i = 0; i < numBalls; i++) {
      balls[i].update();
      balls[i].display();
    }
  };
};

new p5(sketch);
