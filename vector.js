class Vector {
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
      return new Vector(result);
    }

    //multiplying scalar and vector
    static multiply(v1, s1) {
      var result = [];
      v1.vector.map((x, index) => {
        result[index] = x * s1;
      });
      return new Vector(result);
    }
  }