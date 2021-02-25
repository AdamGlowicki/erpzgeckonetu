<?php

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\User;
use Spatie\Permission\PermissionRegistrar;

class PermissionTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */

    public function run()
    {
        \DB::table('model_has_roles')->delete();
        \DB::update("ALTER TABLE `model_has_roles` AUTO_INCREMENT = 1;");

        \DB::table('model_has_permissions')->delete();
        \DB::update("ALTER TABLE `model_has_permissions` AUTO_INCREMENT = 1;");

        \DB::table('role_has_permissions')->delete();
        \DB::update("ALTER TABLE `role_has_permissions` AUTO_INCREMENT = 1;");

        \DB::table('roles')->delete();
        \DB::update("ALTER TABLE `roles` AUTO_INCREMENT = 1;");

        \DB::table('permissions')->delete();
        \DB::update("ALTER TABLE `permissions` AUTO_INCREMENT = 1;");

        app(PermissionRegistrar::class)->forgetCachedPermissions();
        app()['cache']->forget('spatie.permission.cache');

        $permissions = [
            // app-specific permissions

            'root',
            'debug',

            // admin permissions

            'admin/user-list',
            'admin/user-create',
            'admin/user-edit',
            'admin/user-delete',

            'admin/role-list',
            'admin/role-create',
            'admin/role-edit',
            'admin/role-delete',

            'admin/permission-list',
            'admin/permission-create',
            'admin/permission-edit',
            'admin/permission-delete',

            // menu/layouts access permissions

            'dashboard-show',
            'warehouse-show',
            'cars-show',
            'contractors-show',
            'availability-show',
            'rma-show',
            'bhp-show',
            'calendar-show',
            'bok-show',

            // actions permissions

            'event-list-all',
            'event-list',
            'event-create',
            'event-edit',
            'event-delete',

            'bhpUsersStocksItem-list',
            'bhpUsersStocksItem-edit',

            'bhpItem-list',
            'bhpItem-create',
            'bhpItem-edit',
            'bhpItem-delete',

            'bhpOut-list',
            'bhpOut-create',
            'bhpOut-edit',
            'bhpOut-delete',

            'role-list',
            'role-create',
            'role-edit',
            'role-delete',

            'user-list',
            'user-create',
            'user-edit',
            'user-delete',

            'car-list',
            'car-create',
            'car-edit',
            'car-delete',
            'car-move-locked',

            'contractor-list',
            'contractor-create',
            'contractor-edit',
            'contractor-delete',

            'warehouse-list',
            'warehouse-create',
            'warehouse-edit',
            'warehouse-delete',

            'itemsManufacturer-list',
            'itemsManufacturer-create',
            'itemsManufacturer-edit',
            'itemsManufacturer-delete',

            'itemsCategory-list',
            'itemsCategory-create',
            'itemsCategory-edit',
            'itemsCategory-delete',

            'unit-list',
            'unit-create',
            'unit-edit',
            'unit-delete',

            'item-list',
            'item-create',
            'item-edit',
            'item-delete',

            'warehousesIn-list',
            'warehousesIn-create',
            'warehousesIn-edit',
            'warehousesIn-delete',

            'warehousesImport-list',
            'warehousesImport-create',
            'warehousesImport-edit',
            'warehousesImport-delete',

            'warehousesOutCar-list',
            'warehousesOutCar-create',
            'warehousesOutCar-edit',
            'warehousesOutCar-delete',

            'warehousesInCar-list',
            'warehousesInCar-create',
            'warehousesInCar-edit',
            'warehousesInCar-delete',

            'warehousesMove-list',
            'warehousesMove-create',
            'warehousesMove-edit',
            'warehousesMove-delete',

            'carsMove-list',
            'carsMove-create',
            'carsMove-edit',
            'carsMove-delete',
            'carsMove-all',

            'carsIn-list',
            'carsIn-create',
            'carsIn-edit',
            'carsIn-delete',
            'carsIn-all',

            'carsOut-list',
            'carsOut-create',
            'carsOut-edit',
            'carsOut-delete',
            'carsOut-all',

            'request-list',
            'request-create',
            'request-edit',
            'request-delete',
            'request-approve',

            'tax-list',
            'tax-create',
            'tax-edit',
            'tax-delete',

            'investment-list',
            'investment-create',
            'investment-edit',
            'investment-delete',
            'investment-approve',

            'client-list',
            'client-create',
            'client-edit',
            'client-delete',
            'client-search',

            'profile-edit',

            'rwdz-list',
            'rwdz-create',
            'rwdz-edit',
            'rwdz-delete',

            'items_low-list',
            'items_usage-list',
            'users_items_usage-list',
            'cars_items_usage-list',

            'ekw-list',

            'rma-list',
            'rma-create',
            'rma-edit',
            'rma-delete',

            'rmas_reason-list',
            'rmas_reason-create',
            'rmas_reason-edit',
            'rmas_reason-delete',

            'warehousesPlace-list',
            'warehousesPlace-create',
            'warehousesPlace-edit',
            'warehousesPlace-delete',

            'unms-list',

            'wiki-list',
            'wiki-create',
            'wiki-edit',
            'wiki-delete',

            'doc-list',
            'doc-create',
            'doc-edit',
            'doc-delete',

            'lead-list',
            'lead-create',
            'lead-edit',
            'lead-delete',

            //invest
            'body-list',
            'body-store',
            'body-get',
            'body-edit',
            'body-delete',

            'folder-list',
            'folder-store',
            'folder-get',
            'folder-edit',
            'folder-delete',

            'investFile-list',
            'investFile-store',
            'investFile-get',
            'investFile-edit',
            'investFile-delete',

            'folderFile-list',
            'folderFile-store',
            'folderFile-get',
            'folderFile-edit',
            'folderFile-delete',

            'invest-list',
            'invest-store',
            'invest-get',
            'invest-edit',
            'invest-delete',

            'prevFile-list',
            'prevFile-store',
            'prevFile-get',
            'prevFile-edit',
            'prevFile-delete',

            'postFile-list',
            'postFile-store',
            'postFile-get',
            'postFile-edit',
            'postFile-delete',

            'table-list',
            'table-store',
            'table-get',
            'table-edit',
            'table-delete',

            'task-list',
            'task-store',
            'task-get',
            'task-edit',
            'task-delete',

            'secondFile-list',
            'secondFile-store',
            'secondFile-get',
            'secondFile-edit',
            'secondFile-delete',

            'open-invest',
            'open-task',
            'visible-folders',
            'visible-note',
            'visible-table',

            'drawer-list',
            'drawer-store',
            'drawer-get',
            'drawer-edit',
            'drawer-delete',

            'secondPostFile-list',
            'secondPostFile-store',
            'secondPostFile-get',
            'secondPostFile-edit',
            'secondPostFile-delete',

            'agreementFolder-list',
            'agreementFolder-store',
            'agreementFolder-get',
            'agreementFolder-edit',
            'agreementFolder-delete',

            'agreementFile-list',
            'agreementFile-store',
            'agreementFile-get',
            'agreementFile-edit',
            'agreementFile-delete',

            'wfm-show',
            'wfm-list',
            'wfm-create',
        ];

        foreach ($permissions as $permission) {
            Permission::create([
                'guard_name' => 'api',
                'name' => $permission
            ]);
        }

        /*
         * special permissions
         */

        Permission::create([
            'guard_name' => 'api',
            'name' => 'event-list-all-geo',
        ]);

        Permission::create([
            'guard_name' => 'api',
            'name' => 'project-creator',
        ]);

        /*
         * end special permissions
         */

        $roles = [
            'Administrator aplikacji' => $permissions,
            'Administrator' => $permissions,
            'Magazynier/Logistyk' => [
                'dashboard-show',
                'warehouse-show',
                'cars-show',
                'contractors-show',

                'client-list',
                'client-search',

                'investment-list',

                'event-list-all',
                'event-list',
                'event-create',
                'event-edit',
                'event-delete',

                'warehousesPlace-list',
                'warehousesPlace-create',
                'warehousesPlace-edit',
                'warehousesPlace-delete',

                'warehousesIn-list',
                'warehousesIn-create',
                'warehousesIn-edit',
                'warehousesIn-delete',

                'warehousesImport-list',
                'warehousesImport-create',
                'warehousesImport-edit',
                'warehousesImport-delete',

                'warehousesOutCar-list',
                'warehousesOutCar-create',
                'warehousesOutCar-edit',
                'warehousesOutCar-delete',

                'warehousesInCar-list',
                'warehousesInCar-create',
                'warehousesInCar-edit',
                'warehousesInCar-delete',

                'warehousesMove-list',
                'warehousesMove-create',
                'warehousesMove-edit',
                'warehousesMove-delete',

                'carsMove-list',
                'carsMove-create',
                'carsMove-edit',
                'carsMove-delete',
                'carsMove-all',

                'request-list',
                'request-edit',
                'request-delete',
                'request-approve',

                'itemsManufacturer-list',
                'itemsManufacturer-create',
                'itemsManufacturer-edit',
                'itemsManufacturer-delete',

                'itemsCategory-list',
                'itemsCategory-create',
                'itemsCategory-edit',
                'itemsCategory-delete',

                'unit-list',
                'unit-create',
                'unit-edit',
                'unit-delete',

                'item-list',
                'item-create',
                'item-edit',
                'item-delete',

                'car-list',
                'car-create',
                'car-edit',
                'car-delete',
                'car-move-locked',

                'contractor-list',
                'contractor-create',
                'contractor-edit',
                'contractor-delete',

                'warehouse-list',
                'warehouse-create',
                'warehouse-edit',
                'warehouse-delete',

                'carsIn-list',
                'carsIn-create',
                'carsIn-edit',
                'carsIn-all',

                'carsOut-list',
                'carsOut-create',
                'carsOut-edit',
                'carsOut-all',

                'items_low-list',
                'items_usage-list',
                'users_items_usage-list',
                'cars_items_usage-list',

                'rma-list',
                'rma-create',
                'rma-edit',
                'rma-delete',

                'rmas_reason-list',
                'rmas_reason-create',
                'rmas_reason-edit',
                'rmas_reason-delete',

                'bhpItem-list',
                'bhpItem-create',
                'bhpItem-edit',
                'bhpItem-delete',

                'bhpUsersStocksItem-list',
                'bhpUsersStocksItem-edit',

                'bhpOut-list',
                'bhpOut-create',
                'bhpOut-edit',
                'bhpOut-delete',

                'doc-list',

                'unms-list',
            ],
            'Podwykonawca' => [
                'event-list',

                'dashboard-show',
                'warehouse-show',
                'cars-show',

                'car-list',
                'item-list',
                'itemsManufacturer-list',
                'itemsCategory-list',

                'warehousesInCar-list',
                'warehousesOutCar-list',

                'carsIn-list',
                'carsIn-create',
                'carsIn-edit',

                'carsOut-list',
                'carsOut-create',
                'carsOut-edit',

                'carsMove-list',
                'carsMove-create',
                'carsMove-edit',
                'carsMove-delete',

                'request-list',
                'request-create',
                'request-edit',

                'investment-list',
                'investment-edit',

                'doc-list',

                'warehouse-list',
            ],
            'Ekipa teren' => [
                'event-list',

                'dashboard-show',
                'warehouse-show',
                'cars-show',

                'car-list',
                'item-list',
                'itemsManufacturer-list',
                'itemsCategory-list',

                'warehousesInCar-list',
                'warehousesOutCar-list',

                'carsIn-list',
                'carsIn-create',
                'carsIn-edit',

                'carsOut-list',
                'carsOut-create',
                'carsOut-edit',

                'carsMove-list',
                'carsMove-create',
                'carsMove-edit',
                'carsMove-delete',

                'request-list',
                'request-create',
                'request-edit',

                'investment-list',
                'investment-edit',

                'warehouse-list',

                'doc-list',
            ],
            'Technik' => [
                'event-list',

                'dashboard-show',
                'warehouse-show',
                'cars-show',

                'car-list',
                'item-list',
                'itemsManufacturer-list',
                'itemsCategory-list',

                'lead-list',
                'lead-create',
                'lead-edit',
                'lead-delete',

                'carsIn-list',
                'carsIn-create',
                'carsIn-edit',

                'carsOut-list',
                'carsOut-create',
                'carsOut-edit',

                'warehousesInCar-list',
                'warehousesOutCar-list',

                'carsMove-list',
                'carsMove-create',
                'carsMove-edit',
                'carsMove-delete',

                'request-list',
                'request-create',
                'request-edit',

                'investment-list',

                'client-list',
                'client-search',

                'warehouse-list',

                'unms-list',

                'doc-list',

                'wfm-show',
                'wfm-list',
                'wfm-create',
            ],
            'Geodeta' => [
                'event-list',
                'event-list-all-geo',
                'event-list-all',
                'event-create',
                'event-edit',
                'event-delete',

                'investment-list',

                'warehousesInCar-list',
                'warehousesOutCar-list',

                'dashboard-show',
                'warehouse-show',

                'item-list',
                'itemsManufacturer-list',
                'itemsCategory-list',

                'carsIn-list',
                'carsIn-create',
                'carsIn-edit',

                'carsOut-list',
                'carsOut-create',
                'carsOut-edit',

                'carsMove-list',
                'carsMove-create',
                'carsMove-edit',
                'carsMove-delete',

                'request-list',
                'request-create',
                'request-edit',
                'request-approve',

                'warehouse-list',

                'doc-list',
            ],
            'Projektant' => [
                'event-list-all',
                'event-list',
                'event-create',
                'event-edit',
                'event-delete',

                'investment-list',
                'investment-create',
                'investment-edit',
                'investment-approve',

                'warehousesInCar-list',
                'warehousesOutCar-list',

                'dashboard-show',
                'warehouse-show',
                'cars-show',

                'car-list',
                'item-list',
                'itemsManufacturer-list',
                'itemsCategory-list',

                'carsIn-list',
                'carsIn-create',
                'carsIn-edit',

                'carsOut-list',
                'carsOut-create',
                'carsOut-edit',

                'carsMove-list',
                'carsMove-create',
                'carsMove-edit',
                'carsMove-delete',

                'request-list',
                'request-create',
                'request-edit',
                'request-approve',

                'client-list',
                'client-search',

                'warehouse-list',

                'project-creator',

                'body-list',
                'body-store',
                'body-get',
                'body-edit',
                'body-delete',

                'folder-list',
                'folder-store',
                'folder-get',
                'folder-edit',
                'folder-delete',

                'investFile-list',
                'investFile-store',
                'investFile-get',
                'investFile-edit',
                'investFile-delete',

                'folderFile-list',
                'folderFile-store',
                'folderFile-get',
                'folderFile-edit',
                'folderFile-delete',

                'invest-list',
                'invest-store',
                'invest-get',
                'invest-edit',
                'invest-delete',

                'prevFile-list',
                'prevFile-store',
                'prevFile-get',
                'prevFile-edit',
                'prevFile-delete',

                'postFile-list',
                'postFile-store',
                'postFile-get',
                'postFile-edit',
                'postFile-delete',

                'table-list',
                'table-store',
                'table-get',
                'table-edit',
                'table-delete',

                'task-list',
                'task-store',
                'task-get',
                'task-edit',
                'task-delete',

                'secondFile-list',
                'secondFile-store',
                'secondFile-get',
                'secondFile-edit',
                'secondFile-delete',

                'open-invest',
                'open-task',
                'visible-folders',
                'visible-note',
                'visible-table',

                'drawer-list',
                'drawer-store',
                'drawer-get',
                'drawer-edit',
                'drawer-delete',

                'secondPostFile-list',
                'secondPostFile-store',
                'secondPostFile-get',
                'secondPostFile-edit',
                'secondPostFile-delete',

                'lead-list',
                'lead-create',
                'lead-edit',
                'lead-delete',

                'doc-list',
            ],
            'Projektant/Magazynier/Logistyk (grupa tymczasowa)' => [
                'event-list-all',
                'event-list',
                'event-create',
                'event-edit',
                'event-delete',

                'warehousesPlace-list',
                'warehousesPlace-create',
                'warehousesPlace-edit',
                'warehousesPlace-delete',

                'investment-list',
                'investment-create',
                'investment-edit',
                'investment-approve',

                'dashboard-show',
                'warehouse-show',
                'cars-show',
                'contractors-show',

                'car-list',
                'item-list',
                'itemsManufacturer-list',
                'itemsCategory-list',

                'warehousesInCar-list',
                'warehousesOutCar-list',

                'carsIn-list',
                'carsIn-create',
                'carsIn-edit',
                'carsIn-all',

                'carsOut-list',
                'carsOut-create',
                'carsOut-edit',
                'carsOut-all',

                'carsMove-list',
                'carsMove-create',
                'carsMove-edit',
                'carsMove-delete',
                'carsMove-all',

                'request-list',
                'request-create',

                'client-list',
                'client-search',

                'warehouse-list',

                'warehousesIn-list',
                'warehousesIn-create',
                'warehousesIn-edit',
                'warehousesIn-delete',

                'warehousesImport-list',
                'warehousesImport-create',
                'warehousesImport-edit',
                'warehousesImport-delete',

                'warehousesOutCar-list',
                'warehousesOutCar-create',
                'warehousesOutCar-edit',
                'warehousesOutCar-delete',

                'warehousesInCar-list',
                'warehousesInCar-create',
                'warehousesInCar-edit',
                'warehousesInCar-delete',

                'warehousesMove-list',
                'warehousesMove-create',
                'warehousesMove-edit',
                'warehousesMove-delete',

                'request-edit',
                'request-delete',
                'request-edit',
                'request-approve',

                'itemsManufacturer-create',
                'itemsManufacturer-edit',
                'itemsManufacturer-delete',

                'itemsCategory-create',
                'itemsCategory-edit',
                'itemsCategory-delete',

                'unit-list',
                'unit-create',
                'unit-edit',
                'unit-delete',

                'item-create',
                'item-edit',
                'item-delete',

                'car-create',
                'car-edit',
                'car-delete',
                'car-move-locked',

                'contractor-list',
                'contractor-create',
                'contractor-edit',
                'contractor-delete',

                'warehouse-list',
                'warehouse-create',
                'warehouse-edit',
                'warehouse-delete',

                'carsIn-list',
                'carsOut-list',

                'items_low-list',
                'items_usage-list',
                'users_items_usage-list',
                'cars_items_usage-list',

                'rma-list',
                'rma-create',
                'rma-edit',
                'rma-delete',

                'rmas_reason-list',
                'rmas_reason-create',
                'rmas_reason-edit',
                'rmas_reason-delete',

                'bhpItem-list',
                'bhpItem-create',
                'bhpItem-edit',
                'bhpItem-delete',

                'bhpUsersStocksItem-list',
                'bhpUsersStocksItem-edit',

                'bhpOut-list',
                'bhpOut-create',
                'bhpOut-edit',
                'bhpOut-delete',

                'project-creator',

                'body-list',
                'body-store',
                'body-get',
                'body-edit',
                'body-delete',

                'folder-list',
                'folder-store',
                'folder-get',
                'folder-edit',
                'folder-delete',

                'investFile-list',
                'investFile-store',
                'investFile-get',
                'investFile-edit',
                'investFile-delete',

                'folderFile-list',
                'folderFile-store',
                'folderFile-get',
                'folderFile-edit',
                'folderFile-delete',

                'invest-list',
                'invest-store',
                'invest-get',
                'invest-edit',
                'invest-delete',

                'prevFile-list',
                'prevFile-store',
                'prevFile-get',
                'prevFile-edit',
                'prevFile-delete',

                'postFile-list',
                'postFile-store',
                'postFile-get',
                'postFile-edit',
                'postFile-delete',

                'table-list',
                'table-store',
                'table-get',
                'table-edit',
                'table-delete',

                'task-list',
                'task-store',
                'task-get',
                'task-edit',
                'task-delete',

                'secondFile-list',
                'secondFile-store',
                'secondFile-get',
                'secondFile-edit',
                'secondFile-delete',

                'open-invest',
                'open-task',
                'visible-folders',
                'visible-note',
                'visible-table',

                'drawer-list',
                'drawer-store',
                'drawer-get',
                'drawer-edit',
                'drawer-delete',

                'lead-list',
                'lead-create',
                'lead-edit',
                'lead-delete',

                'secondPostFile-list',
                'secondPostFile-store',
                'secondPostFile-get',
                'secondPostFile-edit',
                'secondPostFile-delete',

                'doc-list',
            ],
            'BOK' => [
                'event-list-all',
                'event-list',
                'event-create',
                'event-edit',
                'event-delete',

                'lead-list',
                'lead-create',
                'lead-edit',
                'lead-delete',

                'dashboard-show',
                'warehouse-show',
                'cars-show',

                'car-list',
                'item-list',
                'itemsManufacturer-list',
                'itemsCategory-list',

                'warehousesInCar-list',
                'warehousesOutCar-list',

                'carsIn-list',
                'carsIn-create',
                'carsIn-edit',
                'carsIn-all',

                'carsOut-list',
                'carsOut-create',
                'carsOut-edit',
                'carsOut-all',

                'carsMove-list',
                'carsMove-create',
                'carsMove-edit',
                'carsMove-delete',

                'request-list',
                'request-create',
                'request-edit',

                'investment-list',

                'client-list',
                'client-search',

                'warehouse-list',

                'doc-list',
            ],
            'PH/Biuro' => [
                'event-list-all',
                'event-list',
                'event-create',
                'event-edit',
                'event-delete',

                'lead-list',
                'lead-create',
                'lead-edit',
                'lead-delete',

                'dashboard-show',
                'warehouse-show',
                'cars-show',

                'car-list',
                'item-list',
                'itemsManufacturer-list',
                'itemsCategory-list',

                'warehousesInCar-list',
                'warehousesOutCar-list',

                'carsIn-list',
                'carsIn-create',
                'carsIn-edit',

                'carsOut-list',
                'carsOut-create',
                'carsOut-edit',

                'carsMove-list',
                'carsMove-create',
                'carsMove-edit',
                'carsMove-delete',

                'request-list',
                'request-create',
                'request-edit',

                'investment-list',

                'client-list',
                'client-search',

                'warehouse-list',

                'doc-list',
            ],
            'Administrator sieci' => [
                'investment-list',
                'investment-create',
                'investment-edit',
                'investment-approve',

                'event-list-all',
                'event-list',
                'event-create',
                'event-edit',
                'event-delete',

                'dashboard-show',
                'warehouse-show',
                'cars-show',

                'car-list',
                'item-list',
                'item-create',
                'itemsManufacturer-list',
                'itemsCategory-list',
                'unit-list',

                'warehousesInCar-list',
                'warehousesOutCar-list',

                'carsIn-list',
                'carsIn-create',
                'carsIn-edit',

                'carsOut-list',
                'carsOut-create',
                'carsOut-edit',

                'carsMove-list',
                'carsMove-create',
                'carsMove-edit',
                'carsMove-delete',

                'request-list',
                'request-create',
                'request-edit',

                'investment-list',

                'client-list',
                'client-search',

                'warehouse-list',

                'unms-list',

                'doc-list',
            ],
            'Koordynator terenowy' => [
                'event-list-all',
                'event-list',
                'event-create',
                'event-edit',
                'event-delete',

                'investment-list',
                'investment-create',
                'investment-edit',
                'investment-approve',

                'warehousesInCar-list',
                'warehousesOutCar-list',

                'dashboard-show',
                'warehouse-show',
                'cars-show',

                'car-list',
                'item-list',
                'itemsManufacturer-list',
                'itemsCategory-list',

                'carsIn-list',
                'carsIn-create',
                'carsIn-edit',

                'carsOut-list',
                'carsOut-create',
                'carsOut-edit',

                'carsMove-list',
                'carsMove-create',
                'carsMove-edit',
                'carsMove-delete',

                'request-list',
                'request-create',
                'request-edit',
                'request-approve',

                'client-list',
                'client-search',

                'warehouse-list',

                'project-creator',

                'doc-list',
            ],
            'Umowy Biznes' => [
                'agreementFolder-list',
                'agreementFolder-store',
                'agreementFolder-get',
                'agreementFolder-edit',
                'agreementFolder-delete',

                'lead-list',
                'lead-create',
                'lead-edit',
                'lead-delete',

                'agreementFile-list',
                'agreementFile-store',
                'agreementFile-get',
                'agreementFile-edit',
                'agreementFile-delete',

                'event-list-all',
                'event-list',
                'event-create',
                'event-edit',
                'event-delete',

                'dashboard-show',
                'warehouse-show',
                'cars-show',

                'car-list',
                'item-list',
                'itemsManufacturer-list',
                'itemsCategory-list',

                'warehousesInCar-list',
                'warehousesOutCar-list',

                'carsIn-list',
                'carsIn-create',
                'carsIn-edit',

                'carsOut-list',
                'carsOut-create',
                'carsOut-edit',

                'carsMove-list',
                'carsMove-create',
                'carsMove-edit',
                'carsMove-delete',

                'request-list',
                'request-create',
                'request-edit',

                'investment-list',

                'client-list',
                'client-search',

                'warehouse-list',

                'doc-list',
            ]
        ];

        foreach ($roles as $role => $perm) {
            $r = Role::create([
                'guard_name' => 'api',
                'name' => $role
            ]);

            foreach ($perm as $p) {
                $r->givePermissionTo($p);
            }
        }

        foreach ($roles as $role => $permissions) {
            $users = [];

            switch ($role) {
                case 'Administrator aplikacji':
                    $users = [
                        'radoslaw.sulkowski@geckonet.pl',
                        'adam.glowicki@geckonet.pl',
                        'admin',
                    ];

                    break;
                case 'Administrator':
                    $users = [
                        'adam@geckonet.pl',
                        'mateusz.brzeski@geckonet.pl',
                    ];

                    break;
                case 'Magazynier/Logistyk':
                    $users = [
                        'patryk.kuriata@geckonet.pl',
                        'mateusz.cichoracki@geckonet.pl',
                    ];

                    break;
                case 'Technik':
                    $users = [
                        'piotr.laskowski@geckonet.pl',
                        'dawid.gorski@geckonet.pl',
                        'pawel.laskowski@geckonet.pl',
                        'karol.gawryjalek@geckonet.pl',
                        'bartosz.oskroba@geckonet.pl',
                        'patryk.wolaziewicz@geckonet.pl',
                        'szymon.rozanski@geckonet.pl',
                        'bartosz.buciak@geckonet.pl',
                        'wieslaw.wolaziewicz@geckonet.pl',
                        'dariusz.wilk@geckonet.pl',
                        'tomasz.mglosiek@geckonet.pl',
                    ];

                    break;
                case 'Ekipa teren':
                    $users = [
                        'piotr.peplinski@geckonet.pl',
                        'bartlomiej.waliszewski@geckonet.pl',
                        'michal.michalowski@geckonet.pl',
                        'lukasz.behrendt@geckonet.pl',
                        'lukasz.pietrzykowski@geckonet.pl',
                        'adrian.pietrzykowski@geckonet.pl',
                        'michal.gabrych@geckonet.pl',
                        'remigiusz.gasiorowski@geckonet.pl',
                        'pawel.zadruzynski@geckonet.pl',
                    ];

                    break;
                case 'Projektant':
                    $users = [
                        'joanna.znaniecka@geckonet.pl',
                        'aleksandra.cylka@geckonet.pl',
                        'klaudia.hatlas@geckonet.pl',
                    ];

                    break;
                case 'BOK':
                    $users = [
                        'joanna@geckonet.pl',
                        'dorota.wohlert@geckonet.pl',
                        'joanna.bezyk@geckonet.pl',
                        'mateusz.komorowski@geckonet.pl',
                        'weronika.bauer@geckonet.pl',
                        'agnieszka.bialucha@geckonet.pl',
                        'olga.krysiak@geckonet.pl',
                    ];

                    break;
                case 'PH/Biuro':
                    $users = [
                        'piotr.kwiatkowski@geckonet.pl',
                    ];

                    break;
                case 'Administrator sieci':
                    $users = [
                        'michal@geckonet.pl',
                        'adrian@geckonet.pl',
                    ];

                    break;
                case 'Projektant/Magazynier/Logistyk (grupa tymczasowa)':
                    $users = [
                        'grzegorz.dolinski@geckonet.pl',
                        'sebastian.przybylski@geckonet.pl',
                        'mateusz.koslacz@geckonet.pl',
                    ];

                    break;
                case 'Koordynator terenowy':
                    $users = [
                    ];

                    break;
                case 'Podwykonawca':
                    $users = [
                        'biuro@vionet.pl',
                        'krzysztof_barabas@wp.pl',
                    ];

                    break;
                case 'Geodeta':
                    $users = [
                        'sebastian.zbikowski@geckonet.pl',
                    ];

                    break;
                case 'Umowy Biznes':
                    $users = [
                        'patrick.urban@geckonet.pl',
                    ];

                    break;
            }


            foreach ($users as $user) {
                $result = User::where('username', $user)->first();

                if ($result) {
                    $result->assignRole($role);
                }
            }
        }
    }
}
