const timeAtOffset=(offset)=>{return new Date(new Date().getTime()+offset*3600*1000).toUTCString().replace( / GMT$/, "" ).toString()},
clamp=(num,min,max)=>Math.min(Math.max(num,min),max),
printDuration=(a)=>{a+=1000;const b=[],c=3600000,d=Math.trunc(a/c);0<d&&(b.push(d+"h"),a-=d*c);const e=Math.trunc(a/60000);0<e&&(b.push(e+"m"),a-=60000*e);const f=Math.trunc(a/1e3);return 0<f&&b.push(f+"s"),b.join(" ")},
spam=(args)=>{
	let i,j,c,n,s="",nTot=0;
	for(i=0;i<args.length;i+=2){
		n=parseInt(args[i]),c=args[i+1];
		if(!c || c.length<=0){continue}
		nTot+=n*c.length;
		if(nTot>996){
			s+="...";break;
		}
		c=c.replaceAll("_"," ");
		for(j=n;j>0;j--){s+=c}
	}
	return (s.length<=0)?"ya":s;
},
ipGeo=(ip, cb)=>{
	const url="http://ip-api.com/json/"+ip+"?fields=countryCode,regionName,city,isp,status,message";
	let data;
	fetch(url)
		.then((b)=>b.json())
		.then((c)=>{data=Object.assign({ip},c)})
		.catch((e)=>{data={ip, geo_err:e}})
		.finally(()=>{
			cb(data);
		})
};
module.exports={timeAtOffset, clamp, printDuration, spam, ipGeo}