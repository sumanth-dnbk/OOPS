var PhysicalObject = function (x, y, w, h) {
    // gravity = 10;
    //initialize the coordinates and velocity
    this.s = new Vector([x, y]);
    this.v = new Vector([0, 0]);
    this.a = new Vector([0, gravity]);
    // Set the object's x/y position
    this.dimession = new Vector([w, h]);
    this.x = x;
    this.y = y;
    this.change = 1;
    // Set the object's width and height
    this.width = w;
    this.height = h;
    this.style = "#999";
    // Adjust the object's x velocity
    this.addXVel = function (vel) {
      this.v.vector[0] += vel;
    };

    // Adjust the object's y velocity
    this.addYVel = function (vel) {
      this.v.vector[1] += vel;
    };

    // Update the object's position for the next frame
    //using velocity verlet
    this.nextFrame = function () {
      this.change *= -1;
      this.style = "#999";
      this.s = new Vector([this.x, this.y]);
      this.a_l = this.a;
      this.temp = Vector.add(
        Vector.multiply(this.v, dt),
        Vector.multiply(this.a_l, 0.5 * dt * dt)
      );
      this.s = Vector.add(this.s, this.temp);

      //calculation of forces after reaching new position
      this.a = new Vector([
        0,
        gravity
      ]);
      this.a_avg = Vector.multiply(Vector.add(this.a_l, this.a), 0.5);
      this.v = Vector.add(this.v, Vector.multiply(this.a_avg, 0.5));
      [this.x, this.y] = this.s.vector;

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
      var amin = new Vector([this.x, this.y]);
      var amax = Vector.add(amin, this.dimession);

      var bmin = new Vector([b.x, b.y]);
      var bmax = Vector.add(bmin, b.dimession);
      //get AABB vectors for both objects and use a single vector method for
      //detecting collisions in 2d and 3d
      var isNotCollided = false;
      for (var i = 0; i < amin.vector.length ; i++) {
        isNotCollided ||=
          (amin.vector[i]>= bmax.vector[i]) || (bmin.vector[i]>= amax.vector[i])
      }
      return !isNotCollided;
    };
  };