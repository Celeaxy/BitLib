export{getAllServers, getAllHackableServers, getServersToHack, canHack, nukeAll};

/** @param {NS} ns **/
function getAllServers(ns){
	var visited = [];
	let visit = function(host = 'home'){
		visited.push(host);
		let sub = ns.scan(host).filter(e => !visited.includes(e));
		for(let s of sub){
			visit(s);
		}
	}
	visit();
	return visited;
}

/** @param {NS} ns 
 *  @param {String} host
 * **/
function canHack(ns, host){
	let server = ns.getServer(host);
	let player = ns.getPlayer();
	return server.requiredHackingSkill <= player.hacking && server.openPortCount <= server.numOpenPortsRequired;
}

/** @param {NS} ns **/
function getAllHackableServers(ns){
	return getAllServers(ns).filter(e => canHack(ns, e));
}

/** @param {NS} ns **/
function getServersToHack(ns){
	return getAllHackableServers(ns).filter(e => !ns.getServer(e).hasAdminRights);
}

/** @param {NS} ns **/
function nukeAll(ns){
	for(let s of getServersToHack(ns)){
		ns.nuke(s);
	}
}
