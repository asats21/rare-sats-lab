use wasm_bindgen::prelude::*;

fn mod_pow(mut base: u64, mut exp: u64, modulus: u64) -> u64 {
    let mut result = 1u64;
    base %= modulus;
    while exp > 0 {
        if exp & 1 == 1 {
            result = (result as u128 * base as u128 % modulus as u128) as u64;
        }
        exp >>= 1;
        base = (base as u128 * base as u128 % modulus as u128) as u64;
    }
    result
}

// Miller-Rabin primality test
#[wasm_bindgen]
pub fn is_prime(n: u64) -> bool {
    if n < 2 {
        return false;
    }
    if n == 2 || n == 3 {
        return true;
    }
    if n % 2 == 0 {
        return false;
    }

    let small_primes = [3, 5, 7, 11, 13, 17, 19, 23, 29];
    for &p in small_primes.iter() {
        if n == p {
            return true;
        }
        if n % p == 0 {
            return false;
        }
    }

    let mut d = n - 1;
    let mut s = 0;
    while d % 2 == 0 {
        d /= 2;
        s += 1;
    }

    let bases = [2, 325, 9375, 28178, 450775, 9780504, 1795265022];
    for &a in bases.iter() {
        if a >= n {
            continue;
        }
        let mut x = mod_pow(a, d, n);
        if x == 1 || x == n - 1 {
            continue;
        }

        let mut composite = true;
        for _ in 0..s - 1 {
            x = mod_pow(x, 2, n);
            if x == n - 1 {
                composite = false;
                break;
            }
        }
        if composite {
            return false;
        }
    }
    true
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_small_primes() {
        assert!(is_prime(2));
        assert!(is_prime(3));
        assert!(is_prime(5));
        assert!(is_prime(7));
        assert!(is_prime(11));
    }

    #[test]
    fn test_small_composites() {
        assert!(!is_prime(1));
        assert!(!is_prime(4));
        assert!(!is_prime(6));
        assert!(!is_prime(8));
        assert!(!is_prime(9));
        assert!(!is_prime(10));
    }

    #[test]
    fn test_large_primes() {
        assert!(is_prime(999999999989));  // Known large prime
        assert!(is_prime(138364999999999)); // Known large prime    
    }

    #[test]
    fn test_large_composites() {
        assert!(!is_prime(10000));
        assert!(!is_prime(123456));
        assert!(!is_prime(999961000033)); // Large composite
    }
}