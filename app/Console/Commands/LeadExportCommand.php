<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Mail;
use Rap2hpoutre\FastExcel\FastExcel;

class LeadExportCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'leads:get';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Get leads list from database';

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
        $result = \App\Lead::with([
                'user',
                'terytSimc',
                'terytUlic',
            ])
            ->get();

        $rows = [];

        $bar = $this->output->createProgressBar(count($result));
        $bar->start();

        foreach($result as $lead) {
            $bar->advance();

            $rows[] = [
                'name' => $lead->name,
                'city' => $lead->terytSimc->NAZWA,
                'street' => $lead->terytUlic ? $lead->terytUlic->NAZWA_1 : $lead->terytSimc->NAZWA,
                'building_num' => $lead->building_num,
                'apartment_num' => $lead->apartment_num,
                'phone' => $lead->phone,
                'contract_end_at' => $lead->contract_end_at,
                'offer' => $lead->offer,
                'user_added' => $lead->user->name,
                'created_at' => $lead->created_at->format('Y-m-d H:i:s'),
            ];
        }

        $bar->finish();

        $collection = collect($rows);

        (new FastExcel($collection))->export('storage/app/leads.xlsx');

        if(App::environment('production')) {
            Mail::send('emails.leads', [], function($message) {
                $message->from('erp@geckonet.pl', 'GeckoERP');
                $message->sender('erp@geckonet.pl', 'GeckoERP');
                $message->to('mateusz.brzeski@geckonet.pl', $name = null);
                $message->cc(['adam@geckonet.pl', 'radoslaw.sulkowski@geckonet.pl'], $name = null);
                // $message->bcc($address, $name = null);
                $message->replyTo('radoslaw.sulkowski@geckonet.pl', $name = null);
                $message->subject('Raport leady - '. Carbon::now()->format('Y-m-d'));
                // $message->priority($level);

                $message->attach(storage_path('app/leads.xlsx'));
            });
        }
    }
}
