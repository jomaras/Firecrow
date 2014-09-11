function collector(){
var ja='',ck='';
var bn='',sv=1.1,ss='',sc='';
bn=navigator.appName;if(bn.substring(0,9)=="Microsoft"){bn="MSIE";};
ja=(navigator.javaEnabled()==true)?"y":"n";
document.cookie="verify=test;expire="+(new Date()).toGMTString();
ck=(document.cookie.length>0)?"y":"n";
if (self.screen) {
ss=screen.width+"*"+screen.height;
sc=(bn=='MSIE')?screen.colorDepth:screen.pixelDepth;
}else if(self.java) {
var _j=java.awt.Toolkit.getDefaultToolkit();
var _s=_j.getScreenSize();
ss=_s.width+"*"+_s.height;
}
sv=1.3;
return("&bn="+bn+"&ss="+ss+"&sc="+sc+"&sv="+sv+"&ck="+ck+"&ja="+ja);
}
function domain_cmp(url1,url2){
if(url1.substring(url1.length-1)==".")url1=url1.substring(0,url1.length-1);
if(url1==url2)return 1;
else if(url1.length>url2.length)return(url1.substring(url1.length-url2.length-1)==("."+url2));
return 0;
}
var page,__th_page,__thflag, udf="undefined",arg = "",truehitsurl,_narg='',rf='',VisitorT,Tracker;
hash=escape(hash).replace(/\+/g,"%2b");
if((__th_page==null)&&(page!=null)) __th_page=page;
if((__th_page!=null)&&(__th_page.replace != null))__th_page=__th_page.replace(/%/g,"%25").replace(/ /g,"%20").replace(/\"/g,"%22").replace(/#/g,"%23").replace(/&/g,"%26").replace(/\'/g,"%27").replace(/\+/g,"%2b").replace(/=/g,"%3d").replace(/\</g,"%3c").replace(/\>/g,"%3e").replace(/\:/g,"%3a");
else __th_page = '';
try{
var truehitsurl_top=top.window.document.domain; 
if(!truehitsurl)truehitsurl=parent.document.URL;
if((!__thflag)&&(domain_cmp(document.domain,turlnameindex))&&(domain_cmp(truehitsurl_top,turlnameindex))){
rf=escape(top.document.referrer);if((rf==udf)||(rf=="")){rf="bookmark";};
if(Tracker){ _narg = Tracker(_hc,turlnameindex); }
if(VisitorT==null) VisitorT=0;
truehitsurl = truehitsurl.replace(/&/g,"%26").replace(/\"/g,"%22").replace(/\'/g,"%27").replace(/\</g,"%3c").replace(/\>/g,"%3e").replace(/\:/g,"%3a");
arg="&bv="+VisitorT+"&rf="+rf+"&test=TEST&web="+hash+collector()+_narg+"&truehitspage="+__th_page+"&truehitsurl="+truehitsurl;
}
}catch(e){arg="";} 
__thflag=1;
hash='';
if( arg.length>0  ){
document.write("<a href='http://truehits.net/"+_ctg+"' target='_blank'>"+"<img src='http://"+_hsv+'/'+_ht+'?hc='+_hc+arg+"' width=14 height=17 "+"alt='Thailand Web Stat' border=0></a>");
arg="";
}

