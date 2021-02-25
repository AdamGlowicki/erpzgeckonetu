import {STAGES} from '../../../enums/Stages';
import {
    cabinets,
    compositePost,
    defaultMainStage,
    postForTransmitter,
    wiredLines
} from '../../../common/middleStageRow';
import {generateTasks} from '../../../common/generateTemplate';
import {CLIENT, MUFA, OLT} from '../../../common/taskLists';
import {TableName} from '../../../enums/table/tableName';
import {arrangements, cableLine, seizeRoad, toPd} from '../../../enums/table/headCells';
import {AgreementsStatus} from '../../../enums/table/agreementsStatus';
import {rowConst} from '../../../enums/table/rowConsts';
import {cellTemplate} from '../../../enums/CellTemplate';

const updateTask = (state, stageId, taskId, key, callback) => ({
    ...state,
    mainStage: state.mainStage.map(stage => {
        return stage.id === stageId ? {
            ...stage,
            tasks: [...stage.tasks.map(task => {
                return task.id === taskId ? {
                    ...task,
                    [key]: callback(task, key)
                } : {...task};
            })]
        } : {...stage}
    })
})

export const findTask = (stages, stageId, taskId, parentIds,) => {
    let nested = stages;
    let path = [];
    let index = [];
    if (parentIds) {
        parentIds.forEach(id => {
            index = [...index, nested.findIndex(obj => obj.id === id)]
            nested = nested.find(obj => obj.id === id).stages;
            path = [...path, 'stages']
        })
    }
    index = [...index, nested.findIndex(obj => obj.id === stageId)]
    nested = nested.find((stage) => stage.id === stageId).tasks;
    path = [...path, 'task']
    index = [...index, nested.findIndex(obj => obj.id === taskId)]
};

export const findMainIdInTree = (object) => {
    let ids = [];
    const findIdsInTree = (object) => {
        ids = [...ids, object.id];
        return (Array.isArray(object.stages) ? object.stages.map((stage) => findIdsInTree(stage)) : null)
    };
    findIdsInTree(object);
    return ids;
};

export const addInvestment = (state, payload) => ({
    ...state,
    mainStage: [...state.mainStage, payload]
});

export const removeTask = (state, payload) => ({
    ...state,
    mainStage: [...state.mainStage.map(stage => {
        return stage.id === payload.stageId ? {
            ...stage,
            tasks: stage.tasks.filter(task => task.id !== payload.taskId)
        } : stage
            ;
    })]
});

export const changeStatus = (state, payload) => {
    return {
        ...state,
        mainStage: [...state.mainStage.map(stage => {
            return stage.id === payload.stageId ? {
                ...stage,
                tasks: [...stage.tasks.map(task => {
                    return task.id === payload.id ? {
                        ...task,
                        status: payload.status,
                    } : {...task}
                })]
            } : {...stage}
        })],
    };
};

export const updateName = (state, payload) => ({
    ...state,
    mainStage: state.mainStage.map(stage => {
        if (stage.id === payload.stageId) {
            stage.tasks.map(task => {
                if (task.id === payload.id) {
                    task.name = payload.value
                }
                return {...task}
            })
        }
        return {...stage}
    }),
    modalData: {
        ...state.modalData,
        name: payload.value
    }

});

export const updateMiniNote = (state, payload) => ({
    ...state,
    mainStage: [...state.mainStage.map(stage => {
        if (stage.id === payload.stageId) {
            stage.tasks.map(task => {
                if (task.id === payload.taskId) {
                    task.mini_note = payload.mini_note;
                }
                return {...task}
            })
        }
        return {...stage}
    })
    ]
})

export const addMiddleStage = (state, payload) => ({
    ...state,
    mainStage: [...state.mainStage, {...payload}],
});

export const findIndexes = (state, stageId, taskId) => {
    const stageIndex = state.mainStage.findIndex(stage => stage.id === stageId);
    const taskIndex = taskId && state.mainStage[stageIndex].tasks.findIndex(task => task.id === taskId);

    return ({stageIndex, taskIndex})
};

