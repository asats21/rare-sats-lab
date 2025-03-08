export function getRewardForEpoch(epoch) {
    const rewards = [
      5000000000,  // Epoch 0, 50.000 BTC
      2500000000,  // Epoch 1, 25.000 BTC
      1250000000,  // Epoch 2, 12.500 BTC
      625000000,   // Epoch 3, 6.250 BTC
      312500000,   // Epoch 4, 3.125 BTC
      156250000,   // Epoch 5, 1.56250000 BTC
      78125000,    // Epoch 6, 0.78125000 BTC
      39062500,    // Epoch 7, 0.39062500 BTC
      19531250,    // Epoch 8, 0.19531250 BTC
      9765625,     // Epoch 9, 0.09765625 BTC
      4882812,     // Epoch 10, 0.04882813 BTC
      2441406,     // Epoch 11, 0.02441406 BTC
      1220703,     // Epoch 12, 0.01220703 BTC
      610351,      // Epoch 13, 0.00610352 BTC
      305175,      // Epoch 14, 0.00305176 BTC
      152587,      // Epoch 15, 0.00152588 BTC
      76293,       // Epoch 16, 0.00076294 BTC
      38146,       // Epoch 17, 0.00038147 BTC
      19073,       // Epoch 18, 0.00019073 BTC
      9536,        // Epoch 19, 0.00009537 BTC
      4768,        // Epoch 20, 0.00004768 BTC
      2384,        // Epoch 21, 0.00002384 BTC
      1192,        // Epoch 22, 0.00001192 BTC
      596,         // Epoch 23, 0.00000596 BTC
      298,         // Epoch 24, 0.00000298 BTC
      149,         // Epoch 25, 0.00000149 BTC
      74,          // Epoch 26, 0.00000074 BTC
      37,          // Epoch 27, 0.00000037 BTC
      18,          // Epoch 28, 0.00000018 BTC
      9,           // Epoch 29, 0.00000009 BTC
      4,           // Epoch 30, 0.00000004 BTC
      2,           // Epoch 31, 0.00000002 BTC
      1,           // Epoch 32, 0.00000001 BTC
      0            // Epoch 33, 0.00000000 BTC
    ];
  
    // Ensure the epoch is within the valid range
    if (epoch < 0 || epoch >= rewards.length) {
      return 0;
    }
  
    return rewards[epoch];
}