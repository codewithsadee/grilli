<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>


<?php 


[ $data, $error ] = getPictures();

if($error){
    echo "<p>$error</p>";

}else{


  

}

?>
    
</body>
</html>



<?php 
$url = 'http://localhost:3000/api/pics';


try {
    $xhr = curl_init($url);


    $response = curl_exec($xhr);


    if($response === false){
        throw new Exception(curl_error($xhr), curl_errno($xhr));
    }

} catch (\Throwable $th) {
    //throw $th;
}



function getPictures() : array{

    $data = null;
    $error = null;


    try{

        $url = 'http://localhost:8080/events';


        $ch = curl_init($url);

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPGET, true);

        $response = curl_exec($ch);

        if($response === false){
            $error = curl_error($ch);
            throw new Exception($error, curl_errno($ch));

        }

        curl_close($ch);



        $data = json_decode($response, true);

        


    } catch (\Throwable $th) {
        $error = $th->getMessage();


    }




    return [$data, $error];
}




if($error){
    echo $error;
}else{
    echo json_encode($data);
}




?>