export const chooseTemplate = (stage = [], stageId) => {
    switch (stage) {
        case STAGES.Default:
            return defaultMainStage(stageId);
        case STAGES.Cabinet:
            return cabinets(stageId);
        case STAGES.CompositePost:
            return compositePost(stageId);
        case STAGES.TransponderPost:
            return postForTransmitter(stageId);
        case STAGES.LineEnerga:
            return wiredLines(stageId);
        case STAGES.LineEnea:
            return wiredLines(stageId);
        case STAGES.OltStage:
            return generateTasks(OLT, stageId);
        case STAGES.ClientName:
            return generateTasks(CLIENT, stageId);
        case STAGES.MufaPower:
            return generateTasks(MUFA, stageId);
    }
};

export const chooseTable = (table, ids) => {
    switch (table) {
        case TableName.ARRANGEMENTS:
            return arrangements;
        case TableName.CABLE_LINE:
            return cableLine;
        case TableName.SEIZE_STREET:
            return seizeRoad;
        case TableName.ROUTE_TO_PD:
            return toPd;
    }
};

export const removeFileFromCell = (state, payload) => (
    {
        ...state,
        mainStage: [...state.mainStage.map(stage => {
            if (stage.id === payload.stageId) {
                stage.files = [...stage.files.filter(file => file.id !== payload.id)]
            }
            return {...stage}
        })]
    }
);

export const removeFileFromFolder = (state, payload) => {
    const callback = (obj, key) => ([
        ...obj[key].map(folder => {
            return folder.id === payload.folderId ? {
                ...folder,
                folder_files: [...folder.folder_files.filter(file => file.id !== payload.id)]
            } : {...folder}
        })
    ])
    return updateTask(state, payload.stageId, payload.taskId, 'folders', callback)
};

export const updateTableTitle = (state, payload) => ({
    ...state,
    mainStage: [...state.mainStage.map(stage => {
        return stage.id === payload.stageId ? {
            ...stage,
            tasks: [...stage.tasks.map(task => {
                return task.id === payload.id ? {
                    ...task,
                    table: {
                        ...task.table,
                        title: payload.tableTitle
                    }
                } : {...task}
            })]
        } : {...stage}
    })]
});

export const setFirstColumn = (state, payload) => (
    {
        ...state,
        mainStage: [...state.mainStage.map(stage => {
            return stage.id === payload.stageId ? {
                ...stage,
                stage: [...stage.tasks.map(task => {
                    return task.id === payload.taskId ? {
                        ...task,
                        task: [...task.table.body.map(row => {
                            return row.id === payload.id ? {
                                ...row,
                                title: payload.value
                            } : {...row}
                        })]
                    } : {...task}
                })]
            } : {...stage}
        })]
    });

export const removeFileFromTable = (state, payload, key) => ({
    ...state,
    mainStage: [...state.mainStage.map(stage => {
        return stage.id === payload.stageId ? {
            ...stage,
            tasks: [...stage.tasks.map(task => {
                return task.id === payload.taskId ? {
                    ...task,
                    table: {
                        ...task.table,
                        body: [...task.table.body.map(row => {
                            return row.id === payload.rowId ? {
                                ...row,
                                [key]: [...row[key].filter(file => file.id !== payload.id)]
                            } : {...row}
                        })]
                    }

                } : {...task}
            })]
        } : {...stage}
    })]
});

export const editMainCellName = (state, payload) => ({
        ...state,
        mainStage: [...state.mainStage.map(stage => {
            if (stage.id === state.editData.stageId) {
                stage.stage_name = payload
            }
            return {...stage}
        })]
    }
);

export const addFileToTable = (state, payload, key) => ({
    ...state,
    mainStage: [...state.mainStage.map(stage => {
        return stage.id === payload.stageId ? {
            ...stage,
            tasks: [...stage.tasks.map(task => {
                return task.id === payload.taskId ? {
                    ...task,
                    table: {
                        ...task.table,
                        body: [...task.table.body.map(row => {
                            return row.id === payload.rowId ? {
                                ...row,
                                [key]: row[key] ? (
                                    [...row[key], {
                                        id: payload.id,
                                        data: payload.data,
                                        name: payload.file.name,
                                    }]
                                ) : (
                                    [{id: payload.id, data: payload.data, name: payload.file.name,}]
                                )
                            } : {...row}
                        })]
                    }
                } : {...task}
            })]
        } : {...stage}
    })],
});

