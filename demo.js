// function sum(...args) {
//   let total = args.reduce((acc, curr) => acc + curr, 0);
//   function innerSum(...args) {
//     if (args.length === 0) {
//       return total;
//     }

//     for (let i = 0; i < args.length; i++) {
//       total += args[i];
//     }

//     return innerSum;
//   }
//   return innerSum;
// }

// console.log(sum(1)(2)(3, 4)(4)());
// console.log(sum(1)(2)(3, 4)(4)());

function add(val) {
  let tmp = 0;
  if (val.length === 0) {
    return tmp;
  }

  for (let i = 0; i < val.length; i++) {
    tmp += val[i];
  }

  return tmp;
}

function sum(...args) {
  total = 0 + add(args);
  function innerSum(...args) {
    if (args.length === 0) {
      return total;
    }
    total += add(args);
    return innerSum;
  }
  return innerSum;
}

console.log(sum(1)(2)(3, 4)(4)());

console.log(sum()(2)(3, 4)(4)());
