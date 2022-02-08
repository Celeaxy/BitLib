export {
	getAllServers,
	getAllServersWithDepth,
	getHackableServers,
	getNukableServers,
	getHackedServers,
	getRemoteServers,
	getServersToHack,
	getServersWithClosedPorts,
	canHack,
	canNuke,
	nukeAll,
	scpAll,
	execAll,
	execAllMax,
	rmAllRemote,
	cleanAllRemote,
	killAllRemote,
	needsWeaken,
	hasClosedPorts,
	getMaxGrowth,
	getMostProfitableServer,
	prepareHGW,
	getAvailableThreads,
	getAllAvailableThreads,
	distributeThreads,
	logStatus,
	coexec,
	cohack,
	cogrow,
	coweaken,
	updatePortData,
	getPortData,
	runScript,
	logServerStatus,
	isMinSecurity,
	hasMaxMoney,
	getMaxBuyableServerRam,
	formatNumber,
	getServersSortedByProfit,
	formatRam
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

/** @param {NS} ns **/
function getAllServersWithDepth(ns) {
	var visited = [];
	let visit = function (host = 'home', depth=0) {
		visited.push([host, depth]);
		let names = visited.map(e => e[0])
		let sub = ns.scan(host).filter(e => !names.includes(e));
		for (let s of sub) {
			visit(s, depth+1);
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
	return server.requiredHackingSkill <= player.hacking && server.hasAdminRights;
}

/** @param {NS} ns **/
function getHackableServers(ns) {
	return getRemoteServers(ns).filter(e => canHack(ns, e));
}

/** @param {NS} ns **/
function getHackedServers(ns) {
	let purchasedServers = ns.getPurchasedServers();
	return getAllServers(ns).filter(e => ns.hasRootAccess(e) && e != 'home' && !purchasedServers.includes(e));
}

/** @param {NS} ns 
 * 	@param {String} server
 * **/
function hasClosedPorts(ns, server){
	return ns.getServer(server).openPortCount < 5;
}


/** @param {NS} ns **/
function getServersWithClosedPorts(ns) {
	let purchasedServers = ns.getPurchasedServers();
	return getAllServers(ns).filter(e => 
		e != 'home' && !purchasedServers.includes(e) && hasClosedPorts(ns, e));
}

/** @param {NS} ns **/
function getServersToHack(ns) {
	return getAllServers(ns).filter(e => !ns.getServer(e).hasAdminRights);
}

/** @param {NS} ns 
 * 	@param {String} host
 * **/
function canNuke(ns, host){
	let server = ns.getServer(host);
	return server.numOpenPortsRequired <= server.openPortCount;
}
/** @param {NS} ns **/
function nukeAll(ns) {
	let nuked = getNukableServers(ns);
	for (let s of nuked) {
		ns.nuke(s);
	}
	return nuked;
}

/** @param {NS} ns **/
function getNukableServers(ns){
	return getServersToHack(ns).filter(e => canNuke(ns, e)); 
}
/** @param {NS} ns **/
async function scpAll(ns, files, src = 'home') {
	for (let s of getAllServers(ns).filter(e => e != src)) {
		await ns.scp(files, src, s);
	}
}

/** @param {NS} ns **/
function getRemoteServers(ns) {
	return getAllServers(ns).filter(e => ns.hasRootAccess(e) && e != 'home');
}

/** @param {NS} ns **/
function execAll(ns, file, numThreads = 1, args, ...hosts) {
	let servers = hosts;
	if (!hosts.length) servers = getRemoteServers(ns);
	for (let s of (ns)) {
		ns.exec(file, s, numThreads, args);
	}
}

/** @param {NS} ns **/
function execAllMax(ns, file, args) {
	retur(ns).map(e => {
		let numThreads = ns.getServerMaxRam(e) / ns.getScriptRam(file) | 0 || 1;
		ns.exec(file, e, numThreads, args);
	});
	/*for (let s o(ns)) {
		let numThreads = ns.getServerMaxRam(s)/ns.getScriptRam(file) |0 || 1;
		ns.exec(file, s, numThreads, args);
	}*/
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
function killAllRemote(ns, src = 'home') {
	for (let s of getAllServers(ns).filter(e => e != src)) {
		ns.killall(s);
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


/** @param {NS} ns 
 *  @param {String} host
 * **/
function getMaxGrowth(ns, host) {
	return ns.getServerMaxMoney(host) / ns.getServerMoneyAvailable(host);
}

/** @param {NS} ns **/
function getMostProfitableServer(ns) {
	let moneyPerSecond = (s) => ns.getServerMaxMoney(s)*ns.hackAnalyze(s)*1000/(ns.getHackTime(s)+1200); 

	let maxMoney = (s) => ns.getServerMaxMoney(s) ;
	let value = (s) => ns.getServerMaxMoney(s) * ns.hackAnalyzeChance(s);
	//return getHackableServers(ns).reduce((e, n) => moneyPerSecond(e) > moneyPerSecond(n) ? e : n);
	//return getHackableServers(ns).reduce((e, n) => maxMoney(e) > maxMoney(n) ? e : n);
	return getHackableServers(ns).reduce((e, n) => value(e) > value(n) ? e : n);
}



/** @param {NS} ns 
 *  @param {String} host
 * **/
async function prepareHGW(ns, host) {
	while (true) {
		while (needsWeaken(ns, host)) await ns.weaken(host);
		if (ns.getServerMaxMoney(host) > ns.getServerMoneyAvailable(host)) {
			await ns.grow(host);
		} else break;
	}
	await ns.weaken(host);
}

/** @param {NS} ns 
 *  @param {String} host
 * 	@param {Number} ram
 * **/
function getAvailableThreads(ns, host, ram, ignoreUsedRam = false) {
	return (ns.getServerMaxRam(host) - (ignoreUsedRam ? 0 : ns.getServerUsedRam(host))) / ram | 0;
}

/** @param {NS} ns 
 *  @param {Number} numThreads
 * 	@param {Number} ram
 * 	@param {String[]} hosts
 * **/
function distributeThreads(ns, numThreads, ram, hosts) {
	var servers = hosts;
	if (!hosts) servers = getRemoteServers(ns);
	let maxAvailableThreads = getAllAvailableThreads(ns, ram);
	ns.print(maxAvailableThreads);
	if (maxAvailableThreads < numThreads) {
		ns.print(`Not enough available threads on machines: [${servers}]!`);
		ns.print(`Available threads: ${maxAvailableThreads}`);
		ns.print(`Requested threads: ${numThreads}`);
		return null;
	}
	var tmap = {};
	var threadsLeft = numThreads;
	for (let s of servers) {
		if (!threadsLeft) break;
		var threads = getAvailableThreads(ns, s, ram);
		if (!threads) continue;
		if (threadsLeft < threads) threads = threadsLeft;
		tmap[s] = threads;
		threadsLeft -= threads;
	}
	return tmap;
}


/** @param {NS} ns 
 *  @param {Number} ram
 * 	@param {Boolean} ignoreUsedRam
 * 	@param {String[]} hosts
 * **/
function getAllAvailableThreads(ns, ram, ignoreUsedRam = false, ...hosts) {
	var servers = hosts;
	if (!hosts.length) servers = getRemoteServers(ns);
	return servers.map(e => getAvailableThreads(ns, e, ram, ignoreUsedRam)).reduce((e, n) => e + n);
}

/** @param {NS} ns **/
function logStatus(ns, target) {
	let ms = ns.getServerMinSecurityLevel(target);
	let as = ns.getServerSecurityLevel(target);
	ns.print(`Security at ${(as - ms) / ms * 100}%. (${as}/${ms})`);
	let mm = ns.getServerMaxMoney(target);
	let am = ns.getServerMoneyAvailable(target);
	ns.print(`Growth at ${(am / mm * 100).toFixed(2)}%. (${am}/${mm})`);
}

/** @param {NS} ns 
 * 	@param {String} file
 * 	@param {Number} numThreads
 * 	@param {Number} ramCost
 * 	@param {String[]} args
 * 	@param {String[]} hosts
 * **/
function coexec(ns, file, numThreads, ramCost, ...args){
	for (let [s, t] of Object.entries(distributeThreads(ns, numThreads, ramCost))) {
		ns.exec(file, s, t, ...args);
	}
}

/** @param {NS} ns 
 * 	@param {String} target
 * 	@param {Number} threads
 * **/
function cohack(ns, target, threads) {
	coexec(ns, 'Hack.js', threads, 1.75, target);
}

/** @param {NS} ns 
 * 	@param {String} target
 * 	@param {Number} threads
 * **/
function cogrow(ns, target, threads) {
	coexec(ns, 'Grow.js', threads, 1.75, target);
}

/** @param {NS} ns 
 * 	@param {String} target
 * 	@param {Number} threads
 * **/
function coweaken(ns, target, threads) {
	coexec(ns, 'Weaken.js', threads, 1.75, target);
}

/** @param {NS} ns 
 * 	@param {Number} port
 * 	@param {String} key
 * 	@param {Any} data
 * **/
async function updatePortData(ns, port, key, data){
	let update = {};
	if(ns.peek(port) != 'NULL PORT DATA'){
		update = JSON.parse(ns.readPort(port));
	}
	update[key] = data;
	await ns.writePort(port, JSON.stringify(update));
}

/** @param {NS} ns 
 * 	@param {Number} port
 * **/
function getPortData(ns, port){
	return JSON.parse(ns.peek(port));
}

/** @param {NS} ns 
 * 	@param {String} script
 * 	@param {String} host
 * **/
async function runScript(ns, script, numThreads, ...args){
	ns.run(script, numThreads, ...args);
	while(ns.scriptRunning(script, ns.getHostname())) await ns.sleep(200);
}


/** @param {NS} ns 
 * 	@param {String} target
 * **/
function logServerStatus(ns, target) {
	let ms = ns.getServerMinSecurityLevel(target);
	let as = ns.getServerSecurityLevel(target);
	ns.print(`Security at ${((as - ms) / ms * 100).toFixed(2)}%. (${as}/${ms})`);
	let mm = ns.getServerMaxMoney(target);
	let am = ns.getServerMoneyAvailable(target);
	ns.print(`Growth at ${(am / mm * 100).toFixed(2)}%. (${am | 0}/${mm})`);
}

/** @param {NS} ns 
 * 	@param {String} target
 * **/
function isMinSecurity(ns, target){
	return ns.getServerSecurityLevel(target) == ns.getServerMinSecurityLevel(target);
}

/** @param {NS} ns 
 * 	@param {String} target
 * **/
function hasMaxMoney(ns, target){
	return ns.getServerMoneyAvailable(target) == ns.getServerMaxMoney(target);
}

/** @param {NS} ns **/
function getMaxBuyableServerRam(ns){
	let exp = 0;
	let canBuy = (ram) => ns.getPurchasedServerCost(ram) <= ns.getPlayer().money;
	while(canBuy(2**(exp+1)) && 2**(exp+1) <= ns.getPurchasedServerMaxRam())
		exp++;
	return exp && 2**exp;
}

/** @param {NS} ns */
function getServersSortedByProfit(ns){
	return getHackableServers(ns).filter(s => ns.getServerMaxMoney(s) > 0).sort((a,b) => ns.getServerMaxMoney(b)-ns.getServerMaxMoney(a));	
}

/** @param {Number} num */
function formatNumber(num, fractionDigits=3){
	let suffix = ['', 'k', 'm', 'b', 't', 'q'];
	let i = 0;
	let n = num;
	while(n >= 1000){
		n /= 1000;
		i++;
	}
	return `${n.toFixed(fractionDigits)}${suffix[i]}`;
}

/**
 * @param {Number} ram
 */
function formatRam(ram){
	let suffix = ['GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	let r = ram;
	let i = 0;
	while(r >= 1024){
		r /= 1024;
		i++;
	}
	return `${r}${suffix[i]}`;
}