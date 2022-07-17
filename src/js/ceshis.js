checkAddr=require('./checkAdres.js');
let sig1='0x83997a9dcf43c486dc4ab1d87450fb46ee25b252';
let m=checkAddr.checkAdress(sig1);
if (m.toLowerCase()==sig1.toLowerCase()) {
	console.log(true);
}
else {
	console.log(false);
	console.log(m);
}
0x83997A9dCf43c486dC4Ab1d87450Fb46eE25b252
0x83997a9dcf43c486dc4ab1d87450fb46ee25b252