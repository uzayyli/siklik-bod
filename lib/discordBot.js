const {Client, GatewayIntentBits} = require('discord.js'),
client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] }),
{clamp, spam} = require(process.cwd()+'/lib/util.js'),
bot={
	isOn: false,
	lastEvent: Date.now(),
	prefix: "*",
	client: null,
},

connect = (req, cb)=>{
	client.login(process.env.DC_TOKEN)
	.then(() => {
		const user = client.user;
		console.log(`bod logged in as ${user.tag}!`);
		user.setStatus("online");
		user.setActivity(bot.prefix, {type:"LISTENING"});
		Object.assign(bot, {client, isOn: true, lastEvent: Date.now()} );
	})
	.catch((e)=>{
		console.log("erör: "+e);
	})
	.finally(()=>{cb&&cb();})
},

disconnect = (cb)=>{
	bot.isOn = false;
	bot.lastEvent = Date.now();
	bot.client = null;
	client.destroy();
	cb && cb();
},

replyTypes = {
	PLAIN_ANON: 0,
	PLAIN_NAME: 1,
	DIRECT: 2,
	EMBED_ANON: 3,
	EMBED_NAME: 4,
	EMBED_CMD: 5,
},
replyMsg = (msg,str)=>{ msg.channel.send("**"+msg.member.displayName+"**, "+str); },
replyWithEmbed = (msg, str, showUsername=false, showCmd=false) => {
	const emb = {
		color: 0x92FF0E,
		description: str,
	};
	if(showUsername){
		const field = {name: msg.member.displayName};
		if(showCmd){
			field.value = "\`"+msg.content+"\`";
		}
		emb.fields = [field];
	}
	msg.channel.send({embeds:[emb]});
},

msgHandler = msg => {
	try{
		console.log(msg.author.id+": "+msg.content);
		const b = bot, author = msg.author, content = msg.content;
		if(author.bot){return}
		if(content[0]===bot.prefix){
			const args = content.substring(1).split(" "), a0 = args[0], c = commands[a0];
			if(c){
				if(c.adminOnly && msg.author.id !== process.env.DC_ADMIN_ID){
					return replyMsg(msg,"bu komuda yetkili deylsiniz.");
				}
				c.f(msg, args.slice(1), (reply)=>{
					if(reply && reply.length && typeof reply==="string"){
						switch(c.replyType){
							case 0: msg.channel.send(reply); break;
							case 1: replyMsg(msg, reply); break;
							case 2: msg.author.send(reply); break;
							case 3: replyWithEmbed(msg, reply); break;
							case 4: replyWithEmbed(msg, reply,true); break;
							case 5: replyWithEmbed(msg, reply, true, true); break;
							default: replyMsg(msg, reply); break;
						}
					}/*else{replyMsg(msg, "olmaması gereken bir sıgıntı oldu..")}*///some functions dont return anything..
				});
				c.keepOrig || msg.delete().catch(e2=>{})
			}else{
				replyMsg(msg,"ney?");
			}
		}
	}catch(e){
		replyMsg(msg,"YA "+e.message);
		console.log(e.stack);
	}
},

commands = {
	// "cmd":{f, replyType, adminOnly, keepOrig, hidden}
	"help":{f:(msg,args,cb)=>{
		const cs=commands;
		let reply;
		if(args.length){
			const a0=args[0];
			if(a0 in cs){
				const c=cs[a0];
				reply=("help"in c)?c.help:"bildiğin "+a0+" yav";
			}else{
				reply="Öyle bir komud yoğ"
			}
		}else{
			reply=[];
			Object.keys(cs).forEach(function(k){
				if(!cs[k].hidden){reply.push(k)}
			});
			reply=`**Komutlar: ** ${reply.join(", ")}`;
		}
		cb(reply);
	}, replyType:replyTypes.EMBED_CMD},

	"env":{f:(msg,args,cb)=>{
		cb(process.env.platform);
	}},

	"sa":{f:(msg,args,cb)=>{
		cb("as");
	}},

	"as":{f:(msg,args,cb)=>{
		cb("nbr");
	}},

	"say":{f:(msg,args,cb)=>{
		cb(args.join(" "));
	}, adminOnly:true},

	"pm":{f:(msg,args,cb)=>{
		cb(args.join(" "));
	}, replyType:replyTypes.DIRECT, adminOnly:true},

	"spam":{f:(msg,args,cb)=>{
		cb(spam(args));
	},help:"spamlar. mesela: spam 1 A 10 M. boşluk yerine _ pls", replyType:replyTypes.PLAIN_NAME},

	"pörç":{f:(msg,args,cb)=>{
		let N=0;
		if(args.length){N=parseInt(args[0]);if(isNaN(N)){N=0}}
		N=clamp(N,0,99)+1;
		msg.channel.bulkDelete(N)
			.then(ms=>{})
			.catch((e)=>{});
	},help:"pörç [N=1]: kanaldaki N mesajı siler",adminOnly:true,keepOrig:true},

	"pörçme":{f:(msg,args,cb)=>{
		let N=0,ctr=0;
		if(args.length){N=parseInt(args[0]);if(isNaN(N)){N=0}}
		N=clamp(N,0,99)+1;
		msg.channel.messages.fetch({limit:100})
			.then(ms=>{
				ms.every((m)=>{
					if(m.author.id===msg.author.id){
						m.delete();
						ctr++;
					}
					return ctr<N;
				});
			})
			.catch((e)=>{
				replyMsg(msg,"ya "+e.message)
			});
	}, keepOrig:true},
	
};

client.on('messageCreate',msgHandler);
/*
client.on('guildMemberAdd', guildMember => {
	if(guildMember.user.bot){return}
	guildMember.roles.add(discordConfig.welcomeRoles).catch(console.error);
	client.channels.fetch(discordConfig.welcomeChannel).then(c=>c.send("hğ "+guildMember.displayName+"!"));
	
});
*/
module.exports = {bot, connect, disconnect};