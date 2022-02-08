/** @param {NS} ns **/
export async function main(ns) {
	let data = ns.flags([
		['target', ''],
		['delay', 0]
	]);
	if (data.delay) await ns.sleep(data.delay);
	await ns.hack(data.target);
}