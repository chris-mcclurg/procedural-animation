import p5 from 'p5';
import BodySegment from './bodySegment';

function nyoom(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}
function outBack (x: number): number {
  const c1 = 1.70158;
  const c2 = c1 * 1.525;
  
  return x < 0.5
  ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
  : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
}
function easeOutQuint(x: number): number {
  return 1 - Math.pow(1 - x, 5);
}

const motions = [nyoom, outBack, easeOutQuint];

function ease(x: number, clickCount: number): number {
  const type = clickCount % motions.length;
  console.log(type);
  console.log(motions[type]);
  return motions[type](x);
}

const sketch = (p: p5) => {
  let frameRate: number, totalDuration: number, timePassed: number;
  let size: number;
  let from: p5.Vector, to: p5.Vector, headPos: p5.Vector, secondVect: p5.Vector;
  let points: BodySegment[] = [];
  let pointSize: number;
  let pointCount: number
  let clickCount: number;
  
  p.setup = () => {
    // frameRate = 45;
    pointCount = 8;
    pointSize = 35;
    timePassed = 2;
    totalDuration = 1.5;
    clickCount = -1;


    const canvasElem = document.getElementById('procanim');
    size = p.min(p.windowWidth, p.windowHeight) * 0.8;
    const canvas = p.createCanvas(size, size, canvasElem!);

    from = p.createVector(0, 0);
    to = p.createVector(pointSize, 0);
    headPos = p.createVector(from.x, from.y);
    for (let i = 0; i < pointCount; i++) {
      const secondVect = p.createVector(0, 0);
      secondVect.set(0 - i * pointSize, 0);
      points.push(new BodySegment(p, secondVect, pointSize - 3 * i));
    }
  }

  p.draw = () => {
    p.background(34, 34, 34);
    p.translate(p.width / 2, p.height / 2);

    if (timePassed < totalDuration) {
      const t = timePassed / totalDuration;
      headPos = p5.Vector.lerp(from, to, ease(t, clickCount));    
      points[0].setCoordinates(headPos.x, headPos.y);
      for (let i = 1; i < points.length; i++) {
        points[i-1].constrain(points[i]);
      }
      
      timePassed += p.deltaTime * 0.001;
    } else {
      headPos.set(to.x, to.y);
      points[0].constrain(points[1]);
    }
    
    for (let point of points) {
      point.display();
    }
  }

  p.windowResized = () => {
    size = p.min(p.windowWidth, p.windowHeight) * 0.8;
    p.resizeCanvas(size, size)
  }

  p.mouseClicked = () => {
    from.set(headPos.x, headPos.y);
    to = p.createVector(p.mouseX - p.width / 2, p.mouseY - p.height / 2);
    timePassed = 0;
    clickCount++;
  }
}

new p5(sketch);
