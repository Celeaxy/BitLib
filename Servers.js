import {getAllServers} from 'lib.js';

/** @param {NS} ns **/
export async function main(ns) {
	let data = ns.flags([
		['filter', '']
	]);
	let servers;
	switch(data.filter){
		case 'purchased' :
			servers = ns.getPurchasedServers();
			break;
		default:
			servers = getAllServers(ns);
	}
	ns.tprint(formatServers(ns, servers));
}

/**
 * @param {NS} ns 
 * @param {String[]} servers
 * **/
function formatServers(ns, servers){
	let result = '\n';
	let ramBarSize = 30;
	servers.forEach(s =>{
		let spacing = 30-s.length;
		result += `${s}${' '.repeat(spacing)}${ns.hasRootAccess(s)? 'Y':'N'}`;
		let ram = Math.ceil(ns.getServerUsedRam(s) * ramBarSize / ns.getServerMaxRam(s));
		result += `   [${'|'.repeat(ram)}${'-'.repeat(ramBarSize-ram)}]`;
		result += '\n';
	});
	return result;
}