import axios from 'axios';
import month from "./month";
import { Tty } from '@mui/icons-material';
export async function getPopupData(seq, zone, table) {
    console.log(seq, zone, table);
    let data;
    if (table === "1") {
        data = await SelParcelSTS1ByParcelSeq(seq, zone);
    }
    if (table === "2") {
        data = await SelPointSTS1ByParcelSeq(seq, zone);
    }
    console.log(data, "data");
    if (Array.isArray(data)) {
        if (data.length > 0) {
            if (table === "2") {
                data = data[0];
                console.log(data, "data");
                document.getElementById('inpseq1').value = data.PARCEL_S3_SEQ;
                document.getElementById('input1').value = data.ID;
                document.getElementById('input2').value = data.REMARK;
                document.getElementById('input3n').value = data.PARCEL_ID;
                document.getElementById('input10').value = data.NRAI;
                document.getElementById('input11').value = data.NNHAN;
                document.getElementById('input12').value = data.NWAH;
                document.getElementById('input13').value = data.TYPE_CODE;
                document.getElementById('input_stval').value = data.ST_VALUE;
                document.getElementById('input_stval1').value = data.STREET_VALUE_;
                document.getElementById('input14').value = data.STANDARD_DEPTH;
                document.getElementById('input15').value = data.DEPTH_R;
                document.getElementById('input16').value = data.LAND_TYPE_ID;
                document.getElementById('propertiespoint').hidden = false;
            }
            if (table === "1") {
                data = data[0];
                console.log(data, "data555555");
                SelOptTambol(data.PARCEL_S3_SEQ, data.OPT_CODE, zone);
                document.getElementById('input1_1').value = data.LAND_TYPE;
                document.getElementById('input2_1').value = data.PARCEL_ID
                document.getElementById('input3_1').value = data.AMPHUR_NAME_TH;
                // document.getElementById('input4_1').value = data.OPT_CODE;
                document.getElementById('input5_1').value = data.TYPE_CODE;
                document.getElementById('input6_1').value = data.LAND_TYPE_ID;
                document.getElementById('input10_1').value = data.DEPTH_R;
                document.getElementById('input11_1').value = data.ST_VALUE;
                document.getElementById('input7_1').value = data.NRAI;
                document.getElementById('input8_1').value = data.NNHAN;
                document.getElementById('input9_1').value = data.NWAH;
                document.getElementById('input4_1').disabled = data.OPT_CODE == null ? false : true;
                document.getElementById('propertiespolygon').hidden = false;
            }
        }
    }
}

async function SelParcelSTS1ByParcelSeq(seq, zone) {
    let obj;
    let url = process.env.REACT_APP_HOST_API + "/CALCULATE/SelParcelSTS1ByParcelSeq";
    let datasend = {
        "PARCEL_S3_SEQ": seq,
        "ZONE": zone
    }
    try {
        let res = await axios.post(url, datasend);
        let data = res.data;
        obj = data.result;
    } catch (e) {
        console.log(e);
    }
    return obj;
}
async function SelPointSTS1ByParcelSeq(seq, zone) {
    let obj;
    let url = process.env.REACT_APP_HOST_API + "/POINT/SelPointSTS1ByParcelSeq";
    let datasend = {
        "PARCEL_S3_SEQ": seq,
        "ZONE": zone
    }
    try {
        let res = await axios.post(url, datasend);
        let data = res.data;
        obj = data.result;
    } catch (e) {
        console.log(e);
    }
    return obj;
}

export async function UpdCreateRel(zone) {

    let obj;
    let url = process.env.REACT_APP_HOST_API + "/POINT/UpdPointEditSTS1_Table"
    let datasend = {
        "PARCEL_S3_SEQ": document.getElementById('inpseq1').value,
        "ZONE": zone,
        "PARCEL_TYPE": document.getElementById('input1').value,
        "DEPTH_R": document.getElementById('input15').value,
        "TABLE_NO": "1",
        "PARCEL_ID": document.getElementById('input3n').value,
        "TYPE_CODE": document.getElementById('input13').value,
        "NRAI": document.getElementById('input10').value,
        "NNHAN": document.getElementById('input11').value,
        "NWAH": document.getElementById('input12').value,
        "REMARK": document.getElementById('input2').value,
        "LAND_TYPE_ID": document.getElementById('input16').value,
    }
    // return datasend;
    try {
        let res = await axios.post(url, datasend);
        let data = res.data;
        obj = data.result;
        console.log(data, 'data');
    } catch (e) {

    }
    if (Array.isArray(obj) && obj.length > 0) {
        document.getElementById('propertiespoint').hidden = true;
    }
    return obj;
}
export async function UpdCreateRel2(zone) {
    let obj;
    let url = process.env.REACT_APP_HOST_API + "/POINT/UpdPointEditSTS2_Table"
    let datasend = {
        "PARCEL_S3_SEQ": document.getElementById('inputpointhidden').value,
        "ZONE": zone,
        "PARCEL_TYPE": document.getElementById('input1').value,
        "DEPTH_R": document.getElementById('input15').value,
        "TABLE_NO": "1",
        "PARCEL_ID": document.getElementById('input3n').value,
        "TYPE_CODE": document.getElementById('input13').value,
        "NRAI": document.getElementById('input10').value,
        "NNHAN": document.getElementById('input11').value,
        "NWAH": document.getElementById('input12').value,
        "REMARK": document.getElementById('input2').value,
        "LAND_TYPE_ID": document.getElementById('input16').value,
    }
    console.log(datasend);
    // return datasend;
    try {
        let res = await axios.post(url, datasend);
        let data = res.data;
        obj = data.result;
        console.log(data, 'data');
    } catch (e) {

    }
    if (Array.isArray(obj) && obj.length > 0) {
        document.getElementById('propertiespoint').hidden = true;
    }
    return obj;
}

