import {updatePortData, getPortData, getMostProfitableServer, scpAll} from 'lib.js';

/** @param {NS} ns **/
export async function main(ns) {
	await deployScripts(ns);
	await updatePortData(ns, 20, 'status', 'startup');
	await updatePortData(ns, 20, 'opened', []);
	await updatePortData(ns, 20, 'nuked', {});
	
}

/** @param {NS} ns **/
async function deployScripts(ns) {
	await scpAll(ns, ['lib.js', 'Hack.js', 'Grow.js', 'Weaken.js']);
}