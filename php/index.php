<?php

$dir = '../files/'; //define your folder to search, for default is files
$files1 = scandir($dir);
$ele = array();
$total = count((array) $files1);
$url = $_SERVER['HTTPS'] == 'on' ? 'https://' : 'http://';
$url .= $_SERVER['SERVER_PORT'] != '80' ? $_SERVER["SERVER_NAME"] . ":" . $_SERVER["SERVER_PORT"] . $_SERVER["REQUEST_URI"] : $_SERVER['SERVER_NAME'];

function file_get_contents_curl($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);

    $data = curl_exec($ch);
    curl_close($ch);

    return $data;
}

foreach ($files1 as $key => $value) {
    $html = file_get_contents_curl($url . "/jsearch/files/" . $value);
    $doc = new DOMDocument();
    @$doc->loadHTML($html);
    $nodes = $doc->getElementsByTagName('title');

    $title = $nodes->item(0)->nodeValue;

    $metas = $doc->getElementsByTagName('meta');

    for ($i = 0; $i < $metas->length; $i++) {
        $meta = $metas->item($i);
        if ($meta->getAttribute('name') == 'description')
            $description = $meta->getAttribute('content');
        if ($meta->getAttribute('name') == 'keywords')
            $keywords = $meta->getAttribute('content');
    }
    $t = substr(strrchr($value, '.'), 1);
    if ($t) {
        $file = $url . "/jsearch/files/" . $value;
        if (strtolower(substr($file, stripos($file, ".htm"))) == ".htm" || strtolower(substr($file, stripos($file, ".html"))) == ".html" || strtolower(substr($file, stripos($file, ".asp"))) == ".asp" || strtolower(substr($file, stripos($file, ".php"))) == ".php") {
            $obj = array(
                "title" => $title,
                "link" => $file,
                "description" => $keywords
            );
            array_push($ele, $obj);
        } else {
            $obj = array(
                "title" => $value,
                "link" => $file,
                "description" => "image"
            );
            array_push($ele, $obj);
        }
    }

    if ($total - 1 === $key) {
        print json_encode($ele);
    }
}
?>