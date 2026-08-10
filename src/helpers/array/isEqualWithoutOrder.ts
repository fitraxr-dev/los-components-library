export default function isEqualWithoutOrder(a, b)
{
  // If the other array is a falsy value, return false
  if (!a || !b) {
    return false;
  }

  // Compare lengths - can save a lot of time
  if (a.length !== b.length) {
    return false;
  }

  // Convert both arrays to sets
  let set1 = new Set(a);
  let set2 = new Set(b);

  // Compare sizes - can save a lot of time
  if (set1.size !== set2.size) {
    return false;
  }

  // Convert one set to an array and check if every element is in the other set
  return Array.from(set1).every(function (element) {
    return set2.has(element);
  });
}
