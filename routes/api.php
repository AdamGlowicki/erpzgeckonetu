<?php

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/*
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
*/

// api auth
Route::group(['middleware' => 'throttle:15,1'], function() {
    Route::post('login', 'Auth\LoginController@login');
    Route::post('login/app', 'Auth\LoginController@loginApp');
});

Route::group(['middleware' => ['auth:api,api_app', 'throttle:60,1']], function() {
    Route::get('client/search/{string}', [App\Http\Controllers\ClientController::class, 'search']);
    Route::get('client/search/{string}/nodes', [App\Http\Controllers\ClientController::class, 'searchNodes']);
});

// api methods
Route::group(['middleware' => ['auth:api,api_app', 'throttle:240,1']], function() {
    Route::post('logout', 'Auth\LoginController@logout');

    Route::post('user', 'Auth\RegisterController@register');
    Route::get('user', 'UserController@index');
    Route::get('loggedUser/{id}', [App\Http\Controllers\UserController::class, 'getLoggedUser']);
    Route::get('user/sort/{direction}/{column}', 'UserController@sort');
    Route::get('user/all', 'UserController@all');
    Route::get('user/all/active', 'UserController@allActive');
    Route::get('user/cars/all', 'UserController@allCars');
    Route::put('user/{user}', 'UserController@update');
    Route::delete('user/{user}', 'UserController@delete');

    Route::put('password', [App\Http\Controllers\ProfileController::class, 'password']);

    Route::get('contractor', 'ContractorController@index');
    Route::get('contractor/sort/{direction}/{column}', 'ContractorController@sort');
    Route::get('contractor/all', 'ContractorController@all');
    Route::get('contractor/{contractor}', 'ContractorController@show');
    Route::get('contractor/edit/{contractor}', 'ContractorController@edit');
    Route::post('contractor', 'ContractorController@store');
    Route::put('contractor/{contractor}', 'ContractorController@update');
    Route::delete('contractor/{contractor}', 'ContractorController@delete');
    Route::get('contractor/{contractor}/warehousesIn', 'ContractorController@warehousesIn');

    Route::get('warehouse', 'WarehouseController@index');
    Route::get('warehouse/sort/{direction}/{column}', 'WarehouseController@sort');
    Route::get('warehouse/all', 'WarehouseController@all');
    Route::get('warehouse/{warehouse}', 'WarehouseController@show');
    Route::get('warehouse/edit/{warehouse}', 'WarehouseController@edit');
    Route::get('warehouse/{warehouse}/pdf', 'WarehouseController@document');
    Route::post('warehouse', 'WarehouseController@store');
    Route::post('warehouse/stock/verify', 'WarehouseController@verify');
    Route::put('warehouse/{warehouse}', 'WarehouseController@update');
    Route::delete('warehouse/{warehouse}', 'WarehouseController@delete');

    Route::get('warehousesPlace', [App\Http\Controllers\WarehousesPlaceController::class, 'index']);
    Route::get('warehousesPlace/sort/{direction}/{column}', [App\Http\Controllers\WarehousesPlaceController::class, 'sort']);
    Route::get('warehousesPlace/all', [App\Http\Controllers\WarehousesPlaceController::class, 'all']);
    Route::get('warehousesPlace/{warehouse}', [App\Http\Controllers\WarehousesPlaceController::class, 'show']);
    Route::get('warehousesPlace/edit/{warehouse}', [App\Http\Controllers\WarehousesPlaceController::class, 'edit']);
    Route::post('warehousesPlace', [App\Http\Controllers\WarehousesPlaceController::class, 'store']);
    Route::post('warehousesPlace/import', [App\Http\Controllers\WarehousesPlaceController::class, 'import']);
    Route::put('warehousesPlace/{warehouse}', [App\Http\Controllers\WarehousesPlaceController::class, 'update']);
    Route::delete('warehousesPlace/{warehouse}', [App\Http\Controllers\WarehousesPlaceController::class, 'destroy']);

    Route::get('warehouse/{warehouse}/stock', 'WarehousesStockController@stock');

    Route::get('stock/{stock}', 'ItemController@stockElements');

    Route::get('warehousesIn', 'WarehousesInController@index');
    Route::get('warehousesIn/sort/{direction}/{column}', 'WarehousesInController@sort');
    Route::get('warehousesIn/all', 'WarehousesInController@all');
    Route::get('warehousesIn/{warehousesIn}', 'WarehousesInController@show');
    Route::get('warehousesIn/edit/{warehousesIn}', 'WarehousesInController@edit');
    Route::post('warehousesIn', 'WarehousesInController@store');
    Route::put('warehousesIn/{object}', 'WarehousesInController@update');
    Route::get('warehousesIn/{warehousesIn}/pdf', 'WarehousesInController@document');
    // Route::delete('warehousesIn/{warehousesIn}', 'WarehousesInController@delete');

    Route::get('warehousesImport', [App\Http\Controllers\WarehousesImportController::class, 'index']);
    Route::get('warehousesImport/sort/{direction}/{column}', [App\Http\Controllers\WarehousesImportController::class, 'sort']);
    Route::get('warehousesImport/{warehousesImport}', [App\Http\Controllers\WarehousesImportController::class, 'show']);

    Route::get('carsOut', 'CarsOutController@index');
    Route::get('carsOut/sort/{direction}/{column}', 'CarsOutController@sort');
    Route::get('carsOut/all', 'CarsOutController@all');
    Route::get('carsOut/{carsOut}', 'CarsOutController@show');
    Route::get('carsOut/{carsOut}/pdf', 'CarsOutController@document');
    Route::post('carsOut', 'CarsOutController@store');
    Route::put('carsOut/{carsOut}', 'CarsOutController@update');

    Route::get('investment', [App\Http\Controllers\InvestmentController::class, 'index']);
    Route::get('investment/{investment}/edit', [App\Http\Controllers\InvestmentController::class, 'edit']);
    Route::get('investment/sort/{direction}/{column}', [App\Http\Controllers\InvestmentController::class, 'sort']);
    Route::get('investment/all', [App\Http\Controllers\InvestmentController::class, 'all']);
    Route::get('investment/{investment}', [App\Http\Controllers\InvestmentController::class, 'show']);
    Route::get('investment/{investment}/file/all', [App\Http\Controllers\InvestmentController::class, 'allFiles']);
    Route::get('investment/{investment}/file/{file}', [App\Http\Controllers\InvestmentController::class, 'file']);
    Route::post('investment', [App\Http\Controllers\InvestmentController::class, 'store']);
    Route::put('investment/{investment}', [App\Http\Controllers\InvestmentController::class, 'update']);
    Route::put('investment/{investment}/approve', [App\Http\Controllers\InvestmentController::class, 'approve']);

    Route::get('carsIn', 'CarsInController@index');
    Route::get('carsIn/sort/{direction}/{column}', 'CarsInController@sort');
    Route::get('carsIn/all', 'CarsInController@all');
    Route::get('carsIn/{carsIn}', 'CarsInController@show');
    Route::get('carsIn/{carsIn}/pdf', 'CarsInController@document');
    Route::post('carsIn', 'CarsInController@store');
    Route::put('carsIn/{carsIn}', 'CarsInController@update');

    Route::get('request', 'RequestController@index');
    Route::get('request/sort/{direction}/{column}', 'RequestController@sort');
    Route::get('request/all', 'RequestController@all');
    Route::get('request/{request}', 'RequestController@show');
    Route::get('request/{request}/edit', 'RequestController@edit');
    Route::get('request/{request}/pdf', 'RequestController@document');
    Route::post('request', 'RequestController@store');
    Route::put('request/{request}', 'RequestController@update');
    Route::delete('request/{request}', 'RequestController@destroy');

    Route::get('warehousesOutCar', 'WarehousesOutCarController@index');
    Route::get('warehousesOutCar/sort/{direction}/{column}', 'WarehousesOutCarController@sort');
    Route::get('warehousesOutCar/all', 'WarehousesOutCarController@all');
    Route::get('warehousesOutCar/{warehousesOutCar}', 'WarehousesOutCarController@show');
    Route::get('warehousesOutCar/{warehousesOutCar}/pdf', 'WarehousesOutCarController@document');
    Route::post('warehousesOutCar', 'WarehousesOutCarController@store');
    Route::put('warehousesOutCar/{warehousesOutCar}', 'WarehousesOutCarController@update');
    // Route::delete('warehousesOutCar/{warehousesOutCar}', 'WarehousesOutCarController@delete');

    Route::get('warehousesInCar', 'WarehousesInCarController@index');
    Route::get('warehousesInCar/sort/{direction}/{column}', 'WarehousesInCarController@sort');
    Route::get('warehousesInCar/all', 'WarehousesInCarController@all');
    Route::get('warehousesInCar/{warehousesInCar}', 'WarehousesInCarController@show');
    Route::get('warehousesInCar/{warehousesInCar}/pdf', 'WarehousesInCarController@document');
    Route::post('warehousesInCar', 'WarehousesInCarController@store');
    Route::put('warehousesInCar/{warehousesInCar}', 'WarehousesInCarController@update');
    // Route::delete('warehousesInCar/{warehousesInCar}', 'WarehousesInCarController@delete');

    Route::get('warehousesMove', 'WarehousesMoveController@index');
    Route::get('warehousesMove/sort/{direction}/{column}', 'WarehousesMoveController@sort');
    Route::get('warehousesMove/all', 'WarehousesMoveController@all');
    Route::get('warehousesMove/{warehousesMove}', 'WarehousesMoveController@show');
    Route::get('warehousesMove/{warehousesMove}/pdf', 'WarehousesMoveController@document');
    Route::post('warehousesMove', 'WarehousesMoveController@store');
    Route::put('warehousesMove/{warehousesMove}', 'WarehousesMoveController@update');

    Route::get('bhpItem', [App\Http\Controllers\BhpItemController::class, 'index']);
    Route::get('bhpItem/search/{item}', [App\Http\Controllers\BhpItemController::class, 'search']);
    Route::get('bhpItem/all', [App\Http\Controllers\BhpItemController::class, 'all']);
    Route::get('bhpItem/{bhpItem}', [App\Http\Controllers\BhpItemController::class, 'show']);
    Route::get('bhpItem/{object}/edit', [App\Http\Controllers\BhpItemController::class, 'edit']);
    Route::post('bhpItem', [App\Http\Controllers\BhpItemController::class, 'store']);
    Route::put('bhpItem/{object}', [App\Http\Controllers\BhpItemController::class, 'update']);
    Route::delete('bhpItem/{bhpItem}', [App\Http\Controllers\BhpItemController::class, 'destroy']);

    Route::get('bhpOut', [App\Http\Controllers\BhpOutController::class, 'index']);
    Route::get('bhpOut/all', [App\Http\Controllers\BhpOutController::class, 'all']);
    Route::get('bhpOut/{bhpOut}', [App\Http\Controllers\BhpOutController::class, 'show']);
    Route::get('bhpOut/{bhpOut}/pdf', [App\Http\Controllers\BhpOutController::class, 'document']);
    Route::post('bhpOut', [App\Http\Controllers\BhpOutController::class, 'store']);
    Route::put('bhpOut/{bhpOut}', [App\Http\Controllers\BhpOutController::class, 'update']);

    Route::get('bhpUsersStocksItem', [App\Http\Controllers\BhpUsersStocksItemController::class, 'index']);
    Route::get('bhpUsersStocksItem/all', [App\Http\Controllers\BhpUsersStocksItemController::class, 'all']);
    Route::get('bhpUsersStocksItem/{bhpUsersStocksItem}', [App\Http\Controllers\BhpUsersStocksItemController::class, 'show']);
    Route::get('bhpUsersStocksItem/{bhpUsersStocksItem}/pdf', [App\Http\Controllers\BhpUsersStocksItemController::class, 'document']);
    Route::post('bhpUsersStocksItem', [App\Http\Controllers\BhpUsersStocksItemController::class, 'store']);
    Route::put('bhpUsersStocksItem/{bhpUsersStocksItem}', [App\Http\Controllers\BhpUsersStocksItemController::class, 'update']);

    Route::get('carsMove', [App\Http\Controllers\CarsMoveController::class, 'index']);
    Route::get('carsMove/sort/{direction}/{column}', [App\Http\Controllers\CarsMoveController::class, 'sort']);
    Route::get('carsMove/all', [App\Http\Controllers\CarsMoveController::class, 'all']);
    Route::get('carsMove/{carsMove}', [App\Http\Controllers\CarsMoveController::class, 'show']);
    Route::get('carsMove/{carsMove}/pdf', [App\Http\Controllers\CarsMoveController::class, 'document']);
    Route::post('carsMove', [App\Http\Controllers\CarsMoveController::class, 'store']);
    Route::put('carsMove/{carsMove}/approve', [App\Http\Controllers\CarsMoveController::class, 'approve']);
    Route::put('carsMove/{carsMove}', [App\Http\Controllers\CarsMoveController::class, 'update']);
    Route::delete('carsMove/{carsMove}', [App\Http\Controllers\CarsMoveController::class, 'destroy']);

    Route::get('car', [App\Http\Controllers\CarController::class, 'index']);
    Route::get('car/sort/{direction}/{column}', [App\Http\Controllers\CarController::class, 'sort']);
    Route::get('car/all', [App\Http\Controllers\CarController::class, 'all']);
    Route::get('car/{car}', [App\Http\Controllers\CarController::class, 'show']);
    Route::get('car/{car}/pdf', [App\Http\Controllers\CarController::class, 'document']);
    Route::get('car/{car}/stock', [App\Http\Controllers\CarsItemController::class, 'stock']);
    Route::get('car/edit/{car}', [App\Http\Controllers\CarController::class, 'edit']);
    Route::put('car/{car}', [App\Http\Controllers\CarController::class, 'update']);
    Route::post('car', [App\Http\Controllers\CarController::class, 'store']);
    Route::post('car/stock/verify', [App\Http\Controllers\CarController::class, 'verify']);
    Route::delete('car/{car}', [App\Http\Controllers\CarController::class, 'delete']);

    Route::post('car/items', 'CarsItemController@store');
    Route::post('car/users', 'CarsUserController@store');

    Route::delete('car/items/{carsItem}', 'CarsItemController@delete');
    Route::delete('car/users/{carsItem}', 'CarsUserController@delete');

    Route::get('car/stock/own', 'CarsItemController@stockOwn');
    Route::get('car/stock/{car}', 'CarController@stockElements');

    Route::get('countries', 'CountryController@index');
    Route::get('countries/sort/{direction}/{column}', 'CountryController@sort');
    Route::get('countries/all', 'CountryController@all');
    Route::get('countries/{country}', 'CountryController@show');
    Route::post('countries', 'CountryController@store');
    Route::put('countries/{country}', 'CountryController@update');
    Route::delete('countries/{country}', 'CountryController@delete');
    Route::get('countries/{country}/items', 'CountryController@items');

    Route::get('ekw', [App\Http\Controllers\EkwController::class, 'index']);
    Route::get('ekw/sort/{direction}/{column}', [App\Http\Controllers\EkwController::class, 'sort']);
    Route::get('ekw/all', [App\Http\Controllers\EkwController::class, 'all']);
    Route::get('ekw/search/{item}', [App\Http\Controllers\EkwController::class, 'search']);
    Route::get('ekw/{item}', [App\Http\Controllers\EkwController::class, 'show']);
    Route::get('ekw/edit/{item}', [App\Http\Controllers\EkwController::class, 'edit']);
    Route::post('ekw', [App\Http\Controllers\EkwController::class, 'store']);
    Route::put('ekw/{item}', [App\Http\Controllers\EkwController::class, 'update']);
    Route::delete('ekw/{item}', [App\Http\Controllers\EkwController::class, 'delete']);

    Route::get('item', 'ItemController@index');
    Route::get('item/sort/{direction}/{column}', 'ItemController@sort');
    Route::get('item/all', 'ItemController@all');
    Route::get('item/search/{item}', 'ItemController@search');
    Route::get('item/pdf', 'ItemController@document');
    Route::get('item/{item}', 'ItemController@show');
    Route::get('item/edit/{item}', 'ItemController@edit');
    Route::post('item', 'ItemController@store');
    Route::post('item/import', 'ItemController@import');
    Route::put('item/{item}', 'ItemController@update');
    Route::delete('item/{item}', 'ItemController@delete');
    Route::get('item/{item}/stock', 'ItemController@stock');

    Route::get('itemsManufacturer', 'ItemsManufacturerController@index');
    Route::get('itemsManufacturer/sort/{direction}/{column}', 'ItemsManufacturerController@sort');
    Route::get('itemsManufacturer/all', 'ItemsManufacturerController@all');
    Route::get('itemsManufacturer/{itemsManufacturer}', 'ItemsManufacturerController@show');
    Route::get('itemsManufacturer/edit/{itemsManufacturer}', 'ItemsManufacturerController@edit');
    Route::post('itemsManufacturer', 'ItemsManufacturerController@store');
    Route::put('itemsManufacturer/{itemsManufacturer}', 'ItemsManufacturerController@update');
    Route::delete('itemsManufacturer/{itemsManufacturer}', 'ItemsManufacturerController@delete');
    Route::get('itemsManufacturer/{itemsManufacturer}/items', 'ItemsManufacturerController@items');

    Route::get('itemsCategory', 'ItemsCategoryController@index');
    Route::get('itemsCategory/sort/{direction}/{column}', 'ItemsCategoryController@sort');
    Route::get('itemsCategory/all', 'ItemsCategoryController@all');
    Route::get('itemsCategory/{itemsCategory}', 'ItemsCategoryController@show');
    Route::get('itemsCategory/edit/{itemsCategory}', 'ItemsCategoryController@edit');
    Route::post('itemsCategory', 'ItemsCategoryController@store');
    Route::put('itemsCategory/{itemsCategory}', 'ItemsCategoryController@update');
    Route::delete('itemsCategory/{itemsCategory}', 'ItemsCategoryController@delete');
    Route::get('itemsCategory/{itemsCategory}/items', 'ItemsCategoryController@items');

    Route::get('unit', 'UnitController@index');
    Route::get('unit/sort/{direction}/{column}', 'UnitController@sort');
    Route::get('unit/all', 'UnitController@all');
    Route::get('unit/{unit}', 'UnitController@show');
    Route::get('unit/edit/{unit}', 'UnitController@edit');
    Route::post('unit/', 'UnitController@store');
    Route::put('unit/{unit}', 'UnitController@update');
    Route::delete('unit/{unit}', 'UnitController@delete');

    Route::get('tax', 'TaxController@index');
    Route::get('tax/sort/{direction}/{column}', 'TaxController@sort');
    Route::get('tax/all', 'TaxController@all');
    Route::get('tax/search/{item}', 'TaxController@search');
    Route::get('tax/{tax}', 'TaxController@show');
    Route::post('tax/', 'TaxController@store');
    Route::put('tax/{tax}', 'TaxController@update');
    Route::delete('tax/{tax}', 'TaxController@delete');

    Route::get('ripe', 'RipeController@index');
    Route::get('ripe/sort/{direction}/{column}', 'RipeController@sort');
    Route::get('ripe/all', 'RipeController@all');
    Route::get('ripe/search/{ripe}', 'RipeController@search');

    Route::get('profile', 'ProfileController@show');
    Route::put('profile', 'ProfileController@update');
    Route::get('profile/avatar', 'ProfileController@getAvatar');
    Route::post('profile/avatar', 'ProfileController@avatar');

    Route::get('profile/permissions', 'ProfileController@permissions');
    Route::get('profile/role', 'ProfileController@role');
    Route::get('profile/notifications', 'UserController@notifications');

    Route::get('settings', 'UserController@settings');
    Route::put('settings', 'UserController@settings');

    Route::get('stock/search/{item}/rma', 'WarehousesStockController@searchRma');
    Route::get('stock/search/{item}/{warehouse}', 'WarehousesStockController@search');
    Route::get('car/search/{item}', 'CarController@searchStock');
    Route::get('car/search/{item}/{user}', 'CarController@searchStockOfUser');

    Route::post('stock/import', 'WarehousesStockController@import');

    Route::get('services/search/{city}', 'ServiceController@search');
    Route::get('services/search/{city}/{street}', 'ServiceController@searchByStreet');
    Route::get('services/search/local/{cityId}/{street}', 'ServiceController@searchByStreetLocal');
    Route::get('services/{cityId}/{streetId}/{buildingNumber}', 'ServiceController@show');

    Route::get('client', [App\Http\Controllers\ClientController::class, 'index']);
    Route::get('client/sort/{direction}/{column}', [App\Http\Controllers\ClientController::class, 'sort']);
    Route::get('client/all', [App\Http\Controllers\ClientController::class, 'all']);
    Route::get('client/{client}', [App\Http\Controllers\ClientController::class, 'show']);
    Route::get('client/{client}/lms', [App\Http\Controllers\ClientController::class, 'showLMS']);
    Route::get('client/{id}/pin/{pin}', [App\Http\Controllers\ClientController::class, 'checkPin']);
    Route::get('client/{client}/stock', [App\Http\Controllers\ClientController::class, 'stock']);
    Route::get('client/edit/{client}', [App\Http\Controllers\ClientController::class, 'edit']);
    Route::put('client/{client}', [App\Http\Controllers\ClientController::class, 'update']);
    Route::post('client', [App\Http\Controllers\ClientController::class, 'store']);
    Route::post('client/stock/verify', [App\Http\Controllers\ClientController::class, 'verify']);
    Route::delete('investment/{client}', [App\Http\Controllers\ClientController::class, 'delete']);
    Route::get('client/search/{item}/{client}', 'ClientsItemController@search');

    Route::get('investment', [App\Http\Controllers\InvestmentController::class, 'index']);
    Route::get('investment/sort/{direction}/{column}', [App\Http\Controllers\InvestmentController::class, 'sort']);
    Route::get('investment/all', [App\Http\Controllers\InvestmentController::class, 'all']);
    Route::get('investment/{car}', [App\Http\Controllers\InvestmentController::class, 'show']);
    Route::get('investment/{car}/stock', [App\Http\Controllers\InvestmentController::class, 'stock']);
    Route::get('investment/edit/{car}', [App\Http\Controllers\InvestmentController::class, 'edit']);
    Route::put('investment/{car}', [App\Http\Controllers\InvestmentController::class, 'update']);
    Route::post('investment', [App\Http\Controllers\InvestmentController::class, 'store']);
    Route::post('investment/stock/verify', [App\Http\Controllers\InvestmentController::class, 'verify']);
    Route::delete('investment/{car}', [App\Http\Controllers\InvestmentController::class, 'delete']);
    Route::get('investment/search/{string}', [App\Http\Controllers\InvestmentController::class, 'search']);
    Route::get('investment/search/{item}/{investment}', [App\Http\Controllers\InvestmentsItemController::class, 'search']);

    Route::get('rwdz', [App\Http\Controllers\RWDZController::class, 'index']);
    Route::get('rwdz/sort/{direction}/{column}', [App\Http\Controllers\RWDZController::class, 'sort']);
    Route::get('rwdz/all', [App\Http\Controllers\RWDZController::class, 'all']);
    Route::get('rwdz/{rwdz}', [App\Http\Controllers\RWDZController::class, 'show']);
    Route::get('rwdz/edit/{rwdz}', [App\Http\Controllers\RWDZController::class, 'edit']);
    Route::put('rwdz/{rwdz}', [App\Http\Controllers\RWDZController::class, 'update']);
    Route::post('rwdz', [App\Http\Controllers\RWDZController::class, 'store']);
    Route::delete('rwdz/{rwdz}', [App\Http\Controllers\RWDZController::class, 'delete']);
    Route::get('rwdz/search/{string}', [App\Http\Controllers\RWDZController::class, 'search']);

    Route::get('rma', [App\Http\Controllers\RmaController::class, 'index']);
    Route::get('rma/sort/{direction}/{column}', [App\Http\Controllers\RmaController::class, 'sort']);
    Route::get('rma/all', [App\Http\Controllers\RmaController::class, 'all']);
    Route::get('rma/{rma}', [App\Http\Controllers\RmaController::class, 'show']);
    Route::get('rma/{rma}/pdf', [App\Http\Controllers\RmaController::class, 'document']);
    Route::get('rma/{rma}/stock', [App\Http\Controllers\RmaController::class, 'stock']);
    Route::get('rma/edit/{rma}', [App\Http\Controllers\RmaController::class, 'edit']);
    Route::put('rma/{rma}', [App\Http\Controllers\RmaController::class, 'update']);
    Route::post('rma', [App\Http\Controllers\RmaController::class, 'store']);
    Route::delete('rma/{rma}', [App\Http\Controllers\RmaController::class, 'delete']);

    Route::get('rmas_reason', [App\Http\Controllers\RmasReasonController::class, 'index']);
    Route::get('rmas_reason/sort/{direction}/{column}', [App\Http\Controllers\RmasReasonController::class, 'sort']);
    Route::get('rmas_reason/all', [App\Http\Controllers\RmasReasonController::class, 'all']);
    Route::get('rmas_reason/{rmas_reason}', [App\Http\Controllers\RmasReasonController::class, 'show']);
    Route::get('rmas_reason/edit/{rmas_reason}', [App\Http\Controllers\RmasReasonController::class, 'edit']);
    Route::put('rmas_reason/{rmas_reason}', [App\Http\Controllers\RmasReasonController::class, 'update']);
    Route::post('rmas_reason', [App\Http\Controllers\RmasReasonController::class, 'store']);
    Route::delete('rmas_reason/{rmas_reason}', [App\Http\Controllers\RmasReasonController::class, 'destroy']);

    Route::get('items_low', [App\Http\Controllers\DashboardController::class, 'items_low']);
    Route::get('items_low/sort/{direction}/{column}', [App\Http\Controllers\DashboardController::class, 'items_low_sort']);

    Route::get('items_usage', [App\Http\Controllers\DashboardController::class, 'items_usage']);
    Route::get('items_usage/sort/{direction}/{column}', [App\Http\Controllers\DashboardController::class, 'items_usage_sort']);

    Route::get('users_items_usage', [App\Http\Controllers\DashboardController::class, 'users_items_usage']);
    Route::get('users_items_usage/sort/{direction}/{column}', [App\Http\Controllers\DashboardController::class, 'users_items_usage_sort']);

    Route::get('cars_items_usage', [App\Http\Controllers\DashboardController::class, 'cars_items_usage']);
    Route::get('cars_items_usage/sort/{direction}/{column}', [App\Http\Controllers\DashboardController::class, 'cars_items_usage_sort']);

    Route::get('file/{id}', [App\Http\Controllers\FileController::class, 'show']);
    Route::delete('file/{id}', [App\Http\Controllers\FileController::class, 'destroy']);

    Route::get('event/active', [App\Http\Controllers\EventController::class, 'active']);
    Route::get('event/{event}', [App\Http\Controllers\EventController::class, 'show']);
    Route::get('event/{event}/edit', [App\Http\Controllers\EventController::class, 'edit']);
    Route::get('event/{event}/note', [App\Http\Controllers\EventController::class, 'note']);
    Route::get('event/{start}/{end}/{user?}', [App\Http\Controllers\EventController::class, 'index']);
    Route::put('event/{event}', [App\Http\Controllers\EventController::class, 'update']);
    Route::put('event/{event}/status', [App\Http\Controllers\EventController::class, 'status']);
    Route::post('event/{event}/file', [App\Http\Controllers\EventController::class, 'storeFile']);
    Route::post('event/{event}/note', [App\Http\Controllers\EventController::class, 'storeNote']);
    Route::post('event', [App\Http\Controllers\EventController::class, 'store']);
    Route::delete('event/{event}', [App\Http\Controllers\EventController::class, 'destroy']);

    Route::get('location', [App\Http\Controllers\LocationController::class, 'index']);
    Route::get('location/self', [App\Http\Controllers\LocationController::class, 'self']);
    Route::get('location/{user}', [App\Http\Controllers\LocationController::class, 'show']);
    Route::get('location/{user}/{from}/{to}', [App\Http\Controllers\LocationController::class, 'path']);
    Route::post('location', [App\Http\Controllers\LocationController::class, 'store']);

    Route::get('report/{month}/{user?}', [App\Http\Controllers\ReportController::class, 'index']);
    Route::post('report', [App\Http\Controllers\ReportController::class, 'store']);

    Route::get('stb', [App\Http\Controllers\CarsItemController::class, 'stb']);

    Route::get('unms/search/{query}', [App\Http\Controllers\UNMSController::class, 'search']);

    Route::post('work/status', [App\Http\Controllers\UserController::class, 'work']);

    Route::get('invest', [App\Http\Controllers\InvestController::class, 'index']);
    Route::post('invest', [App\Http\Controllers\InvestController::class, 'store']);
    Route::delete('invest', [App\Http\Controllers\InvestController::class, 'destroy']);
    Route::patch('invest/{id}', [App\Http\Controllers\InvestController::class, 'update']);

    Route::post('investFile', [App\Http\Controllers\InvestFileController::class, 'store']);
    Route::delete('investFile/{id}', [App\Http\Controllers\InvestFileController::class, 'destroy']);
    Route::get('investFile/{id}', [App\Http\Controllers\InvestFileController::class, 'show']);

    Route::post('folderFile', [App\Http\Controllers\FolderFileController::class, 'store']);
    Route::delete('folderFile/{id}', [App\Http\Controllers\FolderFileController::class, 'destroy']);
    Route::get('folderFile/{id}', [App\Http\Controllers\FolderFileController::class, 'show']);

    Route::post('prevFile', [App\Http\Controllers\PrevFileController::class, 'store']);
    Route::delete('prevFile/{id}', [App\Http\Controllers\PrevFileController::class, 'destroy']);
    Route::get('prevFile/{id}', [App\Http\Controllers\PrevFileController::class, 'show']);

    Route::post('postFile', [App\Http\Controllers\PostFileController::class, 'store']);
    Route::delete('postFile/{id}', [App\Http\Controllers\PostFileController::class, 'destroy']);
    Route::get('postFile/{id}', [App\Http\Controllers\PostFileController::class, 'show']);

    Route::post('secondFile', [App\Http\Controllers\SecondFileController::class, 'store']);
    Route::delete('secondFile/{id}', [App\Http\Controllers\SecondFileController::class, 'destroy']);
    Route::get('secondFile/{id}', [App\Http\Controllers\SecondFileController::class, 'show']);

    Route::post('addFolder', [App\Http\Controllers\FolderController::class, 'store']);
    Route::delete('folder/{id}', [App\Http\Controllers\FolderController::class, 'destroy']);
    Route::patch('folder/{id}', [App\Http\Controllers\FolderController::class, 'update']);

    Route::patch('task/{id}', [App\Http\Controllers\TasksController::class, 'update']);
    Route::post('task/{id}', [App\Http\Controllers\TasksController::class, 'store']);
    Route::post('tasks/{id}', [App\Http\Controllers\TasksController::class, 'storeAll']);
    Route::delete('task/{id}', [App\Http\Controllers\TasksController::class, 'destroy']);
    Route::put('task/updateOrder', [App\Http\Controllers\TasksController::class, 'updateOrder']);
    Route::patch('task/{position}/{invest_id}', [App\Http\Controllers\TasksController::class, 'increasePosition']);

    Route::post('body', [App\Http\Controllers\BodyController::class, 'store']);
    Route::delete('body/{id}', [App\Http\Controllers\BodyController::class, 'destroy']);
    Route::patch('body/{id}', [App\Http\Controllers\BodyController::class, 'update']);

    Route::delete('table/{id}', [App\Http\Controllers\TableController::class, 'destroy']);
    Route::post('table', [App\Http\Controllers\TableController::class, 'store']);
    Route::patch('table/{id}', [App\Http\Controllers\TableController::class, 'update']);

    Route::get('wiki/{event}', [App\Http\Controllers\WikiController::class, 'show']);
    Route::get('wiki/{event}/edit', [App\Http\Controllers\WikiController::class, 'edit']);
    Route::get('wiki', [App\Http\Controllers\WikiController::class, 'index']);
    Route::post('wiki', [App\Http\Controllers\WikiController::class, 'store']);
    Route::put('wiki/{event}', [App\Http\Controllers\WikiController::class, 'update']);
    Route::delete('wiki/{event}', [App\Http\Controllers\WikiController::class, 'destroy']);

    Route::get('admin/user', [App\Http\Controllers\Admin\UserController::class, 'index']);
    Route::get('admin/user/{id}', [App\Http\Controllers\Admin\UserController::class, 'show']);
    Route::get('admin/user/{id}/edit', [App\Http\Controllers\Admin\UserController::class, 'edit']);
    Route::get('admin/user/{column?}/{direction?}', [App\Http\Controllers\Admin\UserController::class, 'index']);
    Route::post('admin/user', [App\Http\Controllers\Admin\UserController::class, 'store']);
    Route::put('admin/user/{id}', [App\Http\Controllers\Admin\UserController::class, 'update']);

    Route::get('admin/role', [App\Http\Controllers\Admin\RoleController::class, 'index']);
    Route::get('admin/role/{column?}/{direction?}', [App\Http\Controllers\Admin\RoleController::class, 'index']);
    Route::post('admin/role', [App\Http\Controllers\Admin\RoleController::class, 'store']);

    Route::get('admin/permission', [App\Http\Controllers\Admin\PermissionController::class, 'index']);
    Route::get('admin/permission/{column?}/{direction?}', [App\Http\Controllers\Admin\PermissionController::class, 'index']);
    Route::post('admin/permission', [App\Http\Controllers\Admin\PermissionController::class, 'store']);

    Route::post('drawer', [App\Http\Controllers\DrawerController::class, 'store']);
    Route::get('drawers', [App\Http\Controllers\DrawerController::class, 'create']);
    Route::delete('drawer/{id}', [App\Http\Controllers\DrawerController::class, 'destroy']);
    Route::patch('drawer/{id}', [App\Http\Controllers\DrawerController::class, 'update']);
    Route::post('drawer/invest', [App\Http\Controllers\DrawerController::class, 'assignInvestment']);

    Route::post('postSecondFile', [App\Http\Controllers\SecondPostFileController::class, 'store']);
    Route::delete('postSecondFile/{id}', [App\Http\Controllers\SecondPostFileController::class, 'destroy']);
    Route::get('postSecondFile/{id}', [App\Http\Controllers\SecondPostFileController::class, 'show']);

    Route::get('lms/netnode', [App\Http\Controllers\Lms\NetnodeController::class, 'index']);

    Route::post('mail/attachments', [App\Http\Controllers\MailController::class, 'attachments']);

    Route::get('agreementFolders', [App\Http\Controllers\AgreementFolderController::class, 'index']);
    Route::post('agreementFolders/add', [App\Http\Controllers\AgreementFolderController::class, 'store']);
    Route::patch('agreementFolders/edit/{id}', [App\Http\Controllers\AgreementFolderController::class, 'update']);
    Route::delete('agreementFolders/delete/{id}', [App\Http\Controllers\AgreementFolderController::class, 'destroy']);

    Route::get('agreementFile/{id}', [App\Http\Controllers\AgreementFileController::class, 'show']);
    Route::post('agreementFile', [App\Http\Controllers\AgreementFileController::class, 'store']);
    Route::delete('agreementFile/{id}', [App\Http\Controllers\AgreementFileController::class, 'destroy']);

    Route::get('doc', [App\Http\Controllers\DocController::class, 'index']);
    Route::get('doc/{id}', [App\Http\Controllers\DocController::class, 'show']);
    Route::get('doc/{id}/edit', [App\Http\Controllers\DocController::class, 'edit']);
    Route::get('doc/{id}/file/{file}', [App\Http\Controllers\DocController::class, 'file']);
    Route::get('doc/{column?}/{direction?}', [App\Http\Controllers\DocController::class, 'index']);
    Route::post('doc', [App\Http\Controllers\DocController::class, 'store']);
    Route::put('doc/{id}', [App\Http\Controllers\DocController::class, 'update']);
    Route::delete('doc/{id}', [App\Http\Controllers\DocController::class, 'destroy']);

    Route::get('lead', [App\Http\Controllers\LeadController::class, 'index']);
    Route::get('lead/{id}', [App\Http\Controllers\LeadController::class, 'show']);
    Route::get('lead/{id}/edit', [App\Http\Controllers\LeadController::class, 'edit']);
    Route::get('lead/{column?}/{direction?}', [App\Http\Controllers\LeadController::class, 'index']);
    Route::post('lead', [App\Http\Controllers\LeadController::class, 'store']);
    Route::put('lead/{id}', [App\Http\Controllers\LeadController::class, 'update']);
    Route::delete('lead/{id}', [App\Http\Controllers\LeadController::class, 'destroy']);

    Route::post('investmentNotification', [App\Http\Controllers\InvestController::class, 'sendNotificationMail']);

    Route::get('graph', [App\Http\Controllers\NodeController::class, 'index']);
    Route::post('graph/add', [App\Http\Controllers\NodeController::class, 'store']);
    Route::post('graph/addGraph', [App\Http\Controllers\NodeController::class, 'storeGraph']);
    Route::delete('graph/delete/{id}', [App\Http\Controllers\NodeController::class, 'destroy']);
    Route::delete('graph/deleteGraph/{id}', [App\Http\Controllers\NodeController::class, 'destroyGraph']);
    Route::patch('graph/updateName/{id}', [App\Http\Controllers\NodeController::class, 'update']);

    Route::patch('position/update/{id}', [App\Http\Controllers\PositionController::class, 'update']);

    Route::get('singleElements', [App\Http\Controllers\SingleElementController::class, 'index']);
    Route::post('singleElements/create', [App\Http\Controllers\SingleElementController::class, 'store']);
    Route::delete('singleElements/{id}', [App\Http\Controllers\SingleElementController::class, 'destroy']);

    Route::put('handles/update/{id}', [App\Http\Controllers\HandleController::class, 'update']);
    Route::post('handles/add', [App\Http\Controllers\HandleController::class, 'store']);
    Route::delete('handles/delete/{id}', [App\Http\Controllers\HandleController::class, 'destroy']);

    Route::get('edges', [App\Http\Controllers\EdgeController::class, 'index']);
    Route::post('edges/create', [App\Http\Controllers\EdgeController::class, 'store']);
    Route::delete('edge/deleteByIds', [App\Http\Controllers\EdgeController::class, 'destroy']);

    Route::patch('style/update/{id}', [App\Http\Controllers\StyleController::class, 'update']);

    Route::patch('nodeData/updateLabel/{id}', [App\Http\Controllers\NodeDataController::class, 'update']);

    Route::get('graphPermission/all', [App\Http\Controllers\GraphPermissionController::class, 'index']);
    Route::post('graphPermission/add', [App\Http\Controllers\GraphPermissionController::class, 'store']);
    Route::put('graphPermission/update/{id}', [App\Http\Controllers\GraphPermissionController::class, 'update']);
    Route::delete('graphPermission/delete/{id}', [App\Http\Controllers\GraphPermissionController::class, 'destroy']);

    Route::get('automobile', [App\Http\Controllers\AutomobileController::class, 'index']);
    Route::post('automobile/add', [App\Http\Controllers\AutomobileController::class, 'store']);
    Route::post('automobiles/attachments', [App\Http\Controllers\AutomobileController::class, 'attachments']);
    Route::patch('automobile/patch/{id}', [App\Http\Controllers\AutomobileController::class, 'update']);
    Route::delete('automobile/delete/{id}', [App\Http\Controllers\AutomobileController::class, 'destroy']);

    Route::post('carPhoto', [App\Http\Controllers\CarPhotoController::class, 'store']);
    Route::delete('carPhoto/{id}/{type}', [App\Http\Controllers\CarPhotoController::class, 'destroy']);
    Route::get('carPhoto/{id}/{type}', [App\Http\Controllers\CarPhotoController::class, 'show']);

    Route::get('userPhoto/{id}/{type}', [App\Http\Controllers\UserPhotoController::class, 'show']);
    Route::get('userPhoto/{id}', [App\Http\Controllers\UserPhotoController::class, 'create']);
    Route::post('userPhoto', [App\Http\Controllers\UserPhotoController::class, 'store']);
    Route::delete('userPhoto/{id}/{type}', [App\Http\Controllers\UserPhotoController::class, 'destroy']);

    Route::get('navifleet/cars', [App\Http\Controllers\NavifleetController::class, 'getNavifleet']);
    Route::get('navifleet/car/{id}', [App\Http\Controllers\NavifleetController::class, 'getNavifleetCarById']);

    Route::get('alertsCars', [App\Http\Controllers\CarAlertControler::class, 'index']);
    Route::delete('alertsCars/delete/{id}', [App\Http\Controllers\CarAlertControler::class, 'destroy']);

    Route::get('alertPeriod', [App\Http\Controllers\AlertPeriodController::class, 'create']);
    Route::post('alertPeriod/create', [App\Http\Controllers\AlertPeriodController::class, 'store']);
    Route::patch('alertPeriod/update/{id}', [App\Http\Controllers\AlertPeriodController::class, 'update']);

    Route::get('carPermissions', [App\Http\Controllers\CarPermissionController::class, 'index']);
    Route::post('carPermission/add', [App\Http\Controllers\CarPermissionController::class, 'store']);
    Route::patch('carPermission/update/{id}', [App\Http\Controllers\CarPermissionController::class, 'update']);
    Route::delete('carPermission/delete/{id}', [App\Http\Controllers\CarPermissionController::class, 'destroy']);

    Route::get('car/alerts', [App\Http\Controllers\CarAlertControler::class, 'index']);

    Route::get('users_schedule', [App\Http\Controllers\UsersScheduleController::class, 'index']);
    Route::post('users_schedule', [App\Http\Controllers\UsersScheduleController::class, 'store']);

    Route::get('carInvokesByCar/{id}', [App\Http\Controllers\CarInvokesController::class, 'create']);
    Route::get('carInvoke/{id}', [App\Http\Controllers\CarInvokesController::class, 'show']);
    Route::post('carInvoke', [App\Http\Controllers\CarInvokesController::class, 'store']);
    Route::delete('carInvoke/{id}', [App\Http\Controllers\CarInvokesController::class, 'destroy']);
});
