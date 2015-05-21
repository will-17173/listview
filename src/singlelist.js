define(function(require, exports, module) {
	var $ = require('$'),
		Widget = require('widget'),
		Spinner = require('spin'),
		Core = require('./core');

	var SingleList = Core.extend({
		defaults: {
			template: require('./list.handlebars')
		},
		setup: function(){
			var self = this;
			if(self.option('usePresetDom')){

				self.option('autoload') ? $('<div class="spin"></div><ul></ul><a class="more loading" href="javascript:;" style="display:none;"><span class="loading-txt">LOADING</span></a>').appendTo(self.element) : $('<div class="spin"></div><ul class="zt-list"></ul><a class="more btn-more" href="javascript:;" style="display:none;"><span class="txt">加载更多</span><span class="loading-txt">加载中...</span></a>').appendTo(self.element);
				
				self.$more = self.element.find('.more');
				self.eventHandler();
			}
			SingleList.superclass.setup.apply(self);
		},
		eventHandler: function(){
			var self = this;
			var autoload = self.option('autoload');

			if(autoload){
		        $(window).on('scroll', function(){
		        	var top = document.documentElement.scrollTop + document.body.scrollTop;
		        	var documentHeight = $(document).height();
		        	if (documentHeight - top - $(window).height() <= self.option('threshold') && self.state == 'NORMAL') {
		        		self.page += 1;
		        		self.getData();
		        	}
		        })
			} else{
				self.$more.on('click', function(){
					if(self.state == 'NORMAL'){
						self.page += 1;
						self.getData();
					}
				});
			}
		},
		beforeSend: function(){
			var self = this;
            if(self.page == 1){
            	var target = self.element.find('.spin')[0];
            	var spinner = new Spinner().spin(target);
            } else{
	            if(self.option('autoload')){
	            	self.$more.show();
	            } else{
	            	self.$more.addClass('loading');
	            }
            }
		},
		parseData: function(data){
			var self = this;
			var autoload = self.option('autoload');

			self.page == 1 && self.element.find('.spin').hide().html('');

			if(self.option('usePresetDom')){

		        $(self.option('template')(data)).appendTo(self.element.find('ul'));

		        if(autoload){
		        	self.$more.hide();
		        } else{
		        	self.$more.removeClass('loading');
		        }

		        if(self.page * self.pageSize >= self.total){
		        	!autoload && self.$more.hide();
		        } else{
		        	autoload ? self.$more.hide() : self.$more.show();
		        }

			} else{

			}


	        if ($.isFunction(self.option('callback'))) {
	          self.option('callback').call(self);
	        }

	        // 已显示全部列表
	        if(self.page * self.option('pageSize') >= self.total){
	        	$(window).off('scroll');
	        	self.$more.remove(); 
	        }		


		}
	})

	module.exports = SingleList;

});