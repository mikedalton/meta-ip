let data;
let githubNetworks = [];
const url = 'https://api.github.com/meta';

class IPSubnet {
    constructor(cidr, service) {
        this.cidr = cidr;
        this.service = service;
        const [network, prefixLength] = cidr.split('/');
        this.network = network;
        this.prefixLength = parseInt(prefixLength, 10);
        this.isIPv6 = network.includes(':');
    }

    parseIPv4(ip) {
        return ip.split('.').map(Number);
    }

    parseIPv6(ip) {
        const parts = ip.split(':');
        const fullParts = [];
        for (let part of parts) {
            if (part === '') {
                fullParts.push(...Array(8 - parts.length + 1).fill('0000'));
            } else {
                fullParts.push(part.padStart(4, '0'));
            }
        }
        return fullParts.join('');
    }

    isInSubnet(ip) {
        if (this.isIPv6) {
            const subnetBinary = this.parseIPv6(this.network);
            const ipBinary = this.parseIPv6(ip);
            return subnetBinary.slice(0, this.prefixLength) === ipBinary.slice(0, this.prefixLength);
        } else {
            const subnetParts = this.parseIPv4(this.network);
            const ipParts = this.parseIPv4(ip);
            const mask = -1 << (32 - this.prefixLength);
            const subnetInt = subnetParts.reduce((acc, part) => (acc << 8) + part, 0);
            const ipInt = ipParts.reduce((acc, part) => (acc << 8) + part, 0);
            return (subnetInt & mask) === (ipInt & mask);
        }
    }
}

function searchIP(ip) {
    const result = [];
    for (const network of githubNetworks) {
        if (network.isInSubnet(ip)) {
            result.push(network);
        }
    }
    return result;
}

$(document).ready(function(){
    $("#status-container").text("Fetching data from GitHub API...");
    $.getJSON(url, function(json) {
        data = json;
        ignored_keys = ["verifiable_password_authentication", "ssh_key_fingerprints", "ssh_keys", "domains"];
        for (const key in data){
            if(!ignored_keys.includes(key)){
                networks = data[key];
                for(network in networks){
                    //console.log(networks[network])
                    networkObject = new IPSubnet(networks[network],key);
                    githubNetworks.push(networkObject);
                }
            }
        }
        $("#status-container").text(`Loaded ${githubNetworks.length} IP ranges`);
    });
 });