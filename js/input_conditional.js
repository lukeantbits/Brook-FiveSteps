function inputConditional($node,parent_obj){
	var self = this;
	self.parent_obj = parent_obj
	var data = self.parent_obj.data.data
	$node.addClass('step_inner')
	var total = 0
	var output = '<div>'
	output += '<div class = "conditional_wrap">'
	for(var key in data){
		output+='<a href = "#'+key+'"><div>'+key+'</div><div class = "selected_pointer"></div></a>'
	}
	output += '</div>'
	output += '<div class = "response_wrap">'
	output += '</div>'
	output += '</div>'
	$node.append(output)
	$node.find('.conditional_wrap>a').on('click',function(event){
		$($(event.target)[0].parentNode).addClass('selected')
		$node.find('.conditional_wrap>a').off('click')
		self.createResponse($(event.target).html())
	})
	self.createResponse = function(id){
		var $target = $node.find('.response_wrap')
		var output = ''
		switch(data[id].response_type){
			case 'text_input':
				$target.append('<p>'+data[id].response_text+'</p><textarea id="text_input_'+self.parent_obj.data.topic+'_'+self.parent_obj.data.step+'_'+self.parent_obj.index+'"></textarea><a href="javascript:;" class = "step_btn not-active">Next</a>')
				self.parent_obj.snapToHeight($target)
				$target.find('textarea').on('keyup',function(event){
					if($(event.target).val()!=''){
						$target.find('a').removeClass('not-active').on('click',function(event){
							self.parent_obj.advance()
						})
					}
				})
			break;
		}
	
	}
}