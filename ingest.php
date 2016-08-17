<?
$netID  = $_SERVER['cn'];
$path="data/$netID"; 

if(!empty($_POST)){
	if (!file_exists($path)){
		mkdir($path, 0777, true);
	}
    file_put_contents($path.".json",$_POST);
}
else{
	if (!file_exists($path)){
		throw new Exception('file does not exist');
	}
    print(file_get_contents($path.".json"));
}
?>
