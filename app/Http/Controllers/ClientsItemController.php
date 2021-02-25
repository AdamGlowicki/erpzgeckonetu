<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\ClientsItem;
use App\Client;

class ClientsItemController extends Controller
{
    public function search($item, $client) {
        $result = Client::where('client_id', $client)->first();
        
        if($result) {
            $client = $result->id;
        }
        
        $stock = ClientsItem::with(['item', 'item.itemsManufacturer', 'item.unit', 'element' => function($query) use ($item) {
                        $query->where('sn', 'LIKE', "%{$item}")->orWhere('mac', 'LIKE', "%{$item}");
                    }])
                    ->where('quantity', '>', 0)
                    ->where(function($q) use ($item, $client) {
                        $q->where(function($query) use ($item, $client) {
                            $query->where(['item_id' => $item, 'client_id' => $client]);
                        })
                        ->orWhere(function($query) use ($item, $client) {
                            $query->where(['client_id' => $client])->whereHas('item', function($query) use ($item) {
                                $query->where('model_name', 'LIKE', "%{$item}%");
                            });
                        })
                        ->orWhere(function($query) use ($item, $client) {
                            $query->where(['client_id' => $client])->whereHas('item.itemsManufacturer', function($query) use ($item) {
                                $query->where('name', 'LIKE', "%{$item}%");
                            });
                        })
                        ->orWhere(function($query) use ($item, $client) {
                            $query->where(['client_id' => $client])->whereHas('element', function($query) use ($item) {
                                $query->where('sn', 'LIKE', "%{$item}")->orWhere('mac', 'LIKE', "%{$item}");
                            });
                        });
                    })
                    ->get();
        
        return response()->json(['data' => $stock], 200);
    }
}
