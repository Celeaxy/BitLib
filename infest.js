import {scpAll, execAllMax} from 'lib.js'

/** @param {NS} ns **/
export async function main(ns) {
	ns.tail();
	await scpAll(ns, ['basicHack.js', 'lib.js']);
	execAllMax(ns, 'basicHack.js', 'foodnstuff');
}
