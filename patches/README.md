# Upstream issue/PRs

## SES compatibility

- cross-fetch: try to modify `fetch`. <https://github.com/lquixada/cross-fetch/pull/137>
- immer: try to overwrite `Map` and `Set` methods. <https://github.com/immerjs/immer/pull/914/>
- reflect-metadata: try to overwrite `Reflect` methods. We use `ReflectMetadata` global object for them.

### Bundled outdated `regenerator-runtime`

- @ceramicnetwork/rpc-transport
- @uniswap/v3-sdk <https://github.com/Uniswap/v3-sdk/issues/109>

## Worker compatibility

- arweave: try to access `window` in Worker. <https://github.com/ArweaveTeam/arweave/issues/379>
- @snapshot-labs/snapshot.js: bundled outdated `__awaitor` and try to access `window`. <https://github.com/snapshot-labs/snapshot.js/issues/668>

## ESM-CJS compatibility

- gulp: cannot be used with ts-node/esm mode.
- urlcat: <https://github.com/balazsbotond/urlcat/issues/171>
- ipfs-http-client: already fixed in the upstream. wait for their new version release.
- @ethersphere/bee-js: <https://github.com/ethersphere/bee-js/issues/751>
- @hookform/resolvers: <https://github.com/react-hook-form/resolvers/issues/460>
- @types/react-avatar-editor: <https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/63075>
- web3: <https://github.com/web3/web3.js/issues/5543>
- fuse.js: <https://github.com/krisk/Fuse/pull/692/>
- rss3-next: No issue. This project has been abandoned. See <https://github.com/NaturalSelectionLabs/RSS3-SDK-for-JavaScript#readme>
- @project-serum/sol-wallet-adapter: <https://github.com/project-serum/sol-wallet-adapter/issues/53>
- @types/react-highlight-words: <https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/63096>
- @snapshot-labs/snapshot.js: <https://github.com/snapshot-labs/snapshot.js/issues/752>
- @cyberlab/cyberconnect: <https://github.com/cyberconnecthq/js-cyberconnect/issues/32>
- fortmatic: No issue. Cannot find a GitHub repo. <https://github.com/fortmatic/fortmatic-js> is 404.
- @walletconnect/client: <https://github.com/WalletConnect/walletconnect-monorepo/issues/1601>

## Other problems

- emotion-js: SSR rendering does not work on browser. <https://github.com/emotion-js/emotion/issues/2691>
- react-devtools-inline: <https://github.com/facebook/react/pull/25510> and <https://github.com/facebook/react/pull/25518>
- web3: <https://github.com/web3/web3.js/pull/5274> introduce a bug that crashes

## CSP

- @protobufjs/inquire: We don't allow eval.
