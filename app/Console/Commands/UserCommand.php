<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use App\User;

class UserCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:add {name} {username} {email}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Adding user to database';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $password = str_random(8);
        $hash = Hash::make($password);
        
        User::create([
            'name' => $this->argument('name'),
            'username' => $this->argument('username'),
            'email' => $this->argument('email'),
            'password' => $hash,
        ]);
        
        echo "{$this->argument('name')} {$this->argument('username')} {$this->argument('email')} {$password}";
    }
}
