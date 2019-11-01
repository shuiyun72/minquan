<?php 
    require_once('init.php');
    $imgurl = $_REQUEST["name"];
    // $picpathCount = json_decode($imgurl,TRUE);
    
    // foreach ($picpathCount as $picpath) {
    // $base64_image = str_replace(' ', '+', $picpath);
    // post方式接收的数据, 加号会被替换为空格, 需要重新替换回来, 若不是post数据, 不需要执行
    // if (preg_match('/^(data:\s*image\/(\w+);base64,)/', $base64_image, $result)){


    //     //定义图片储存文件目录
    //     $dir = './toutiaopic/'.date('ymd');
    //     //定义文件名称
    //     $picname = date("his") . '_' . rand(10000, 99999);

    //     if (!is_dir($dir)){
    //         //如果不存在就创建该目录
    //         mkdir($dir,0777,true);
    //     }

    //     //获取图片后缀
    //     if($result[2] == 'jpeg'){
    //         $picdir=$picname.'.jpg';
    //     }else{
    //         $picdir=$picname.'.'.$result[2];
    //     }
    //     //图片名称
    //     $image_url = $dir.'/'.$picdir;
    //     //储存图片
    //     $img_url = '';//图片路径
    //     if (file_put_contents($image_url, base64_decode(str_replace($result[1], '', $base64_image)))){
    //         $img_url = $image_url;
    //     }  
    // }
    // }
    echo json_encode("{'code':0}")
?> 