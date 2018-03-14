const yargs=require('yargs');
const request=require('request');
const cheerio=require('cheerio');
const fs=require('fs');

const argv=yargs
	.options({
		thing:{
			demand:true,
			describe:'The type of thing for which to search images.',
			alias:'t',
			string:true
		}
	})
	.help()
	.alias('help','h')
	.argv;

var url="https://unsplash.com/search/photos/"+argv.t;
var images=[];
var tempstr='';
var flag=false;

request(url,(err,resp,body)=>{
	if(!err ){
		flag=true;
		//console.log(body);
		var $=cheerio.load(body);
		$('#gridMulti').find('img').each(function(){
			tempstr=$(this).attr('src');
			if(tempstr.search('crop=faces')===-1)
				images.push(tempstr);
		});
		
		//console.log("scraped:\n ",images);

	}
	if(flag)
	{
		for(var i=0;i<images.length;i++){
			request(images[i]).pipe(fs.createWriteStream(`./scraped_pictures/${argv.t}${i+1}.jpg`));
		}
		if(images.length===0){
			console.log(`Sorry, no images of '${argv.t}' has been found.`)
		}else{
			console.log(images.length,"images scraped");
		}
		
	}
});