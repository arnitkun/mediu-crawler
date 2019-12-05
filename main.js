// var list= [];

// function add(a,b,c){
//     a = b + c;
//     for(i = 0; i < 5; i++){
//         list.push(a);
//     }
//     return list;
// }

// let ans = add(1,2,3);
// console.log(ans);

var arr = [];

const request = require('request')
const cheerio = require('cheerio')

baseUrl = 'http://medium.com'

function sendRequest(url){
request(url, (err, res, body) => {
    // console.log(body)
   if(!err){
       refNo = parseUrl(body, url);
       console.log(refNo);//save reference number of this url to db,
        } else {
       console.log('Error. Can\'t make request.');
    }    
    })
}



function parseUrl(html, url){
    $ = cheerio.load(html);
    links = $('a');
    extractedLinks = []
    // console.log(extractedLinks.length)
    $(links).each(function(i, link){
        if($(link).attr('href').startsWith('https://medium.com'))
        {console.log($(link).attr('href'));
        extractedLinks.push($(link).attr('href'))}
    })
    //console.log(extractedLinks.length);
    saveLinks_Init(extractedLinks);
    return extractedLinks.length;//reference number of the url
}

const execute = sendRequest(baseUrl)


function saveLinks_Init(links){
    linkMap = links.map( (link, id ) => {
            return {
                id,
                link
            }
    })
    // console.log(linkMap)
}