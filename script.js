(function() {
  'use strict';

  var data;
  var width = document.getElementsByClassName('card')[0].getBoundingClientRect().width-20; //20px is card margin
  var threshold = {x:30, y:50};
  var swipe={page:null};
  var DOY;
  var morn_eve=new Date().getHours()<17?'morning':'evening';
  var thisYear = new Date().getFullYear();
  var missing = document.getElementsByClassName('missing')[0];
  function dayOfYear(date) {
     return Math.floor((new Date() - new Date(date.getFullYear(), 0, 0)) / 86400000);
  }
  function dateString(day) {
     var monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
     var date = new Date((new Date(thisYear, 0)).setDate(day));
     return monthNames[date.getMonth()]+' '+date.getDate();
  }
  function setMorning() {
    var cards = document.getElementsByClassName('card');
    var card = cards[cards.length-1];
    card.getElementsByClassName("morn_eve")[0].innerHTML=morn_eve;
  }
  function setDay(day) {
    var cards = document.getElementsByClassName('card');
    var card = cards[cards.length-1];
    card.getElementsByClassName("date")[0].innerHTML=dateString(day);
    card.getElementsByClassName("datepicker")[0].value=day;
    setMorning();
    DOY=day;
  }
  function loadDay(day) {
    missing.style.display='none';
    var cards = document.getElementsByClassName('card');
    var card = cards[cards.length-1];
    card.getElementsByClassName("heading")[0].innerHTML='';
    card.getElementsByClassName("references")[0].innerHTML='';
    var verses = card.getElementsByClassName("verses")[0];
    verses.innerHTML='';
    setDay(day);
    if (!data) {
      missing.style.display = 'block';
      return;
    }
    var item;
    item = data.days.day.filter(function(block) {return block.date===dateString(day);});
    if (item.length>0) {
      if (morn_eve==='morning') {
        item = item[0].morning;
      } else {
        item = item[0].evening; }
      card.getElementsByClassName("heading")[0].innerHTML=item.heading;
      card.getElementsByClassName("references")[0].innerHTML=item.references;
      verses.innerHTML='';
      if (item.references.length>0) {
        card.getElementsByClassName("heading")[0].innerHTML=item.heading;
        card.getElementsByClassName("references")[0].innerHTML=item.references;
        verses.innerHTML='';
        var firstWord = item.text.split(' ')[0];
        var text = firstWord.toUpperCase() + item.text.substring(firstWord.length);
        text.split('\n').forEach(function(verse) {
          var el = document.createElement('p');
          el.className='text';
          el.innerHTML=verse.replace(/LORD/g,'<span class="lord">LORD</span>');
          verses.appendChild(el);
        });
        localStorage.lastDOYRead = DOY;
        localStorage.lastOpened = dayOfYear(new Date());
      } else {
        missing.style.display='block';
      }
    } else {
      missing.style.display='block';
    }
    var height = document.getElementsByClassName('card')[0].getBoundingClientRect().height;
    document.getElementById('swipe').style.height = height;
  }
  var toggleMorning = function() {
    morn_eve = morn_eve==='morning'?'evening':'morning';
    setMorning();
    loadDay(DOY);
  };
  var dateChanged = function(evt) {
    var doy = evt.target.value;
    loadDay(doy);
  };
  var changeDOY = function(delta) {
    DOY = (Number(DOY) + delta + 366) % 366;
    loadDay(DOY);
  };
  function buildSwipePage() {
    var card = document.getElementsByClassName('card')[0];
    if (swipe.direction==="right") changeDOY(-1);
    swipe.page = card.cloneNode(true);
    swipe.page.className += " swipe"
    swipe.page.style.width = width + "px";
    document.getElementById('swipe').appendChild(swipe.page);
    changeDOY(1);
  }
  function clearSwipePage() {
    var div = document.getElementById('swipe');
    setTimeout(function() {
      swipe.page = null;
      while (div.firstChild) {
        document.getElementById('swipe').className = "";
        div.removeChild(div.firstChild);
      }
    }, 600);
  }
  function completeSwipe(type) {
    if (type === 'back') {
      DOY = swipe.lastDOY;
      loadDay(DOY);
    }
    if (swipe.page != null) {
      if (swipe.direction==='right') changeDOY(-1);
      swipe.direction = "";
      document.getElementById('swipe').className += " " + type;
      document.getElementById('swipe').style.left = null;
      clearSwipePage();
    }
  }
  var touchStart = function(event) {
    if (swipe.page === null) {
      swipe.x = event.changedTouches[0].clientX;
      swipe.y = event.changedTouches[0].clientY;
      swipe.lastDOY = DOY;
      swipe.direction = (event.changedTouches[0].clientX>(width/2)?"left":"right");
    }
  }
  var touchMove = function(event) {
    var y_distance = Math.abs(swipe.y - event.changedTouches[0].clientY);
    if (y_distance > threshold.y) {
      completeSwipe('back');
    } else {
      var x_distance = event.changedTouches[0].clientX - swipe.x;
      if (Math.abs(x_distance) > threshold.x) {
        if (swipe.page === null) buildSwipePage();
        if (swipe.direction==='left') {
          document.getElementById('swipe').style.left = x_distance + "px";
        }
        if (swipe.direction==='right') {
          document.getElementById('swipe').style.left = x_distance-width + "px";
        }
        event.preventDefault();
      }
    }
  }
  var touchEnd = function(event) {
    var distance = Math.abs(swipe.x - event.changedTouches[0].clientX);
    if (distance > (width/3)) {
      completeSwipe(swipe.direction)
    } else {
      completeSwipe('back');
    }
  }
  var touchCancel = function() {
    completeSwipe('back');
  }

  // Main
  DOY = dayOfYear(new Date());
  if (localStorage) {
    if (localStorage.lastDOYRead && localStorage.lastOpened) {
        DOY = localStorage.lastDOYRead;
        //if already opened today, show same day, otherwise increment
        if (localStorage.lastOpened != dayOfYear(new Date())) {
            console.debug('not opened today, incrementing card');
            morn_eve='morning';
            console.log('Day of year::',DOY);
            DOY++;
            if (DOY>366) { DOY=1; }
        }
    }
    localStorage.lastDOYRead = DOY;
    localStorage.lastOpened = dayOfYear(new Date());
  }
  if (DOY) { setDay(DOY); }
  var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("get", url, true);
    xhr.responseType = "json";
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status);
      }
    };
    xhr.send();
  };
  getJSON('DailyLight.json', function(err, result) {
    if (err!==null) {
      console.error('Error loading data:' + err);
      data=undefined;
    }
    data=result;
    loadDay(DOY);
  });
  document.getElementsByClassName('morn_eve')[0].addEventListener('click', toggleMorning);
  document.getElementsByClassName('datepicker')[0].addEventListener('input', dateChanged);
  document.getElementById('swipe').addEventListener('touchstart', touchStart, false);
  document.getElementById('swipe').addEventListener('touchmove', touchMove, false);
  document.getElementById('swipe').addEventListener('touchend', touchEnd, false);
  document.getElementById('swipe').addEventListener('touchcancel', touchCancel, false);
})();
