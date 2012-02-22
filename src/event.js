/* 
 * ------------------module: events
 *  self-made event-handler for using width self-made objects
 */

var $ev={
/* <% point_start('object_paths') %>*/
/**
 *  here is a self-made event handling
 */
		_handlers:{},
		_curhandle:'0',
		set:function(x){if(!x)x='0';this._curhandle=x;return this;},
		$:function(id){
			return (typeof id=='string')?document.getElementById(id):id;
		},
		add_event: function(a,e,o,c,d){
			if(!a)return this;
			if (e instanceof Array) {
				for (var i in e)
					this.add_event(a, e[i], o);
				return this;
			}
			if(!o)o=this[e];
			if(!o)return null;
			var fn=o;
			if(!fn.__binded){
				fn=function(e){
					return o.call(a,e||window.event,c,d);
				};
			}
			fn.__binded=true;
			if (a.addEventListener)
				a.addEventListener(e,fn,false);
			else if (a.attachEvent) {
				try {
					a.attachEvent( e='on'+e, fn);
				} catch (aEx) {}
			}
			var ind=this._curhandle,h=this._handlers;
			if(!h[ind])h[ind]=[];
			h[ind].push({a:a,e:e,o:fn});
			return this;
		},
		/**
		 * 
		 */
		clear_events:function(ind) {
			var h,o,hh=this._handlers[ind||0];
			if(hh){
				while(h=hh.pop()){
					if (h.a.removeEventListener) {
						h.a.removeEventListener(h.e, h.o, false);
					} else if (o=h.a.detachEvent) {
						try {
							o( /*'on'   */ h.e, h.o);
						} catch (aEx) {}
					}
				}
			}
			return this;
		},
		/**
		 * 
		 */
		mousetgt : (window.execScript || window.opera)?document:window,

		/**
		 * 
		 */
		clearEv:function(e){
			if (e.preventDefault) e.preventDefault();
			e.cancelBubble = true;
			if(e.stopPropagation) e.stopPropagation();
			return (e.returnValue = false);
		},
		/*<% point_finish('object_paths') %>*/
		nothing:''
};

