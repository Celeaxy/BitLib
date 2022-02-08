import { getAllServersWithDepth, formatRam } from 'lib.js';
import renderCustomModal, { EventHandlerQueue, css } from 'CustomModal.js';


const toolbarStyles = {
    lineHeight: '30px',
    alignItems: 'center',
    display: 'flex',
    gap: 16,
    margin: 8,
};

let showNonRooted = true;
let showNonHackable = false;

let filteredServers;

"use strict";
/** @param {NS} ns **/
export async function main(ns) {

const player = ns.getPlayer();
  ns.tail();
  while (true) {

    filteredServers = getAllServersWithDepth(ns).map(s => ({name : s[0], server: ns.getServer(s[0]), depth : s[1] })).filter(({ server }) => (
      (showNonRooted || server.hasAdminRights) &&
      (showNonHackable || server.requiredHackingSkill <= player.hacking)
    ));

    renderCustomModal(ns, React.createElement(Monitor, {
      ns: ns
    }));
    const eventQueue = new EventHandlerQueue();
    await eventQueue.executeEvents();
    await ns.sleep(1000);
  }
}



let _ = t => t,
  _t;


class Monitor extends React.Component {
  render() {
    let ns = this.props.ns;
    return /*#__PURE__*/React.createElement("div", {
      id: "custom-monitor"
    }, /*#__PURE__*/React.createElement("div", {
      style: toolbarStyles
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => showNonRooted = !showNonRooted
    }, showNonRooted ? 'Show' : 'Hide', " non-rooted"), /*#__PURE__*/React.createElement("button", {
      onClick: () => showNonHackable = !showNonHackable
    }, showNonHackable ? 'Show' : 'Hide', " non-hackable")), /*#__PURE__*/React.createElement("style", {
      children: css(_t || (_t = _`
                    #custom-monitor th,
                    #custom-monitor td {
                        padding-right: 12px;
                    }
                    #custom-monitor th {
                        text-align: left;
                    }
                    #custom-monitor thead > * {
                        border-bottom: 1px solid green;
                    }
                    #custom-monitor tr:hover {
                        background: rgba(255, 255, 255, 0.1);
                    }
                `))
    }), /*#__PURE__*/React.createElement("table", {
      style: {
        borderSpacing: 0,
        whiteSpace: 'pre'
      }
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("th", null, "Server"), /*#__PURE__*/React.createElement("th", null, "RAM-Auslastung")), filteredServers.map(s => {
      let ramUsed = ns.getServerUsedRam(s.name);
      let ramMax = ns.getServerMaxRam(s.name);
      return /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, ' '.repeat(s.depth), s.name), /*#__PURE__*/React.createElement("td", {
        style: {
          textAlign: "right"
        }
      }, colorSpan(formatRam(ramUsed) + '/' + formatRam(ramMax), ramMax ? ramUsed / ramMax : 0)));
    })));
  }

}

function colorSpan(text, load) {
  //return(<span style={{color: `rgb(${255*load},'${255-255*load},0)`}}>{text}</span>);
  return /*#__PURE__*/React.createElement("span", {
    style: {
      color: `rgb(${255 * load},${255 - 255 * load},0)`
    }
  }, text);
}