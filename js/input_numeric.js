function inputNumeric($node,parent_obj){
	var self = this;
	self.parent_obj = parent_obj
	var data = self.parent_obj.data.data
	$node.addClass('step_inner_numeric')
	var total = 0
	var output = '<div>'
	for(var key in data){
		total=data[key].bracket[1]	
		for(var i = data[key].bracket[0];i<=data[key].bracket[1];i++){
			output+= '<a class = "numeric" href="#numeric_'+i+'">'+i+'</a>'
		}
	}
	output+= '</div>'
	$node.append(output)
	$node.append('<div class = "numeric_tip"><div></div></div>')
	$node.find('.numeric').on('click',function(event){
		event.preventDefault();
		var val = parseInt(event.target.hash.split('_')[1])
		$node.find('.numeric').removeClass('selected')
		for(var key in data){
			if(val >= data[key].bracket[0] && val <= data[key].bracket[1]){
				$node.find('.numeric_tip').css('display','block').fadeTo(300,1)
				$node.find('.numeric_tip>div').html(data[key].body)
			}
		}
		self.parent_obj.snapToHeight($node)
		$(event.target).addClass('selected')
		self.parent_obj.advance()
	})
}