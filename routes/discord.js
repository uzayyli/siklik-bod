const router = require('express').Router(),
{bot, connect, disconnect} = require(process.cwd()+'/lib/discordBot.js'),
{printDuration} = require(process.cwd()+'/lib/util.js');

router.get('/',(req,res,next)=>{
	res.render('discord', {bot, isOn:bot.isOn, href:bot.isOn?"disconnect":"connect", lastEvtTime:printDuration(Date.now()-bot.lastEvent)});
});

router.get('/connect',(req,res,next)=>{
	connect(req,()=>{
		res.redirect('/discord');
	});
});

router.get('/disconnect',(req,res,next)=>{
	res.render('generic_io',{data:"olmaz"});
	//disconnect(()=>{res.redirect('/discord');});
});

module.exports=router;