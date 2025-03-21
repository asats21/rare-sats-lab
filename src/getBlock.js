import { getRewardForEpoch } from './getRewardForEpoch';

export function getBlock(sat_num) {
    sat_num = Number(sat_num);

    const BLOCKS = 210000; // Number of blocks per halving epoch

    let startSats = 0;     // Cumulative satoshis mined up to the current epoch
    let totalBlocks = 0;   // Cumulative blocks up to the current epoch
    let epoch = 0;         // Current epoch number

    while (true) {
        // Get the reward per block in satoshis for this epoch
        let rewardPerBlock = getRewardForEpoch(epoch);

        // If reward is 0, we've reached the end of Bitcoin's issuance
        if (rewardPerBlock === 0) {
            break;
        }

        // Total satoshis mined in this epoch (210,000 blocks * reward per block)
        let epochSats = BLOCKS * rewardPerBlock;

        // Check if sat_num falls within this epoch
        if (sat_num < startSats + epochSats) {
            // Calculate the block offset within this epoch
            let block = Math.floor((sat_num - startSats) / rewardPerBlock);
            // Return the total block number
            return totalBlocks + block;
        }

        // Move to the next epoch
        startSats += epochSats;
        totalBlocks += BLOCKS;
        epoch++;
    }

    // If sat_num is beyond the total supply, return 0
    return 0;
}