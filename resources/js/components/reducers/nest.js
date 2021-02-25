export const nest = (items, id = null, link = 'parent_id') => {
    return items && items
        .filter(item => item[link] === id)
        .map(item => ({ ...item, stages: nest(items, item.id) }));
};
