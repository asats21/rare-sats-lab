import { getBlock } from './getBlock';

export function isPaliblock(sat_num) {
    sat_num = Number(sat_num);

    const block_num = getBlock(sat_num);

    if(block_num < 10)
        return false;

    return isPalindrome(block_num);
}

function isPalindrome(num) {
    let str = num.toString();
    return str === str.split('').reverse().join('');
}