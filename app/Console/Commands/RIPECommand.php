<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Ixudra\Curl\Facades\Curl;
use App\Ripe;

class RIPECommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ripe:dump';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fill RIPE table';

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
        $url = 'https://apps.db.ripe.net/db-web-ui/api/rest/fulltextsearch/select';
        $i = 0;
        
        while(true) {
            $response = Curl::to($url)
                ->withData(['facet' => 'true', 'format' => 'xml', 'hl' => 'true', 'q' => '((Poland) OR (.pl)) AND (object-type:organisation OR object-type:person)', 'start' => $i*10, 'wt' => 'json'])
                ->withContentType('application/json')
                ->withHeader('Accept: application/json, text/plain, */*')
                ->withHeader('X-Requested-With: XMLHttpRequest')
                ->withHeader('User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Safari/537.36')
                ->withHeader('Referer: https://apps.db.ripe.net/db-web-ui/')
                ->get();

            $json = json_decode($response);
            
            var_dump($url, $i);

            foreach($json->result->docs as $item) {
                foreach($item as $row) {
                    $element = [
                        'address' => '',
                        'email' => '',
                        'notify' => '',
                        'org_name' => '',
                        'descr' => '',
                        'ref_nfy' => '',
                        'person' => '',
                        'descr' => '',
                        'phone' => '',
                    ];
                    
                    foreach($row->strs as $prop) {                        
                        if($prop->str->name == 'notify' || $prop->str->name == 'e-mail' || $prop->str->name == 'ref-nfy') {
                            foreach($row->strs as $prop_) {
                                if($prop_->str->name == 'address') {
                                    $element['address'] = $prop_->str->value .', '. $element['address'];
                                }
                                
                                if($prop_->str->name == 'e-mail') {
                                    $element['email'] = $prop_->str->value;
                                }
                                
                                if($prop_->str->name == 'notify') {
                                    $element['notify'] = $prop_->str->value;
                                }
                                
                                if($prop_->str->name == 'ref-nfy') {
                                    $element['ref-nfy'] = $prop_->str->value;
                                }
                                
                                if($prop_->str->name == 'org-name') {
                                    $element['org_name'] = $prop_->str->value;
                                }
                                
                                if($prop_->str->name == 'phone') {
                                    $element['phone'] = $prop_->str->value;
                                }
                                
                                if($prop_->str->name == 'descr') {
                                    $element['descr'] = $prop_->str->value .', '. $element['descr'];
                                }
                                
                                if($prop_->str->name == 'person') {
                                    $element['person'] = $prop_->str->value;
                                }
                            }
                            
                            if(Ripe::where('email', $element['email'])->where('notify', $element['notify'])->first()) {
                                continue 2;
                            }
                            
                            Ripe::create([
                                'email' => (isset($element['email']) ? $element['email'] : null),
                                'notify' => (isset($element['notify']) ? $element['notify'] : null),
                                'address' => (isset($element['address']) ? $element['address'] : null),
                                'org_name' => (isset($element['org_name']) ? $element['org_name'] : null),
                                'ref_nfy' => (isset($element['ref_nfy']) ? $element['ref_nfy'] : null),
                                'phone' => (isset($element['ref_nfy']) ? $element['phone'] : null),
                                'descr' => (isset($element['descr']) ? $element['descr'] : null),
                                'person' => (isset($element['person']) ? $element['person'] : null),
                            ]);
                            
                            continue 2;
                        }
                    }
                }
            }
            $i++;
        }
    }
}
