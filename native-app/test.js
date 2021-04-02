class test {
  constructor() {
    console.log(this);
    this.x = 10;
  }

  test = () => {
    console.log(this);
    this.x = 30;
  };
}

const a = new test();
console.log(a.x);

a.test();
console.log(a.x);
