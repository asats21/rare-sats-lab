#include <iostream>

typedef long long CAmount;  // Using long long to handle large values
#define COIN 100000000  // 1 BTC in satoshis (100 million satoshis)

namespace Consensus {
    struct Params {
        int nSubsidyHalvingInterval;
    };
}

CAmount GetBlockSubsidy(int nHeight, const Consensus::Params& consensusParams) {
    int halvings = nHeight / consensusParams.nSubsidyHalvingInterval;
    if (halvings >= 64)
        return 0;

    CAmount nSubsidy = 50LL * COIN;  // Use long long literal to prevent overflow
    nSubsidy >>= halvings;  // Halve the subsidy for each epoch
    return nSubsidy;
}

int main() {
    // Set halving interval (210,000 blocks per halving)
    Consensus::Params consensusParams;
    consensusParams.nSubsidyHalvingInterval = 210000;

    // Print subsidy for each epoch
    for (int i = 0; i < 64; ++i) {
        int blockHeight = i * consensusParams.nSubsidyHalvingInterval;
        CAmount subsidy = GetBlockSubsidy(blockHeight, consensusParams);
        std::cout << "Block height: " << blockHeight << " Subsidy: " << subsidy << " satoshis" << std::endl;
    }

    return 0;
}