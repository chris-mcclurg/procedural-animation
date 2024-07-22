import p5 from 'p5';

class BodySegment {
  public position: p5.Vector;
  public distance: number;
  private p: p5; 

  constructor(p: p5, position: p5.Vector, distance: number) {
    this.p = p;
    this.position = position
    this.distance = distance;
  }

  setCoordinates(x: number, y: number) {
    this.position.set(x, y);
  }

  display() {
    const borderWidth = 0.05 * this.distance;
    const dotSize = 0.05 * this.distance;
    const numDashes = 32;

    // Draw the hollow circle
    this.p.strokeWeight(borderWidth);
    this.p.stroke(255);
    this.p.noFill();
    this.p.ellipse(this.position.x, this.position.y, this.distance * 0.2, this.distance * 0.2);

    // Draw the dotted line
    this.p.noStroke();
    this.p.fill(255, 255 * 0.7);
    const angleIncrement = (2 * Math.PI) / numDashes;
    const dashAng = this.p.createVector(this.distance, 0);
    for (let i = 0; i < numDashes; i++) {
      dashAng.rotate(angleIncrement)
      const dashPos = p5.Vector.add(this.position, dashAng);
      this.p.circle(dashPos.x, dashPos.y, dotSize * 2);
    }
  }

  constrain(other: BodySegment) {
    const dx = other.position.x - this.position.x;
    const dy = other.position.y - this.position.y;
    const angle = Math.atan2(dy, dx);
    const newX = this.position.x + Math.cos(angle) * this.distance;
    const newY = this.position.y + Math.sin(angle) * this.distance;
    other.setCoordinates(newX, newY);
  }
}

export default BodySegment;
