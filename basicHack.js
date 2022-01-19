import {needsWeaken} from 'lib.js'

/** @param {NS} ns **/
export async function main(ns) {
	if(!ns.args.length){
		ns.print('No target specified!');
		return;
	}
	let target = ns.args[0];
	while(true){
		while(needsWeaken(ns, target)){
			await ns.weaken(target);
		}
		await ns.hack(target);
	}
}
