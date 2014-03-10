define([
	
    'backbone'
	
], function() {
	
	var Grid = Backbone.View.extend({
		
		elms: {
			item: '.chess-grid-item',
			image: '.chess-grid-image'
		},
		
		options: {},
		
		initialize: function(){
			var self = this;
			
			self.parseOptions();

			if (! self.options.columns) self.options.columns = 2;
			if (! self.options.margin) self.options.margin = 0;
			
			// Render grid
			self.renderGrid();

            if (true == ('onorientationchange' in window)) {
                $(window).on('orientationchange.chess-grid', function() {
					self.resizeGrid();               
                }).trigger('orientationchange.chess-grid');
            }            
            else {
                $(window).on('resize.chess-grid', function() {
					self.resizeGrid();             
                }).trigger('resize.chess-grid');   
            }			
			
			
		},
		
		parseOptions: function() {
			var self = this;
			var data = this.$el.data() || {};
			
			$.each(data, function(name, value) {
				if (data.hasOwnProperty(name)) {
					self.options[name] = value;
				}
			});
			return this;
		},		
		
		renderGrid: function() {
			var self = this;
			var counter = 0;
			var widthItem = Math.round((self.$el.width() - (self.options.columns * 2 - 1) * self.options.margin) / self.options.columns / 2);
			// Set width for items
			self.$el.find(self.elms.item).each(function() {
				var type = $(this).data('type');
				switch (type) {
					case '2x1':
						$(this).width(widthItem * 2 + self.options.margin).height(widthItem);	
						break;
					case '2x2':
						$(this).width(widthItem * 2 + self.options.margin).height(widthItem * 2 + self.options.margin);	
						break;	
					case 'nx2':
						$(this).width('100%').height(widthItem * 2 + self.options.margin);	
						break;												
				}
			});
			// Mark last item in row
			var top = 0;	
			var index = 0;
			
			self.$el.find(self.elms.item).each(function() {
				index = $(this).index();
				if ($(this).position().top != top) {
					top = $(this).position().top;
					self.$el.find(self.elms.item).eq(index - 1).addClass('last');
				}
			});	
			self.$el.find(self.elms.item).eq(index).addClass('last');
			
			if (self.options.textPosition == 'auto') {
				flag = true;
				// Auto text position
				self.$el.find(self.elms.item).each(function() {
					if ($(this).is('.text-hover') == false) {
				
					$(this).removeClass('text-left text-right');
					if (flag == true)
						$(this).addClass('text-left');
					else
						$(this).addClass('text-right');
					if ($(this).is('.last'))
						flag = !flag;
					}
				});	
			}
			
			// Set bottom margin
			if (self.options.margin > 0) {
				self.$el.find(self.elms.item).css({'marginBottom': self.options.margin});			
			}		
		},
		
		resizeGrid: function() {
			var self = this;
			var widthItem = Math.round((self.$el.width() - (self.options.columns * 2 - 1) * self.options.margin) / self.options.columns / 2);
			var rowWidth = (widthItem * self.options.columns * 2) + ((self.options.columns * 2 - 1) * self.options.margin);
			var deltaLast = rowWidth - self.$el.width();

			
			self.$el.find(self.elms.item).each(function() {
				var type = $(this).data('type');
				var last = $(this).is('.last');

				var rate = $(this).data('rate');
					rate = (rate == undefined) ? 1 * widthItem : rate * widthItem;
				
				switch (type) {
					case '2x1':
						$(this).width(widthItem * 2 + self.options.margin).height(widthItem);
						if (last == true)	
							$(this).width($(this).width() - deltaLast);
						break;
					case '2x2':
						$(this).width(widthItem * 2 + self.options.margin).height(widthItem * 2 + self.options.margin);	
						if (last == true)	
							$(this).width($(this).width() - deltaLast);						
						break;	
					case 'nx2':
						$(this).width('100%').height(widthItem * 2 + self.options.margin);	
						break;												
				}
				if (last == false && self.options.margin > 0) {
					$(this).css({'marginRight': self.options.margin});			
				}
				
				
					
				if ($(this).is('.text-left')) {
					$(this).find('.chess-grid-text').width(rate);
					$(this).find('.chess-grid-image').css('marginLeft', rate);
				}
				if ($(this).is('.text-right')) {
					var w = $(this).width() - rate;
					$(this).find('.chess-grid-text').width(w);
					$(this).find('.chess-grid-image').css('marginRight', w);
				}			
				
				//self.setImageSize($(this).find('.chess-grid-image img'));
				

			});		
		},
		
        setImageSize: function(img) {
			
            var imageWidth = parseInt($(img).attr('data-width'));
            var imageHeight = parseInt($(img).attr('data-height'));
            var imageRate = imageWidth / imageHeight;
            
            $(img).data('imageRate', imageRate).addClass(imageRate >= 1 ? 'w' : 'h');			
			
			
			
            $(img).css({'marginTop':0,'marginLeft':0});
            
            var wi = $(img).width();
            var ww = $(img).parent().width();
            
            if (wi != ww) {
                var align = $(img).attr('data-align');
                switch (align) {
                    case 'left': align = 0; break;
                    case 'right': align = ww - wi; break;
                    default:
                        align = parseInt((ww - wi) / 2);
                }
                $(img).css('marginLeft',align + 'px');

            }
            var hi = $(img).height();
            var hw = $(img).parent().height();

            if (hi != hw) {
                $(img).css('marginTop',parseInt((hw - hi) / 2) + 'px');  
            }                           
        },		
		
		render: function() {
			return this;
		}
		
	});
	
	return Grid;
});
