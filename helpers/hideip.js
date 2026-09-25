exports.hideip = (ip) => {
    const octets = ip.split(".");
    if (octets.length !== 4) return ip; //for only ip4

    return `${octets[0]}.***.***.***`;
};
