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

startSearch = async () => {
  if (!this.state.ips.length) return;
  // console.log("I am starting an interval");
  console.log("Search Starting....", this.state.ips.length);
  await Promise.all(this.state.ips.map(async (ip) => await this.connect(ip)))
    .then((res) => console.log(res.length))
    .catch((ips) => console.log(ips));
  let int = setInterval(async () => {
    if (!this.state.search) {
      clearInterval(this.state.interval);
      this.setState({ interval: -1 });
      return;
    }
    if (this.state.interval == -1) this.setState({ interval: int });

    console.log("Search Starting....", this.state.ips.length);
    await Promise.all(this.state.ips.map(async (ip) => await this.connect(ip)))
      .then((res) => console.log(res.length))
      .catch((ips) => console.log(ips));
  }, 15000);
  setTimeout(() => clearInterval(this.state.interval), 60000);
};
