export function isPrime(n) {
    // eslint-disable-next-line no-undef
    n = BigInt(n);
    if (n < 2n) return false;
    if (n === 2n || n === 3n) return true;
    if (n % 2n === 0n) return false;

    const smallPrimes = [3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n];
    for (const p of smallPrimes) {
      if (n === p) return true;
      if (n % p === 0n) return false;
    }

    let s = 0;
    let d = n - 1n;
    while (d % 2n === 0n) {
      d /= 2n;
      s++;
    }

    const bases = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n];

    function modPow(base, exp, mod) {
      let result = 1n;
      base = base % mod;
      while (exp > 0n) {
        if (exp % 2n === 1n) {
          result = (result * base) % mod;
        }
        exp /= 2n;
        base = (base * base) % mod;
      }
      return result;
    }

    for (const a of bases) {
      if (a >= n) continue;
      let x = modPow(a, d, n);
      if (x === 1n || x === n - 1n) continue;

      let composite = true;
      for (let i = 0; i < s - 1; i++) {
        x = modPow(x, 2n, n);
        if (x === n - 1n) {
          composite = false;
          break;
        }
      }
      if (composite) return false;
    }

    return true;
}