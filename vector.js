class Vec {
  vector;
  constructor(v1) {
    this.vector = v1;
  }

  //vector addition
  static add(v1, v2) {
    //assuming lenghts are equal
    var result = [];
    v1.vector.map((x, index) => {
      result[index] = v1.vector[index] + v2.vector[index];
    });
    return new Vec(result);
  }

  add(v1) {
    this.vector.map((x, index) => {
      this.vector[index] += v1.vector[index];
    });
  }
  //multiplying scalar and vector
  static scale(v1, s1) {
    var result = [];
    v1.vector.map((x, index) => {
      result[index] = x * s1;
    });
    return new Vec(result);
  }

  static cross(v1, v2) {
    return v1.vector[0] * v2.vector[1] - v2.vector[0] * v1.vector[1];
  }

  static subract(v1, v2) {
    //assuming lenghts are equal
    var result = [];
    v1.vector.map((x, index) => {
      result[index] = v1.vector[index] - v2.vector[index];
    });
    return new Vec(result);
  }
}
