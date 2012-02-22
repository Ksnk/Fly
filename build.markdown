##чтобы собрать проект

Чтобы собрать проект вам понадобится

* проект `preprocessor` - https://github.com/Ksnk/preprocessor
* утилита `YUICompressor` - http://developer.yahoo.com/yui/compressor/

## использование батника make.bat

Необходимо откорректирвоать путь к PHP и PREPROCESSOR в строчках

    if "%PHPBIN%" == ""  set PHPBIN=Z:\usr\local\php5\php.exe
    if "%PROCESSOR%"=="" set PROCESSOR=..\preprocessor\build\preprocessor.php

После запуска батника, появится каталог build/release с файлами

 *   bgx.jpg -
 *   index.html - тестовая страничка для демонстрации fly.js
 *   excanvas-modified.js - файл excanvas-modified - доработанная  версия excanvas для поддержкки canvas на IE
 *   fly.js - собственно файл, русующий муху
 *   03.png - картинка с мухой

После появления файлов необходимо используя НГШСщьзкуыыщк минимизировать файл fly.js

## использование phing

phing - пакет pear для сборки файлов. Аналог ANT, только на PHP.

build.xml является файлом сборки для phing.
Необходимо откорректировать строчку

     <property name="YUicompressor" value="/projects/tools/yuicompressor-2.4.5.jar"/>

этого файла, чтобы путь указывал на Yuicompressor.

После выполнения цели `release` появятся, в дополнение к файлам из первого списка, уже минимизированные версии файлов excanvas и fly.js

target'ы `debug` и `browser` используют параметры

	<property name="test_dir" value="z:/home/localhost/www/fly"/>
	<property name="test_url" value="http://localhost/fly/"/>

которые нужно установить в каталог локального сервера и его адрес.

`browser` выводит тестовую страничку на экран дефолтного броузера после коипрования на сервер всех нужных файлов.
