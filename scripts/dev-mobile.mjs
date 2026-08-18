#!/usr/bin/env node
/**
 * Starts the dev server so a phone on the same network can use the scanner.
 *
 * Two things have to be true for that to work, and both are easy to miss:
 *
 *  1. The server must listen on the LAN interface, not just loopback.
 *  2. The page must be a secure context. `getUserMedia` is only available over
 *     HTTPS or on localhost, so an `http://192.168.x.x:3000` page has no camera
 *     at all — the API is simply absent, which reads as "the scanner is broken"
 *     rather than "this page is insecure".
 *
 * So this resolves the machine's LAN address, hands it to Next as the host
 * (which also puts that address in the generated certificate, instead of only
 * localhost) and turns on the built-in HTTPS dev server.
 *
 * Pass an address explicitly when the guess is wrong:
 *   npm run dev:mobile -- --host 192.168.1.24
 */

import { spawn } from 'node:child_process';
import { networkInterfaces } from 'node:os';

/** Interfaces that are never the one a phone can reach. */
const VIRTUAL_PREFIXES = ['vethernet', 'virtualbox', 'vmware', 'docker', 'loopback', 'tailscale'];

/** Ranges handed out by home and office routers, most likely first. */
const PREFERRED_RANGES = [/^192\.168\./, /^10\./, /^172\.(1[6-9]|2\d|3[01])\./];

const readFlag = (name) => {
  const index = process.argv.indexOf(`--${name}`);
  return index !== -1 ? process.argv[index + 1] : undefined;
};

const lanAddresses = () =>
  Object.entries(networkInterfaces())
    .filter(([name]) => !VIRTUAL_PREFIXES.some((prefix) => name.toLowerCase().startsWith(prefix)))
    .flatMap(([name, addresses]) =>
      (addresses ?? [])
        .filter((address) => address.family === 'IPv4' && !address.internal)
        .map((address) => ({ name, address: address.address })),
    );

const pickHost = () => {
  const explicit = readFlag('host');
  if (explicit) return explicit;

  const candidates = lanAddresses();
  for (const range of PREFERRED_RANGES) {
    const match = candidates.find((candidate) => range.test(candidate.address));
    if (match) return match.address;
  }
  return candidates[0]?.address;
};

const host = pickHost();
const port = readFlag('port') ?? '3000';

if (!host) {
  console.error(
    'No LAN address found. Connect to Wi-Fi or Ethernet, or pass one:\n' +
      '  npm run dev:mobile -- --host 192.168.1.24',
  );
  process.exit(1);
}

console.log('');
console.log(`  LeafCare dev server for mobile`);
console.log(`  Open on your phone:  https://${host}:${port}`);
console.log('');
console.log('  The certificate is self-signed, so the phone will warn once.');
console.log('  Accept it — the camera needs the page to be served over HTTPS.');
console.log('  If the page never loads, allow Node.js through the Windows firewall');
console.log('  for private networks.');
console.log('');

const child = spawn(
  process.platform === 'win32' ? 'npx.cmd' : 'npx',
  ['next', 'dev', '--experimental-https', '-H', host, '-p', port],
  { stdio: 'inherit', shell: process.platform === 'win32' },
);

child.on('exit', (code) => process.exit(code ?? 0));
