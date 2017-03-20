
let paramName="maps";
let paramCompare="compareTo";

/**
 * Encode maps to URI in binary form (string)
 * @returns {string} binary representation
 */
function encodeMapsToUrl(base) {
    // console.log(mapBitSet.toString());
    changeUrlParam(paramName, mapBitSet.toString(base));
}

/**
 * Decodes the selected maps from the url parameter.
 * @param encoded
 */
function decodeMapsFromUri() {

    let urlParam=getURLParameter(paramName);
    if(urlParam!=null)
        mapBitSet=BitSet("0x"+urlParam);
    if(getURLParameter(paramCompare)!=null){
        let otherBitSet=new BitSet('0x'+getURLParameter(paramCompare));

        mapBitSet=new BitSet();
        for(i=0; i<loadedMaps.length;i++){
            if(mapBitSet.get(i)!=1 && otherBitSet.get(i)!=1){
                mapBitSet.set(i,1);
            }
        }
    }
    //console.log(mapBitSet.toString().length);
}


function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
}

function changeUrlParam(param, value) {
    let currentURL = window.location.href + '&';
    let change = new RegExp('(' + param + ')=(.*)&', 'g');
    let newURL = currentURL.replace(change, '$1=' + value + '&');

    if (getURLParameter(param) !== null) {
        try {
            window.history.replaceState('', '', newURL.slice(0, -1));
        } catch (e) {
            console.log(e);
        }
    } else {
        let currURL = window.location.href;
        if (currURL.indexOf("?") !== -1) {
            window.history.replaceState('', '', currentURL.slice(0, -1) + '&' + param + '=' + value);
        } else {
            window.history.replaceState('', '', currentURL.slice(0, -1) + '?' + param + '=' + value);
        }
    }
}