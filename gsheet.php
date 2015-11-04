<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="viewport" id="mvp" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>GSheet updater</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-sheetrock/1.0.0/dist/sheetrock.min.js"></script>
</head>
<body>
<div id="output"></div>
<script language="javascript">
var key = '1KoPT2OqWoVeT7jq9kgNzAFYfxFp6wmtZEg6PWoSAmLY'
function IsJsonString(str) {
    try {
        var o = JSON.parse(str);
        if (o && typeof o === "object" && o !== null) {
            return o;
        }
    }
    catch (e) { }
    return false;
}
function sheetObj(key,target){
	var self = this
	self.target = target
	var savefile = 'jsheet_update.php?target='+target
	this.output = {}
	this.maps = {}
	this.queue = 0
	this.key = key
	$('body').append('<div id="dump" style="display:none;"></div>')
	//console.log(this)
	this.processSheet = function(map,sheet){
		self.queue+=1
		self.maps[sheet] = map
		if(map.style == 'array'){
			self.output[map.key] = []
		}else{
			self.output[map.key] = {}
		}
		$('#dump').sheetrock({
		  url: 'https://docs.google.com/spreadsheets/d/'+this.key+'/edit#gid='+sheet,
		  callback: self.parseSheet
		});
	}
	this.commit = function(){
		//console.log(self.output)
		$.ajax({
			url: savefile,
			type: 'POST',
			data: { json: JSON.stringify(self.output)},
			dataType: 'json',
			complete:function(data){
				$('#output').html('update status: '+data.responseText);
			}
		});
	}
	this.checkFormat = function(str){
		if(IsJsonString(str)){
			str = JSON.parse(str)
		}
		return str
	}
	this.parseSheet = function(error,options,response){
		$('#dump').html('')
		if(typeof response.rows == 'undefined'){
			
		}else{
			var map = self.maps[options.request.gid]
			var start = 0
			if(typeof map.start != 'undefined'){
				start = parseInt(map.start)
			}
			if(jQuery.isEmptyObject(self.output[map.key])){
				if(typeof map.columns != 'undefined'){
					for(var i = start;i<response.rows.length;i++){
						if(map.style == 'array'){
							var obj = {}
							var allow = true
							for(var j = 0;j<map.columns.length;j++){
								obj[map.columns[j].id] = self.checkFormat(response.rows[i].cellsArray[j])
								
								if(map.columns[j].required && response.rows[i].cellsArray[j] == ''){
									allow = false;
								}
							}
							if(allow){
								self.output[map.key].push(obj)
							}
						}else{
							if(map.columns.length==2){
								self.output[map.key][response.rows[i].cellsArray[0]]=response.rows[i].cellsArray[1]
							}else{
								var tmp = {}
								for(var j = 0;j<map.columns.length;j++){
									tmp[map.columns[j].id]= self.checkFormat(response.rows[i].cellsArray[j])
								}
								self.output[map.key][response.rows[i].cellsArray[0]]=tmp
							}
							
						}
					}
					console.log(map)
					if(map.nest != null){
						tmp = {}
						for(var i = 0;i<self.output[map.key].length;i++){
							tmp[self.output[map.key][i][map.nest]] = []
						}
						console.log(self.output[map.key])
						for(var i = 0;i<self.output[map.key].length;i++){
							if(map.neststyle == 'array'){
								tmp[self.output[map.key][i][map.nest]].push(self.output[map.key][i])
							}else{
								tmp[self.output[map.key][i][map.nest]] = [self.output[map.key][i]]
							}
							
						}
						self.output[map.key] = tmp
					
					}
				}else{
					self.output[map.key] = []
					var obj = {}
					for(var i = 1;i<map.rows.length;i++){
						obj[map.rows[i].id]=''
					}
					obj = JSON.stringify(obj)
					for(var j = 1;j<response.rows[0].cellsArray.length ;j++){
						self.output[map.key].push(JSON.parse(obj))
					}
					for(var i = 1;i<response.rows.length;i++){
						for(var j = 1;j<response.rows[i].cellsArray.length ;j++){
							self.output[map.key][j-1][response.rows[i].cellsArray[0]] =  self.checkFormat(response.rows[i].cellsArray[j])
						}
					}
				}
				self.queue-=1
				console.log(self.output)
				if(self.queue == 0){
					self.commit()
					//console.log('commit')
				}
			}
		}
	}
}

//862853845
var sheet_obj = new sheetObj('1fdqmcmG6a454JT1liG_vq3D46JmpbZz3aT2NgG4YIU8','data.json')
sheet_obj.processSheet({
	key:'topic',
	nest:null,
	style:'array',
	neststyle:'array',
	columns:[
		{'id':'id','required':true},
		{'id':'title','required':false}
	]
},0)
sheet_obj.processSheet({
	key:'text_areas',
	nest:'id',
	style:'array',
	neststyle:'object',
	columns:[
		{'id':'id','required':true},
		{'id':'body','required':false}
	]
},862853845)
sheet_obj.processSheet({
	key:'content',
	nest:'topic',
	style:'array',
	neststyle:'array',
	columns:[
		{'id':'topic','required':true},
		{'id':'step','required':true},
		{'id':'type','required':true},
		{'id':'data','required':false},
		{'id':'example_1','required':false},
		{'id':'example_2','required':false},
		{'id':'example_3','required':false},
		{'id':'example_4','required':false},
		{'id':'example_5','required':false},
		{'id':'example_6','required':false}
	]
},679744671)
</script>
</body>