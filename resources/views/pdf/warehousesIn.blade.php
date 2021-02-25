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
                <strong>Kontrahent/Dostawca</strong>
                <p class="contractor ml-1">{{ $data->contractor->name }}<br>{{ $data->contractor->street }}<br>{{ $data->contractor->postcode }} {{ $data->contractor->city }}<br>{{ $data->contractor->nip }}</p>
            </div>
            <div class="col-xs-4 pl-1">
                <strong>Magazyn</strong>
                <p class="warehouse ml-1">{{ $data->warehouse->name }}<br>{{ $data->warehouse->street }}<br>{{ $data->warehouse->postcode }} {{ $data->warehouse->city }}</p>
            </div>
        </div>
        <div class="row mt-10">
            <div class="col-xs-12 text-center doc-name">
                <strong><span style="font-size: 14pt;">Dokument nr <span class="name">{{ $data->document_name }}</span><br><small>do faktury {{ $data->invoice_name }}<br>z dnia {{ $data->invoice_date }}</small></span></strong>
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
                            <th>Cena (netto)</th>
                            <th>Podatek</th>
                            <th>Cena (brutto)</th>
                            <th>Wartość (netto)</th>
                            <th>Wartość (brutto)</th>
                        </tr>
                    </thead>
                    <tbody>
                    @foreach($data->warehousesInItem as $row)
                        <tr>
                            <td>{{ $row->item->id }}</td>
                            <td>{{ $row->item->itemsManufacturer->name }}</td>
                            <td>{{ $row->item->model_name }}</td>
                            <td>{{ $row->quantity }}</td>
                            <td>{{ $row->item->unit->short_name }}</td>
                            <td>{{ number_format(round($row->price_notax, 2), 2) }}</td>
                            <td>{{ $row->tax->name }}</td>
                            <td>{{ number_format(round($row->price_withtax, 2), 2) }}</td>
                            <td>{{ number_format(round($row->price_notax * $row->quantity, 2), 2) }}</td>
                            <td>{{ number_format(round($row->price_notax * ((($row->tax->multipler/100)+1) * $row->quantity), 2), 2) }}</td>
                        </tr>
                        @foreach($row->element as $element)
                            <tr>
                                <td></td>
                                <td colspan="9">
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
        <div class="row">
            <div class="col-xs-8 ml-2">&nbsp;</div>
            <div class="col-xs-4">
                <strong>Wystawił</strong>
                <p class="user ml-1">{{ $data->user->name }}</p>
            </div>
        </div>
    </div>
</body>
</html>
