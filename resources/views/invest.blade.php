<!--@extends('layouts.app')-->

@php ($title = __('invest.title'))

@section('style')
<style>
</style>
@endsection

@section('content')
<div class="main">
    <div class="main" id="example"></div>
</div>
@endsection

@section('script')
<script type="text/javascript" src="js/app.js"></script>
<script src="https://js.pusher.com/7.0/pusher.min.js"></script>
<script>
    // document.body.classList.add('sidebar-mini');
</script>
@endsection
