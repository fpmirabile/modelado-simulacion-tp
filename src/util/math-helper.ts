export const quadraticSolver = (a: number, b: number, c: number) => {
  // program to solve quadratic equation
  let root1, root2;

  // calculate discriminant
  const discriminant = b * b - 4 * a * c;

  // condition for real and different roots
  if (discriminant > 0) {
    root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    root2 = (-b - Math.sqrt(discriminant)) / (2 * a);

    // result
    console.log("Roots are", root1, root2);
    return [root1, root2];
  }
  // condition for real and equal roots
  else if (discriminant === 0) {
    root1 = root2 = -b / (2 * a);

    // result
    console.log(`The roots of quadratic equation are ${root1} and ${root2}`);
    return [root1, root2];
  }
  // if roots are not real
  else {
    let realPart = (-b / (2 * a)).toFixed(2);
    let imgPart = (Math.sqrt(-discriminant) / (2 * a)).toFixed(2);

    // result
    console.log(
      `The roots of quadratic equation are ${realPart} + ${imgPart}i and ${realPart} - ${imgPart}i`
    );
    return [`${realPart} + ${imgPart}i`, `${realPart} - ${imgPart}i`]
  }
};

export const createRangeBetweenNumbers = (min: number, max: number): number[] => {
  if (max <= min || min >= max) {
    return [];
  }
  
  const result = [];
  for (var x = min; x <= max; x++) {
    result.push(x);
  }

  return result;
}

export const calculateTrace = (a: number, d: number) => {
  return a + d;
}

export const calculateDeterminant = (a: number, b: number, c: number, d: number) => {
  return (a*d) - (b*c);
}
