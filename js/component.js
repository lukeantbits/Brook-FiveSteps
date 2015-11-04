function component(siblings,index,$target,data,next_group,parent){
	var self = this;
	self.siblings = siblings
	self.parent = parent
	self.index = index
	self.$target = $target
	self.data = data
	self.locked = true
	self.input = false
	self.next_group = next_group
	$target.append('<div></div>')
	var $node = $($target[0].childNodes[index])
	if(self.data.type.indexOf('input')>-1){
		self.input = true
	}
	
	switch(self.data.type){
		case "title":
			$node.addClass('step_header').html('<strong>Step '+self.data.step+' </strong>'+self.data.data)
		break;
		case "text":
			$node.addClass('step_inner').html('<p>'+self.data.data+'</p>')
		break;
		case "numeric_input":
			self.data.obj = new inputNumeric($node,self)
		break;
		case "conditional_input":
			self.data.obj = new inputConditional($node,self)
		break;
		case "list_input":
			self.data.obj = new inputList($node,self)
		break;
		case "text_input":
			$node.addClass('step_inner').html('<textarea id="text_input_'+data.topic+'_'+data.step+'_'+self.index+'" disabled></textarea><a href="javascript:;" class = "step_btn">Next</a>')
			var $text_input = $('#text_input_'+data.topic+'_'+data.step+'_'+self.index)
			$text_input.on('keyup',function(event){
				if($text_input.val()!=''){
					$node.find('a').removeClass('not-active').on('click',function(event){
						self.data.user_text = $text_input.val()
						self.advance()
					})
				}
			})
			
			
		break;
		default:
			$node.addClass('step_inner').html(self.data.data)
		break;
	}
	/*if(self.data.example != ''){
		$node.prepend('<a href = "#example_'+self.data.topic+'_'+self.data.step+'_'+self.index+'" class = "example">Need an example?</a>')
		$node.find('.example').on('click',function(event){
			self.parent.showExample(event.target.hash)
			event.preventDefault();
		})
	}*/
	this.advance = function(){
		if(self.siblings.length>self.index+1){
			self.siblings[self.index+1].obj.unlock()
		}else{
			self.sectionComplete()
		}
		$('html, body').stop().delay(500).animate({scrollTop:$(document).height()}, 1000);
	}
	this.lock = function(){
		$node.css('opacity',0.3333)
		$node.find('a').addClass('not-active')
	}
	this.snapToHeight = function($target){
		var inner_height = 0
		$target.children().each(function(){
			inner_height = inner_height + $(this).outerHeight(true);
		});
		$target.animate({'height':inner_height},300,function(){
			$target.css('overflow','auto').css('height','auto')
		})
	}
	this.unlock = function(){
		if(self.locked){
			$node.fadeTo(300,1)
			self.snapToHeight($node)
			self.locked = false
			switch(self.data.type){
				case "text_input":
					$node.find('textarea').prop('disabled',false)
				break;
				default:
					$node.find('a').removeClass('not-active')
				break;
			}
			$node.find('.example').removeClass('not-active')
			if(!self.input){
				self.advance()
			}
		}
	}
	this.selectVal = function(val){
		//console.log(val)
	}
	this.sectionComplete = function(){
		if(self.next_group != undefined){
			self.next_group[0].obj.unlock()
		}
	}
	self.lock()
}