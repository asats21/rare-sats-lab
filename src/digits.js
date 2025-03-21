export function is3Digits(sat_num) {
    sat_num = Number(sat_num);
    // Convert the number to a string, then a Set to get unique digits
    const uniqueDigits = new Set(String(sat_num));
    // Check if the size of the Set is exactly 3
    return uniqueDigits.size === 3;
}

export function is2Digits(sat_num) {
    sat_num = Number(sat_num);
    // Convert the number to a string, then a Set to get unique digits
    const uniqueDigits = new Set(String(sat_num));
    // Check if the size of the Set is exactly 2
    return uniqueDigits.size === 2;
}