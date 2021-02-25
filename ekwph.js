var wasSuccessful = phantom.injectJs('./lib/waitFor.js');
var page = require('webpage').create();

page.settings.userAgent = 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36';

page.open('https://przegladarka-ekw.ms.gov.pl/eukw_prz/KsiegiWieczyste/wyszukiwanieKW?komunikaty=true&kontakt=true&okienkoSerwisowe=false', function(status) {
    console.log("Status: " + status);
    if(status === "success") {
        page.evaluate(function() {
            $("#kodWydzialuInput").attr('value', 'TO1U');
            $("#numerKsiegiWieczystej").val('00002002');
            $("#cyfraKontrolna").val('9');
            
            $("#wyszukaj").trigger('click');
        });
        
        setTimeout(function() {
            page.render('example.png');
            
            phantom.exit();
        }, 10000);
    }
});