<!DOCTYPE html>
<html lang="pl">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title></title>
    <link href="{{ base_path('public/assets/css/bootstrap.min.css') }}" rel="stylesheet">
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
                <img src="{{ base_path('public/assets/img/logo.png') }}" alt="">
            </div>
            <div class="col-xs-4">
            </div>
            <div class="col-xs-4 pl-1">
                <strong>Magazyn</strong>
                <p class="car ml-1">{{ $data->warehouse->name }} ({{ $data->warehouse->id }})<br>{{ $data->warehouse->street }}<br>{{ $data->warehouse->postcode }} {{ $data->warehouse->city }}</p>
            </div>
        </div>
        <div class="row mt-10">
            <div class="col-xs-12 text-center doc-name">
                <strong><span style="font-size: 14pt;">Dokument nr <span class="name">{{ $data->document_name }}</span><br></span></strong>
            </div>
        </div>
        <div class="row mt-5">
            <div class="col-xs-12">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Indeks</th>
                            <th>Producent</th>
                            <th>Model</th>
                            <th>Ilość potrzebna</th>
                            <th>J.m.</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($data->requestsItem as $row)
                            <tr>
                                <td>{{ $row->item->id }}</td>
                                <td>{{ $row->item->itemsManufacturer->name }}</td>
                                <td>{{ $row->item->model_name }}</td>
                                <td>{{ $row->quantity }}</td>
                                <td>{{ $row->item->unit->short_name }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
        <div class="row mt-5">
            <div class="col-xs-4">
                <strong>Uwagi</strong>
                <p class="date ml-1">{{ $data->notes }}</p>
            </div>
            <div class="col-xs-4">
                <strong>Data zapotrzebowania</strong>
                <p class="date ml-1">{{ $data->date }}</p>
            </div>
            <div class="col-xs-4">
                <strong>Data wystawienia</strong>
                <p class="date ml-1">{{ now()->format('Y-m-d H:i:s') }}</p>
            </div>
        </div>
        <div class="row mt-5">
            <div class="col-xs-9">
            </div>
            <div class="col-xs-3">
                <strong>Zgłaszający</strong>
                <p class="user ml-1">{{ $data->user->name }}</p>
            </div>
        </div>
    </div>
</body>
</html>