const SelOptTambol = async (seq, val, zone) => {
    document.getElementById('inpseq').value = seq;
    const res = await fetch(process.env.REACT_APP_HOST_API + "/CALCULATE/SelOptTambol", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "PARCEL_S3_SEQ": seq + "",
            "MAPZONE": zone
        })
    });
    const response = await res.json();
    // console.log(response);
    if (response.status === "200") {
        var result = response.result
        var html = '<option value="">เลือกเทศบาล / ตำบล</option>';
        result.forEach((item, i) => {
            html += '<option value="' + item.OPT_CODE + '">' + item.OPT_NAME_TH + '</option>'
        })
        document.getElementById('input4_1').innerHTML = html;
        document.getElementById('input4_1').value = val
    }

}
export function getPopupData2(seq, zone, type, tt) {
    if (type === "1") {
        selParcelByParcelSeq(seq, zone, tt)
    }
    if (type === "2") {
        SelPointSTS2ByParcelSeq(seq, zone)
    }
}

const selParcelByParcelSeq = async (seq, zone, tt) => {
    const res = await fetch(process.env.REACT_APP_HOST_API + "/CALCULATE/selParcelByParcelSeq", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "PARCEL_S3_SEQ": seq + "",
            "MAPZONE": zone + ""
        })
    });
    const response = await res.json();
    if (response.status === "200") {
        document.getElementById('label1_1').style.color = 'black';
        document.getElementById('label2_1').style.color = 'black';
        document.getElementById('label3_1').style.color = 'gray';
        document.getElementById('label4_1').style.color = 'gray';
        document.getElementById('label5_1').style.color = 'black';
        document.getElementById('label6_1').style.color = 'black';
        document.getElementById('label7_1').style.color = 'gray';
        document.getElementById('label8_1').style.color = 'gray';
        document.getElementById('label9_1').style.color = 'gray';
        document.getElementById('label10_1').style.color = 'gray';
        document.getElementById('label11_1').style.color = 'gray';
        document.getElementById('input4_1').disabled = true;
        document.getElementById('input4_1').classList.add("Mui-disabled");
        document.getElementById("input4_1").parentNode.classList.add("Mui-disabled");
        document.getElementById('input5_1').disabled = false;
        document.getElementById('input5_1').classList.remove("Mui-disabled");
        document.getElementById("input5_1").parentNode.classList.remove("Mui-disabled");
        document.getElementById('input6_1').disabled = false;
        document.getElementById('input6_1').classList.remove("Mui-disabled");
        document.getElementById("input6_1").parentNode.classList.remove("Mui-disabled");
        document.getElementById('input7_1').disabled = true;
        document.getElementById('input7_1').classList.add("Mui-disabled");
        document.getElementById("input7_1").parentNode.classList.add("Mui-disabled");
        document.getElementById('input8_1').disabled = true;
        document.getElementById('input8_1').classList.add("Mui-disabled");
        document.getElementById("input8_1").parentNode.classList.add("Mui-disabled");
        document.getElementById('input9_1').disabled = true;
        document.getElementById('input9_1').classList.add("Mui-disabled");
        document.getElementById("input9_1").parentNode.classList.add("Mui-disabled");
        document.getElementById('savepolygon').hidden = false;
        var result = response.result[0]
        console.log(result, 'result');
        document.getElementById('inpseq1').value = result.PARCEL_S3_SEQ;
        document.getElementById('input1_1').value = result.LAND_TYPE;
        document.getElementById('input2_1').value = result.PARCEL_ID;
        document.getElementById('input3_1').value = result.AMPHUR_NAME_TH;
        // document.getElementById('input4_1').value = result.OPT_CODE;
        // document.getElementById('input5_1').value = result.OPT_NAME;
        document.getElementById('input6_1').value = result.TYPE_CODE;
        document.getElementById('input7_1').value = result.NRAI;
        document.getElementById('input8_1').value = result.NNHAN;
        document.getElementById('input9_1').value = result.NWAH;
        document.getElementById('input10_1').value = result.STANDARD_DEPTH;
        document.getElementById('input11_1').value = (result.ST_VALUE == undefined || result.ST_VALUE == null) ? 0 : numberWithCommas(result.ST_VALUE);
        document.getElementById('input12_1').value = (result.VAL_PER_WAH == undefined || result.VAL_PER_WAH == null) ? 0.00 : numberWithCommas(result.VAL_PER_WAH);
        document.getElementById('input13_1').value = (result.VALAREA == undefined || result.VALAREA == null) ? 0.00 : numberWithCommas(result.VALAREA);
    }
    SelOptTambol2(seq, result.OPT_CODE, zone)
    // document.getElementById('input5_1').value = result.TYPE_CODE;
    // document.getElementById('input6_1').value = result.PARCEL_SHAPE;
    SelAttach(seq, result.TYPE_CODE, zone, tt)
    SelParcelShp(seq, result.PARCEL_SHAPE)
    document.getElementById('propertiespolygon').hidden = false;

}
const SelOptTambol2 = async (seq, val, zone) => {
    document.getElementById('inpseq').value = seq;
    const res = await fetch(process.env.REACT_APP_HOST_API + "/CALCULATE/SelOptTambol", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "PARCEL_S3_SEQ": seq + "",
            "MAPZONE": zone + ""
        })
    });
    const response = await res.json();
    // console.log(response);
    if (response.status === "200") {
        var result = response.result
        var html = '<option value="">เลือกเทศบาล / ตำบล</option>';
        result.forEach((item, i) => {
            html += '<option value="' + item.OPT_CODE + '">' + item.OPT_NAME_TH + '</option>'
        })
        document.getElementById('input4_1').innerHTML = html;
        document.getElementById('input4_1').value = val
    }

}
const SelAttach = async (seq, val, zone, tt) => {
    const res = await fetch(process.env.REACT_APP_HOST_API + "/CALCULATE/SelAttach", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "PARCEL_S3_SEQ": seq + "",
            "MAPZONE": zone + "",
            "OPT_TYPE": tt + ""
        })
    });
    const response = await res.json();
    if (response.status === "200") {
        var result = response.result
        var html = '<option value="" data-stdepth="" data-stval="" data-stid="">เลือกหน่วยที่ดิน</option>';
        result.forEach((item, i) => {
            html += '<option value="' + item.TYPE_CODE + '" data-stdepth="' + item.STREET_DEPTH + '" data-stval="' + item.STREET_VALUE + '" data-stid="' + item.ID + '">' + item.TYPE_NAME + '</option>'
        })
        document.getElementById('input5_1').innerHTML = html;
        document.getElementById('input5_1').value = (val == null) ? '' : val;
    }


}
const SelParcelShp = async (seq, val) => {
    const res = await fetch(process.env.REACT_APP_HOST_API + "/CALCULATE/SelParcelShp");
    const response = await res.json();
    // console.log(response);
    if (response.status === "200") {
        var result = response.result
        var html = '<option value="">เลือกหน่วยที่ดิน</option>';
        result.forEach((item, i) => {
            html += '<option value="' + item.LAND_TYPE_ID + '" >' + item.LAND_TYPE_NAME + '</option>'
        })
        document.getElementById('input6_1').innerHTML = html;
        document.getElementById('input6_1').value = (val == null) ? '' : val;
    }


}
async function SelPointSTS2ByParcelSeq(seq, zone) {
    const res = await fetch(process.env.REACT_APP_HOST_API + "/POINT/SelPointSTS2ByParcelSeq", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "PARCEL_S3_SEQ": seq + "",
            "ZONE": zone + ""
        })
    });
    const response = await res.json();
    if (response.status === "200") {
        let result = response.result
        console.log(result, 'result');
        document.getElementById('inputpointhidden').value = result[0].PARCEL_S3_SEQ;
        document.getElementById('input1').value = result[0].ID;
        document.getElementById('input2').value = result[0].REMARK;
        document.getElementById('input3').value = result[0].REFERENCE_NO;
        document.getElementById('input3n').value = result[0].PARCEL_ID;
        document.getElementById('input10').value = result[0].NRAI;
        document.getElementById('input11').value = result[0].NNHAN;
        document.getElementById('input12').value = result[0].NWAH;
        document.getElementById('input13').value = result[0].TYPE_CODE;
        document.getElementById('input_stval').value = result[0].ST_VALUE;
        document.getElementById('input_stval1').value = result[0].STREET_VALUE_;
        document.getElementById('input14').value = result[0].STANDARD_DEPTH;
        document.getElementById('input15').value = result[0].DEPTH_R;
        document.getElementById('input16').value = result[0].LAND_TYPE_ID;
        document.getElementById('input17').value = numberWithCommas(result[0].VAL_PER_WAH);
        document.getElementById('input18').value = numberWithCommas(result[0].VALAREA);
        document.getElementById('propertiespoint').hidden = false;
    }

}
export const dateFormatTime = (date, method = null) => {
    if (method == null) {
        method = 'MONTH_NAME_TH'
    }

    if (date == null) {
        return ""
    }
    let datex = date.split("T")

    try {
        let newdate = datex[0].split("-")
        let year = newdate[0]
        let m = newdate[1]
        let d = newdate[2]
        let mname = ""

        for (var i in month) {
            if (month[i].MONTH_ID == m) {
                mname = month[i].MONTH_NAME_TH
            }
        }
        return String(parseInt(d)) + " " + mname + " " + (parseInt(year) + 543) + " " + datex[1].substring(0, 5)
    }
    catch {
        return false
    }
}
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

