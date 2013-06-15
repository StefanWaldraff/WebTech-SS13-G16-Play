var conditionCodes = [2, 3, 5, 6, 7, 8, 9];
var conditionText = ["Thunderstorm" , "Drizzle" , "Rain" , "Snow" , "Atmosphere" , "Cloud" , "Extreme"];

var thunderstormCodes = [200, 201, 210, 211, 212, 221, 230, 231, 232];
var thunderstormText = ["with light rain", "with rain", "with heavy rain", "light",
	"thunderstorm", "heavy", "ragged", "with light drizzle",
	 "with drizzle", "with heavy drizzle"];

var drizzleCodes = [300, 301, 302, 310, 311, 312, 321];
var drizzleText =["light intensity", "drizzle", "heavy intensity", "light drizzle rain",
	"drizzle rain", "heavy drizzle rain", "shower drizzle"];

var rainCodes = [500, 501, 502, 503, 504, 511, 520, 521, 522];
var rainText = ["light", "moderate", "heavy intensity", "very heavy", "extreme", "freezing",
	"light shower", "shower", "heavy shower"];

var snowCodes = [600, 601, 602, 611, 621];
var snowText = ["light snow", "snow", "sleet", "shower snow"];

var atmosphereCodes = [701, 711, 721, 731, 741];
var atmosphereText = ["mist", "smoke", "haze", "Sand/Dust Whirls", "Fog"];

var cloudCodes = [800, 801, 802, 803, 804];
var cloudText = ["sky is clear", "few clouds", "scattered clouds", "broken clouds", "overcast clouds"];

var extremeCodes = [900, 901, 902, 903, 904, 905, 906];
var extremeText = ["tornado", "tropical storm", "hurricane", "cold", "hot", "windy", "hail"];

var dirNumbers = [0, 45, 90, 135, 180, 225, 270, 315];
var dirBorders = [22, 67, 112, 157, 202, 247, 292, 337];
var dirText = ["North", "North-East", "East", "South-East", "South", "South-West", "West", "North-West"];

erweitern = function(feld, wert, codeArray, textArray, setzeSelect){
	if(!setzeSelect || $.inArray(wert, codeArray) != -1){
		for (var i = 0; i < codeArray.length; i++) {
		var opt = new Option(textArray[i], codeArray[i]);
		$(feld).append(opt);
	};
	if(setzeSelect)
		$(feld).val(escape(wert));
	}
}
	 		
	        
getDirection = function(value, numbers, borders){
	if(value < 0){
		value = 360 + value;
	}
	for (var i = 0; i < borders.length; i++) {
		if(value <= borders[i])
			return numbers[i];
	};
	return 0;
}

getGruppe = function (gruppenNr, wert, setzeSelect){
	var feld = '#wcc';
	var cond = '#condition';
	switch(gruppenNr){
		case 1:
			erweitern(cond, wert, conditionCodes, conditionText, setzeSelect);
			break;
		case 2:
			erweitern(feld, wert, thunderstormCodes, thunderstormText, setzeSelect);
			$(cond).val(escape(gruppenNr));
			break;
		case 3:
			erweitern(feld, wert, drizzleCodes, drizzleText, setzeSelect);
			$(cond).val(escape(gruppenNr));
			break;
		case 5:
			erweitern(feld, wert, rainCodes, rainText, setzeSelect);
			$(cond).val(escape(gruppenNr));
			break;
		case 6:
			erweitern(feld, wert, snowCodes, snowText, setzeSelect);
			$(cond).val(escape(gruppenNr));
			break;
		case 7:
			erweitern(feld, wert, atmosphereCodes, atmosphereText, setzeSelect);
			$(cond).val(escape(gruppenNr));
			break;
		case 8:
			erweitern(feld, wert, cloudCodes, cloudText, setzeSelect);
			$(cond).val(escape(gruppenNr));
			break;
		case 9:
			erweitern(feld, wert, extremeCodes, extremeText, setzeSelect);
			$(cond).val(escape(gruppenNr));
			break;
	}
}