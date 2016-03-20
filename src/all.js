module.exports = {
  Account: require('ethereumjs-account'),
  Buffer: require('buffer'),
  BN: require('ethereumjs-util').BN,
  ICAP: require('ethereumjs-icap'),
  RLP: require('ethereumjs-util').rlp,
  Trie: require('merkle-patricia-tree'),
  Tx: require('ethereumjs-tx'),
  Util: require('ethereumjs-util'),
  VM: require('ethereumjs-vm'),
  Wallet: require('ethereumjs-wallet'),
  WalletThirdparty: require('ethereumjs-wallet/thirdparty')
}
