$(function() {
	$(document).ready(function(event) {
		loadEntry();
		var temp = document.getElementById('temp');
		$("select").change(function(){
			var e = $(this).context;

        	if($(this).val() == 'celsius') {
        		temp.value = Math.round((temp.value - 32) * 5/9);
        	}
        	else if ($(this).val() == 'fahrenheit') {
        		temp.value = Math.round(temp.value *1.8 +32);
        	}

        	if(e.name == 'condition') {
        		document.getElementById('wcc').options.length = 0;
        		erweitern('#wcc', "wccnull" , ["wccnull"], ["---"], true);
       		getGruppe(parseInt(e.options[e.selectedIndex].value), null, false);
            } 
            else if(e.name == 'scale') {
        		call_update('temp', e.options[e.selectedIndex].value);
        	}
            else {
        		call_update(e.name, e.options[e.selectedIndex].value);
        	}
    	});

    	$("input").change(function(e) {	
    		if($(this).context.name == 'temp') {
    			var result = 0;
        		var tmpVal = document.getElementById('scale');

        		if(tmpVal.value == 'celsius') {
        			result = parseInt($(this).val()) + 272;
        		} else {
        			result = Math.round((parseInt($(this).val()) - 32) * 5/9) + 272;
        		}
        		call_update($(this).context.name, result);
        	}
        	else {
    			call_update($(this).context.name, $(this).val());
                var name = $(this).context.name;
                if(name == 'wdate' || name == 'lat' || name == 'lng'){
                    getWeatherData(true);
                }
    		}
    	});
	});

});

function call_update(fieldName, fieldVal) {

        if(fieldName == 'wdate' || fieldName == 'wtime' || fieldName == 'icon'){
            // this fix is needed to store values string types in sql
            fieldVal = "'" + fieldVal + "'";
        }
		event.preventDefault();
		var query = window.location.search;
		
		var waynrQuery = query.match(/wnr=\d/);
		var waynr = waynrQuery[0].replace(/wnr=/, "");
	
		var json = {
			"wnr": waynr,
			"field": fieldName,
			"value": fieldVal
	    };
	    jQuery.post("app_waypoint_update.html", json, function(data) { 	    	
	    }, "json");

}


function buildDateString(date){
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10)? "0" + month : month;
    var day = date.getDate();
    day = (day < 10)? "0" + day : day;
    return year + "-" + month + "-" + day;
}

function getWeatherData(force){
    var lat = document.getElementById('lat').value;
    var lon = document.getElementById('lng').value;
    var date = document.getElementById('wdate').value;

    var today = buildDateString(new Date());
    for (var i = 0; i < today.length; i++) {
        if(date.charAt(i) > today.charAt(i))
            return getPredictedWeatherData(lat, lon, date, force);
        if(date.charAt(i) < today.charAt(i))
            return getClosestCities(lat, lon, date, force);
    }
    return getCurrentWeatherData(lat, lon, force);
}

getClosestCities = function (lat, lon, date, force){
    $.ajax({
        type : 'get',
        url : "http://api.openweathermap.org/data/2.5/find?lat=" + lat + "&lon=" + lon + "&callback=?",
        dataType : 'json', 
        success : function(response){
            var cityIDs = new Array();
            for (var i = 0; i < response.list.length; i++) {
                cityIDs.push(response.list[i].id);
            };   
            var dateSec = (new Date(date).getTime())/1000;      
            getHistoricWeatherData(lat, lon, dateSec, force, cityIDs, 0);
        }, 
        error: function(a,b,c){
        }
    });
}

function getHistoricWeatherData(lat, lon, date, force, cityIDs, index){
    if(index == cityIDs.length){
        // checked all possible cities
        return;
    }
    $.ajax({
        type : 'get',
        url : "http://api.openweathermap.org/data/2.5/history/city/1517501?type=day&start=1371081600&end=1371081600&callback=?",
        dataType : 'json', 
        success : function(response){
           if(response.list.length == 0){
                // no data from this station
                return getHistoricWeatherData(lat, lon, date, force, cityIDs, ++index);
            }
            writeHistoricData(response.list[0], force);
        }, 
        error: function(a,b,c){
            // try next city
            getHistoricWeatherData(lat, lon, date, force, cityIDs, ++index);
        }
    });
}

