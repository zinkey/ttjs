/*  
 *	ttjs 0.x
 *	 
 *	-_- by yaya
 * 
 */
;(function() {

	var map = {};

    function complete(keyarray,dom,index,params) {
       
        index = index || 0;
        params = params || [];

        var key = keyarray[index];
        var fn = map[key];
        
        if (!fn){
            return;
        }

        fn.call(dom,function(){
                    
            var obj = dom.stateMap = dom.stateMap || {
                load:false,
                callback:[],
                params:[]
            };

            obj.params.push([].slice.call(arguments));

            if (index==keyarray.length-1){
               
                obj.load = true;

                var array = obj.params;
                if (array.length==1){
                    array = array[0];
                }

                for(var i=0;i<obj.callback.length;i++){
                    obj.callback[i].apply({
                        node:dom                        
                    },array);
                }
            }
            else{
                complete(keyarray,dom,index+1,[].slice.call(arguments));

            }

        },params);

    }

    function tt(dom,callback) {
       
        var array;
        if (dom instanceof Array){
            array = dom;
        }
        else{
            array = [dom];
        }
        var len = array.length;
    	
    	for (var i=0;i<len;i++){
    		var dom = array[i];
    		var obj = dom.stateMap;
    		if (obj){
                if (callback){
        			
        			if (obj.load){
                        var array = obj.params;
                        if (array.length==1){
                            array = array[0];
                        }
        				callback.apply({
                            node:dom
                        },array);
        			}
                    else{
                        obj.callback.push(callback);
                    }
                }
    			continue;
    		}
    		
    		dom.stateMap = {
                load:false,
                callback:callback?[callback]:[],
                params:[]
            };

    		var keys = dom.getAttribute("tt");
            if (keys){
                complete(keys.split(","),dom);
            }            
    	}
    }

    function ttconfig(value) {
    	for (var i in value){
			map[i] = value[i];
		}
    }

    window.tt = tt;
    window.ttconfig = ttconfig;

})(); 