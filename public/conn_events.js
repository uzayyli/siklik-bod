(function(){
let evtsTable,lastTime;
const printDuration=(a)=>{a+=1000;const b=[],c=3600000,d=Math.trunc(a/c);0<d&&(b.push(d+"h"),a-=d*c);const e=Math.trunc(a/60000);0<e&&(b.push(e+"m"),a-=60000*e);const f=Math.trunc(a/1e3);return 0<f&&b.push(f+"s"),b.join(" ")};
const addEvent=(isOnline)=>{
	const tr=document.createElement("tr"),_now=Date.now();
	tr.innerHTML=`<td>${isOnline?"on ":"off"}</td><td>${new Date().toTimeString().split(' ')[0]}</td><td>${printDuration(_now-lastTime)}</td>`;
	lastTime=_now;
	tr.className=isOnline?"on":"off";
	evtsTable.appendChild(tr);
}
const clearEvents=()=>{
	lastTime=Date.now();
	evtsTable.innerHTML="";
}
window.onload=()=>{
	evtsTable=document.getElementById("evtsTable");
	document.getElementById("clearEvents").onclick=clearEvents;
	lastTime=Date.now();
	window.addEventListener('online',()=>{
		addEvent(true);
	});
	window.addEventListener('offline',()=>{
		addEvent(false);
	});
}
})();