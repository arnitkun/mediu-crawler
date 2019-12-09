var request = require('request');
var cheerio = require('cheerio');


var START_URL = "http://www.medium.com";

var pagesVisited = {};
var numPagesVisited = 0;
var pagesToVisit = [];
var baseUrl = START_URL

pagesToVisit.push(START_URL);
crawl();

function crawl() {
  
  var nextPage = pagesToVisit.pop();
  if (nextPage in pagesVisited) {
    crawl();
  } else {
    visitPage(nextPage, crawl);
  }
}

function visitPage(url, callback) {
  pagesVisited[url] = true;
  numPagesVisited++;

  
  console.log("Visiting page " + url);
  request(url, function(error, response, body) {
    
     console.log("Status code: " + response.statusCode);
     
     if(response.statusCode !== 200) {
       callback();
       return;
     }
     var $ = cheerio.load(body);
     
     
  collectInternalLinks($);
       //collectExternalLinks($);
       // callback is just calling crawl()
  callback();
     
  });
}

function collectInternalLinks($) {
    var relativeLinks = $("a[href^='/']");
    console.log("Found " + relativeLinks.length + " relative links on page");
    relativeLinks.each(function() {
        link = $(this).attr('href')
        console.log('initial Link:' + link)
        if(link.startsWith('//')){
          link = link.replace('//','/')
          if(link.startsWith('medium'))
          {
            link = ('https:/' + $(this).attr('href'))
            console.log(link)
            pagesToVisit.push(link);
          }
        } else {
          console.log(baseUrl + $(this).attr('href'))
          pagesToVisit.push(baseUrl + $(this).attr('href'));
        }
        console.log(pagesToVisit.length)
        //console.log(pagesToVisit)
    });
}

// function collectExternalLinks($){
//     var absoluteLinks = $("a[href^='http']");
//     console.log("Found " + absoluteLinks.length + " absolute links on page")
//     absoluteLinks.each(function() {
//         targetLink = $(this).attr('href')
//         if(targetLink.startsWith(baseUrl))
//         pagesToVisit.push(targetLink);
//     });
//     console.log(pagesToVisit.length)
//     console.log(pagesToVisit)
// }