/*<%=point('readme','comment')%>*/
/*@cc_on @*/
(function(){
/**
 *   current mouse coordinates
 */
var cursor= {x:-1,y:0}; // 
/**
 *  new fly object! one canvas with fly 
 */
function the_fly(param){
	/**
	 * time to live in this state.
	 */
	this._cnt=1;
    /**
	 * fly state
	 */
	this.state='hidden';
	/**
	 * top-left corner of the canvas
	 */
	this.coord={x:200,y:100};
	/**
	 * fly speed
	 */
	this.speed=0;
	/**
	 * fly angle
	 */
	this.angle=0;
	/**
	 * canvas element
	 */
	fly=document.createElement('canvas');
	fly.className='fly';
	fly.setAttribute('width','<%=$cWidth%>');
	fly.setAttribute('height','<%=$cHeight%>');
	this.element=document.body.appendChild(fly);
	/*@if (@_jscript_version >= 1)
    	G_vmlCanvasManager.initElement(this.element);
	@end @*/	
	/**
	 * update new object with parameters
	 */
	if(param)for(a in param){
		this[a]=param[a];
	}
	/**
	 * current frame to show in canvas
	 */
	this.kadr=0;
	/**
	 * intaerface function - done all work  
	 */
	this.done=function(){
	/**
	 * just to clear something any case
	 */
		this.element=null;
	};
	/**
	 * distance calculation
	 */
	this.dist=function(cursor){
		var dx=cursor.x-<%=$cWidth/2%>-this.coord.x, 
			dy=-cursor.y+this.coord.y+<%=$cWidth/2%>,
			dd=Math.sqrt(dx*dx+dy*dy);
		return dd;
	};
	/**
	 * let fly to look at cursor
	 */
	this.lookat=function(cursor){
		if(cursor.x!=-1){
	    	var dx=cursor.x-<%=$cWidth/2%>-this.coord.x, dy=-cursor.y+this.coord.y+<%=$cWidth/2%>;
	    	var dd=Math.sqrt(dx*dx+dy*dy);
	    	if(dd>0.001){ // защита от деления на ноль
	    		this.angle=Math.acos(dx/dd); if (dy<0) this.angle=-this.angle;
	    	}
		}
	};
	/**
	 * automation states
	 */
	var fly_states=['stay','walk' ,'fly']; // ,'hidden' state
	/**
	 * just do next step, if you need to forcely change the state - call him with parameter
	 */
	this.nextstep=function(state){
		if (this._cnt>0 && !state) {
			this._cnt--;
		} else {
			this.state=0;
		}
		switch (this.state){
		case 'stay': // just stay and look
			this.lookat(cursor);
			this.kadr=0;
			break;
		case 'walk': // work directly 
			this.coord.x+=Math.cos(this.angle)*this.speed;
			this.coord.y-=Math.sin(this.angle)*this.speed;
			this.kadr=this._cnt & 3;
			break;
		case 'fly': // flu directly
			this.coord.x+=Math.cos(this.angle)*this.speed;
			this.coord.y-=Math.sin(this.angle)*this.speed;
			this.kadr=4;
			break;
		case 'hidden':
			this.coord.x=Math.ceil(Math.random()*engine.window.x+engine.scroll.x);
 			this.coord.y=Math.ceil(Math.random()*engine.window.y+engine.scroll.y);
 		//	engine.debug('coord:'+this.coord.x+' '+this.coord.y+' scroll:'+engine.scroll.x+' '+engine.scroll.y);
	 	default: // last state is stopped - so change a new one
	 		this.state=state || fly_states[Math.floor(Math.random()*fly_states.length)];
	 		this._cnt=Math.round(30+Math.random(30));
	 		this.kadr=0;
			switch(this.state){
	 		case 'walk':
	 			this.speed=6;
	 			this.lookat({x:Math.random()*engine.window.x+engine.scroll.x
	 				,y:Math.random()*engine.window.y+engine.scroll.y});
	 			break;
	 		case 'fly':
	 			this.speed=50;
	 			this._cnt-=20;
	 			this.kadr=4;
	 			this.lookat({x:Math.random()*engine.window.x+engine.scroll.x
	 				,y:Math.random()*engine.window.y+engine.scroll.y});
	 			break;
	 		default:
	 			this.speed=0;
	 		}
		}	
	};
	/**
	 * to draw a fly
	 */
	this.draw=function(){
		if(this.element && this.element.getContext){
			this.element.style.top=this.coord.y+'px';
			this.element.style.left=this.coord.x+'px';
				
			var ctx = this.element.getContext('2d');
			ctx.fillStyle = "rgba(255,255,255,0)";
			ctx.clearRect(<%=-$cWidth%>,<%=-$cHeight%>,<%=2*$cWidth%>,<%=2*$cHeight%>);
			ctx.lineWidth = 1.0; 
			var _img=document.getElementById('fly_01');
			try{	 
				if(typeof(_img.complete)=='undefined' || _img.complete){
					ctx.save();
					ctx.translate(<%=$cWidth/2%>,<%=$cHeight/2%>);
					ctx.rotate(<%=$fAngle%>-this.angle);
					ctx.drawImage(_img
				  		,0,this.kadr*<%=$fFHeight%>,<%=$fWidth%>,<%=$fHeight%>
				  		,<%=(-$cWidth-$fWidth)/2 +$cWidth/2%>,<%=(-$cWidth-$fHeight)/2 +$cHeight/2%>,<%=$fWidth%>,<%=$fHeight%>);
					ctx.restore();  
				}
			} catch(e){
				//engine.debug('1'+e.toString());
			}
			
			/**
			 * if fly is too close with cursor - fly away
			 */
			if(60>this.dist(cursor) && this.state!='fly'){
				this.nextstep('fly');
			} else
				this.nextstep();
		}		
	}
};	

/**
 * just an engine
 */	
var engine={
	/**
	 * dirty and fast window screen calculation
	 */
	scroll:{x:0,y:0},	
	calc_Bounds:function() {
	  //  var padd = 20; // donow truly, but it's work :) mb possible scroller size?
	    engine.window={
	    	x:document.compatMode=='CSS1Compat' && !window.opera?document.documentElement.clientWidth:document.body.clientWidth,
	    	y:document.compatMode=='CSS1Compat' && !window.opera?document.documentElement.clientHeight:document.body.clientHeight		
	    };

	    //Размер документа по горизонтали
	    engine.scroll={x:(document.documentElement && document.documentElement.scrollLeft) 
	            		|| (document.body && document.body.scrollLeft),
	    	           y:(document.documentElement && document.documentElement.scrollTop) || (document.body && document.body.scrollTop) 
	   			};
	},
/*<%=point ('object_paths'); %>*/
	objects:[],
	add:function(elem){
		this.objects.push(elem);
	},
	init_fly:function(){
	    this.add(new the_fly());
	    this.add(new the_fly());
	    this.add(new the_fly());
	    this.add(new the_fly());
	    this.add(new the_fly());
	    this.add(new the_fly());
	    this.add(new the_fly());
	    this.add(new the_fly());
	},
	init:function(){
		this.add_event(window,'load',function(){
		/*@if (@_jscript_version >= 1)
		engine.appendScript('<%=$excanvas%>',function(){engine.excanvas_complete=true;});
		/*@end @*/	
			engine.appendCSSRules("<%=point('fly_css','css2js')%>");
			var fly=document.createElement('div');
			fly.setAttribute('id', 'fly_prepare');
		    fly.innerHTML="<%=point('prepare','html2js')%>";
		    document.body.appendChild(fly);
		    
		/*@if (@_jscript_version >= 1)
		    function xxx(){
		      if(engine.excanvas_complete && G_vmlCanvasManager){
		        if (!document.namespaces || !document.namespaces['g_vml_']){
		            G_vmlCanvasManager.init_(document);
		        } 
		        engine.calc_Bounds();
		        engine.init_fly();
			  }
			  else
			    setTimeout(xxx,100);
		    }
			setTimeout(xxx,100);
		@else @*/
		    setTimeout(function(){engine.calc_Bounds();engine.init_fly()},100);
		/*@end @*/
		    engine.draw();
		});
	    this.add_event(window,'unload');
	    this.add_event(this.mousetgt,'mousemove',
            function (e) {
            	cursor.x=e.clientX+(engine.scroll.x||0);
            	cursor.y=e.clientY+(engine.scroll.y||0);
            });
        this.add_event(window,'resize',this.calc_Bounds);
        this.add_event(window,'scroll',this.calc_Bounds);
        
		this._drawto=setInterval(this.draw,50);
	},
	/**
	 * unload function - call all done destructors and cleanup event handlers
	 */
	unload:function(){
		if(engine._drawto) clearInterval(engine._drawto);
		if (engine.objects)
		for(var i=0;i<engine.objects.length;i++){
			engine.objects[i].done();
			engine.objects[i]=null;
		}
		for(var i in engine._handlers)
			engine.clear_events(i);
	},
	/**
	 * united draw funtion
	 */
	draw: function()
    {
		for(var i=0;i<engine.objects.length;i++){
			engine.objects[i].draw();
		}
    }
};
engine.init();
})()
