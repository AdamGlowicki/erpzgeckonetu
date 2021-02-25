<?php

use Illuminate\Database\Seeder;
use App\User;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $users = [
            [
                'name' => 'Piotr Laskowski', 
                'username' => 'piotr.laskowski@geckonet.pl',
                'email' => 'piotr.laskowski@geckonet.pl',
                'phone' => '',
                'role' => 4,
            ],
            [
                'name' => 'Dawid Górski', 
                'username' => 'dawid.gorski@geckonet.pl',
                'email' => 'dawid.gorski@geckonet.pl',
                'phone' => '',
                'role' => 4,
            ],
            [
                'name' => 'Paweł Laskowski', 
                'username' => 'paswel.laskowski@geckonet.pl',
                'email' => 'paswel.laskowski@geckonet.pl',
                'phone' => '',
                'role' => 4,
            ],
            [
                'name' => 'Karol Gawryjałek', 
                'username' => 'karol.gawryjalek@geckonet.pl',
                'email' => 'karol.gawryjalek@geckonet.pl',
                'phone' => '',
                'role' => 4,
            ],
            [
                'name' => 'Bartosz Oskroba', 
                'username' => 'bartosz.oskroba@geckonet.pl',
                'email' => 'bartosz.oskroba@geckonet.pl',
                'phone' => '',
                'role' => 4,
            ],
            [
                'name' => 'Patryk Wołąziewicz', 
                'username' => 'patryk.wolaziewicz@geckonet.pl',
                'email' => 'patryk.wolaziewicz@geckonet.pl',
                'phone' => '',
                'role' => 4,
            ],
            [
                'name' => 'Grzegorz Doliński', 
                'username' => 'grzegorz.dolinski@geckonet.pl',
                'email' => 'grzegorz.dolinski@geckonet.pl',
                'phone' => '',
                'role' => 5,
            ],
            [
                'name' => 'Szymon Jabłoński', 
                'username' => 'szymon.jablonski@geckonet.pl',
                'email' => 'szymon.jablonski@geckonet.pl',
                'phone' => '',
                'role' => 5,
            ],
            [
                'name' => 'Patrick Urban', 
                'username' => 'patrick.urban@geckonet.pl',
                'email' => 'patrick.urban@geckonet.pl',
                'phone' => '',
                'role' => 6,
            ],
        ];
        
        foreach($users as $user) {
            $password = str_random(8);
            $user['password'] = Hash::make($password);
            
            $role = $user['role'];
            unset($user['role']);
            
            $user = User::create($user);
            $user->assignRole($role);
            
            echo 'Login '. $user['username'] .' Password '. $password ."\n";
        }
    }
}
