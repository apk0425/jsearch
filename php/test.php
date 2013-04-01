<?php

error_reporting(0);
$files = array();
$dir = "../files/";
$url = $_SERVER['HTTPS'] == 'on' ? 'https://' : 'http://';
$url .= $_SERVER['SERVER_PORT'] != '80' ? $_SERVER["SERVER_NAME"] . ":" . $_SERVER["SERVER_PORT"] . $_SERVER["REQUEST_URI"] : $_SERVER['SERVER_NAME'] . $_SERVER['REQUEST_URI'];
$urlPath = explode("php/", $url);

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

function listFolderFiles($dir) {
    global $files;
    global $urlPath;
    $ffs = scandir($dir);
    foreach ($ffs as $ff) {
        if ($ff != '.' && $ff != '..' && $ff != ".DS_Store") {
            if (is_dir($dir . $ff)) {
                listFolderFiles($dir . $ff . '/');
            } else {
                $fileSplode = explode("../", $dir);
                $file = $urlPath[0] . $fileSplode[1] . $ff;

                $html = file_get_contents_curl($urlPath[0] . $fileSplode[1] . $ff);
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

                if (strtolower(substr($file, stripos($file, ".htm"))) == ".htm" || strtolower(substr($file, stripos($file, ".html"))) == ".html" || strtolower(substr($file, stripos($file, ".asp"))) == ".asp" || strtolower(substr($file, stripos($file, ".php"))) == ".php") {
                    $obj = array(
                        "title" => $title,
                        "link" => $file,
                        "description" => $description,
                        "claves" => $keywords
                    );
                    array_push($files, $obj);
                } else {
                    $obj = array(
                        "title" => $ff,
                        "link" => $file,
                        "description" => "",
                        "claves" => ""
                    );
                    array_push($files, $obj);
                }
            }
        }
    }
}

listFolderFiles($dir);
print json_encode($files);
?>
