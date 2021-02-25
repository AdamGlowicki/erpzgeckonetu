<?php

class Helpers {
    /**
     * Generate a URL to an application asset with a versioned timestamp parameter.
     * @param $path
     * @param null $secure
     * @return string
     */
    
    public static function asset($path, $secure = null) {
        $timestamp = @filemtime(public_path($path)) ?: 0;
        return $path . '?' . $timestamp;
    }
    
    public static function value($path, $array) {
        $result = explode('.', $path);
        
        foreach($result as $key) {
            $array = $array[$key];
        }
        
        return $array;
    }
}