function writeHistoricData(response, force){
    var field, value;

    field = document.getElementById('windspeed'); 
    if(force || check(field)){
        value = parseInt(response.wind.speed);
        call_update(field.name, value);
        field.value = value;
    }   
    field = document.getElementById('winddirection'); 
    if(force || check(field) || field.options[field.selectedIndex].text == "---"){
        value = response.wind.deg;
        call_update(field.name, value);
        field.options.length = 0;
        var direction;
        var setzeSelect = false;
        if (value != null) {
            setzeSelect = true;
            direction = getDirection(value, dirNumbers, dirBorders);
        }
        if(!setzeSelect){
            erweitern('#winddirection', "widnull" , ["widnull"], ["---"], true);
        }
        erweitern('#winddirection', direction, dirNumbers, dirText, setzeSelect);
    }

        
    field = document.getElementById('wcc'); 
    if(force || check(field) || field.options[field.selectedIndex].text == "---"){
        field.options.length = 0;
        document.getElementById('condition').options.length = 0;
        var temp = response.weather[0];
        call_update(field.name, temp.id);
        call_update("icon", temp.icon);
        if (temp.id != null) {
            getGruppe(1, null, false);
            getGruppe(parseInt(temp.id /100), temp.id, true);
            var ic = document.getElementById('icon');
            if(temp.icon != null)
                ic.src = "assets/images/custom/" + temp.icon + ".png";
            else
                ic.src = "";
        }else{
            erweitern('#wcc', "wccnull" , ["wccnull"], ["---"], true);
            erweitern('#condition', "cnull", ["cnull"], ["---"], true);
            getGruppe(1, null, false);
        }
    }
    field = document.getElementById('airpressure'); 
    if(force || check(field)){
        value = parseInt(response.main.pressure);
        call_update(field.name, value);
        field.value = value;
    }
    field = document.getElementById('precipation'); 
    if(force || check(field)){
        // hacky solutions because of "3h" fieldname...
        for(wert in response.rain){
            // checks for rain
            value = response.rain[wert];
            call_update(field.name, value);
            field.value = value;
            break;
        }
        for(wert in response.snow){
            // checks for snow
            value = response.snow[wert];
            call_update(field.name, value);
            field.value = value;
            break;
        }
    }
    field = document.getElementById('temp'); 
    if(force || check(field)){
        value = response.main.temp;
        var tmp;
        if(document.getElementById("scale").value == "fahrenheit")
            tmp = Math.round(value * 1.8 - 459.67);
        else
            tmp = Math.round(value - 272);
        call_update(field.name, value);
        field.value = tmp;
    }
    field = document.getElementById('clouds'); 
    if(force || check(field)){
        value = parseInt(response.clouds.all);
        call_update(field.name, value);
        field.value = value;
    }
    if(force){
        value = null;
        field = document.getElementById('wavehight');
        call_update(field.name, value);
        field.value = value;

        field = document.getElementById('wavedirection');
        call_update(field.name, value);
        field.options.length = 0;
        erweitern('#wavedirection', "wavnull" , ["wavnull"], ["---"], true);
        erweitern('#wavedirection', value, dirNumbers, dirText, false);
    }
}

function getPredictedWeatherData(lat, lon, date, force){
    $.ajax({
      type : 'get',
      url : "http://api.openweathermap.org/data/2.5/forecast/daily?cnt=14&lat=" + lat +"&lon=" + lon + "&callback=?",
      dataType : 'json', 
      success : function(response){
        for (var i = 0; i < response.list.length; i++){
            // hacky solution, need *1000 for time in mils and StringBuilder to ignore h, min and sec
            var entryDate = buildDateString(new Date(response.list[i].dt *1000));
            if(date == entryDate){
                return readPredictedData(response.list[i], force);
            }
        }
        // can't predict further than 14 days, so no data available
        return defaultWeatherData();
      }, 
      error: function(a,b,c){
      }
    });

}

function defaultWeatherData(){
    event.preventDefault();
    var query = window.location.search;
    
    var waynrQuery = query.match(/wnr=\d/);
    var waynr = waynrQuery[0].replace(/wnr=/, "");

    var json = {
        "wnr": waynr,
    };

    jQuery.post("app_waypoint_default.html", json, function(data) {
        var figure = document.getElementById("fig")
        figure.innerHTML = "";
        var img = new Image();
        img.src = "";
        img.setAttribute("id","icon");
        img.setAttribute("name", "icon");
        figure.appendChild(img);
        loadEntry();
    }, "json");
}

