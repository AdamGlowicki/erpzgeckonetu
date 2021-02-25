<?php

namespace App\Http\Controllers;

use App\AgreementFile;
use App\FolderFile;
use App\InvestFile;
use App\PostFile;
use App\PrevFile;
use App\SecondFile;
use App\SecondPostFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Webklex\IMAP\Facades\Client;
use Illuminate\Support\Str;

class MailController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {

    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    /**
     * Listen to mail folder for new mails and get attachments
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     * @throws \Webklex\PHPIMAP\Exceptions\ConnectionFailedException
     * @throws \Webklex\PHPIMAP\Exceptions\FolderFetchingException
     * @throws \Webklex\PHPIMAP\Exceptions\MaskNotFoundException
     */


    public function attachments(Request $request)
    {
        $imap = Client::account('default');
        $imap->connect();


        $folders = $imap->getFolders('INBOX');
        $requestTimeInSecond = round(microtime(true));

        while (true) {
            sleep(2);
            if (($requestTimeInSecond + ($request->time * 60)) == round(microtime(true))) {
                return;
            }

            foreach ($folders as $folder) {

                $messages = $folder->messages()->whereUnseen()->get();

                foreach ($messages as $message) {
                    $attachments = $message->getAttachments();
                    $code = $message->getSubject();
                    $date = $message->getDate();
                    $emailMillisecond = strtotime($date);

                if (($emailMillisecond < $requestTimeInSecond)) {
                    continue;
                }

                if ($code != $request->code) {
                    return response()->json('code reject', 404);
                }

                    foreach ($attachments as $attachment) {

                        $filename = $attachment->getName();
                        $extension = pathinfo($filename, PATHINFO_EXTENSION);;

                        if ($extension) {
                            $newFilename = Str::random(128) . '.' . $extension;
                        } else {
                            $newFilename = Str::random(128);
                        }

                        switch ($request->place) {
                            case 'prevFile':
                                if (!File::exists(storage_path('app/prevFile'))) {
                                    Storage::disk('local')->makeDirectory('prevFile/');
                                }

                                $attachment->save(storage_path('app/prevFile/'), $newFilename);
                                PrevFile::create(['data' => 'prevFile/' . $newFilename, 'name' => $filename, 'body_id' => $request->body_id]);

                                break;
                            case 'postFile':
                                if (!File::exists(storage_path('app/postFile'))) {
                                    Storage::disk('local')->makeDirectory('postFile/');
                                }

                                $attachment->save(storage_path('app/postFile/'), $newFilename);
                                PostFile::create(['data' => 'postFile/' . $newFilename, 'name' => $filename, 'body_id' => $request->body_id]);

                                break;
                            case 'secondFile':
                                if (!File::exists(storage_path('app/secondFile'))) {
                                    Storage::disk('local')->makeDirectory('secondFile/');
                                }

                                $attachment->save(storage_path('app/secondFile/'), $newFilename);
                                SecondFile::create(['data' => 'secondFile/' . $newFilename, 'name' => $filename, 'body_id' => $request->body_id]);

                                break;
                            case 'secondPostFile':
                                if (!File::exists(storage_path('app/secondPostFile'))) {
                                    Storage::disk('local')->makeDirectory('secondPostFile/');
                                }

                                $attachment->save(storage_path('app/secondPostFile/'), $newFilename);
                                SecondPostFile::create(['data' => 'secondPostFile/' . $newFilename, 'name' => $filename, 'body_id' => $request->body_id]);

                                break;
                            case 'investFiles':
                                if (!File::exists(storage_path('app/investFiles'))) {
                                    Storage::disk('local')->makeDirectory('investFiles');
                                    Storage::makeDirectory('investFiles/');
                                }

                                $attachment->save(storage_path('app/investFiles/'), $newFilename);
                                InvestFile::create(['data' => 'investFiles/' . $newFilename, 'name' => $filename, 'invest_id' => $request->stage_id]);

                                break;
                            case 'folderFiles':
                                if (!File::exists(storage_path('app/folderFiles'))) {
                                    Storage::disk('local')->makeDirectory('folderFiles/');
                                }

                                $attachment->save(storage_path('app/folderFiles/'), $newFilename);
                                FolderFile::create(['data' => 'folderFiles/' . $newFilename, 'name' => $filename, 'folder_id' => $request->folder_id]);

                                break;
                            case 'agreementFiles':
                                if (!File::exists(storage_path('app/agreements'))) {
                                    Storage::disk('local')->makeDirectory('agreements/');
                                }

                                $attachment->save(storage_path('app/agreements/'), $newFilename);
                                AgreementFile::create(['data' => 'agreements/' . $newFilename, 'name' => $filename, 'agreement_folder_id' => $request->agreement_folder_id]);

                                break;
                            default:
                                break;
                        }
                    }
                    $message->delete();
                    $imap->disconnect();
                    return;
                }
            }
        }

        return response()->json(null, 200);
    }
}
