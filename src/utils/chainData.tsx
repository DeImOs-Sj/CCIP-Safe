export const chainData = {
  "Fuji testnet": {
    routerAddress: "0xF694E193200268f9a4868e4Aa017A0118C9a8177",
    destinationChainAddress: [
      { name: "BNB Chain testnet", address: "0xF25ECF1Aad9B2E43EDc2960cF66f325783245535" },
      { name: "Sepolia testnet", address: "0x5724B4Cc39a9690135F7273b44Dfd3BA6c0c69aD" },
      { name: "Arbitrum Sepolia testnet", address: "0x8bB16BEDbFd62D1f905ACe8DBBF2954c8EEB4f66" },
    ],
    chainSelector: "14767482510784806043",
    feeTokens: {
      LINK: "0x0b9d5D9...a297846",
      WAVAX: "0xd00ae08...C39A48c",
      AVAX: "Native gas token",
    },
  },
  "BNB Chain testnet": {
    routerAddress: "0xF25ECF1Aad9B2E43EDc2960cF66f325783245535",
    destinationChainAddress: [],
    chainSelector: "13264668187771770619",
    feeTokens: {},
  },
  "Sepolia testnet": {
    routerAddress: "0x5724B4Cc39a9690135F7273b44Dfd3BA6c0c69aD",
    destinationChainAddress: [],
    chainSelector: "16015286601757825753",
    feeTokens: {
      LINK: "0x779877A...4624789",
      WETH: "0x097D90c...f9FB534",
      ETH: "Native gas token",
    },
  },
};
