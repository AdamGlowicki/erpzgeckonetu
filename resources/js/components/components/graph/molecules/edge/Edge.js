import React, {Fragment} from 'react';
import { getBezierPath, getMarkerEnd } from 'react-flow-renderer';
export default function CustomEdge({
                                       id,
                                       sourceX,
                                       sourceY,
                                       targetX,
                                       targetY,
                                       sourcePosition,
                                       targetPosition,
                                       arrowHeadType,
                                       markerEndId,
                                   }) {
    const edgePath = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });
    const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);
    return (
        <Fragment>
            <path id={id} style={{strokeWidth: '2', }} className="react-flow__edge-path" d={edgePath} markerEnd={markerEnd} />
        </Fragment>
    );
}
