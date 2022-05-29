<?php

function showOnMap(int $x = 0, int $y = 0)
{
    clearstatcache();
    // Створюємо зображення з файлу
    $image = imagecreatefromjpeg('./imgs/map/map.jpg');

    // Колір
    $ellipseColor = imagecolorallocate($image, 255, 0, 0);

    // Малюємо
    imagefilledellipse($image, $x, $y, 30, 30, $ellipseColor);

    // Зберігаємо
    global $resultPath;
    imagejpeg($image, "./imgs/map/map_marker.jpg");
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $crumaTower = $_POST['cruma'] ?? null;
    $townOfGiran = $_POST['giran'] ?? null;
    $irisLake = $_POST['iris'] ?? null;

    $cx = intval($_POST['cx'] ?? 0);
    $cy = intval($_POST['cy'] ?? 0);

    if (isset($crumaTower)) {
        showOnMap(1720, 1870);
    } else if (isset($townOfGiran)) {
        showOnMap(2040, 2040);
    } else if (isset($irisLake)) {
        showOnMap(1860, 1700);
    } else if (isset($cx) && isset($cy)) {
        showOnMap($cx, $cy);
    }
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>МАПА ЄБОБАНА</title>
    <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/photoswipe/4.1.1/photoswipe.min.css'>
    <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/photoswipe/4.1.1/default-skin/default-skin.min.css'>

</head>

<body>

    <center>
        <h1>МАПА ЄБОБАНА</h1>
        <form method="post">
            <button name="cruma">Cruma Tower</button>
            <button name="giran">Town Of Giran</button>
            <button name="iris">Iris Lake</button>

        </form>
        <br>
        <form action="" method="post">
            <input type="number" name="cx" min="0" max="3276" placeholder="x: 0-3276">
            <input type="number" name="cy" min="0" max="2620" placeholder="y: 0-2620">
            <button name="custom">Custom Coordinates</button>
        </form>
        <br>
        <img src="./imgs/map/map_marker.jpg?timestamp=1357571065" height="800" width="1000" onclick="openPhotoSwipe();">
    </center>


    <div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">

        <div class="pswp__bg"></div>
        <div class="pswp__scroll-wrap">

            <div class="pswp__container">
                <div class="pswp__item"></div>
                <div class="pswp__item"></div>
                <div class="pswp__item"></div>
            </div>

            <div class="pswp__ui pswp__ui--hidden">

                <div class="pswp__top-bar">

                    <div class="pswp__counter"></div>
                    <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>
                    <button class="pswp__button pswp__button--share" title="Share"></button>
                    <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>
                    <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>

                    <div class="pswp__preloader">
                        <div class="pswp__preloader__icn">
                            <div class="pswp__preloader__cut">
                                <div class="pswp__preloader__donut"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
                    <div class="pswp__share-tooltip"></div>
                </div>

                <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)">
                </button>

                <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)">
                </button>

                <div class="pswp__caption">
                    <div class="pswp__caption__center"></div>
                </div>

            </div>

        </div>

    </div>
    <script src='https://cdnjs.cloudflare.com/ajax/libs/photoswipe/4.1.1/photoswipe.min.js'></script>
    <script src='https://cdnjs.cloudflare.com/ajax/libs/photoswipe/4.1.1/photoswipe-ui-default.min.js'></script>
    <script src="./src/script.js"></script>

</body>

</html>