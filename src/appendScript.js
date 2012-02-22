/* 
 * ------------------module: events
 *  self-made event-handler for using width self-made objects
 */
var $ev={
// <% point_start('object_paths') %>
/**
 * debuger function
 */
/*<% if($debug_enabled) { %>*/
	debug:function(s,replace){
	    if(!document.body) {
	    	alert(s);
	    	return;
	    }
		var d=document.getElementById('debug');
		if(!d){
			d= document.appendChild(document.createElement('div'));
			d.setAttribute('id','debug');
		}
		var div=document.createElement('div');
		div.innerHTML=s;
		if(replace){
			div.setAttribute('tag','replace');
			if(d.firstChild && d.firstChild.getAttribute && d.firstChild.getAttribute('tag')=='replace'){
				d.replaceChild(div,d.firstChild);
				return;
			}
		}
		d.insertBefore(div,d.firstChild);
	},
/*<% } else { %>*/
	debug:function(){},
/*<% }; %>*/
/**
 * append script with callback
 */	
	appendScript:function(src,callback){
	    var scriptElem = document.createElement('script');
	    scriptElem.setAttribute('type','text/javascript');
	    if(callback){
	    	scriptElem.onload=function(){
	    		scriptElem.onreadystatechange=null;
	    		scriptElem.onload=null;
    			callback();
    		};
	    	scriptElem.onreadystatechange=function(){
	    		if ('loaded' == this.readyState) {
	    			scriptElem.onload();
	    		}
	    	}
	    };
	    scriptElem.setAttribute('src',src);
	    document.getElementsByTagName('head')[0].appendChild(scriptElem);
	},
/**
 * append multyline CSS text into CSS rules store
 */	
	appendCSSRules:function(text){
		/*@if (@_jscript_version >= 1)
		var cssreg=/([^{]+){([^}]+)}/g, res;
		while (res=cssreg.exec(text)) {
			document.styleSheets[0].addRule(res[1].replace(/^\s+|\s+$/g,''),res[2].replace(/^\s+|\s+$/g,''));
		}
		@else @*/
		var style = document.createElement('style');
	    style.type = 'text/css';
	    if (style.styleSheet) {
	    	style.styleSheet.cssText = ' '+text;
	    } else if (style.innerText == '') {
		    style.innerText = text;
		} else {
		    style.innerHTML = text;
		}
	    document.getElementsByTagName('head')[0].appendChild(style);
		/*@end @*/		
	},
	//<% point_finish('object_paths') %>
	nothing:''
};
