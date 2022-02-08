import {updatePortData, getPortData, canNuke, getNukableServers} from 'lib.js';

/** @param {NS} ns **/
export async function main(ns) {
	let openedServers = getPortData(ns, 20).opened;
	let nuked = [];
	let nukable = getNukableServers(ns);
	ns.print(openedServers);
	for(let s of nukable){
		ns.nuke(s);
		nuked.push(s);
	}
	/*
	if(openedServers.length){
		for(let [s, p] of Object.entries(openedServers)){
			if(canNuke(ns, s)){
				ns.nuke(s);
				nuked.push(s);
				delete openedServers[s];
			}
		}
	}
	await updatePortData(ns, 20, 'opened', openedServers);*/
	await updatePortData(ns, 20, 'nuked', nuked);
	if(nuked.length) await updatePortData(ns, 20, 'status', 'hgwsetup');
}