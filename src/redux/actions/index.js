export const removeGeozona = id => ({ type: "REMOVE_GEOZONA", id });
export const editGeozona = obj => ({ type: "EDIT_GEOZONA", obj });
export const addGeozona = obj => ({ type: "ADD_GEOZONA", obj });
export const searchGeozona = word => ({ type: "SEARCH_GEOZONA", word });
export const emptyGeozona = _ => ({ type: "EMPTY_GEOZONA" });

