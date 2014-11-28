var keymap = [
	'ㅁ','ㅠ','ㅊ','ㅇ','ㄷ','ㄹ','ㅎ','ㅗ','ㅑ','ㅓ','ㅏ','ㅣ','ㅡ','ㅜ','ㅐ','ㅔ','ㅂ','ㄱ','ㄴ','ㅅ','ㅕ','ㅍ','ㅈ','ㅌ','ㅛ','ㅋ'];
var initialized = false;

var e2k = function(ch){
	return keymap[ch - 65];
}

var cho_map = ["아","카까","가","사","자","타차짜따","다","나","하","바","파빠","마","라"];
var joong_map = ["아","이","우으","에","오","ｘ","ｘ","ｘ","ｘ","ｘ","야","유","요"];
var jong_map = ["안앙암","앗앚앋앛압악"];
var hiragana_map = [
/* ㅇ */ "あ","い","う","え","お","ぁ","ぃ","ぅ","ぇ","ぉ","や","ゆ","よ",
/* ㅋ */ "か","き","く","け","こ","ｘ","ｘ","ｘ","ｘ","ｘ","きゃ","きゅ","きょ",
/* ㄱ */ "が","ぎ","ぐ","げ","ご","ｘ","ｘ","ｘ","ｘ","ｘ","ぎゃ","ぎゅ","ぎょ",
/* ㅅ */ "さ","し","す","せ","そ","ｘ","ｘ","ｘ","ｘ","ｘ","しゃ","しゅ","しょ",
/* ㅈ */ "ざ","じ","ず","ぜ","ぞ","ｘ","ｘ","ｘ","ｘ","ｘ","じゃ","じゅ","じょ",
/* ㅌ */ "た","ち","つ","て","と","ｘ","ｘ","ｘ","ｘ","ｘ","ちゃ","ちゅ","ちょ",
/* ㄷ */ "だ","ぢ","づ","で","ど","ｘ","ｘ","ｘ","ｘ","ｘ","ぢゃ","ぢゅ","ぢょ",
/* ㄴ */ "な","に","ぬ","ね","の","ｘ","ｘ","ｘ","ｘ","ｘ","にゃ","にゅ","にょ",
/* ㅎ */ "は","ひ","ふ","へ","ほ","ｘ","ｘ","ｘ","ｘ","ｘ","ひゃ","ひゅ","ひょ",
/* ㅂ */ "ば","び","ぶ","べ","ぼ","ｘ","ｘ","ｘ","ｘ","ｘ","びゃ","びゅ","びょ",
/* ㅍ */ "ぱ","ぴ","ぷ","ぺ","ぽ","ｘ","ｘ","ｘ","ｘ","ｘ","ぴゃ","ぴゅ","ぴょ",
/* ㅁ */ "ま","み","む","め","も","ｘ","ｘ","ｘ","ｘ","ｘ","みゃ","みゅ","みょ",
/* ㄹ */ "ら","り","る","れ","ろ","ｘ","ｘ","ｘ","ｘ","ｘ","りゃ","りゅ","りょ"];


var cho = function(a){
    var r = ((a.charCodeAt(0) - parseInt('0xac00',16)) /28) / 21;
    var t = String.fromCharCode(r + parseInt('0x1100',16));
    return t;
}
var joong = function(a){
    var r = ((a.charCodeAt(0)- parseInt('0xac00',16)) / 28) % 21;
    var t = String.fromCharCode(r + parseInt('0x1161',16));
    return t;
}
var jong = function(a){
    var r = (a.charCodeAt(0) - parseInt('0xac00',16)) % 28;
    var t = String.fromCharCode(r + parseInt('0x11A8') -1);
    return t;
}

var break_map = function(map, func){
	for(var i=0;i<map.length;i++){
		for(var j=0;j<map[i].length;j++){
			map[i] = map[i].replace(map[i][j], func(map[i][j]));
		}
	}
}
var index_of = function(map, ch){
	for(var i=0;i<map.length;i++){
		for(var j=0;j<map[i].length;j++){
			if( map[i][j] == ch )
				return i;
		}
	}
}
var init = function(){
	break_map( cho_map, cho );
	break_map( joong_map, joong );
	break_map( jong_map, jong );
	
	initialized = true;
}
var special_case = function(ch1, ch2, ch3){
	switch( ch2 ){
		case '-':
			if( ch3 != '-' && ch1 != '-' )
				return "う";
			else if( ch1 != '-' )
				return "-";
			else
				return "";
		case '.':
			return "。";
		case '와':
			return 'わ';
		case '워':
			return 'を';
	}
	return null;
}
var k2j = function(str){
  var result = "";
  
  if(initialized == false) init();

	for(var i=0;i<str.length;i++){
		var ch = str[i];

		/* 특수 케이스 */
		var special = special_case(str[i-1], ch, str[i+1]);
		if( special != null ){
			result += special;
			continue;
		}
		
		/* 가나 변환 */
		var col = index_of( cho_map, cho(ch) );
		var row = index_of( joong_map, joong(ch) );
		var gana = hiragana_map[ col * 13 + row ];

		if( gana != null )
			result += gana;
		else
			result += ch;

		/* 받침 붙이기 */
		var ad = index_of( jong_map, jong(ch) );
		switch( ad ){
			case 0:
				result += "ん";
				break;
			case 1:
				result += "っ";
				break;
		}
	}

	return result;
}
 
