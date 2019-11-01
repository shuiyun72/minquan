<?php
require_once('init.php');
$name = $_REQUEST["name"];
$code = $_REQUEST["code"];
$price = $_REQUEST["price"];
$count = $_REQUEST["count"];
$imgurl = $_REQUEST["imgurl"];
$picpathCount = json_decode($imgurl,TRUE);

//echo json_encode("{'code':$count}");

$urlIme = array();
foreach ($picpathCount as $picpath) {
    $base64_image = str_replace(' ', '+', $picpath);
    //post方式接收的数据, 加号会被替换为空格, 需要重新替换回来, 若不是post数据, 不需要执行
    if (preg_match('/^(data:\s*image\/(\w+);base64,)/', $base64_image, $result)){

        //定义图片储存文件目录
        $dir = 'img/'.date('ymd');
        //定义文件名称
        $picname = date("his") . '_' . rand(10000, 99999);

        if (!is_dir($dir)){
            //如果不存在就创建该目录
            mkdir($dir,0777,true);
        }

        //获取图片后缀
        if($result[2] == 'jpeg'){
            $picdir=$picname.'.jpg';
        }else{
            $picdir=$picname.'.'.$result[2];
        }
       
        //图片名称
        $image_url = $dir.'/'.$picdir;
        array_push($urlIme,$image_url);
        //储存图片
        $img_url = '';//图片路径
        if (file_put_contents($image_url, base64_decode(str_replace($result[1], '', $base64_image)))){
            $img_url = $image_url;
        }  
    }
}
   // echo json_encode(implode("|",$urlIme));	
    $lastUrl = implode("|",$urlIme);

$sql = "INSERT INTO gu_shop(name,code,price,count,imgurl) VALUES('$name','$code','$price','$count','$lastUrl')";

$result= mysqli_query($conn,$sql); 

$sql = "SELECT * from  gu_shop where  code = '$code'";
$result=mysqli_query($conn,$sql);
$row = mysqli_fetch_assoc($result);

if($row){
 	echo json_encode("{'code':'1','url':'true'}",JSON_UNESCAPED_UNICODE);
 }else{
 	echo json_encode("{'code':0}");
 }

?>