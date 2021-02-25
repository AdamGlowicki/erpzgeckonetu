<?php

namespace App\Http\Controllers;

use App\Navifleet;
use Illuminate\Http\Request;

class NavifleetController extends Controller
{
    public function getNavifleet() {
        $data = new Navifleet();

        $result = $data->fetchNavifleet();
        return response()->json($result, 200);
    }

    public function getNavifleetCarById($id) {
        $data = new Navifleet();

        $result = $data->fetchNavifleetByCar($id);
        return response()->json($result, 200);
    }
}
