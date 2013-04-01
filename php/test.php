<?php

error_reporting(0);
$files = array();
$dir = "../files/";

function listFolderFiles($dir) {
    global $files;
    global $current;
    $ffs = scandir($dir);
    foreach ($ffs as $ff) {
        if ($ff != '.' && $ff != '..') {
            if (is_dir($dir . $ff)) {
                listFolderFiles($dir . $ff . '/');
            } else {
                $fileLink = $dir . $ff;
                $obj = array(
                    "fileLink" => $fileLink
                );
                array_push($files, $obj);
            }
        }
    }
    print json_encode($files);
}

listFolderFiles($dir);
?>
