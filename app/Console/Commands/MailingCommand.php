<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;
use Mail;
use DB;

class MailingCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mailing:send';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send mailing';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }
	
	public function sendTo($receiver, $token, $id, $type) {
		$data = [
			'token' => $token,
			'id' => $id,
			'type' => $type,
		];
		
        Mail::send('emails.mailing2', $data, function($message) use($receiver) {
			$message->from('zdalnaszkola@geckonet.pl', 'Zdalna Szkoła');
			$message->sender('zdalnaszkola@geckonet.pl', 'Zdalna Szkoła');
			$message->to($receiver, $name = null);
			// $message->cc($address, $name = null);
			// $message->bcc($address, $name = null);
			$message->replyTo('zdalnaszkola@geckonet.pl', 'Zdalna Szkoła');
			$message->subject('Program Zdalna Szkoła: dostarczamy sprzęt komputerowy');
			// $message->priority($level);
			
			$message->attach(storage_path('app/HP_250-255.pdf'));
		});
	}

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
		$result = DB::table('gminy2')->get();
		
		foreach($result as $gmina) {
			echo $gmina->gmina . "\r\n";
			
			$token = '';
			
			if($gmina->wlodarz_mail && filter_var(trim($gmina->wlodarz_mail), FILTER_VALIDATE_EMAIL)) {
				if(!$gmina->wlodarz_token) {
					$token = Str::random(128);
					
					DB::table('gminy2')->where('id', $gmina->id)->update(['wlodarz_token' => $token]);
				} else {
					$token = $gmina->wlodarz_token;
				}
				
				$this->sendTo($gmina->wlodarz_mail, $token, $gmina->id, 'w');
			
				sleep(10);
			}
			
			if($gmina->sekretarz_mail && filter_var(trim($gmina->sekretarz_mail), FILTER_VALIDATE_EMAIL)) {
				if(!$gmina->sekretarz_token) {
					$token = Str::random(128);
					
					DB::table('gminy2')->where('id', $gmina->id)->update(['sekretarz_token' => $token]);
				} else {
					$token = $gmina->sekretarz_token;
				}
				
				$this->sendTo($gmina->sekretarz_mail, $token, $gmina->id, 's');
			
				sleep(10);
			}
			
			if($gmina->informatyk_mail && filter_var(trim($gmina->informatyk_mail), FILTER_VALIDATE_EMAIL)) {
				if(!$gmina->informatyk_token) {
					$token = Str::random(128);
					
					DB::table('gminy2')->where('id', $gmina->id)->update(['informatyk_token' => $token]);
				} else {
					$token = $gmina->informatyk_token;
				}
				
				$this->sendTo($gmina->informatyk_mail, $token, $gmina->id, 'i');
				
				sleep(10);
			}
		}
    }
}
