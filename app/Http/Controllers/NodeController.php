<?php

namespace App\Http\Controllers;

use App\Graph;
use App\Node;
use App\NodeData;
use App\Position;
use App\Style;
use Illuminate\Http\Request;

class NodeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $result = Graph::with([
            'nodes',
            'nodes.nodesData',
            'nodes.nodesData.styles',
            'nodes.positions',
            'nodes.handles',
        ])->get();

        return response()->json($result, 200);
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
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $node = $request->all();
        $newNode = Node::create(['type'=> $node['type'], 'graph_id' => $node['graph_id']]);
        $nodeData = NodeData::create(['label' => 'Nowy', 'node_id' => $newNode->id]);
        $style = $node['data']['style'];
        Style::create([
            'width' => $style['width'],
            'height' => $style['height'],
            'backgroundColor' => $style['backgroundColor'],
            'radius' => $style['radius'],
            'borderSize' => $style['borderSize'],
            'borderType' => $style['borderType'],
            'borderColor' => $style['borderColor'],
            'fontSize' => $style['fontSize'],
            'fontWeight' => $style['fontWeight'],
            'color' => $style['color'],
            'rotate' => $style['rotate'],
            'node_data_id' => $nodeData->id,
        ]);
        $position = $node['position'];
        Position::create(['x' => $position['x'], 'y' => $position['y'], 'node_id' => $newNode->id]);

        return response()->json($newNode, 200);
    }

    public function storeGraph(Request $req) {
        $graph = $req->all();
        $newGraph = Graph::create($graph);

        return response()->json($newGraph, 200);
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
        $name = $request->all();
        $graph = Graph::findOrFail($id)->update($name);

        return response()->json($graph, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $nodeToDelete = Node::findOrfail($id);
        $nodeToDelete->deleteNode($id);

    }

    public function destroyGraph($id) {
        $graphToDelete = Graph::findOrFail($id);
        $graphToDelete->deleteGraph($id);
    }
}
