class Util{
    allowDrop(ev) {
       ev.preventDefault();
   }
   drag(ev) {
       ev.dataTransfer.setData("text", ev.target.id);
       document.getElementById("div3").innerHTML =document.getElementById("div3").innerHTML+document.getElementById(ev.target.id).parentNode.id+" " +ev.target.id+","
   }
   drop2(ev) {
       ev.preventDefault();
       var data = ev.dataTransfer.getData("text");
       //console.log("al trash;"+ev.target,data);
       //ev.target.appendChild(document.getElementById(data));
       let elemt=document.getElementById(data);
       //console.log("al trash;"+elemt);
       if(confirm("se eliminará permanentemente"))
           elemt.remove();
   }    
   sendData = async  (objToSend) => {
    document.getElementById("loader").style.display = ""
       //console.log("sendData",JSON.stringify(objToSend));
       const fetchDetail = fetch(`https://setstaffinghttp.azurewebsites.net/api/setstaffinghttp`, {
           method: 'POST',
           body:JSON.stringify(objToSend),
           headers: {
               //'Content-Type': 'application/x-www-form-urlencoded',
               'Content-Type': 'application/json',
           }
       }).then(r => r.json()).catch((error) => {
           console.error(error);
       });
       document.getElementById("loader").style.display = "none"
       return fetchDetail;
   }
   asynGetFromDB = async (url,ptoken,ptime) => { 
        document.getElementById("loader").style.display = ""
        let obj={token:ptoken,time:ptime}
        const fetchData= await fetch(url, {
           method: 'POST',
           body:JSON.stringify(obj),
           headers: {
               //'Content-Type': 'application/x-www-form-urlencoded',
               'Content-Type': 'application/json',
           }
       }).then(r => r.json()).catch((error) => {
           console.log(error);
       });
       //console.log("asynGetFromDB",fetchData);
       document.getElementById("loader").style.display = "none"
       return fetchData;
   }
   sendToServer(){
        document.getElementById("loader").style.display = "";
       let modifyData=projList.getChanged();
       //console.log("modify data",modifyData);
       if(modifyData.length>0){
           var objToSend={data:modifyData,token:myToken,time:myTime}
           //console.log("enviar a server",objToSend);
           this.sendData(objToSend).then((fetchDetail)=>{  
               //console.log("retorno fetchdetail",fetchDetail);
               //var ret= JSON.parse(fetchDetail);
               //console.log("fetchDetail",fetchDetail.code)
               document.getElementById("loader").style.display = "none";
               if(fetchDetail.code==0){
                   //console.log("entro a limpiar dirty")
                   // si todo ok, limpia el arreglo con los cambios
                   projList.cleanChanged();
                   alert("La información se actualizó exitosamente");
               // Response: "{ "status": "cambio en dedicacion errado", "code": 1, "orig": 42.86, "chg": 22.86 }"
               }else alert("No se pudo realizar la actualizacion. Valor original "+fetchDetail.orig+" cambio por "+fetchDetail.chg)
           });
       }else alert("No se ha modificado datos");
   }
}
class Render{
   constructor(){
       let f1=(obj)    => { let edo=obj.Fase;
                            let prop=edo.indexOf("Lead")>0 ||edo.indexOf("Propuesta")>0?"style='font-weight:normal;color:orange'":"style='font-weight:bold;'";
                            return `<div class="proyecto" id="${obj.IDp}.${obj.fase}.${obj.mes}"  ondrop="staffing.drop(event)" ondragover="util.allowDrop(event)">
                               <span ${prop}>${obj.IDp}-${obj.proyecto} </span> con la fase: ${obj.fase} en el mes ${obj.mes}  -
                               <span id="ref-${obj.IDp}.${obj.fase}.${obj.mes}" style="color:green"></span>&nbsp;&nbsp;cambio por:&nbsp;&nbsp;
                               <span id="chng-${obj.IDp}.${obj.fase}.${obj.mes}" style="color:green"></span>   
                               <div >
                                   <button type="button" class="btn_lite" style="margin-left:1px;" onclick="bw_mostrar(${obj.IDp},${obj.fase},${obj.mes})" name="bw-${obj.IDp}.${obj.fase}.${obj.mes}" id="bw-${obj.IDp}.${obj.fase}.${obj.mes}">detail &#62;</button>
                                   <button type="button" class="btn_lite" onclick="bwi_info(${obj.IDp},${obj.fase},${obj.mes})" name="bwi-${obj.IDp}.${obj.fase}.${obj.mes}" id="bwi-${obj.IDp}.${obj.fase}.${obj.mes}">info &#62;</button> 
                                   <button type="button" class="btn_lite" style="margin-left:1px;" onclick="bpv_show(${obj.IDp},${obj.fase},${obj.mes})" name="bpv-${obj.IDp}.${obj.fase}.${obj.mes}" id="bpv-${obj.IDp}.${obj.fase}.${obj.mes}">project &#62;</button>                                                                                             
                               </div>`;
                            }
       let f2=(obj,arr)=>  `<div id="c-${arr.nombre}-${obj.IDp}.${obj.fase}.${obj.mes}-${arr.inOnSite}" dragable="false"  class="card" style="background-color:${arr.inOnSite==1?'blue':'#e6f9ff'}">
                               <input type="text" name="nombre" readonly style="width: 120px;" value="${arr.nombre}">
                               <input type="text" id="id-${arr.nombre}-${obj.IDp}.${obj.fase}.${obj.mes}-${arr.inOnSite}" onchange="tx_dedichange('${arr.nombre}','${obj.IDp}','${obj.fase}','${obj.mes}',${arr.inOnSite})" style="width: 39px;" value="${arr.dedicacion}">
                               </div>`;
       let f3=(o)      =>  `<div id="t-${o.name}" draggable="true" class="card" ondragstart="util.drag(event)">
                               <input type="text" name="nombre" readonly class="name" value="${o.name}">
                               <input type="text" name="${o.name}" style="width:30px" value="0">
                               <button type="button" onclick="bt_filterProj('f-${o.name}')" name="f-${o.name}" id="f-${o.name}">f</button>
                            </div>`;
       let f4=(o)      =>  `<option value="${o.proyecto}">${o.proyecto}-${o.nb_proyecto}</option>`;
       let f5=(o,el)      =>  `<tr>
                                <td>${o.id}</td>
                                <td>${el.fase}</td>
                                <td>${(!el.hrs ? el.hrs : el.hrs.toFixed(2))}</td>
                                <td>${(!el.weeks ? el.weeks : el.weeks.toFixed(2))}</td>
                                <td>${(!el.dura_sem ? el.dura_sem : el.dura_sem.toFixed(2))}</td>
                               </tr>`;
       let f6=(o,el)      =>  `<tr>
                               <td>Total:</td>
                                <td>${o.length}</td>
                                <td>${(el.total_hrs.toFixed(2))}</td>
                                <td>${(el.total_week.toFixed(2))}</td>
                                <td>${(el.calendar_week.toFixed(2))}</td>
                              </tr>`;            
       let f7=(o)          => `<div class="${o.clase}">
                                <span class="nb">${o.key}</span>
                                <input class="dedi" readonly id="sp-${o.key}-${o.mes}" value="${o.dedi}">
                                <span>%</span>
                               </div>`;                
       let f8=(o)          => `<div id="t-${o.nombre}-${o.IDp}.${o.fase}.${o.mes}-${o.inOnSite}" draggable="true" class="card" ondragstart="util.drag(event)">
                                <input type="text" name="nombre" class="name" readonly value="${o.nombre}">
                                <input type="text" name="${o.nombre}" style="width:30px" id="id-${o.nombre}-${o.IDp}.${o.fase}.${o.mes}-${o.inOnSite}" onchange="tx_dedichange('${o.nombre}','${o.IDp}','${o.fase}','${o.mes}',${o.inOnSite})" value="${o.dedicacion}">
                                <input type="checkbox" id="cb-${o.nombre}-${o.IDp}.${o.fase}.${o.mes}-${o.inOnSite}" onclick="click_checkbox('${o.nombre}',${o.IDp},${o.fase},${o.mes},${o.inOnSite})">
                               </div>`;
       let f9=(o,arr)      =>  {   //console.log("f9"+arr.nombre,typeof arr.dirty ==="undefined")
                                   if(typeof arr.dirty !=="undefined"){ 
                                       if(arr.dirty==1){ 
                                           //console.log("f9",arr.dirty)
                                           return `<tr><td>${arr.nombre}</td><td>${o.IDp}</td><td>${o.fase}</td><td>${arr.dedicacion}</td><td>${arr.original}</td><td>${arr.inOnSite}</td></tr>`;
                                       }
                                   }else return "";
                               }
        let f10=(arr)      =>  `<tr><td>${arr.nombre_persona}</td><td>${arr.proyecto}</td><td>${arr.Fase}</td><td>${arr.po_dedicacion}</td><td>${arr.po_original}</td><td>${arr.inOnSite}</td></tr>`;
        let f11=(o)      => { 
                                let btn_plus=""
                                let travel=""
                                let rowMo=new Map()
                                if(o.ind==0)
                                    btn_plus=`<button onclick="mostrarProy('${'h.'+o.nombre_persona}')">+</button>`;
                                if(o.inOnSite==1)
                                    travel='<img src="image/avion.svg" width="18px">'
                                rowMo.set(0,`<tr name="${o.ind==0?'o.'+o.nombre_persona:'h.'+o.nombre_persona}" class="${o.ind==0?'head-cell':''}" style="${o.ind==0?'':'display:none'}">
                                    <td class="${o.ind==0?'head-cell-left':''}" >${btn_plus} ${o.nombre_persona} ${travel}</td>
                                    <td class="${o.ind==0?'head-cell':''}" >${o.proyecto}-${o.nb_proyecto}</td>
                                    <td class="${o.ind==0?'head-cell':''}" >${o.fase}</td>`);
                                rowMo.set(1,`<td class="${o.ind==0?'head-cell':''}" ${this.formatCell(o.pEne)} >${o.pEne==null?0:(o.pEne*100).toFixed(2)+'%'}</td>`);
                                rowMo.set(2,`<td class="${o.ind==0?'head-cell':''}" ${this.formatCell(o.pFeb)}>${o.pFeb==null?0:(o.pFeb*100).toFixed(2)+'%'}</td>`);
                                rowMo.set(3,`<td class="${o.ind==0?'head-cell':''}" ${this.formatCell(o.pMar)}>${o.pMar==null?0:(o.pMar*100).toFixed(2)+'%'}</td>`);
                                rowMo.set(4,`<td class="${o.ind==0?'head-cell':''}" ${this.formatCell(o.pAbr)}>${o.pAbr==null?0:(o.pAbr*100).toFixed(2)+'%'}</td>`);
                                rowMo.set(5,`<td class="${o.ind==0?'head-cell':''}" ${this.formatCell(o.pMay)}>${o.pMay==null?0:(o.pMay*100).toFixed(2)+'%'}</td>`);
                                rowMo.set(6,`<td class="${o.ind==0?'head-cell':''}" ${this.formatCell(o.pJun)}>${o.pJun==null?0:(o.pJun*100).toFixed(2)+'%'}</td>`);
                                rowMo.set(7,`<td class="${o.ind==0?'head-cell':''}" ${this.formatCell(o.pJul)}>${o.pJul==null?0:(o.pJul*100).toFixed(2)+'%'}</td>`);
                                rowMo.set(8,`<td class="${o.ind==0?'head-cell':''}" ${this.formatCell(o.pAgo)}>${o.pAgo==null?0:(o.pAgo*100).toFixed(2)+'%'}</td>`);
                                rowMo.set(9,`<td class="${o.ind==0?'head-cell':''}" ${this.formatCell(o.pSep)}>${o.pSep==null?0:(o.pSep*100).toFixed(2)+'%'}</td>`);
                                rowMo.set(10,`<td class="${o.ind==0?'head-cell':''}" ${this.formatCell(o.pOct)}>${o.pOct==null?0:(o.pOct*100).toFixed(2)+'%'}</td>`);
                                rowMo.set(11,`<td class="${o.ind==0?'head-cell':''}" ${this.formatCell(o.pNov)}>${o.pNov==null?0:(o.pNov*100).toFixed(2)+'%'}</td>`);
                                rowMo.set(12,`<td class="${o.ind==0?'head-cell':''}" ${this.formatCell(o.pDic)}>${o.pDic==null?0:(o.pDic*100).toFixed(2)+'%'}</td>`);
                                let rows=rowMo.get(0);
                                for(let m=INITIALMONTH;m<INITIALMONTH+MONTHTOSHOW;m++){
                                    if(m!=0)
                                        if(rowMo.get(m))
                                            rows=rows+rowMo.get(m);
                                }
                                return rows+"</tr>"
                            }
                                                     
       this.fm = new Map();
       this.fm.set( "proyecto_calendario",f1 );
       this.fm.set( "team_staffing",f2 );
       this.fm.set( "miembros_equipo",f3 );
       this.fm.set( "lista_proyectos",f4 );
       this.fm.set( "resumen_proyecto",f5 );
       this.fm.set( "total_proyecto",f6 );
       this.fm.set( "total_persona_mes",f7 );
       this.fm.set( "drop_persona",f8 );
       this.fm.set( "cambios_staff",f9 );
       this.fm.set( "historial_cambios",f10 );
       this.fm.set( "fact_personas",f11 );
   }
   formatCell(valor){
        let v=valor==null?0:valor;
        v=v*100;
        let rango=""
        if(v<=30)
            rango="#b3b3ff"
        else if(v>30 && v<=50)
            rango="#ffcc66"
        else if(v>50 && v<=100)
            rango="#33cc33"
        else rango="#ff6699";
         
        return v==0?`style="background-color:white;color:#b3b3ff;"`:`style="background-color:${rango};"`;
   }
   send(o,i){
       return this.fm.get(i)(o);
   }
   sendTable(arr,i,encab,e_encab,tag,e_tag){
       var t=encab;
       arr.forEach(o =>{
           t+=tag+this.fm.get(i)(o)+e_tag;
       })
       t+=e_encab;
       return t;
   }
   sendTableComp(o,arr,i,encab,e_encab,tag,e_tag){
       var t=encab;
       arr.forEach(a =>{
           t+=tag+this.fm.get(i)(o,a)+e_tag;            
       })
       t+=e_encab;
       return t;
   }
}