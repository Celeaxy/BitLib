/** @param {NS} ns **/
export async function main(ns) {
	ns.tail();
	let url = 'https://celeaxy.github.io/bitburner/'
	let scripts = [
		'Daemon.js',
		'lib.js', 
		'UpdateScripts.js', 
		'HGW.js',
		'HGWSetup.js'
	];
	for(let s of scripts){
		await ns.wget(`${url}${s}`, s, 'home');
	}
}