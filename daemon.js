import {getServersToHack, nukeAll} from 'lib.js';

/** @param {NS} ns **/
export async function main(ns) {
	while(true){
		let to_hack = getServersToHack(ns);
		if(to_hack){
			nukeAll(ns);
		}
		ns.print(ns.getPlayer().hacking);
		await ns.sleep(1000);		
	}
}
