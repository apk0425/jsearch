<?php
if (isset($_POST['submit'])) {
    $fp = fopen("js/database.js", "a");
    $add = 'jsearch.addItem("' . $_POST['titulo'] . '", "' . $_POST['link'] . '", "' . $_POST['desc'] . '");';
    fwrite($fp, $add . PHP_EOL);
    fclose($fp);

    $titulo = $_POST['titulo'];
    echo "<center><img src='http://www.michaelasher.com/ok.png'><br><br>";
    echo "Has a&ntilde;adido a <font color='darkblue'>$titulo</font> al buscador!<br><a href='agregar.php' title='volver'>Volver</a> | <a href='index.html' title='buscar'>Ir al buscador</a>";
    die;
}
?>
<!DOCTYPE html>
<head>
    <title>Agregar</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <link rel="stylesheet" type="text/css" href="css/style-add.css" />
</head>
<body>
    <div id="page-wrap">
        <div id="contact-area">
            <form action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post" />
                <label for="titulo">Titulo:</label>
                <input type="text" name="titulo" required="required" id="titulo"/>
                <label for="link">Link:</label>
                <input type="text" name="link" required="required" id="link"/>
                <label for="descripcion">Descripción:</label>
                <input type="text" name="desc" required="required" id="descripcion"/>
                <input type="submit" name="submit" value="Agregar" class="submit-button" />
            </form>
            <div style="clear: both;"></div>
        </div>
    </div>
</body>
</html>