function readPredictedData(entry, force){

    var field, value;

    field = document.getElementById('windspeed')
    if(force || check(field)){
        value = entry.speed;
        call_update(field.name, value);
        field.value = parseInt(value);
    }   
    field = document.getElementById('winddirection'); 
    if(force || check(field) || field.options[field.selectedIndex].text == "---"){
        value = entry.deg;
        call_update(field.name, value);
        field.options.length = 0;
        var direction;
        var setzeSelect = false;
        if (value != null) {
            setzeSelect = true;
            direction = getDirection(value, dirNumbers, dirBorders);
        }
        if(!setzeSelect){
            erweitern('#winddirection', "widnull" , ["widnull"], ["---"], true);
        }
        erweitern('#winddirection', direction, dirNumbers, dirText, setzeSelect);
    }
    field = document.getElementById('wcc'); 
    if(force || check(field) || field.options[field.selectedIndex].text == "---"){
        field.options.length = 0;
        document.getElementById('condition').options.length = 0;
        var temp = entry.weather[0];
        call_update(field.name, temp.id);
        call_update("icon", temp.icon);
        if (temp.id != null) {
            getGruppe(1, null, false);
            getGruppe(parseInt(temp.id /100), temp.id, true);
            var ic = document.getElementById('icon');
            if(temp.icon != null)
                ic.src = "assets/images/custom/" + temp.icon + ".png";
            else
                ic.src = "";
        }else{
            erweitern('#wcc', "wccnull" , ["wccnull"], ["---"], true);
            erweitern('#condition', "cnull", ["cnull"], ["---"], true);
            getGruppe(1, null, false);
        }
    }
    field = document.getElementById('airpressure'); 
    if(force || check(field)){
        value = entry.pressure;
        call_update(field.name, value);
        field.value = parseInt(value);
    }
    field = document.getElementById('precipation'); 
    if(force || check(field)){
        value = entry.rain;
        call_update(field.name, value);
        if(value != null){
            field.value = value;
        }
        value = entry.snow;
        call_update(field.name, value);
        if(value != null){
            field.value = value;
        }
    }
    field = document.getElementById('temp'); 
    if(force || check(field)){
        // using average temp
        value = (entry.temp.min + entry.temp.max)/2;
        var tmp;
        if(document.getElementById("scale").value == "fahrenheit")
            tmp = Math.round(value * 1.8 - 459.67);
        else
            tmp = Math.round(value - 272);
        call_update(field.name, value);
        field.value = tmp;
    }
    field = document.getElementById('clouds'); 
    if(force || check(field)){
        value = entry.clouds;
        call_update(field.name, value);
        field.value = parseInt(value);
    }
    // retrive data from database if something changed
    if(force){
        value = null;
        field = document.getElementById('wavehight');
        call_update(field.name, value);
        field.value = value;

        field = document.getElementById('wavedirection');
        call_update(field.name, value);
        field.options.length = 0;
        erweitern('#wavedirection', "wavnull" , ["wavnull"], ["---"], true);
        erweitern('#wavedirection', value, dirNumbers, dirText, false);
    }
}

function getCurrentWeatherData(lat, lon, force){	

    $.ajax({
      type : 'get',
      url : "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&callback=?",
      dataType : 'json', 
      success : function(response){
      	var somethingChanged = false;
        var field, value;

        field = document.getElementById('windspeed'); 
        if(force || check(field)){
            value = response.wind.speed;
            call_update(field.name, value);
            field.value = parseInt(value);
        }   
        field = document.getElementById('winddirection'); 
        if(force || check(field) || field.options[field.selectedIndex].text == "---"){
            value = response.wind.deg;
            call_update(field.name, value);
            field.options.length = 0;
            var direction;
            var setzeSelect = false;
            if (value != null) {
                setzeSelect = true;
                direction = getDirection(value, dirNumbers, dirBorders);
            }
            if(!setzeSelect){
                erweitern('#winddirection', "widnull" , ["widnull"], ["---"], true);
            }
            erweitern('#winddirection', direction, dirNumbers, dirText, setzeSelect);
        }
            
        field = document.getElementById('wcc'); 
        if(force || check(field) || field.options[field.selectedIndex].text == "---"){
            field.options.length = 0;
            document.getElementById('condition').options.length = 0;
            var temp = response.weather[0];
            call_update(field.name, temp.id);
            call_update("icon", temp.icon);
            if (temp.id != null) {
                getGruppe(1, null, false);
                getGruppe(parseInt(temp.id /100), temp.id, true);
                var ic = document.getElementById('icon');
                if(temp.icon != null)
                    ic.src = "assets/images/custom/" + temp.icon + ".png";
                else
                    ic.src = "";
            }else{
                erweitern('#wcc', "wccnull" , ["wccnull"], ["---"], true);
                erweitern('#condition', "cnull", ["cnull"], ["---"], true);
                getGruppe(1, null, false);
            }
        }

        field = document.getElementById('airpressure'); 
        if(force || check(field)){
            value = response.main.pressure;
            call_update(field.name, value);
            field.value = parseInt(value);
        }

        field = document.getElementById('precipation'); 
        if(force || check(field)){
            // hacky solution because of "3h" fieldname...
            for(wert in response.rain){
                value = response.rain[wert];
                call_update(field.name, value);
                field.value = value;
                break;
            }
            for(wert in response.snow){
                value = response.snow[wert];
                call_update(field.name, value);
                field.value = value;
            }
        }
        field = document.getElementById('temp'); 
        if(force || check(field)){
            value = response.main.temp;
            var tmp;
            if(document.getElementById("scale").value == "fahrenheit")
                tmp = Math.round(value * 1.8 - 459.67);
            else
                tmp = Math.round(value - 272);
            call_update(field.name, value);
            field.value = tmp;
        }
        field = document.getElementById('clouds'); 
        if(force || check(field)){
            value = response.clouds.all;
            call_update(value.name, value);
            field.value = parseInt(value);
        } 
        if(force){
            value = null;
            field = document.getElementById('wavehight');
            call_update(field.name, value);
            field.value = value;

            field = document.getElementById('wavedirection');
            call_update(field.name, value);
            field.options.length = 0;
            erweitern('#wavedirection', "wavnull" , ["wavnull"], ["---"], true);
            erweitern('#wavedirection', value, dirNumbers, dirText, false);
        }
      }, 
      error: function(a,b,c){
      }
    });

}

