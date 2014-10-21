<?php
if(isset($_GET["name"]))
{
	$name = $_GET["name"];
}
if(isset($_GET["score"]))
{
	$score = $_GET["score"];
}

$json = file_get_contents("score.json");

$parsed_json = json_decode($json);

print_r($parsed_json);

$parsed_json->$name = $score;

print_r($parsed_json);

$scoreJsonEncoded = json_encode($parsed_json);
print_r($scoreJsonEncoded);

$emptyFile = fopen('score.json',"w");
ftruncate($emptyFile,0);
fclose($emptyFile);

if(!$fillFile = fopen('score.json', 'a')){
	exit;
} else {
	fwrite($fillFile, $scoreJsonEncoded);
	fclose($fillFile);
}
?>