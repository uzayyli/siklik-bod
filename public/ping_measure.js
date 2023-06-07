(function(){
let mainDiv,url;
const x={N:0,min:Infinity,max:0,tot:0};
const testStep=(i)=>{
	const t0=Date.now();
	fetch(url,{
		method:"post",
	})
	.then((r) => r.json())
	.then((data) => {
		const t=Date.now()-t0,_x=x;N=++_x.N;
		if(t<_x.min){
			_x.min=t;
		}if(t>_x.max){
			_x.max=t;
		}_x.tot+=t;
		if(i>0){
			testStep(i-1);
		}else{
			mainDiv.innerHTML=`<p>${Math.round(_x.tot/N)} (min: ${_x.min}, max: ${_x.max}, N: ${N})</p>`;
		}
	})
	.catch((e)=>{console.log("ping err: "+e)});
	
}
const startTest=(e)=>{
	let N=10;
	if(e){N=parseInt(e.target.dataset.num)}
	mainDiv.innerHTML="";
	x.N=0;x.min=Infinity;x.max=0;x.tot=0;
	testStep(N);
}
window.onload=()=>{
	mainDiv=document.getElementById("pingTests");
	url=mainDiv.dataset.posturl;
	document.getElementById("btn_testPing_10").onclick=startTest;
	document.getElementById("btn_testPing_100").onclick=startTest;
	document.getElementById("btn_testPing_1000").onclick=startTest;
}
})();