function check(value){
	return value.value == null || value.value == "" || value.value == "null";
}

function loadEntry() { 

	var query = window.location.search;

	var waypnrQuery = query.match(/wnr=\d/);
	var waypnr = waypnrQuery[0].replace(/wnr=/, "");

	jQuery.get("app_tripinfo_load.html", {'wnr': waypnr}, function(data) {

        $('#name').val(data['name']);
        $('#lat').val(data['lat']);
        $('#lng').val(data['lng']);
        $('#btm').val(data['btm']);
        $('#dtm').val(data['dtm']);
        $('#sog').val(data['sog']);
        $('#cog').val(data['cog']);
        $('#manoever').append('<option>' + data['manoever'] + '</option>');
        $('#vorsegel').append('<option>' + data['vorsegel'] + '</option>');
        $('#marker').append('<option>' + data['marker'] + '</option>');
        $('#wdate').val(data['wdate']);
        $('#wtime').val(data['wtime']);

 		var value = data['wcc'];
 		var setzeSelect = false;
        var direction = 0;
        document.getElementById('condition').options.length = 0;
        document.getElementById('wcc').options.length = 0;
        
        if (value != null) {
            getGruppe(1, null, false);
            getGruppe(parseInt(value.charAt(0)), parseInt(value), true);
        }else{
        	erweitern('#wcc', "wccnull" , ["wccnull"], ["---"], true);
        	erweitern('#condition', "cnull", ["cnull"], ["---"], true);
            getGruppe(1, null, false);
        }

        var ic = document.getElementById('icon');
        if(data['icon'] != null)
            ic.src = "assets/images/custom/" + data['icon'] + ".png";
        else
            ic.src = "";
       
        value = data['temp'];
        if(value != null){
            var tmp;
            if(document.getElementById("scale").value == "fahrenheit")
                tmp = Math.round(value * 1.8 - 459.67);
            else
                tmp = Math.round(value - 272);
        	$('#temp').val(tmp);
        } else{
            $('#temp').val(null);
        }
        $('#airpressure').val(data['airpressure']);
        $('#windspeed').val(data['windspeed']);

        value = data['winddirection'];
        setzeSelect = false;
        direction = 0;
        document.getElementById('winddirection').options.length = 0;
        if (value != null) {
        	setzeSelect = true;
        	direction = getDirection(parseInt(value), dirNumbers, dirBorders);
        }
        if(!setzeSelect){
        	erweitern('#winddirection', "widnull" , ["widnull"], ["---"], true);
        }
        erweitern('#winddirection', direction, dirNumbers, dirText, setzeSelect);

        $('#precipation').val(data['precipation']);
        $('#clouds').val(data['clouds']);
        $('#wavehight').val(data['wavehight']);

        value = data['wavedirection'];
        document.getElementById('wavedirection').options.length = 0;
        setzeSelect = false;
       	direction = 0;
        if (value != null) {
        	setzeSelect = true;
        	direction = getDirection(parseInt(value), dirNumbers, dirBorders);
        }

        if(!setzeSelect){
        	erweitern('#wavedirection', "wavnull" , ["wavnull"], ["---"], true);
        }
        erweitern('#wavedirection', direction, dirNumbers, dirText, setzeSelect);
        getWeatherData(false);
    }, "json");
	
}