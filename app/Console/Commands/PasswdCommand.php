<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\User;
use Hash;

class PasswdCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'passwd:generate {username}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate password for all or specified users';

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
        if(!$this->argument('username')) {
            return false;
        }
        
        $user = User::where('username', $this->argument('username'))->first();
        
        if(!$user) {
            return false;
        }
        
        $password = str_random(8);
        $user->password = Hash::make($password);
        $user->save();
        
        $this->info('User '. $this->argument('username') .' new password is: '. $password);
    }
}