export const setTableData = (state, payload, key) => ({
    ...state,
    mainStage: [...state.mainStage.map(stage => {
        return stage.id === payload.stageId ? {
            ...stage,
            task: [...stage.tasks.map(task => {
                return task.id === payload.taskId ? {
                    ...task,
                    table: {
                        ...task.table,
                        body: [...task.table.body.map(row => {
                            return row.id === payload.rowId ? {
                                ...row,
                                [key]: payload.value
                            } : {...row}
                        })]
                    }
                } : {...task}
            })]
        } : {...stage}
    })]
});

export const updateTableStatus = (state, payload) => ({
    ...state,
    mainStage: [...state.mainStage.map(stage => {
        return stage.id === payload.stageId ? {
            ...stage,
            tasks: [...stage.tasks.map(task => {
                return task.id === payload.taskId ? {
                    ...task,
                    task: [...task.table.body.map(row => {
                        return row.id === payload.rowId ? {
                            ...row,
                            status: payload.value,
                        } : {...row}
                    })]
                } : {...task}
            })]
        } : {...stage}
    })]
});

export const updateSecondTableStatus = (state, payload) => ({
    ...state,
    mainStage: [...state.mainStage.map(stage => {
        return stage.id === payload.stageId ? {
            ...stage,
            tasks: [...stage.tasks.map(task => {
                return task.id === payload.taskId ? {
                    ...task,
                    task: [...task.table.body.map(row => {
                        return row.id === payload.rowId ? {
                            ...row,
                            second_status: payload.value,
                        } : {...row}
                    })]
                } : {...task}
            })]
        } : {...stage}
    })],
});

export const deleteTable = (state, payload) => ({
    ...state,
    mainStage: [...state.mainStage.map(stage => {
        return stage.id === payload.stageId ? {
            ...stage,
            tasks: [...stage.tasks.map(task => {
                return task.id === payload.id ? {
                        ...task,
                        table: null
                    }
                    : {...task}
            })]
        } : {...stage}
        return {...stage}
    })]
});

export const setIfAllFilesUploaded = (state, payload, key) => ({
    ...state,
    mainStage: [...state.mainStage.map(stage => {
        return stage.id === payload.stageId ? {
            ...stage,
            tasks: [...stage.tasks.map(task => {
                return task.id === payload.taskId ? {
                    ...task,
                    table: {
                        ...task.table,
                        body: [...task.table.body.map(row => {
                            return row.id === payload.rowId ? {
                                ...row,
                                [key]: payload.checked
                            } : {...row}
                        })]
                    }
                } : {...task}
            })]
        } : {...stage}
    })],
});

export const addTable = (state, payload,) => ({
    ...state,
    mainStage: [...state.mainStage.map(stage => {
        return stage.id === payload.stageId ? {
            ...stage,
            tasks: [...stage.tasks.map(task => {
                return task.id === payload.id ? {
                    ...task,
                    table: {
                        id: payload.data.id,
                        title: payload.data.title,
                        type: payload.data.title,
                    },
                } : {...task}
            })]
        } : {...stage}
        return {...stage}
    })],
});

export const addRow = (state, payload) => ({
        ...state,
        mainStage: [...state.mainStage.map(stage => {
            return stage.id === payload.stageId ? {
                ...stage,
                task: [...stage.tasks.map(task => {
                    return task.id === payload.id ? {
                        ...task,
                        table: {
                            ...task.table,
                            body: [...task.table.body, payload.data]
                        }
                    } : {...task}
                })]
            } : {...stage}
        })]
    }
);

export const removeTableRow = (state, payload) => ({
        ...state,
        mainStage: [...state.mainStage.map(stage => {
            return stage.id === payload.stageId ? {
                ...stage,
                stage: [...stage.tasks.map(task => {
                    return task.id === payload.taskId ? {
                        ...task,
                        table: {
                            ...task.table,
                            body: [...task.table.body.filter(row => row.id !== payload.rowId)]
                        },
                    } : {...task}
                })]
            } : {...stage}
        })]
    }
);

export const addColumn = (state, payload) => ({
        ...state,
        mainStage: [...state.mainStage.map(stage => {
            return stage.id === payload.stageId ? {
                ...stage,
                tasks: [...stage.tasks.map(task => {
                    return task.id === payload.taskId ? {
                        ...task,
                        table: {
                            ...task.table,
                            body: [...task.table.body.map(row => {
                                return row.id === payload.rowId ? {
                                    ...row,
                                    is_second_table: payload.value,
                                } : {...row}
                            })]
                        }
                    } : {...task}
                })]
            } : {...stage}
        })]

    }
);

