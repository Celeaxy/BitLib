import {getMaxBuyableServerRam, formatRam} from 'lib.js';

/** @param {NS} ns **/
export async function main(ns) {
	ns.tail();

	let num = () => ns.getPurchasedServers().map(s => parseInt(s.split('-')[1])).reduce((e, n) => e > n ? e : n , 0)+1;
	
	let serverWithLowestRam = () => ns.getPurchasedServers().reduce((e, n) => ns.getServerMaxRam(e) < ns.getServerMaxRam(n) ? e : n);
	let ram = () => getMaxBuyableServerRam(ns);
	while(ram() >= 32){
		let n = num();
		let r = ram();
		let name = `pserv-${n}-${formatRam(r)}`;
		if(ns.getPurchasedServers().length == ns.getPurchasedServerLimit()){
			let lowest = serverWithLowestRam();
			if(ns.getServerMaxRam(lowest) > r)
				break;
			ns.killall(lowest);
			ns.deleteServer(lowest);
		}
		ns.purchaseServer(name, r);
	}
}