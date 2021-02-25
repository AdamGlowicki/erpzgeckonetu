<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Webklex\IMAP\Facades\Client;

class Attachments extends Model
{
    public function attachments(Request $request, $callback)
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
                        return 404;
                    }

                    foreach ($attachments as $attachment) {

                        $filename = $attachment->getName();
                        $extension = pathinfo($filename, PATHINFO_EXTENSION);;

                        if ($extension) {
                            $newFilename = Str::random(128) . '.' . $extension;
                        } else {
                            $newFilename = Str::random(128);
                        }

                        $callback($attachment, $newFilename, $filename, $request);
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
