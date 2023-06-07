const express = require('express'),
router = express.Router();

router.get('/',(req,res,next)=>{
	res.render('home');
});

// TEMP! TODO: remove
router.get('/env',(req,res,next)=>{
	res.render('generic_io',{data:process.env});
});

module.exports=router;