(function(){
	function app(){
		var self = this;
		var data_path = 'data.json';
		self.tab = 0;
		self.session_log = {'v':0,'id':'Brook-triage'}
		self.qstr = getUrlVars();
		$.getJSON(data_path,function(data){
			for(var obj in data.content){
				console.log(obj)
				data.content[obj] = self.nest(data.content[obj],'step')
			}
			self.data = data
			self.init()
		})
		if(typeof(self.qstr.syn_partner)!= 'undefined'){
			self.syn_partner = self.qstr.syn_partner
			if(self.syn_partner != ''){
				self.syndicated = true
			}
		}
		if(isMobile.any() && $(window).width()<800){
			/*loadjscssfile('css/brook_triage_mob.css','css')
			if(self.qstr.layout == 'mobile'){
			}*/
		}
		this.nest = function(data,key){
			var output = {}
			for(var i = 0;i<data.length;i++){
				if(typeof output[data[i][key]] == 'undefined'){
					output[data[i][key]] = []
				}
				output[data[i][key]].push(data[i])
			}
			return output;
		
		}
		this.switchTopic = function(id,unlock){
			$('#topic>div').hide()
			$(id).show()
			var index = parseInt(id.split('_')[1])+1
			if(unlock && self.data.content[index] != 'undefined'){
				self.data.content[index][1][0].obj.unlock()// unlock first element
			}
		}
		this.drawSteps = function($target,data,topic){
			if(data != undefined){
				for(var key in data){
					$target.append('<div class = "step_wrap" id = "step_'+topic+'_'+key+'"></div>')
					for(var sub_key in data[key]){
						data[key][sub_key].obj = new component(data[key],parseInt(sub_key),$('#step_'+topic+'_'+key),data[key][sub_key],data[parseInt(key)+1],self)
					}
				}
			}
		}
		this.showExample = function(str){
			$('#example').show().css('opacity',0).animate({'opacity':1},300)
			event.preventDefault()
			var tmp = str.split('_')
			$('#example>div').html(self.data.content[tmp[1]][tmp[2]][tmp[3]].example)
			
			$('#example').css('margin-top',(0-($('#example').height()/2))+'px')
			
		}
		this.hideExample = function(){
			$('#example').fadeOut(300)
			event.preventDefault()
			//console.log(str)
		}
		this.init = function(){
			// populate splash
			$('#header').append('<h1>'+self.data.text_areas.header[0]['body']+'</h1><p>'+self.data.text_areas.splash[0]['body']+'</p>')
			
			// populate nav
			for(var key in self.data.topic){
				$('#nav').append('<a href= "#topic_'+key+'"><div><div>'+self.data.topic[key].title+'</div></div></a>')
			}
			$('#nav a').on('click',function(event){
				event.preventDefault();
				$(this).addClass("current");
				$(this).siblings().removeClass("current");
				self.switchTopic($(this).attr("href"),true);
			})
			// populate topic areas
			for(var key in self.data.topic){
				$('#topic').append('<div id = "topic_'+key+'"></div>')
				self.drawSteps($('#topic_'+key),self.data.content[parseInt(key)+1],key)
			}
			self.switchTopic('#topic_0',false)
			$('#example .close').on('click',function(){
				self.hideExample()
			})
		}
	}
	new app()
})();