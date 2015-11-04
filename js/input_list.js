function inputList($node,parent_obj){
	var self = this;
	self.parent_obj = parent_obj
	console.log(self.parent_obj)
	var data = self.parent_obj.data.data
	var output = ''
	self.list = ['']
	$node.addClass('step_inner')
	output+='<div class = "list_wrapper"></div>'
	output+='<a href = "#" class = "add_list_item step_btn">Add list item...</a>'
	output+='<a href = "#" class = "step_btn next">Next</a>'
	$node.append(output)
	
	self.addItem = function(){
		$node.find('.list_wrapper').append('<div class= "list_item"><div><input type="text"></div><a href = "#"></a></div>')
		var tmp  = $($node.find('.list_wrapper')[0].lastChild)
		tmp.hide().fadeIn(300)
		$node.find('.list_wrapper input').on('keyup',function(){$node.find('.next').fadeIn(300)})
	//
	}
	self.removeItem = function(target){
		if($node.find('.list_item').length>1){
			$(target)[0].parentNode.remove()
		}
	}
	$node.find('.add_list_item').on('click',function(event){
		event.preventDefault()
		self.addItem();
		self.parent_obj.snapToHeight($node)
		$node.find('.list_wrapper a').on('click',function(event){
			event.preventDefault()
			self.removeItem(event.target)
		})
	})
	$node.find('.next').on('click',function(event){
		self.parent_obj.advance()
		event.preventDefault()
	}).fadeOut(0)
	self.addItem();
}