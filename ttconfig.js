(function() {

	if (typeof $ == "undefined"){
		document.write('<script src="http://cdn.bootcss.com/jquery/2.0.3/jquery.min.js"></script>');
	}
	if (typeof Mustache == "undefined"){
		document.write('<script src="http://cdn.bootcss.com/mustache.js/0.7.2/mustache.min.js"></script>');
	}
	if (typeof seajs == "undefined"){
		document.write('<script src="http://static.alipayobjects.com/seajs/??seajs/2.1.1/sea.js,seajs-combo/1.0.0/seajs-combo.js,seajs-style/1.0.0/seajs-style.js"></script>');
	}

	document.body.setAttribute("ng-app","");
	if (typeof angular == "undefined"){
		document.write('<script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.2.8/angular.min.js"></script>');
	}

	function c(argument) {
		seajs.config({
			base:"http://static.alipayobjects.com/",
			alias: {
				'$': 'jquery/jquery/1.10.1/jquery.js'
			}
		});
	}
	

	var num = 0;

	ttconfig({
		
		"auto":function(done) {
			var dom = $("body")[0];
			var actionlist = $("[tt]");
			var len = actionlist.length-1;
		
			actionlist.each(function() {
				if (this==dom){
					return;
				}
				
				tt(this,function() {
					len--;
					if (len==0){
						done();
					}
				});
			});

			seajs.use("http://cdn.bootcss.com/bootstrap/3.1.1/css/bootstrap.min.css");

			//seajs.use("https://a.alipayobjects.com/alice/one/1.1.0/one.css");

		},

		"tmpl/mustache":function(done,params) {
			var jdom = $(this);

			var tmplHtml = jdom.html();

			var src = jdom.attr("data-src");

			params = params||[];
			var data = params[0]||{};

			var html = Mustache.render(tmplHtml,data);
				
			var idarray = [];
			var newdom = $("<div>"+html+"</div>");
			newdom.first().children().each(function(index,dom) {
				dom = $(dom);
				if (dom.attr("tt")){
					var id = dom.attr("id");
					if (!id){
						id = ("tmpl"+(new Date()-Math.random())).replace(".","");
						dom.attr("id",id);
					}
					idarray.push(id);
				}
			});

			jdom.replaceWith(newdom.first().html());
				
			var num = 0; 
			if (idarray>0){
				for (var i=0;i<idarray.length;i++){
						
					tt($("#"+idarray[i])[0],function() {
						num++;
						if (num == idarray.length){
							done();
						}
					});
				}
			}
			else{
				done();
			}

		},
		"arale/select":function(done) {
		
			c();

			var dom = this;

			seajs.use("http://assets.spmjs.org/alice/select/1.0.2/select.css");
			
			seajs.use(['arale/select/0.9.8/select'], function(Select){
					
				done(new Select({
				    trigger: dom
				}).render());
			
			});

		},
		"arale/calendar":function(done) {
			
			c();

			var dom = this;

			seajs.use("arale/calendar/1.0.0/calendar.css");

			seajs.use(['arale/calendar/1.0.0/calendar'], function(Calendar){
					
				done(new Calendar({
					trigger:dom
				}));
			});

		},
		"arale/tip":function(done) {
			
			c();

			var dom = this;

			seajs.use(['arale/tip/1.2.1/tip'], function(Tip){
					
				done(new Tip({
					trigger:dom,
					content: dom.getAttribute("content"),
			        theme: 'white',
			        arrowPosition: 7,
			        effect: 'fade'	
				}));

			});

		},
		"arale/dialog":function(done) {
			
			c();

			var dom = this;

			seajs.use(['arale/dialog/1.2.5/dialog','https://a.alipayobjects.com/arale/dialog/1.2.5/dialog.css'], function(Dialog) {
			    done(new Dialog({
			        trigger: dom,
			        content: dom.getAttribute("content")
			    }));
			});

		},

		/*
		"arale/validator":function(done) {

			c();

			seajs.use(['arale/validator/0.9.6/validator', '$'], function(Validator, $) {
			    $(function() {
			        var validator = new Validator({
			            element: 'form'
			        });

			        validator.addItem({
			            element: '[name=username]',
			            required: true,
			            rule: 'email minlength{min:1} maxlength{max:20}'
			        })

			        .addItem({
			            element: '[name=password]',
			            required: true,
			            rule: 'minlength{min:5}'
			        })

			        .addItem({
			            element: '[name=password-confirmation]',
			            required: true,
			            rule: 'confirmation{target: "#password"}'
			        });
			    });
			});


		},
		*/

		"angular/input":function(done) {
			
			var controller = "controller"+(num++);
			
			window[controller] = function() {};


			$(this).attr("ng-controller",controller);


		

			$("input",$(this)).each(function(index,item) {
				$(item).attr("ng-model",$(item).attr("name"));
			})
			done();
		},


		"table/easytable":function(done,params) {

			params = params||[];
			var data = params[0]||{};
			
			var table = $(this).attr("table");

			var list = table.split(",");

			var th = [];
			var td = [];

			for (var i=0;i<list.length;i++){
				var array = list[i].match(/(.*?)\(\s*([^\s]*)\s*\)/);
				th.push("<th>",array[1],"</th>");
				td.push("<td>{{",array[2],"}}</td>");
			}
			th = th.join("");
			td = td.join("");

			var tpl = '\
				<table class="table table-striped table-hover" tt="table/list">\
			        <thead>\
			          <tr>\
			          	@th\
			          </tr>\
			        </thead>\
			        <tbody>\
			        	{{#list}}\
						<tr>\
							@td\
						</tr>\
						{{/list}}\
					</tbody>\
				</table>\
			'.replace("@th",th).replace("@td",td);
			
			

			var html = Mustache.render(tpl,{
				list:data.result.resultList
			});
		
			$(this).html(html);

		},

		"data/easydata":function(done) {
		
			var url = $(this).attr("url");
			$.get(url,function(data) {
				done(data);
			});

		},

	});

})();