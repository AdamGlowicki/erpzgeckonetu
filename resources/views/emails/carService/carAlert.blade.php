<html>
<head>
    <title>App Name - @yield('title')</title>
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Dancing+Script&display=swap" rel="stylesheet">
    <style>
        body {
            display: flex;
            flex-direction: column;
            height: 700px;
            width: 500px;
        }

        .head {
            color: yellowgreen;
            font-size: 40px;
            font-family: 'Dancing Script', cursive;
            font-weight: bold;
            align-self: center;
        }

        .content {
            margin-left: 24px;
            margin-top: 40px;
        }

        .essence {
            font-size: 18px;
        }

        footer {
            font: 12px Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            flex-grow: 2;
        }

        img {
            object-fit: contain;
            margin-right: 8px;
        }

        .small {
            height: 12px;
        }

        .bold {
            font-weight: bold;
        }

        .footer-desc {
            line-height: 18px;
        }

        span {
            font-weight: bolder;
            text-transform: uppercase;
        }

    </style>
</head>
<body>
<h1 class='head'>
    Samochody Geckonet
</h1>

<div class="content">
    <h3>
        Masz nowe powiadomienie
    </h3>
    <h4>
        <a href='{{$carAlert}}'>Tutaj</a> znajduje się samochód który wymaga przeglądu, zapoznaj się i podejmij odpowiednie kroki.
    </h4>
</div>

<footer>
    <div class="footer-desc">
        <div class='bold'>Z wyrazami szacunku</div>
        <div>Automatyczny serwis samochodowy<span>geckocar</span></div>
        <div>Liczymy na owocną współpracę</div>
        <div>Niech prowadzi Cie geckon <img class='small' src="data:image/jpeg;base64,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" alt="gekon"></div>
    </div>
</footer>

</body>
</html>
