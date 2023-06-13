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
       const fetchDetail = fetch(`https://staffing-func.azurewebsites.net/api/setstaffinghttp`, {
           method: 'POST',
           body:JSON.stringify(objToSend),
           headers: {
               //'Content-Type': 'application/x-www-form-urlencoded',
               'Content-Type': 'application/json',
           }
       }).then(r => r.json()).catch((error) => {
           console.error(error);
           return "";
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
   asynGetFromDB_ = async (url,obj) => { 
    //console.log("asynGetFromDB_",JSON.stringify(obj))
    document.getElementById("loader").style.display = ""
    //let obj={token:ptoken,time:ptime}
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
   async sendToServer(){
        document.getElementById("loader").style.display = "";
       let modifyData=projList.getChanged();
       let retcode=0
       //console.log("modify data",modifyData);
       if(modifyData.length>0){
           var objToSend={data:modifyData,usr:userSession,token:myToken,time:myTime}
           //console.log("enviar a server",objToSend);
           await this.sendData(objToSend).then((fetchDetail)=>{  
               //console.log("retorno fetchdetail",fetchDetail);
               //var ret= JSON.parse(fetchDetail);
               //console.log("fetchDetail",fetchDetail)
               document.getElementById("loader").style.display = "none";
               if(fetchDetail.status==""){
                   //console.log("entro a limpiar dirty")
                   // si todo ok, limpia el arreglo con los cambios
                   projList.cleanChanged();
                   alert("La información se actualizó exitosamente");
                   retcode=0;
               // Response: "{ "status": "cambio en dedicacion errado", "code": 1, "orig": 42.86, "chg": 22.86 }"
               }else {
                alert("No se pudo realizar la actualizacion. Valor original "+fetchDetail.orig+" cambio por "+fetchDetail.chg);
                retcode=-1;
               }
           });
       }else {alert("No se ha modificado datos");
            retcode=1;
        }
        return retcode;
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
                                <td>${(!el.hrs ? el.hrs : el.hrs.toFixed(1))}</td>
                                <td>${(!el.weeks ? el.weeks : el.weeks.toFixed(1))}</td>
                                <td>${(!el.dura_sem ? el.dura_sem : el.dura_sem.toFixed(1))}</td>
                               </tr>`;
       let f6=(o,el)      =>  `<tr>
                               <td>Total:</td>
                                <td>${o.length}</td>
                                <td>${(el.total_hrs.toFixed(1))}</td>
                                <td>${(el.total_week.toFixed(1))}</td>
                                <td>${(el.calendar_week.toFixed(1))}</td>
                              </tr>`;            
       let f7=(o)          => {
                                let vac="";
                                if(teamView.buscarPorNombre(o.key)===undefined){
                                    vac="color:#F8F8F8;";
                                }
                                return `<div class="${o.clase}" style="${vac}">
                                <span class="nb">${o.key}</span>
                                <input class="dedi" ${o.horasPlan>=160?'style="color:red"':''} readonly id="sp-${o.key}-${o.mes}" value="${o.horasPlan.toFixed(1)}">
                                <input class="dedi" ${o.horasReal>=160?'style="color:red"':''} readonly id="spr-${o.key}-${o.mes}" value="${o.horasReal.toFixed(1)}">
                                <span>H</span>
                               </div>`
                                }                      
       let f8=(o)          => `<div id="t-${o.nombre}-${o.IDp}.${o.fase}.${o.mes}-${o.inOnSite}" draggable="true" class="card" ondragstart="util.drag(event)">
                                <input type="text" name="nombre" class="name" readonly value="${o.nombre}">
                                <input type="text" name="${o.nombre}" style="width:30px" id="id-${o.nombre}-${o.IDp}.${o.fase}.${o.mes}-${o.inOnSite}" onchange="tx_dedichange('${o.nombre}','${o.IDp}','${o.fase}','${o.mes}',${o.inOnSite})" value="${o.dedicacion}">
                                <input type="checkbox" id="cb-${o.nombre}-${o.IDp}.${o.fase}.${o.mes}-${o.inOnSite}" onclick="click_checkbox('${o.nombre}',${o.IDp},${o.fase},${o.mes},${o.inOnSite})">
                               </div>`;
       let f9=(arr)      =>  {   //console.log("f9"+arr.nombre,typeof arr.dirty ==="undefined")
                              
                                           //console.log("f9",arr.dirty)
                                    return `<tr><td>${arr.nb}</td><td>${arr.IDp}</td><td>${arr.mes}</td><td>${arr.horasPlan}</td><td><button onclick="alert('En desarrollo')">-</button></td></tr>`;
                                }
        let f10=(arr)      =>  `<tr><td>${arr.usr}</td><td>${arr.idProy}</td><td>${arr.nb_proyecto}</td><td>${arr.tot_new_horas}</td><td>${arr.tot_orig_horas}</td><td>${arr.diferencia}</td><td><button onclick="btn_borrarHist('${arr.usr}',${arr.idProy})">-</button></td></tr>`;
        let f11=(o)      => { 
                                let btn_plus=""
                                let travel=""
                                let rowMo=new Map()
                                if(o.ind==0)
                                    btn_plus=`<button onclick="mostrarProy('${'h.'+o.usr}')">+</button>`;
                                if(o.inOnSite==1)
                                    travel='<img src="image/avion.svg" width="18px">'
                                if(o.inTeam){
                                    rowMo.set(0,`<tr name="${o.ind==0?'o.'+o.usr:'h.'+o.usr}" class="${o.ind==0?'head-cell':''}" style="${o.ind==0?'':'display:none'}">
                                        <td class="${o.ind==0?'head-cell-left':''}" >${btn_plus} ${o.usr} ${travel}</td>
                                        <td class="${o.ind==0?'head-cell':''}" >${o.idProy}-${o.nb_proyecto}</td>
                                        <td class="${o.ind==0?'head-cell':''}" >${o.fase}</td>`);
                                    rowMo.set(1,`<td class="${o.ind==0?'head-cell':''}" ${this.formatCell(o.rEne,o.pEne)} >${o.pEne==null?0.00:(o.pEne).toFixed(1)}H<br/>(${o.rEne==null?0.00:(o.rEne).toFixed(1)}H )</td>`);
                                    rowMo.set(2,`<td class="${o.ind==0?'head-cell':''}" ${this.formatCell(o.rFeb,o.pFeb)}>${o.pFeb==null?0.00:(o.pFeb).toFixed(1)}H<br/>( ${o.rFeb==null?0.00:(o.rFeb).toFixed(1)}H )</td>`);
                                    rowMo.set(3,`<td class="${o.ind==0?'head-cell':''}" ${this.formatCell(o.rMar,o.pMar)}>${o.pMar==null?0.00:(o.pMar).toFixed(1)}H<br/>( ${o.rMar==null?0.00:(o.rMar).toFixed(1)}H )</td>`);
                                    rowMo.set(4,`<td class="${o.ind==0?'head-cell':''}" ${this.formatCell(o.rAbr,o.pAbr)}>${o.pAbr==null?0:(o.pAbr).toFixed(1)}H<br/>( ${o.rAbr==null?0.00:(o.rAbr).toFixed(1)}H )</td>`);
                                    rowMo.set(5,`<td class="${o.ind==0?'head-cell':''}" ${this.formatCell(o.rMay,o.pMay)}>${o.pMay==null?0:(o.pMay).toFixed(1)}H<br/>( ${o.rMay==null?0.00:(o.rMay).toFixed(1)}H )</td>`);
                                    rowMo.set(6,`<td class="${o.ind==0?'head-cell':''}" ${this.formatCell(o.rJun,o.pJun)}>${o.pJun==null?0:(o.pJun).toFixed(1)}H<br/>( ${o.rJun==null?0.00:(o.rJun).toFixed(1)}H )</td>`);
                                    rowMo.set(7,`<td class="${o.ind==0?'head-cell':''}" ${this.formatCell(o.rJul,o.pJul)}>${o.pJul==null?0:(o.pJul).toFixed(1)}H<br/>( ${o.rJul==null?0.00:(o.rJul).toFixed(1)}H )</td>`);
                                    rowMo.set(8,`<td class="${o.ind==0?'head-cell':''}" ${this.formatCell(o.rAgo,o.pAgo)}>${o.pAgo==null?0:(o.pAgo).toFixed(1)}H<br/>( ${o.rAgo==null?0.00:(o.rAgo).toFixed(1)}H )</td>`);
                                    rowMo.set(9,`<td class="${o.ind==0?'head-cell':''}" ${this.formatCell(o.rSep,o.pSep)}>${o.pSep==null?0:(o.pSep).toFixed(1)}H<br/>( ${o.rSep==null?0.00:(o.rSep).toFixed(1)}H )</td>`);
                                    rowMo.set(10,`<td class="${o.ind==0?'head-cell':''}" ${this.formatCell(o.rOct,o.pOct)}>${o.pOct==null?0:(o.pOct).toFixed(1)}H<br/>( ${o.rOct==null?0.00:(o.rOct).toFixed(1)}H )</td>`);
                                    rowMo.set(11,`<td class="${o.ind==0?'head-cell':''}" ${this.formatCell(o.rNov,o.pNov)}>${o.pNov==null?0:(o.pNov).toFixed(1)}H<br/>( ${o.rNov==null?0.00:(o.rNov).toFixed(1)}H )</td>`);
                                    rowMo.set(12,`<td class="${o.ind==0?'head-cell':''}" ${this.formatCell(o.rDic,o.pDic)}>${o.pDic==null?0:(o.pDic).toFixed(1)}H<br/> ${o.rDic==null?0.00:(o.rDic).toFixed(1)}H )</td>`);
                                
                                    let rows=rowMo.get(0);
                                    for(let m=INITIALMONTH;m<INITIALMONTH+MONTHTOSHOW;m++){
                                        if(m!=0)
                                            if(rowMo.get(m))
                                                rows=rows+rowMo.get(m);
                                    }
                                    return rows+"</tr>"
                                }
                                return ""
                            }
        let f12=(obj,arr)=> { 
                                let horasReal=arr.horasReal?arr.horasReal:0;
                                let dedi=arr.dedicacion?arr.dedicacion:0;
                                let real=arr.real?arr.real:0;  //percentage
                                let futuro=false;
                                let vac="";
                                let v=vacationView.getVacation(obj.mesi,arr.nombre);
                                if(v>0){
                                    vac="background-color:yellow;";
                                }
                                if(teamView.buscarPorNombre(arr.nombre)===undefined){
                                    vac="color:red;";
                                }
                                //console.log("vacaciones",obj.mesi,arr.nombre,v);
                                if(obj.mesi>CURRENTMONTH){
                                    horasReal=arr.avgReal;
                                    real=(arr.avgReal/160)*100;
                                    futuro=true;
                                }
                                
                                return  `<div id="c-${arr.nombre}-${obj.IDp}.${obj.fase}.${obj.mesi}-${arr.inOnSite}" dragable="false"  class="card" style="background-color:${arr.inOnSite==1?'blue':'#e6f9ff'}">
                                <input type="text" name="nombre" readonly style="width: 110px;${vac}" value="${arr.nombre}">
                                <input type="text" id="id-${arr.nombre}-${obj.IDp}.${obj.fase}.${obj.mesi}-${arr.inOnSite}" onchange="tx_dedichange('${arr.nombre}','${obj.IDp}','${obj.fase}','${obj.mesi}',${arr.inOnSite})" class="horas-plan" style="width: 27px;font-size:9px;" value="${arr.horasPlan?arr.horasPlan.toFixed(1):0}">
                                <input type="text" id="id-${arr.nombre}-${obj.IDp}.${obj.fase}.${obj.mesi}-${arr.inOnSite}" onchange="tx_dedichange('${arr.nombre}','${obj.IDp}','${obj.fase}','${obj.mesi}',${arr.inOnSite})" class="horas-real" style="width: 27px;font-size:9px;${futuro?'color:hsl(240, 100%, 50%)':''}" value="${horasReal?horasReal.toFixed(1):0}">
                                </div>`;
                              
                            }  
        let f13=(obj)    => {   
                                let edo=obj.Fase;
                                let color=(edo=='Propuesta Activa'?'darkorange':'#006080;');
                                let clas=this.claseFase(edo);
                                let ima=this.imageFase(edo);
                                //if(obj.IDp==331) console.log("estado",edo,ima)
                                clas=clas==""?"":"class='"+clas+"'"
                                let prop=edo.indexOf("Lead")>=0 ||edo.indexOf("Propuesta")>=0?"style='font-weight:normal;color:orange'":"style='font-weight:bold;'";
                                let box="<label for='probable-"+obj.IDp+"'>Staffing:</label>  <input type='checkbox' checked='true' id='probable-"+obj.IDp+"-"+obj.mesi+"' name='probable-"+obj.IDp+"' onclick='probable(event,"+obj.mes+")'>"
                                let tcheck=""
                                if(edo.indexOf("Lead")>=0 ||edo.indexOf("Propuesta")>=0)
                                    tcheck=box;
                                //console.log("check",box,tcheck,prop,edo.indexOf("Lead"),edo.indexOf("Propuesta"),edo);
                                return `<div class="proyecto" id="${obj.IDp}.${obj.fase}.${obj.mesi}"  ondrop="staffing.drop(event)" ondragover="util.allowDrop(event)">
                                   
                                   <img src="image/${ima}"></img><a style="cursor: pointer;font-weight:bold;"   onclick="markar(${obj.IDp},${obj.mes})">${obj.IDp}-${obj.proyecto} </a>mes:${obj.mes}-${obj.year}-${obj.pais===null?'':obj.pais} 
                                   <div id="edit-${obj.IDp}-${obj.mes}" class="edit-block" style="display:none">${tcheck}
                                    <div>
                                        <span class="horas-plan" ${obj.totHorasPlan>0?'':'style="color:LightSlateGrey"'}>${obj.totHorasPlan.toFixed(1)}</span><span class="horas-real" ${obj.totHorasReal>0?'':'style="color:Gainsboro"'} > ${obj.totHorasReal.toFixed(1)}</span><span class="horas-plan" style="color:white;background-color:${(obj.totHorasPlan-obj.totHorasReal)<0?'red':'green'}"> ${(obj.totHorasPlan-obj.totHorasReal).toFixed(1)}</span>
                                        <span id="ref-${obj.IDp}.${obj.fase}.${obj.mesi}" style="color:green"></span>&nbsp;&nbsp;cambio por:&nbsp;&nbsp;
                                        <span id="chng-${obj.IDp}.${obj.fase}.${obj.mesi}" style="color:green"></span>   
                                    </div>
                                        <div >
                                            <button type="button" class="btn_lite" style="margin-left:1px;" onclick="bw_mostrar(${obj.IDp},${obj.fase},${obj.mesi})" name="bw-${obj.IDp}.${obj.fase}.${obj.mesi}" id="bw-${obj.IDp}.${obj.fase}.${obj.mesi}">detail &#62;</button>
                                            <button type="button" class="btn_lite" onclick="bwi_info(${obj.IDp},${obj.fase},${obj.mesi})" name="bwi-${obj.IDp}.${obj.fase}.${obj.mesi}" id="bwi-${obj.IDp}.${obj.fase}.${obj.mesi}">info &#62;</button> 
                                            <button type="button" class="btn_lite" style="margin-left:1px;" onclick="bpv_show(${obj.IDp},${obj.fase},${obj.mesi})" name="bpv-${obj.IDp}.${obj.fase}.${obj.mesi}" id="bpv-${obj.IDp}.${obj.fase}.${obj.mesi}">project &#62;</button>                                                                                             
                                        </div>
                                   </div>
                                   `;
                               
                            }             
        let f14=(o)      =>  `<option value="${o}">${o}</option>`;                                             
                                                     
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
       this.fm.set( "team_staffingr",f12 );
       this.fm.set( "proyecto_calendarior",f13);
       this.fm.set( "lista_gerentes",f14);
   }
   imageFase(edo){
        let klass=""
        if(edo=="En Proceso") klass="edo-enproceso.svg";
        else if(edo=="Propuesta Activa") klass="edo-propuesta.svg";
        else if(edo=="SOW/Contrato") klass="edo-sowcontrato.svg";
        else if(edo=="Detenido") klass="edo-detenido.svg";
        else if(edo=="Lead") klass="edo-lead.svg";
        else if(edo=="Cerrado") klass="edo-cerrado.svg"
        else if(edo=="Cierre Interno") klass="edo-cierre-interno.svg"
        else if(edo=="Propuesta Detenida") klass="edo-prop-detenida.svg"
        return klass;
   }
   claseFase(edo){
        let klass=""
        if(edo=="En Proceso") klass="enproceso";
        else if(edo=="Propuesta Activa") klass="prop-activa";
        else if(edo=="SOW/Contrato") klass="sow-contrato";
        else if(edo=="Detenido") klass="detenido";
        else if(edo="Lead") klass="lead"
        return klass;
   }
   formatCell(valor,valor1){
        let v=valor==null?0:valor;
        let v1=valor1==null?0:valor1;
        //v=v*100;
        if(v1>v){
            v=v1;
        }
        let rango=""
        if(v<=80)
            rango="var(--color-sem-normal)"
        else if(v>80 && v<=100)
            rango="var(--color-sem-yellow)"
        else if(v>100 && v<=160)
            rango="var(--color-sem-green)"
        else rango="var(--color-sem-red)";
         
        return v==0?`style="background-color:white;color:var(--color-sem-normal);padding:10px"`:`style="background-color:${rango};padding:10px"`;
   }
   getArrDistict(arr,par){
        let b=""
        let distinct=[];
        arr.forEach((o)=>{
            if(b!=o[par]){
                distinct.push(o[par]);
                b=o[par];
            }
        })
        return distinct;
    }
   send(o,i){
       return this.fm.get(i)(o);
   }

   sendTableWB(arr,rompe,i,encab,e_encab,tag,e_tag){
        //if(encab=="") //console.log("sendTableWB encab (4to parametro) no puede estar vacio");
        let distinArr=this.getArrDistict(arr,rompe);
        let re="";
        let t;
        distinArr.forEach((br)=>{
            t=encab;
            re+=`<div id='${br}' style="cursor: pointer;font-weight:bold;font-size:14pt" onclick="mostrarBloque('h-${br}')">${br}</div><div id="h-${br}" style='display:block;border:1px silver solid;'>`
            arr.forEach(o =>{
                if(br==o[rompe])
                    t+=tag+this.fm.get(i)(o)+e_tag;
            });
            t+=e_encab;
            re+=t;
            re+="</div>";
        })
        
        return re;
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
       if(arr!==undefined){
            //console.log("sendTableComp funcion a activar",i,o,arr,encab);
      
            arr.forEach(a =>{
                t+=tag+this.fm.get(i)(o,a)+e_tag;            
            })
            t+=e_encab;
        }
       return t;
   }
}