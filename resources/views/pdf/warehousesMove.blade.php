<!DOCTYPE html>
<html lang="pl">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>&nbsp;</title>
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

    .warehouse {
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

    .mt-2 {
        margin-top: 20px;
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
    </style>
    <div class="content">
        <div class="row">
            <div class="col-xs-4">
                <img src="{{ base_path('public/assets/img/logo.png') }}" alt="">
            </div>
            <div class="col-xs-4">
                <strong>Magazyn źródłowy</strong>
                <p class="warehouse ml-1">{{ $data->warehouse_in->name }} ({{ $data->warehouse_in->id }})<br>{{ $data->warehouse_in->street }}<br>{{ $data->warehouse_in->postcode }} {{ $data->warehouse_in->city }}</p>
            </div>
            <div class="col-xs-4 pl-1">
                <strong>Magazyn docelowy</strong>
                <p class="warehouse ml-1">{{ $data->warehouse_out->name }} ({{ $data->warehouse_out->id }})<br>{{ $data->warehouse_out->street }}<br>{{ $data->warehouse_out->postcode }} {{ $data->warehouse_out->city }}</p>
            </div>
        </div>
        <div class="row mt-10">
            <div class="col-xs-12 text-center doc-name">
                <strong><span style="font-size: 14pt;">Dokument nr <span class="name">{{ $data->document_name }}</span></span></strong>
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
                            <th>Ilość</th>
                            <th>J.m.</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($data->warehousesMovesItem as $row)
                            <tr>
                                <td>{{ $row->item->id }}</td>
                                <td>{{ $row->item->itemsManufacturer->name }}</td>
                                <td>{{ $row->item->model_name }}</td>
                                <td>{{ $row->quantity }}</td>
                                <td>{{ $row->item->unit->short_name }}</td>
                            </tr>
                            @foreach($row->element as $element)
                                <tr>
                                    <td></td>
                                    <td colspan="5">
                                        <span class="ml-1 mr-1">
                                            {{ $loop->iteration }}.
                                        </span>
                                        @if(strlen($element->sn) > 0)
                                            <span class="ml-1 mr-1">
                                                S/N: <strong>{{ $element->sn }}</strong>
                                            </span>
                                        @endif
                                        @if(strlen($element->mac) > 0)
                                            <span class="ml-1 mr-1">
                                                MAC: <strong>{{ $element->mac }}</strong>
                                            </span>
                                        @endif
                                    </td>
                                </tr>
                            @endforeach
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
        <div class="row mt-5">
            <div class="col-xs-8 ml-2">
                <strong>Uwagi</strong>
                <p class="notes ml-1">{{ $data->notes }}</p>
            </div>
            <div class="col-xs-4">
                <strong>Data wystawienia</strong>
                <p class="date ml-1">{{ $data->created_at }}</p>
            </div>
        </div>
        <div class="row mt-2">
            <div class="col-xs-8 ml-2">
            </div>
            <div class="col-xs-4">
                <strong>Wystawił</strong>
                <p class="user ml-1">{{ $data->user->name }}</p>
            </div>
        </div>
    </div>
</body>
</html>
