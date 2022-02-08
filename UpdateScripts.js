/** @param {import(".").NS } ns */
export async function main(ns) {
	ns.tail();
	let data = ns.flags([
		['self', false]
	]);
	let url = 'https://celeaxy.github.io/bitburner/';
	if(data.self){
		let selfName = 'UpdateScripts.js';
		await ns.wget(`${url}${selfName}`, selfName, 'home');
		ns.run(selfName);
		ns.exit();
	}
	let scripts = [
		'lib.js', 
		'Daemon.js',
		'DaemonSetup.js',
		'HGW/HGW.js',
		'HGW/HGWSetup.js',
		'HGW/HGWLite.js',
		'HGW/Hack.js',
		'HGW/Grow.js',
		'HGW/Weaken.js',
		'CustomModal.js',
		'Monitor.js',
		'KillRemotes.js',
		'NukeAll.js',
		'OpenPorts.js',
		'PurchaseServers.js',
		'Servers.js'
	];
	for(let s of scripts){
		await ns.wget(`${url}${s}`, `/${s}`, 'home');
	}
}