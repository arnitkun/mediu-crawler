var request = require('request');
var cheerio = require('cheerio');

var START_URL = "http://www.medium.com";

var pagesVisited = {};
var numPagesVisited = 0;
var pagesToVisit = [];
var baseUrl = START_URL
let linksAndRefs = {};

pagesToVisit.push(START_URL);
crawl(simpleCallback);

function crawl() {
  
  var nextPage = pagesToVisit.pop();
  if (nextPage in pagesVisited) {
    crawl();
  } else {
    visitPage(nextPage, crawl);
    // callback();
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

function simpleCallback() {
  console.log("retriggering crawl");
}

function collectInternalLinks($) {
    var relativeLinks = $("a[href^='/']");
    let tempLinks = [];
    // console.log("Found " + relativeLinks.length + " relative links on page");
    relativeLinks.each(function() {
        link = $(this).attr('href')
        // console.log('initial Link:' + link)
        if(link.startsWith('//')){
          link = link.replace('//','/')
          if(link.startsWith('medium'))
          {
            link = ('https:/' + $(this).attr('href'))
            // console.log(link)
            tempLinks.push(link) 
            pagesToVisit.push(link);
          }
        } else {
          link = (baseUrl + $(this).attr('href'));
          // console.log(baseUrl + $(this).attr('href')) //push to an array then to db
          tempLinks.push(link);
          pagesToVisit.push(baseUrl + $(this).attr('href'));
        }
        

        
        tempLinks.forEach(elem => {
            link = new URL(elem);
            linkPath = link.hostname + link.pathname;
            linkPath = link.hostname + link.pathname;
            linksAndRefs[linkPath] = linksAndRefs[linkPath]+1 || 1;
        })

        console.log((linksAndRefs))


    });
}

