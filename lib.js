export {
	getAllServers, 
	getAllHackableServers, 
	getAllHackedServers,
	getServersToHack, 
	canHack, 
	nukeAll, 
	scpAll,
	execAll, 
	execAllMax, 
	rmAllRemote, 
	cleanAllRemote,
	needsWeaken
};

/** @param {NS} ns **/
function getAllServers(ns) {
	var visited = [];
	let visit = function (host = 'home') {
		visited.push(host);
		let sub = ns.scan(host).filter(e => !visited.includes(e));
		for (let s of sub) {
			visit(s);
		}
	}
	visit();
	return visited;
}

/** @param {NS} ns 
 *  @param {String} host
 * **/
function canHack(ns, host) {
	let server = ns.getServer(host);
	let player = ns.getPlayer();
	return server.requiredHackingSkill <= player.hacking && server.openPortCount <= server.numOpenPortsRequired;
}

/** @param {NS} ns **/
function getAllHackableServers(ns) {
	return getAllServers(ns).filter(e => canHack(ns, e));
}

/** @param {NS} ns **/
function getAllHackedServers(ns) {
	return getAllServers(ns).filter(e => ns.hasRootAccess(e));
}

/** @param {NS} ns **/
function getServersToHack(ns) {
	return getAllHackableServers(ns).filter(e => !ns.getServer(e).hasAdminRights);
}

/** @param {NS} ns **/
function nukeAll(ns) {
	for (let s of getServersToHack(ns)) {
		ns.nuke(s);
	}
}

/** @param {NS} ns **/
async function scpAll(ns, files, src = 'home') {
	for (let s of getAllServers(ns).filter(e => e != src)) {
		await ns.scp(files, src, s);
	}
}

/** @param {NS} ns **/
function execAll(ns, file, numThreads = 1, args ) {
	for (let s of getAllHackedServers(ns)) {
		ns.exec(file, s, numThreads, args);
	}
}

/** @param {NS} ns **/
function execAllMax(ns, file, args) {
	for (let s of getAllHackedServers(ns)) {
		let numThreads = ns.getServerMaxRam(s)/ns.getScriptRam(file) |0;
		ns.exec(file, s, numThreads, args);
	}
}

/** @param {NS} ns **/
function cleanAllRemote(ns, src = 'home') {
	for (let s of getAllServers(ns).filter(e => e != src)) {
		for (let f of ns.ls(s)) {
			ns.rm(f, s);
		}
	}
}

/** @param {NS} ns **/
function rmAllRemote(ns, file, src = 'home') {
	for (let s of getAllServers(ns).filter(e => e != src)) {
		ns.rm(file, s);
	}
}


/** @param {NS} ns 
 *  @param {String} host
 * **/
function needsWeaken(ns, host, numThreads = 1) {
	return ns.getServerMinSecurityLevel(host) + ns.weakenAnalyze(numThreads) < ns.getServerSecurityLevel(host);
}
