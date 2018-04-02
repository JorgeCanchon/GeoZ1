const URL = "http://visormapa.gear.host/services/DatosMapas/";

export const fetchGetDatos = async _ => {
    try {
       // Consumiendo Web api 
        let response = await fetch(`${URL}GetDatosMovil`);
        let data = [];
        if(response.status != 204){
            data = await response.json();
        }
        return data;
    } catch (ex) {
        alert(ex);
    }
}
export const fetchDeleteDatos = async id => {
    try {
        let config =
            {
                method: "DELETE"
            };
        let response = await fetch(`${URL}DeleteDatosMovil/${id}`, config);
        let data = await response.status;
        if (data >= 200 && data < 300) {
            return true;
        }
        return false;
    } catch (ex) {
        return false;
    }
}
export const fetchPostDatos = async obj => {
    try { 
        let config = 
            { 
                headers:
                    {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                     },
            method: "POST",
            body: JSON.stringify(obj)
            }
        let response = await fetch(`${URL}PostDatosMovil`, config);
        let res = await response.status;
        if (res >= 200 && res < 300) {
            return await response.json();
        }else{
            return false;
        }
    } catch (ex) {
        return false;
    }
}

export const fetchPutDatos = async (id, obj) => {
    try {
        let config =
            {
                headers:
                    {
                        'Access-Control-Allow-Origin': '*',
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                mode: 'cors',
                method: "PUT",
                body: JSON.stringify(obj)
            }
        let response = await fetch(`${URL}PutDatosMovil/${id}`, config);
        let data = await response.status;
        if (data >= 200 && data < 300) {
            return true;
        }
        return false;
    } catch (ex) {
        return false;
    }
}