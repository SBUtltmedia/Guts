<?
$netID  = $_SERVER['cn'];
$path="data/$netID"; 
if (!file_exists($path)){
mkdir($path, 0777, true);
}

file_put_contents($path."/".time(),$_POST);


?>

