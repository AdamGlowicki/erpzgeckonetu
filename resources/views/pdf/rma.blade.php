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

    .car {
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
                <strong>Kontrahent</strong>
                <p class="warehouse ml-1">{{ $data->contractor->name }}<br>{{ $data->contractor->street }}<br>{{ $data->contractor->postcode }} {{ $data->contractor->city }}<br>{{ $data->contractor->nip }}</p>
            </div>
            <div class="col-xs-4 pl-1">
                <strong>Faktura</strong>
                <p class="warehouse ml-1">{{ $data->invoice }}</p>
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
                            <th>S/N</th>
                            <th>MAC</th>
                            <th>Ilość</th>
                            <th>J.m.</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($data->rmasItem as $row)
                            <tr>
                                <td>{{ $row->item->id }}</td>
                                <td>{{ $row->item->itemsManufacturer->name }}</td>
                                <td>{{ $row->item->model_name }}</td>
                                <td>{{ $row->element[0]->sn }}</td>
                                <td>{{ $row->element[0]->mac }}</td>
                                <td>{{ $row->quantity }}</td>
                                <td>{{ $row->item->unit->short_name }}</td>
                            </tr>
                            @foreach($row->element as $element)
                                <tr>
                                    <td></td>
                                    <td colspan="6">
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
        <div class="row mt-2">
            <div class="col-xs-6 ml-2">
                <strong>Powód reklamacji</strong>
                <p class="notes ml-1">{{ $data->rmasReason->name }}</p>
            </div>
        </div>
        <div class="row mt-2">
            <div class="col-xs-4 ml-2">
                <strong>Uwagi</strong>
                <p class="notes ml-1">{{ $data->note }}</p>
            </div>
        </div>
        <div class="row mt-2">
            <div class="col-xs-4 ml-2">
                <strong>Data utworzenia</strong>
                <p class="date ml-1">{{ $data->created_at }}</p>
            </div>
        </div>
        <div class="row mt-2">
            <div class="col-xs-4 ml-2">
                <strong>Wystawił</strong>
                <p class="user ml-1">{{ $data->user->name }}</p>
            </div>
        </div>
    </div>
</body>
</html>