export const updateFolderName = (state, payload) => {
    const callback = (obj, key) => ([
        ...obj[key].map(folder => {
            return folder.id === payload.id ? {
                ...folder,
                folder_name: payload.value
            } : {...folder}
        })
    ])

    return updateTask(state, payload.stageId, payload.taskId, 'folders', callback)
}

export const addFolder = (state, payload) => ({
    ...state,
    mainStage: [...state.mainStage.map(stage => {
        return stage.id === payload.ids.stageId ? {
            ...stage,
            tasks: [...stage.tasks.map(task => {
                return task.id === payload.ids.taskId ? {
                    ...task,
                    folders: task.folders ? [...task.folders, {...payload.data}] : [{...payload.data}]
                } : {...task};
            })]
        } : {...stage};
    })]
});

export const addCell = (state, payload) => {

    return {
        ...state,
        mainStage: [...state.mainStage.map(stage => {
            return stage.id === payload.stageId ? {
                ...stage,
                tasks: [...stage.tasks, cellTemplate(payload.id)].map(task => {
                    const updated = payload.updatedTasks.find(updated => updated.id === task.id)
                    return {...task, position: updated.position}
                })
            } : {...stage}
        })]
    };
};

export const removeFolder = (state, payload) => {
    const callback = (obj, key) => ([
        ...obj[key].filter(folder => folder.id !== payload.data.id)
    ])

    return updateTask(state, payload.stageId, payload.taskId, 'folders', callback)
};

export const addInvestFile = (state, payload) => ({
    ...state,
    mainStage: [...state.mainStage.map(stage => {
        if (stage.id === payload.stageId) {
            stage.files = [...stage.files, {
                id: payload.id,
                data: payload.data,
                name: payload.file.name,
            }]
        }
        return {
            ...stage
        }
    })]
});

export const addFileToFolder = (state, payload) => {

    const callback = (obj, key) => ([
        ...obj[key].map(folder => {
            return folder.id === payload.folderId ? {
                ...folder,
                folder_files: folder.folder_files ? ([...folder.folder_files, {
                    id: payload.id,
                    data: payload.data,
                    name: payload.file.name,
                }]) : ([{
                    id: payload.id,
                    data: payload.data,
                    name: payload.file.name,
                }])
            } : {...folder}
        })
    ])

    return updateTask(state, payload.stageId, payload.taskId, 'folders', callback)
};

export const updateNote = (state, payload) => ({
    ...state,
    mainStage: [...state.mainStage.map(stage => {
        return stage.id === payload.stageId ? {
            ...stage,
            tasks: [...stage.tasks.map(task => {
                return task.id === payload.id ? {
                    ...task,
                    notes: payload.stateNote,
                } : {...task}
            })]
        } : {...stage}
    })],
});

export const updateAdditionalCell = (state, payload) => ({
    ...state,
    mainStage: [...state.mainStage.map(stage => {
        if (stage.id === payload.id) {
            stage.client = payload
        }
        return {...stage}
    })]
});

export const updateMainInvest = (state, payload) => ({
    ...state,
    mainStage: [...state.mainStage.map(stage => {
        return stage.id === payload.id ? {
            ...stage,
            ...payload.data,
            drawer_id: payload.drawer_id,
        } : {...stage}
    })]
})

export const setPermissions = (state, permissions) => ({
    ...state,
    permissions,
})

export const updateInvestmentId = (state, payload) => ({
    ...state,
    mainStage: [...state.mainStage.map(stage => {
        return stage.id === payload.id ? {
            ...stage,
            investment_id: payload.investment_id
        } : {...stage}
    })]
})

export const updateOrderTasks = (state, payload) => ({
    ...state,
    mainStage: [...state.mainStage.map(stage => {
        return stage.id === payload.stageId ? {
            ...stage,
            tasks: [...payload.tasks]
        } : {...stage}
    })]
})

export const saveDrawer = (state, payload) => ({
    ...state,
    drawers: [...state.drawers, payload]
})

export const updateDrawers = (state, payload) => ({
    ...state,
    drawers: [...state.drawers.map(drawer => {
        return drawer.id === payload.id ? {
            ...drawer,
            name: payload.name
        } : {...drawer}
    })]
})

export const deleteDrawer = (state, payload) => ({
    ...state,
    drawers: [...state.drawers.filter(drawer => drawer.id !== payload)]
})

