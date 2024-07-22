import p5 from 'p5';

class Ball {
  public position: p5.Vector;
  public velocity: p5.Vector;
  public radius: number;
  private p: p5; 

  constructor(p: p5, x: number, y: number, xSpeed: number, ySpeed: number, radius: number) {
    this.p = p;
    this.position = this.p.createVector(x, y);
    this.velocity = this.p.createVector(xSpeed, ySpeed);
    this.radius = radius;
  }

  setCoordinates(x: number, y: number) {
    this.position.set(x, y);
  }

  intersects(other: Ball): boolean {
    const dx = this.position.x - other.position.x;
    const dy = this.position.y - other.position.y;
    const distance = this.p.sqrt(dx * dx + dy * dy);
    return distance < this.radius + other.radius;
  }

  handleCollision(other: Ball) {
    const distance = p5.Vector.dist(this.position, other.position);
    const sumOfRadii = this.radius + other.radius;
    if (distance < sumOfRadii) {
      const angle = p5.Vector.angleBetween(this.position, other.position);
      const direction = p5.Vector.sub(other.position, this.position).normalize();
      const newPosition = p5.Vector.add(this.position, direction.mult(sumOfRadii));
      other.position.set(newPosition.x, newPosition.y);
    }
    [this.velocity, other.velocity] = [other.velocity, this.velocity];
  }

  update() {
    this.position.add(this.velocity);
    
    if (this.position.x + this.radius > this.p.width / 2 || this.position.x - this.radius < this.p.width / -2) {
      this.velocity.x *= -1;
      this.position.x = this.p.constrain(this.position.x, this.p.width / -2 + this.radius, this.p.width / 2 - this.radius);
    }

    if (this.position.y + this.radius > this.p.height / 2 || this.position.y - this.radius < this.p.height / -2) {
      this.velocity.y *= -1;
      this.position.y = this.p.constrain(this.position.y, this.p.height / -2 + this.radius, this.p.height / 2 - this.radius);
    }
  }

  display() {
    this.p.ellipse(this.position.x, this.position.y, this.radius * 2, this.radius * 2);
  }
}

export default Ball;
