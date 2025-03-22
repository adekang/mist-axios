class CancelToken {
  constructor(executer) {
    let resolvePromise;

    this.promise = new Promise(resolve => {
      resolvePromise = resolve;
    });

    executer(message => {
      console.log(message);
      if (this.reason) {
        return void 0;
      }

      this.reason = message;
      resolvePromise(message);
    });
  }
}

let cancel;
let p1 = new CancelToken(c => {
  cancel = c;
});

