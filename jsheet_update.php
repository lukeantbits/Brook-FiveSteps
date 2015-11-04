<?php
$status = "fail";
if(isset($_REQUEST['json']) && isset($_REQUEST['target'])){
	if(strlen($_REQUEST['json'])>0){
		$string = str_replace(array("\\r\\n","\\n"),array("",""),$_REQUEST['json']);
		$fp = fopen($_REQUEST['target'], 'w');
		fwrite($fp, $string);
		fclose($fp);
		$status = "success";
	}
}
echo $status;
?>