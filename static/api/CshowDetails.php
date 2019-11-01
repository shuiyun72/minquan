<?php 
require_once('init.php');

$sql = "SELECT * FROM gu_shop " ;

$result = mysqli_query($conn,$sql);

$res = mysqli_fetch_all($result,MYSQLI_ASSOC);

echo json_encode($res,JSON_UNESCAPED_UNICODE);

?>