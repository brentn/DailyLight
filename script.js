(function() {
  'use strict';

  var data;
  var min_swipe_distance = 10;
  var mid = document.getElementsByClassName('card')[0].getBoundingClientRect().width/2;
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
    document.getElementsByClassName("morn_eve")[0].innerHTML=morn_eve;
  }
  function setDay(day) {
    document.getElementsByClassName("date")[0].innerHTML=dateString(day);
    document.getElementsByClassName("datepicker")[0].value=day;
    setMorning();
    DOY=day;
  }
  function loadDay(day) {
    missing.style.display='none';
    document.getElementsByClassName("heading")[0].innerHTML='';
    document.getElementsByClassName("references")[0].innerHTML='';
    var verses = document.getElementById("verses");
    verses.innerHTML='';
    if (!data) { return; }
    setDay(day);
    var item;
    item = data.days.day.filter(function(block) {return block.date===dateString(day);});
    if (item.length>0) {
      if (morn_eve==='morning') {
        item = item[0].morning;
      } else {
        item = item[0].evening; }
      document.getElementsByClassName("heading")[0].innerHTML=item.heading;
      document.getElementsByClassName("references")[0].innerHTML=item.references;
      verses.innerHTML='';
      if (item.references.length>0) {
        document.getElementsByClassName("heading")[0].innerHTML=item.heading;
        document.getElementsByClassName("references")[0].innerHTML=item.references;
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
    DOY = (DOY + delta + 366) % 366;
    loadDay(DOY);
  };
  var mouseDown = function(event) {
    if (swipe.page === null) {
      swipe.x = event.clientX;
      swipe.y = event.clientY;
      swipe.direction = (event.clientX>mid?"left":"right");
      var card = document.getElementsByClassName('card')[0];
      swipe.page = card.cloneNode(true);
      swipe.page.className += " swipe"
      swipe.page.style.position = "absolute";
      swipe.page.style.zIndex = "2";
      document.body.insertBefore(swipe.page, card);
      event.preventDefault();
    }
  }
  var mouseMove = function(event) {
    var distance = Math.abs(swipe.x - event.clientX);
    if (swipe.page != null && distance > min_swipe_distance) {
      if (swipe.direction==="left" && event.clientX < swipe.x) {
        swipe.page.style.left = -distance + "px";
      }
      // if (swipe.direction==="right" && event.clientX > swipe.x) {
      //   swipe.page.style.left = distance+"px";
      // }
    }
  }
  var mouseUp = function(event) {
    var distance = Math.abs(swipe.x - event.clientX);
    if (swipe.page != null) {
      if (distance > mid) {
        swipe.page.className += " "+swipe.direction;
        changeDOY(1);
      } else {
        swipe.page.style.left = null;
        swipe.page.className += " back";
      }
      swipe.direction="";
      setTimeout(function() {
        document.body.removeChild(swipe.page);
        swipe.page=null;
      }, 600);
    }
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
  document.body.addEventListener('mousedown', mouseDown, false);
  document.body.addEventListener('mousemove', mouseMove, false);
  document.body.addEventListener('mouseup', mouseUp, false);
})();
