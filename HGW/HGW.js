import { getPortData, updatePortData, coexec } from '../lib.js';

/** @param {NS} ns **/
export async function main(ns) {
	let hgw = getPortData(ns, 20).hgw;
	let target = hgw.target;

	let deltaWG = hgw.weaken.time - hgw.grow.time - 200;
	let deltaGH = hgw.grow.time - hgw.hack.time - 200;


	coexec(ns, 'Weaken.js', hgw.weaken.threads, 1.75, '--target', target);
	coexec(ns, 'Grow.js', hgw.grow.threads, 1.75, '--target', target, '--delay', deltaWG);
	coexec(ns, 'Hack.js', hgw.hack.threads, 1.70, '--target', target, '--delay', deltaGH);
	await ns.sleep(hgw.weaken.time + 600);

	updatePortData(ns, 20, 'status', 'hgwsetup');
}