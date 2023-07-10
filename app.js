const express=require('express'),
app=express(),
ejs=require('ejs');

if(process.env.platform!=="remote"){require('dotenv').config();}

app.use(express.static(process.cwd()+'/public'));
app.set('views',process.cwd()+'/views');
app.set('view engine','ejs');
//app.use('/favicon.ico',express.static(process.cwd()+'public/favicon.ico'));
//app.use(express.urlencoded({extended:true}));
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 })); // for minify payload

// routes
require(process.cwd()+'/lib/discordBot.js').connect();
app.use((req,res,next)=>{Object.assign(res.locals,{title:req.originalUrl.split("?")[0],_platform:process.env.platform});return next();});
app.use('/', require(process.cwd()+'/routes/main.js'));
app.use('/discord', require(process.cwd()+'/routes/discord.js'));
app.use('/tools', require(process.cwd()+'/routes/tools.js'));
app.use(function(req,res,next){const err=new Error('Not Found');err.status=404;return next(err);});
app.use(function(err,req,res,next){res.status(err.status||500);return res.render('generic_data',{h1:"Error",data:err.stack});});
process
	.on('unhandledRejection', (reason, p) => {
		console.error(reason, 'Unhandled Rejection at Promise', p);
		console.log('custom unhandledRejection event:'); console.log(reason); console.log(p);
	})
	.on('uncaughtException', err => {
		console.error(err, 'Uncaught Exception thrown');
		//process.exit(1);
		console.log('custom uncaughtException event:');	console.log(err);
	});

const httpPort = process.env.PORT||3131;
app.listen(httpPort, ()=>{console.log('Listening at http://localhost:'+httpPort);});
