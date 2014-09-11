var VisitorT;
var onSeconds=0;
var p_cookie='';
if(window.turlnameindex){
p_cookie = path_cookie(turlnameindex);
}else if(window.turlnameindexa){
p_cookie = path_cookie(turlnameindexa);
}
function getLogonTime(){
var now=new Date();
onSeconds=now.getTime();
VisitorT=logon_getcookie('visit_time');
if(VisitorT==null) VisitorT=0;
document.cookie='visit_time=0;path=/;expires='+now.toGMTString()+";"+p_cookie;
}
function getLogoffTime(){
var PageTimeValue=0,now=new Date();
if(onSeconds){
PageTimeValue=Math.round((now.getTime()-onSeconds)/1000);
now.setTime(now.getTime()+259200000);
document.cookie='visit_time='+PageTimeValue+';path=/;expires='+now.toGMTString()+";"+p_cookie ;
}
}
function path_cookie(sd) {
var _cd="";
if(sd && sd!="" && document.domain.indexOf(sd)<0 ) return '';
if(sd && sd!="" && (sd.indexOf('.')>=0) ) _cd=" domain="+ sd +";";
document.cookie="_cbclose=1; path=/;" +_cd;
if(document.cookie.indexOf("_cbclose") < 0){
_cd = "";
}
return _cd;
}
function logon_getcookie( _vn ){
var _cookie = document.cookie;
var i2,i1 = _cookie.indexOf( _vn+'=' );
if (i1 < 0){ return 0; }
i1 += _vn.length +1;
i2 = _cookie.indexOf(';',i1);
if (i2 < 0) i2=_cookie.length;
return _cookie.substring(i1,i2);
}
getLogonTime();
window.onunload=getLogoffTime;
function Tracker(code,sd){
var _cookie = document.cookie;
var _exp1=" expires=Sun, 18 Jan 2038 00:00:00 GMT;";
var _nc = 0,_rf="",_uri;
var _cd = "";
if(sd && sd!="" && document.domain.indexOf(sd)<0 ) return '';
if(sd && sd!="" && (sd.indexOf('.')>=0) ) _cd=" domain="+ sd +";";
var _hc = _Hash(sd);
var _uid = _gsc(_cookie,"_uid"+_hc,';');
if(! _uid || _uid=="" || (_uid.lastIndexOf('.') != 8)){
_uid = _rdId() + "."+"0";
_nc=1;
}
if((!_nc)&&(_cookie.indexOf("_ctout"+_hc) <0 || _cookie.indexOf("_cbclose"+_hc) <0 )){
_nc=1;
}
if(_nc){
document.cookie="_cbclose"+_hc+"=1; path=/;" +_cd;
if(document.cookie.indexOf("_cbclose"+_hc) < 0){
	document.cookie="_cbclose"+_hc+"=1; path=/;";
	if(document.cookie.indexOf("_cbclose"+_hc) < 0)	return '';
	_cd = "";
}
var uid = _uid.substring(0,8);
var cn  = _uid.substring(9,_uid.length);
cn++;
_uid = uid+"."+cn;
document.cookie="_uid"+_hc+"="+ _uid +"; path=/;"+_exp1+_cd;
if(document.cookie.indexOf("_uid"+_hc) < 0) return '';
_rf = _ref();
}
var _tObject=new Date();
var _exp2=new Date(_tObject.getTime()+1200000);
_exp2=" expires="+_exp2.toGMTString()+";";
document.cookie="_ctout"+_hc+"=1; path=/;"+_exp2+_cd;
if(document.cookie.indexOf("_ctout"+_hc) < 0) return '';
var je = navigator.javaEnabled()?1:0;
var fv = _Flv();
return("&vt="+_uid+"&fp="+_rf+"&fv="+fv);
}
function _rdId(){
var _rand1 = Math.round(Math.random()*255),
_rand2 = Math.round(Math.random()*255),
_rand3 = Math.round(Math.random()*255),
_rand4 = Math.round(Math.random()*255);
return 	_toHex(_rand1>>4) +''+  _toHex(_rand1%16)+''+
_toHex(_rand2>>4)+''+_toHex(_rand2%16)+''+
_toHex(_rand3>>4)+''+_toHex(_rand3%16)+''+
_toHex(_rand4>>4)+''+ _toHex(_rand4%16);}
function _toHex(d){
if(d>15 || d<0) d=0;
switch(d){
case 15:return 'F';case 14:return 'E';case 13:return 'D';case 12:return 'C';case 11:return 'B';case 10:return 'A';
default: return d;
}
}
function _gsc(b,s,t){
if (!b || b=="" || !s || s=="" || !t || t=="") return false;
var i1,i2,i3,c="-";
i1=b.indexOf(s);
if (i1 < 0) return false;
i1 += s.length +1;
i2=b.indexOf(t,i1);
if (i2 < 0) i2=b.length;
return b.substring(i1,i2);
}
function _Flv(){var f="-",n=navigator;
if(n.plugins && n.plugins.length){for(var ii=0;ii<n.plugins.length;ii++){if(n.plugins[ii].name.indexOf('Shockwave Flash')!=-1){f=n.plugins[ii].description.split('Shockwave Flash ')[1];break;}}}
else if(window.ActiveXObject){for (var ii=11;ii>=2;ii--){try{var fl=eval("new ActiveXObject('ShockwaveFlash.ShockwaveFlash."+ii+"');");if(fl){f=ii+'.0';break;}}catch(e){}}}return f;}
function _Hash(s){
 var h=0,g=0;
 if (!s || s=="") return 1;
 for (var i=s.length-1;i>=0;i--){
  var c=parseInt(s.charCodeAt(i));
  h = (((h*64)%268435456)+(c*16385)) % 268435456;
  g = (h-(h%2097152))/2097152;
  h = h ^ g;
 }
 return(h % 65536);
}
function _ref(){
var h,q,i,j,
_rf=top.document.referrer;
if(! _rf) return "d";
if(((i=_rf.indexOf(document.domain))>0)&&(i<=8)) return "d";
var _sre=new Array("search","yahoo","altavista","google","lycos","hotbot","msn","netscape","netster","mamma","alltheweb","aol","ask","looksmart","cnn","gigablast","siamguru","sansarn","truehits","bing","hao123");
var _skw=new Array("q","p","q","q","query","query","q","query","Keyword","query","q","query","q","qt","query","q","q","q","keyword","q","wd");
if((i=_rf.indexOf("://")) < 0) return "d"; i+=3;if((j=_rf.indexOf("/",i)) < 0) j=_rf.length; h=_rf.substring(i,j);q=_rf.substring(j,_rf.length);
if(h.indexOf("www.")==0) h=h.substring(4,h.length);
if(h.length == 0) return "d";
if(q.length > 0 ){for(i=0;i<_sre.length;i++){if(h.indexOf(_sre[i])>-1){if((j=q.indexOf("?"+_skw[i]+"=")) > -1 || (j=q.indexOf("&"+_skw[i]+"=")) > -1){return "s";}}}}
return "r";
}
