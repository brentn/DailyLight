var monthNames = [
  "January", "February", "March",
  "April", "May", "June", "July",
  "August", "September", "October",
  "November", "December"
];
var dailyLight;

class DailyLight {
    constructor(xml) {
        this.xml = xml;
    }
    buildCard(date, morning) {
    var $card = $("<div>", {"class": 'card drop-shadow'});
        var dateString = monthNames[date.getMonth()] + " " + date.getDate();
        var day = $(this.xml).find('day[date="' + dateString + '"]');
        console.error(date);
        var tomorrow = new Date(date.getTime()).setDate(date.getDate()+1);
        $card.append("<div class='date' onclick='dailyLight.load(new Date(\""+tomorrow+"\"),"+morning+");'>"
                     +dateString+"</div>");
        $card.append("<div class='morn_eve' onclick='dailyLight.load(new Date(\""+date+"\"),"+!morning+");'>"
                     +(morning?"morning":"evening")+"</div>");
        $card.append("<div style='clear:both'></div><hr/>");
        if (day.length>0) {
            var section = $(day).find(morning?"morning":"evening");
            if (section.length>0 && $(section).find('text').text().length>0) {
                $card.append("<div class='heading'>"+$(section).find('heading').text()+"</div>");
                $card.append("<div class='text'>"+$(section).find('text').text()+"</div>");
                $card.append("<div class='references'><hr/>"+$(section).find('references').text()+"</div>");
                return $card;
            }
        }
        $card.append("<div class='missing'>Missing content</div>");
        return $card;
    }
    load(date, morning) {
    	console.warn(date);
        $('.card').addClass('old');
        $('.card').removeClass('lifted');
        $('.old').fadeOut(1000, function() { $('.old').remove(); });
        var newCard = this.buildCard(date, morning).css({'opacity':0});
        $('.cards').append(newCard);
        $('.card').animate({'opacity':1}, 800, function() {$('.card').addClass('lifted');});
        localStorage.lastDateRead = date;
        localStorage.lastOpened = new Date();
        console.warn(date)
    }
}

$(document).ready(function() {
    $.ajax({
        type: "GET",
        url: "https://dl.dropboxusercontent.com/s/rkoqw1jlnz1zrlg/DailyLight.xml?dl=1",
        dataType: "xml",
        success: function(xml) {
            dailyLight = new DailyLight(xml);
            var date;
            if (localStorage.lastDateRead && localStorage.lastOpened) {
        		date = new Date(localStorage.lastDateRead);
        		//if already opened today, show same day, otherwise increment 
        		if (new Date(localStorage.lastOpened).setHours(0,0,0,0) != new Date().setHours(0,0,0,0)) {
        			console.debug('not opened today, incrementing card')
        			date.setDate(date.getDate()+1);
        		} else {
        			console.debug('already opened today.  Showing same card');
        		}
            } else {
            	console.debug('no cookies found');
            	date = new Date();
            }
            var morning = date.getHours()<17;
            dailyLight.load(date, morning);
        },
        error: function(xhr, status) {
            console.error(status);
        }
    });
})