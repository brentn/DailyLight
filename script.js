(function() {
  'use strict';

  var data;
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
    console.log(delta, DOY);
    loadDay(DOY);
  };

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
  document.body.addEventListener('swl', changeDOY(-1), false);
  document.body.addEventListener('swr', changeDOY(1), false);
})();



(function(d){
 var
 ce=function(e,n){var a=document.createEvent("CustomEvent");a.initCustomEvent(n,true,true,e.target);e.target.dispatchEvent(a);a=null;return false},
 nm=true,sp={x:0,y:0},ep={x:0,y:0},
 touch={
  touchstart:function(e){sp={x:e.touches[0].pageX,y:e.touches[0].pageY}},
  touchmove:function(e){nm=false;ep={x:e.touches[0].pageX,y:e.touches[0].pageY}},
  touchend:function(e){if(nm){ce(e,'fc')}else{var x=ep.x-sp.x,xr=Math.abs(x),y=ep.y-sp.y,yr=Math.abs(y);if(Math.max(xr,yr)>20){ce(e,(xr>yr?(x<0?'swl':'swr'):(y<0?'swu':'swd')))}};nm=true},
  touchcancel:function(e){nm=false}
 };
 for(var a in touch){d.addEventListener(a,touch[a],false);}
})(document);
