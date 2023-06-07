const router=require('express').Router(),
hjson = require('hjson'),
uglifyReserved=require(process.cwd()+"/lib/uglify_reserved.json"),
UglifyJS=require("uglify-js"),
{timeAtOffset, ipGeo}=require(process.cwd()+'/lib/util.js');

router.get('/',(req,res,next)=>{
	res.render('tools');
});

router.get('/echo', (req,res,next)=>{
	res.render('generic_io',{h1:"Echo"});
});

router.post('/echo', (req,res,next)=>{
	res.render('generic_io',{data:"you said "+req.body.input});
});

router.get('/ip',(req,res)=>{
	res.render('generic_data',{h1:"IP Address",data:JSON.stringify({reqIp:req.ip, remoteAdd:req.socket.remoteAddress, xff:req.headers['x-forwarded-for'], XFF2:req.headers['X-Forwarded-For'] },null,2)});
});

router.get('/time',(req,res)=>{
	res.render('generic_data',{h1:"Time",data:JSON.stringify({"Türkiye":timeAtOffset(3),"US East":timeAtOffset(-4),"US West":timeAtOffset(-7)},null,2)});
});

router.get('/conn',(req,res)=>{
	res.render('conn_events');
});

router.get('/pingm',(req,res)=>{
	res.render('ping_measure',{posturl:req.protocol+'://'+req.get('host')+req.originalUrl});
})
router.post('/pingm',(req,res,next)=>{
	res.json({a:1});
})

router.get('/base64',(req,res)=>{
	res.render('generic_io',{h1:"Base64 "+req.query.m});
});
router.post('/base64',(req,res)=>{
	const m=req.query.m,data=m==="encode"?Buffer.from(req.body.input,'utf-8').toString('base64'):Buffer.from(req.body.input,'base64').toString('utf-8');
	res.render('generic_io',{h1:"Base64 "+m, h2:"Output", data});
});

router.get('/beautifyJS',(req,res)=>{
	res.render('generic_io',{h1:"Beautify JS"});
});
router.post('/beautifyJS',(req,res)=>{
	const result=UglifyJS.minify(req.body.input,{compress:false,mangle:false,output:{beautify:true}}),
	err=result.error;
	res.render('generic_io',{h1:err?"Error":"Output",data:err||result.code})
});

router.get('/minifyJS',(req,res)=>{
	res.render('generic_io',{h1:"Minify (Headless Props)"});
});
router.post('/minifyJS',(req,res)=>{
	const code=req.body.input,options={
		compress: {passes:1},
		mangle:{properties:{reserved:uglifyReserved, keep_quoted:true}},
		output: {beautify:false}
	},result=UglifyJS.minify(code,options),err=result.error;
	res.render('generic_io',{h1:err?"Error":"Output",data:err||result.code})
});

router.get('/json',(req,res)=>{
	const m=req.query.m;
	res.render('generic_io',{h1:"JSON "+m});
});
router.post('/json',(req,res)=>{
	const m=req.query.m;
	const data=hjson.parse(req.body.input);
	res.render('generic_io',{h1:"Output",data:m==="minify"?JSON.stringify(data):JSON.stringify(data,null,2)})
});

router.get('/queryIP',(req,res)=>{
	ipGeo(req.query.ip,(data)=>{
		res.render('generic_io',{h1:"Output",data});
	});
});

module.exports=router;