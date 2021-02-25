<!DOCTYPE html>
<html lang="pl">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title></title>
    <link href="assets/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <style scoped>
    body {
        font-family: DejaVu Sans; font-size: 10pt;
    }

    table {
        font-size: 7pt;
    }

    /* bootstrap */

    /* end bootstrap */

    .car {
        font-size: 8pt;
    }

    .contractor {
        font-size: 8pt;
    }

    .date,.user,.notes {
        font-size: 8pt;
    }

    .mt-10 {
        margin-top: 100px;
    }

    .mt-5 {
        margin-top: 50px;
    }

    .ml-1 {
        margin-left: 10px;
    }

    .ml-2 {
        margin-left: 20px;
    }

    .pl-1 {
        padding-left: 10px;
    }

    .elements {
        font-size: 6pt;
    }
    </style>
    <div class="content">
        <div class="row">
            <div class="col-xs-4">
                <img src="assets/img/logo.png" alt="">
            </div>
            <div class="col-xs-4">
            </div>
            <div class="col-xs-4 pl-1">
            </div>
        </div>
        <div class="row mt-10">
            <div class="col-xs-12 text-center doc-name">
                <strong><span style="font-size: 14pt;">Lista produktów</span></strong>
            </div>
        </div>
        <div class="row mt-5">
            <div class="col-xs-12">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Indeks</th>
                            <th>Kategoria</th>
                            <th>Producent</th>
                            <th>Model</th>
                            <th>J.m.</th>
                        </tr>
                    </thead>
                    <tbody>
                        {elements}
                    </tbody>
                </table>
            </div>
        </div>
        <div class="row mt-5">
            <div class="col-xs-4">
                <strong>Data wystawienia</strong>
                <p class="date ml-1">{date}</p>
            </div>
            <div class="col-xs-4">
            </div>
            <div class="col-xs-4">
                <strong>Wystawił</strong>
                <p class="user ml-1">{username}</p>
            </div>
        </div>
    </div>
</body>
</html>
