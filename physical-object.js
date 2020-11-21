var PhysicalObject = function (x, y, w, h) {
  // gravity = 10;
  //initialize the coordinates and velocity
  this.s = new Vec([x, y]);
  this.v = new Vec([0, 0]);
  this.a_avg = new Vec([0, gravity]);
  // Set the object's x/y position
  this.dimession = new Vec([w, h]);
  this.x = x;
  this.y = y;
  // Set the object's width and height
  this.width = w;
  this.height = h;
  this.springPositions = [];
  this.style = "#" + Math.floor(Math.random() * 256 * 256 * 256);
  this.torque = 0;
  this.omega = 0;
  this.theta = 0;
  this.m = 1;
  this.MomentofInertia = (this.m * (w * w + h * h)) / 12;
  // Adjust the object's x velocity
  this.addXVel = function (vel) {
    this.v.vector[0] += vel;
  };

  // Adjust the object's y velocity
  this.addYVel = function (vel) {
    this.v.vector[1] += vel;
  };

  this.fixSpringAt = function (x1, y1) {
    this.springPositions.push(new Vec([x1, y1]));
  };
  this.getNetForces = function () {
    let netForce = new Vec([0, 0]);
    let gForce = new Vec([0, this.m * gravity]);
    netForce.add(gForce);
    //if any constraits for this body then other force
    if (this.springPositions.length > 0) {
      this.springPositions.map((springPosition) => {
        netForce.add(
          Vec.scale(
            Vec.subract(
              new Vec([this.x + this.width / 2, this.y + this.height / 2]),
              springPosition
            ),
            -1 * stiffness
          )
        );
      });

      // netForce.add(springForce);
    }
    return netForce;
  };
  // Update the object's position for the next frame
  //using velocity verlet
  this.nextFrame = function () {
    //calculating new position after previous force calculation
    this.s = new Vec([this.x, this.y]);
    this.a_l = this.a_avg;
    this.temp = Vec.add(
      Vec.scale(this.v, dt),
      Vec.scale(this.a_l, 0.5 * dt * dt)
    );
    this.s = Vec.add(this.s, this.temp);

    //calculation of forces after reaching new position
    this.netForce = this.getNetForces();

    this.a_n = Vec.scale(this.netForce, 1 / this.m);
    this.a_avg = Vec.scale(Vec.add(this.a_l, this.a_n), 0.5);
    this.v = Vec.add(this.v, Vec.scale(this.a_avg, dt));
    [this.x, this.y] = this.s.vector;

    //adding a generailized drag
    this.v.vector[0] -= this.v.vector[0] * 0.01;
    this.v.vector[1] -= this.v.vector[1] * 0.01;
    //hit the boundary time for collision
    if (this.x + this.width >= width || this.x <= 0) {
      this.v.vector[0] *= elasticity;
      this.x <= 0 ? (this.x = 0) : (this.x = width - this.width);
    }
    if (this.y + this.height >= height || this.y <= 0) {
      this.v.vector[1] *= elasticity;
      //y+object height >= canvas height means that part of the object would not be rendered
      // so need to put the y of the object in such a way that the whole object is rendered
      //and feels realistic and also we do not do multiple collisions when hit the ground once
      this.y <= 0 ? (this.y = 0) : (this.y = height - this.height);
    }
  };

  this.areColliding = function (b) {
    var amin = new Vec([this.x, this.y]);
    var amax = Vec.add(amin, this.dimession);

    var bmin = new Vec([b.x, b.y]);
    var bmax = Vec.add(bmin, b.dimession);
    //get AABB vectors for both objects and use a single vector method for
    //detecting collisions in 2d and 3d
    var isNotCollided = false;
    for (var i = 0; i < amin.vector.length; i++) {
      isNotCollided ||=
        amin.vector[i] >= bmax.vector[i] || bmin.vector[i] >= amax.vector[i];
    }
    return !isNotCollided;
  };

  this.render = function (context) {
    context.fillStyle = this.style;
    context.fillRect(this.x, this.y, this.width, this.height);
    this.springPositions.map((springPosition) => {
      context.beginPath();
      context.moveTo(springPosition.vector[0], springPosition.vector[1]);
      context.lineTo(this.x + this.width / 2, this.y + this.height / 2);
      context.stroke();
    });
  };
};
