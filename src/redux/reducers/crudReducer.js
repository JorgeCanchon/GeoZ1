const crudReducers = (state = [], action) => {
    switch (action.type) {
        case 'ADD_GEOZONA':
            return [
                ...state,
                crudReducer(undefined, action)
            ]
        case 'EDIT_GEOZONA':
            return state.map(
                data => crudReducer(data, action)
            );
        case 'REMOVE_GEOZONA':
            return crudReducer(state, action);
        case 'SEARCH_GEOZONA':
            return state.map(
                data => crudReducer(data, action)
            );
        case 'EMPTY_GEOZONA':
            return [];
        default:
            return state;
    }
}
const crudReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_GEOZONA':
            return {
                id: action.obj.IdMapaMovil,
                nombre: action.obj.Nombre,
                description: action.obj.Descripcion,
                lat: action.obj.Lat,
                lng: action.obj.Lng,
                tipo: action.obj.TipoGeozona,
                radio: action.obj.Radio,
                view: true,
                open: false
            }
        case 'EDIT_GEOZONA':
            if (state.id !== action.obj.IdMapaMovil) {
                return state;
            }
            return {
                ...state,
                nombre: action.obj.Nombre,
                description: action.obj.Descripcion,
                lat: action.obj.Lat,
                lng: action.obj.Lng,
                tipo: action.obj.TipoGeozona,
                radio: action.obj.Radio,
                view: true,
                open: false
            }
        case 'REMOVE_GEOZONA':
            return [
                ...state.filter(x => x.id !== action.id)
            ];
        case 'SEARCH_GEOZONA':
            if (state.nombre.indexOf(action.word) >= 0) {
                return {
                    ...state,
                    view: true
                }
            }
            return {
                ...state,
                view: false
            }
        default:
            return state;
    }
}
export default crudReducers;
