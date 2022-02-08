import {getServersWithClosedPorts, updatePortData} from 'lib.js';

/** @param {NS} ns **/
export async function main(ns) {
	let opened = {};

	for (let s of getServersWithClosedPorts(ns)) {
		let ports = [];
		if (!ns.getServer(s).sshPortOpen && ns.fileExists('BruteSSH.exe', 'home')) {
			ns.brutessh(s);
			ports.push('ssh');
		}
		if (!ns.getServer(s).ftpPortOpen && ns.fileExists('FTPCrack.exe', 'home')) {
			ns.ftpcrack(s);
			ports.push('ftp');

		}
		if (!ns.getServer(s).smtpPortOpen && ns.fileExists('relaySMTP.exe', 'home')) {
			ns.relaysmtp(s);
			ports.push('smtp');
		}
		if (!ns.getServer(s).httpPortOpen && ns.fileExists('HTTPWorm.exe', 'home')) {
			ns.httpworm(s);
			ports.push('http');
		}
		if (!ns.getServer(s).sqlPortOpen && ns.fileExists('SQLInject.exe', 'home')) {
			ns.sqlinject(s)	
			ports.push('sql');
		}
		if(ports.length) opened[s] = ports;
	}
	if(opened.length){
		await updatePortData(ns, 20, 'status', 'nuke');
		await updatePortData(ns, 20, 'opened', opened);
	}else{
		await updatePortData(ns, 20, 'status', 'hgw');
	}
}