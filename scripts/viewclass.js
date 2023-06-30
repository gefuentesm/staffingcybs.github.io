class ProjSummaryView{
    constructor(fetchData,container,containHead){
        this.contenedor=container;
        this.containHead=containHead;
        var breakProj="";
        var objProj={id:0,total_hrs:0,total_week:0,calendar_week:0,fases:[]}
        var tot_hrs=0;
        var tot_week=0;
        var cal_week=0;
        this.projStrtSumm=[];
        var fases=[]
        var projArr =[]
        fetchData.data.forEach((d)=>{
            if(d.in_staffing==1)
                projArr.push(d);
        })
        var prj=0;
        for(let i in projArr){
            //console.log(i,projArr[i]);
            if(breakProj==projArr[i].proyecto){
                //totalizar
                tot_hrs=tot_hrs+parseFloat(projArr[i].horas);
                tot_week=tot_week+parseFloat(projArr[i].semanas);
                if(!isNaN(parseFloat(projArr[i].dura_sem)))
                    cal_week=cal_week+parseFloat(projArr[i].dura_sem);
                fases.push({fase:projArr[i].Fase,hrs:projArr[i].horas,weeks:projArr[i].semanas,dura_sem:projArr[i].dura_sem})
            }else{
                //rompe
                if(breakProj==""){
                    //primer ciclo
                    breakProj=projArr[i].proyecto;
                    fases.push({fase:projArr[i].Fase,hrs:projArr[i].horas,weeks:projArr[i].semanas,dura_sem:projArr[i].dura_sem})
                    //console.log("breakProj",breakProj);
                    //console.log("1era vez ",fases);
                }else{
                    //subsiguientes
                    var phase=fases;
                    var projObj={id:breakProj,total_hrs:tot_hrs,total_week:tot_week,calendar_week:cal_week,fases:phase}
                    this.projStrtSumm.push(projObj);
                    breakProj=projArr[i].proyecto;
                    //console.log("breakProj",breakProj);
                    //console.log("rompe",projStrtSumm);
                    fases=[];
                    fases.push({fase:projArr[i].Fase,hrs:projArr[i].horas,weeks:projArr[i].semanas,dura_sem:projArr[i].dura_sem})
                    prj++;
                }
                tot_hrs=parseFloat(projArr[i].horas);
                tot_week=parseFloat(projArr[i].semanas);
                if(!isNaN(parseFloat(projArr[i].dura_sem)))
                    cal_week=parseFloat(projArr[i].dura_sem);
            }
        }
    }
    headTable(){
        return `<thead>
                    <tr>
                    <td>ID</td>
                    <td>Fase</td>
                    <td>Total Horas</td>
                    <td>Total Semanas</td>
                    <td>Semanas Calendario</td>
                    </tr>
                </thead>`;
    }
    blankProjSummary(){
        var tabla=document.getElementById(this.contenedor);
        tabla.innerHTML = "";
    }
    fillProjSumm(projId){
        //   traer tabla
        var tabla=document.getElementById(this.contenedor);
        tabla.innerHTML = "";
        var t="";
        if(projId!="Seleccione...")
            t=this.headTable();
        for( let i in this.projStrtSumm){
            if(this.projStrtSumm[i].id==projId){
                let f=this.projStrtSumm[i].fases;
                let arr=[]
                arr.push(this.projStrtSumm[i]);
                t+=render.sendTableComp(this.projStrtSumm[i],f,"resumen_proyecto","","","","");
                t+=render.sendTableComp(f,arr,"total_proyecto","","","","");
                tabla.innerHTML=t;
            } 
        }
        //console.log("projSumm",tabla.offsetHeight)
        let ht= tabla.offsetHeight+40;
        if(ht>40)
            document.getElementById(this.containHead).style.height=ht+"px";
        else
            document.getElementById(this.containHead).style.height="120px";
    }
}
class ProjViewReal{
    constructor(data,container,tab_container,proyectos){
        this.factprojmonthy=data;
        this.projects=proyectos;
        this.containerProject=container;
        this.tabContainer=tab_container;
        this.totalProj=new Map();
        this.contMap=new Map();
        this.param=-1;
        //this.makeTotalMap();
        //console.log("ProjViewReal",this.factprojmonthy,this.totalProj);
    }

    isVisible(){
        let content = document.getElementById(this.containerProject);
        //console.log("content.style.display",content.style.display);
        return content.style.display=="";
    }
    setContainerHide(){
        let content = document.getElementById(this.containerProject);
        content.style.display="none";
    }
    setContainerShow(){
        let content = document.getElementById(this.containerProject);
        content.style.display="block";
        //let content1 = document.getElementById(this.tab_container);
        //content1.style.display="";
    }    
    previousCalledNoZero(){
        if(this.param>=0)
            return true;
        else return false
    }
    setPreviousCalledNoZero(){
        this.param=-1;
    }
    mostrar(x){
        var arr=document.getElementsByName(x);
        arr.forEach((el)=>{
            if(el.style.display=="none"){
                el.style.display="";
            }else el.style.display="none";
        });
    }
    formtSem(v,fase){
        let cons=parseFloat(v);
        if(cons<=70){
            if(fase=="En Proceso"||fase=="Detenido")
                return "#ffcc00";
            else return "Green";
        }
        if(cons>70 && cons<=100)
            return "green";
        else return "red"

    }
    formtRango=(v)=>{
        let rango="";
        if(v<=80)
            rango="#b3b3ff"
        else if(v>80 && v<=100)
            rango="#ffcc66"
        else if(v>100 && v<=160)
            rango="#33cc33"
        else rango="#ff6699";
        return "style='color:"+rango+"'";
    }
    calcTotalProj(proj,fecha){
        let arr=this.factprojmonthy.filter((e)=>e.idProy==proj);
        let mes=fecha.getMonth()+1;
        let anio=fecha.getFullYear();
        let nbmes=(mes==1?"Ene":(mes==2?"Feb":(mes==3?"Mar":(mes==4?"Abr":(mes==5?"May":(mes==6?"Jun":(mes==7?"Jul":(mes==8?"Ago":(mes==9?"Sep":(mes==10?"Oct":(mes==11?"Nov":"Dic")))))))))))
        let objrcy="r"+nbmes;  // obj r(eal)c(urrent)y(ear)
        let objrny="r_"+nbmes;  // obj r(eal)n(ext)y(ear)
        let objpcy="p"+nbmes;
        let objpny="p_"+nbmes;
        let totmes=0;
        let totmesp=0;
        arr.forEach((e)=>{
            if(anio==CURRYEAR){
                totmes+=e[objrcy];
                totmesp+=e[objpcy];
            }else{
                totmesp+=e[objpny];
            }
        })
        //console.log("arreglo filtrado por proyecto",proj,mes,anio,totmes,totmesp);
        return "plan:"+totmesp.toFixed(1)+" <b>Real:"+totmes.toFixed(1)+"</b>";
        
        
    }
    mostrarProyReal(pproy){
        var contenedor = document.getElementById(this.tabContainer);
        var rowHead=``;
        var rowName=['<thead><tr><th width="140px" style="background-color:#6666ff; width:140px">ID</th><th style="background-color:#6666ff;width:420px">Nombre</th><th style="background-color:#6666ff;width:20px">Semanas Plan</th><th style="background-color:#6666ff;width:20px">Horas Plan</th><th style="background-color:#6666ff;width:80px">Inicio</th><th style="background-color:#6666ff;width:80px">Cierre</th><th style="background-color:#6666ff;width:80px">%Hrs Consumidas</th><th style="background-color:#6666ff;width:80px">Tasa de Consumo (Plan)</th><th style="background-color:#6666ff;width:80px">Tasa Consumo (Real)</th><th style="background-color:#6666ff;width:80px">Dias para consumir las horas</th>','<th style="background-color:#6666ff;width:400px">Ene</th>','<th style="background-color:#6666ff;width:400px">Feb</th>','<th style="background-color:#6666ff;width:400px">Mar</th>','<th style="background-color:#6666ff;width:400px">Abr</th>','<th style="background-color:#6666ff;width:400px">May</th>','<th style="background-color:#6666ff;width:400px">Jun</th>','<th style="background-color:#6666ff;width:400px">Jul</th>','<th style="background-color:#6666ff;width:400px">Ago</th>','<th style="background-color:#6666ff;width:400px">Sep</th>','<th style="background-color:#6666ff;width:400px">Oct</th>','<th style="background-color:#6666ff;width:400px">Nov</th>','<th style="background-color:#6666ff;width:400px">Dic</th>','<th style="background-color:#6666ff;width:400px">Ene_</th>','<th style="background-color:#6666ff;width:400px">Feb_</th>','<th style="background-color:#6666ff;width:400px">Mar_</th>','<th style="background-color:#6666ff;width:400px">Abr_</th>','<th style="background-color:#6666ff;width:400px">May_</th>','<th style="background-color:#6666ff;width:400px">Jun_</th>','<th style="background-color:#6666ff;width:400px">Jul_</th>','<th style="background-color:#6666ff;width:400px">Ago_</th>','<th style="background-color:#6666ff;width:400px">Sep_</th>','<th style="background-color:#6666ff;width:400px">Oct_</th>','<th style="background-color:#6666ff;width:400px">Nov_</th>','<th style="background-color:#6666ff;width:400px">Dic_</th>']
        this.param=pproy;
        contenedor.innerHTML=rowHead;
        var rows="";        
        var arr=this.factprojmonthy;

        console.log("mostrarProyReal",pproy,arr);
        let inHead=true;
        let primera=true;
        let projHead="";
        let projBreak=0;
        for(let i in arr){     
            if(arr[i].idProy==pproy||pproy==0){
                if(inHead){
                    rowHead=rowName[0];
                    //console.log()
                    for(let m=INITIALMONTH;m<INITIALMONTH+MONTHTOSHOW;m++){
                        if(m!=0)
                            rowHead=rowHead+rowName[m];
                    }
                    rowHead=rowHead+"</tr></thead>"
                    inHead=false;
                   
                }  
                //if(tasaConsumo)console.log("tasa de consumo en proyReal",tasaConsumo);
                var tds=[];
                var tdh="";
                let ex="color:green;";
                let bgc="";
                let periodo="";
                if(arr[i].idProy!=projBreak){
                    let cons=this.projects.getPorConsumido(arr[i].idProy);
                    let fase=this.projects.getFase(arr[i].idProy);
                    let color=this.formtSem(cons,fase);
                    let tasaConsPlan=tasaConsumo?parseFloat(tasaConsumo.getTasaConsumoById(arr[i].idProy)):"N/D";
                    let tasaConsReal=tasaConsumo?parseFloat(tasaConsumo.getTasaConsumoRealById(arr[i].idProy)):"N/D";
                    let diasConsumirTodo=tasaConsumo?tasaConsumo.getDiasConsumoTotal(arr[i].idProy):"N/d"
                    console.log("color sem",arr[i].idProy,cons,color);
                    projHead=`<tr name="o.${arr[i].nb_proyecto}" >
                                  <td class="head-cell-left" style="background-color:var(--color-head)" colspan="4"><button onclick="mostrarProyReal('p.${arr[i].idProy}')">+</button>${arr[i].idProy}-${arr[i].nb_proyecto} (${fase})</td>
                                  <td>${(arr[i].inicio_mon?arr[i].inicio_mon.substring(0,10):'')}</td>
                                  <td>${(arr[i].cierre_mon?arr[i].cierre_mon.substring(0,10):'')}</td>
                                  <td style="color:${color};background-color:white;">${cons}</td>
                                  <td>${tasaConsPlan}</td>
                                  <td style="color:${tasaConsReal>tasaConsPlan?"red":(tasaConsReal<tasaConsPlan?"orange":"green")}">${tasaConsReal}</td>
                                  <td>${diasConsumirTodo}</td>`;
                    let feiniR=new Date(arr[i].inicio_mon.substring(0,8)+"01");
                    let fefinR=new Date(arr[i].cierre_mon.substring(0,10));
                    //console.log("Rango fechas",arr[i].idProy,feiniR,fefinR)
                    bgc="";
                    //if(arr[i].fase=="Propuesta Activa"||arr[i].fase=="SOW/Contrato") bgc="style='background-color:orange;'";
                    //if(arr[i].fase=="Detenido") bgc="style='background-color:red;'";
                    bgc=`style='background-color:${color};'`;
                    //console.log ("solución para safari",new Date('2011-04-12'),new Date('2011-04-12'.replace(/-/g, "/")));
                    for(let j=INITIALMONTH;j<INITIALMONTH+MONTHTOSHOW;j++){
                        let fe2Test=j<=12?new Date(CURRYEAR+"/"+j+"/01"):new Date((CURRYEAR+1)+"/"+(j-12)+"/01");
                        //console.log("problema en safari",arr[i].idProy,CURRYEAR+"/"+j+"/01",(CURRYEAR+1)+"/"+(j-12)+"/01",fe2Test)
                        if(fe2Test>=feiniR && fe2Test<=fefinR){ 
                            periodo+=`<td class='head-cell-left' ${bgc} >&nbsp;${this.calcTotalProj(arr[i].idProy,fe2Test)}</td>`;
                        }else periodo+="<td></td>";
                    } 
                    projHead+=periodo;
                    //tds.push(`<td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>`);
                    projBreak=arr[i].idProy;
                }
                if(teamView.buscarPorNombre(arr[i].usr)===undefined){
                    ex="color:red;"
                }
                
                tds.push(`<tr name="p.${arr[i].idProy}" style="display:none;"><td>&nbsp;</td><td style="${ex}">${arr[i].usr}</td><td>${arr[i].dura_plan_week?arr[i].dura_plan_week:0}</td><td>${arr[i].hrs_dedica_plan?arr[i].hrs_dedica_plan:0}</td><td>${(arr[i].inicio_mon?arr[i].inicio_mon.substring(0,10):'')}</td><td>${(arr[i].cierre_mon?arr[i].cierre_mon.substring(0,10):'')}</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>`)
                tds.push(`<td width='170px'${arr[i].pEne||arr[i].rEne?'class="cell1"':''}>${(arr[i].pEne?`<span class="plan" ${this.formtRango(arr[i].pEne)}>Plan:`+arr[i].pEne.toFixed(1)+'H</span>':'')}${(arr[i].rEne?`<div class="real" ${this.formtRango(arr[i].rEne)}>Real:`+arr[i].rEne.toFixed(1)+'H</div>':'')}</td>`);
                tds.push(`<td width='170px'${arr[i].pFeb||arr[i].rFeb?'class="cell1"':''}>${(arr[i].pFeb?`<span class="plan"  ${this.formtRango(arr[i].pFeb)}>Plan:`+arr[i].pFeb.toFixed(1)+'H</span>':'')}${(arr[i].rFeb?`<div class="real" ${this.formtRango(arr[i].rFeb)}>Real:`+arr[i].rFeb.toFixed(1)+'H</div>':'')}</td>`);
                tds.push(`<td width='170px'${arr[i].pMar||arr[i].rMar?'class="cell1"':''}>${(arr[i].pMar?`<span class="plan" ${this.formtRango(arr[i].pMar)}>Plan:`+arr[i].pMar.toFixed(1)+'H</span>':'')}${(arr[i].rMar?`<div class="real" ${this.formtRango(arr[i].rMar)}>Real:`+arr[i].rMar.toFixed(1)+'H</div>':'')}</td>`);
                tds.push(`<td width='170px'${arr[i].pAbr||arr[i].rAbr?'class="cell1"':''}>${(arr[i].pAbr?`<span class="plan" ${this.formtRango(arr[i].pAbr)}>Plan:`+arr[i].pAbr.toFixed(1)+'H</span>':'')}${(arr[i].rAbr?`<div class="real" ${this.formtRango(arr[i].rAbr)}>Real:`+arr[i].rAbr.toFixed(1)+'H</div>':'')}</td>`);
                tds.push(`<td width='170px'${arr[i].pMay||arr[i].rMay?'class="cell1"':''}>${(arr[i].pMay?`<span class="plan" ${this.formtRango(arr[i].pMay)}>Plan:`+arr[i].pMay.toFixed(1)+'H</span>':'')}${(arr[i].rMay?`<div class="real" ${this.formtRango(arr[i].rMay)}>Real:`+arr[i].rMay.toFixed(1)+'H</div>':'')}</td>`);
                tds.push(`<td width='170px'${arr[i].pJun||arr[i].rJun?'class="cell1"':''}>${(arr[i].pJun?`<span class="plan" ${this.formtRango(arr[i].pJun)}>Plan:`+arr[i].pJun.toFixed(1)+'H</span>':'')}${(arr[i].rJun?`<div class="real" ${this.formtRango(arr[i].rJun)}>Real:`+arr[i].rJun.toFixed(1)+'H</div>':'')}</td>`);
                tds.push(`<td width='170px'${arr[i].pJul||arr[i].rJul?'class="cell1"':''}>${(arr[i].pJul?`<span class="plan" ${this.formtRango(arr[i].pJul)}>Plan:`+arr[i].pJul.toFixed(1)+'H</span>':'')}${(arr[i].rJul?`<div class="real" ${this.formtRango(arr[i].rJul)}>Real:`+arr[i].rJul.toFixed(1)+'H</div>':'')}</td>`);
                tds.push(`<td width='170px'${arr[i].pAgo||arr[i].rAgo?'class="cell1"':''}>${(arr[i].pAgo?`<span class="plan" ${this.formtRango(arr[i].pAgo)}>Plan:`+arr[i].pAgo.toFixed(1)+'H</span>':'')}${(arr[i].rAgo?`<div class="real" ${this.formtRango(arr[i].rAgo)}>Real:`+arr[i].rAgo.toFixed(1)+'H</div>':'')}</td>`);
                tds.push(`<td width='170px'${arr[i].pSep||arr[i].rSep?'class="cell1"':''}>${(arr[i].pSep?`<span class="plan" ${this.formtRango(arr[i].pSep)}>Plan:`+arr[i].pSep.toFixed(1)+'H</span>':'')}${(arr[i].rSep?`<div class="real" ${this.formtRango(arr[i].rSep)}>Real:`+arr[i].rSep.toFixed(1)+'H</div>':'')}</td>`);
                tds.push(`<td width='170px'${arr[i].pOct||arr[i].rOct?'class="cell1"':''}>${(arr[i].pOct?`<span class="plan" ${this.formtRango(arr[i].pOct)}>Plan:`+arr[i].pOct.toFixed(1)+'H</span>':'')}${(arr[i].rOct?`<div class="real" ${this.formtRango(arr[i].rOct)}>Real:`+arr[i].rOct.toFixed(1)+'H</div>':'')}</td>`);
                tds.push(`<td width='170px'${arr[i].pNov||arr[i].rNov?'class="cell1"':''}>${(arr[i].pNov?`<span class="plan" ${this.formtRango(arr[i].pNov)}>Plan:`+arr[i].pNov.toFixed(1)+'H</span>':'')}${(arr[i].rNov?`<div class="real" ${this.formtRango(arr[i].rNov)}>Real:`+arr[i].rNov.toFixed(1)+'H</div>':'')}</td>`);
                tds.push(`<td width='170px'${arr[i].pDic||arr[i].rDic?'class="cell1"':''}>${(arr[i].pDic?`<span class="plan" ${this.formtRango(arr[i].pDic)}>Plan:`+arr[i].pDic.toFixed(1)+'H</span>':'')}${(arr[i].rDic?`<div class="real" ${this.formtRango(arr[i].rDic)}>Real:`+arr[i].rDic.toFixed(1)+'H</div>':'')}</td>`);
                tds.push(`<td width='170px'${arr[i].p_Ene||arr[i].r_Ene?'class="cell1"':''}>${(arr[i].p_Ene?`<span class="plan" ${this.formtRango(arr[i].p_Ene)}>Plan:`+arr[i].p_Ene.toFixed(1)+'H</span>':'')}${(arr[i].r_Ene?`<div class="real" ${this.formtRango(arr[i].r_Ene)}>Real:`+arr[i].r_Ene.toFixed(1)+'H</div>':'')}</td>`);
                tds.push(`<td width='170px'${arr[i].p_Feb||arr[i].r_Feb?'class="cell1"':''}>${(arr[i].p_Feb?`<span class="plan" ${this.formtRango(arr[i].p_Feb)}>Plan:`+arr[i].p_Feb.toFixed(1)+'H</span>':'')}${(arr[i].r_Feb?`<div class="real" ${this.formtRango(arr[i].r_Feb)}>Real:`+arr[i].r_Feb.toFixed(1)+'H</div>':'')}</td>`);
                tds.push(`<td width='170px'${arr[i].p_Mar||arr[i].r_Mar?'class="cell1"':''}>${(arr[i].p_Mar?`<span class="plan" ${this.formtRango(arr[i].p_Mar)}>Plan:`+arr[i].p_Mar.toFixed(1)+'H</span>':'')}${(arr[i].r_Mar?`<div class="real" ${this.formtRango(arr[i].r_Mar)}>Real:`+arr[i].r_Mar.toFixed(1)+'H</div>':'')}</td>`);
                rows=rows+tdh+projHead+tds[0];
                projHead="";
                //console.log("data arr",arr[i],tds);
                for(let j=INITIALMONTH;j<INITIALMONTH+MONTHTOSHOW;j++){
                    if(typeof tds[j]!="undefined" )
                        rows=rows+tds[j];
                }
            }
        }
        contenedor.innerHTML=rowHead+rows;
    }
}
class AlarmView{
    constructor(data){
        this.alarm=data;
    }
    createView(){
        let cant=this.alarm.length;
        let filas="<h2>Proyectos con Alarmas Activadas</h2><table style='text-align:left;font-size:12pt'><thead><tr><th>ID</th><th>Nombre</th><th>Gerente</th><th>Fase</th><th>Alarma</th></tr><thead><tbody>";
        this.alarm.forEach((obj)=>{
            //console.log("alarmas",obj,cant);
            filas+=`<tr><td>${obj.idProy}</td><td>${obj.nb_proyecto}</td><td>${obj.gerente}</td><td>${obj.fase}</td><td>${obj.alarma}</td></tr>`;
        })
        document.getElementById("alarma1").innerHTML=cant;
        document.getElementById("alarm-container").style.visibility="visible";
        document.getElementById("alarm-text").innerHTML=filas+"</tbody></table>";
        
    } 
}
class SessionView{
    constructor(data,container){
        //console.log("data",data);
        this.sesiones=data;
        this.container=container;
        this.eachSession=new Map();
        this.createEachSession();    
        this.createView()
    }
    createEachSession(){
        let breakSession=""

        this.sesiones.forEach((el)=>{
            if(el.usrChanger!=breakSession){
                this.eachSession.set(el.usrChanger,[{usr:el.usr,proy:el.idProy}])
                breakSession=el.usrChanger
            }else{
                //console.log("no rompe",this.eachSession.get(el.usrChanger));
                this.eachSession.get(el.usrChanger).push({usr:el.usr,proy:el.idProy});
                //console.log(this.eachSession.get(el.usrChanger));
            }
        })

        //console.log("EachSession",this.eachSession);

    }
    createView(){
        let sesion=""
        let sesionDiv=document.getElementById(this.container);

        this.eachSession.forEach((s,k)=>{
            //sesion+="<span id='sesion-"+k+"' class='session'>"+k+"</span><div id='session-text' class='tooltiptext'></div>";
            let divContainer=document.createElement("div");
            divContainer.setAttribute("id","session-container-"+k);
            divContainer.setAttribute("class","tooltip");
            let span=document.createElement("span");
            span.setAttribute("class", "session");
            let texto=document.createTextNode(k);
            span.appendChild(texto);
            let div=document.createElement("div");
            div.setAttribute("id","session-text");
            div.setAttribute("class","tooltiptext");
            div.setAttribute("style","width:360px");
            let tips=""
            s.forEach((e)=>{
                let tip=document.createElement("div");
                tip.appendChild(document.createTextNode("Cambio a "+e.usr+" en el proyecto "+e.proy))
                div.appendChild(tip)
            })
            let tooltipsTexto=document.createTextNode(tips);
            div.appendChild(tooltipsTexto);
            divContainer.appendChild(span);
            divContainer.appendChild(div);
            sesionDiv.appendChild(divContainer);
        })
       
        
    }
}
class VacationView{
    constructor(data){
        this.vacation=data;
        //console.log("vacation",data,this.vacation);
        this.mesVac=new Map();
    }
    getVacation(mes,usr){
        try{
            let arr= this.mesVac.get(mes)
            let us;
            let hr=0;
            if(arr!==undefined && arr.length>0){
                us=arr.filter((u)=>u.usr==usr);                
                if(us!==undefined && us.length>0)
                    hr=us[0].horas;
            }
            return hr;
        }catch(err){console.log("getVacation err",err)}

    }
    createVacationMonth(){
        this.vacation.forEach((el)=>{
            let mes=el.mes;
            if(this.mesVac.get(mes)===undefined)
                this.mesVac.set(mes,[{mes:el.mes,usr:el.usr,horas:el.horas,dias:el.dias}]);
            else{
                let vacacionistas=this.mesVac.get(mes);
                vacacionistas.push({mes:el.mes,usr:el.usr,horas:el.horas,dias:el.dias});
                this.mesVac.set(mes,vacacionistas);                
            }
            //console.log(this.mesVac);
        })
    }
    createView(){
        for(let i=0;i<25;i++){
            let arr=this.mesVac.get(i)
            if(arr!==undefined){
                let vac=document.getElementById("mes"+i+"vacaciones");
                let item="";
                arr.forEach((v)=>{
                    if(v.horas>0){
                        item+=`<div class="grid-vacation"style="width:250px">`;
                        item+=`<div class="grid-vac nbvaca">${v.usr}: ${v.dias} Días</div>`
                        for(let j=0;j<4;j++){
                            item+=`<div class="grid-vac ${j<v.horas/40?'vaca':''}"></div>`
                        }
                        item+="</div>";
                    }
                })
                
                vac.innerHTML=item;
            }
        }
    }

}
class ProjView{
    constructor(data,container,tab_container){
        this.factprojmonthy=data;
        this.containerProject=container;
        this.tabContainer=tab_container;
        this.totalProj=new Map();
        this.contMap=new Map();
        this.makeTotalMap();
        //console.log("total proj",this.totalProj);
    }

    isVisible(){
        let content = document.getElementById(this.containerProject);
        //console.log("content.style.display",content.style.display);
        return content.style.display=="";
    }
    setContainerHide(){
        let content = document.getElementById(this.containerProject);
        content.style.display="none";
    }
    setContainerShow(){
        let content = document.getElementById(this.containerProject);
        content.style.display="";
    }
    countAvailValueByMonth(id,mon,val){
        let indx=id+"-"+mon; // indice del map es el proyecto-mes
        let valor=val?1:0;
        this.contMap.set(indx,typeof this.contMap.get(indx)=="undefined"?valor:this.contMap.get(indx)+valor);
    }
    makeTotalMap(){
        var arr=this.factprojmonthy;
        //console.log("arr",arr);
        var totDed=Array.from({length: 24}, function() { return 0.0; });
        var tothrs=Array.from({length: 24}, function() { return 0.0; });
        var maxDed=Array.from({length: 24}, function() { return 0.0; });
        var rompe=arr[0].proyecto;
        //console.log("rompe",rompe);
        var cont=0;
        var maxfase=0;
        var maxCantConsl=0;
        for(let i in arr){ 
            //if(arr[i].proyecto==171) //console.log("check break",cont,arr[i])
            if(rompe!=arr[i].proyecto){
                //console.log("cont",rompe, cont);
                if(cont>0){
                    //console.log("map contadores",this.contMap);
                    let i=0;
                    let j=0;
                    var totDedx=totDed.map(e=>e/this.contMap.get(rompe+"-"+i++));
                    var tothrsx=tothrs.map(e=>e/this.contMap.get(rompe+"-"+j++));
                    //console.log("cont",rompe, cont,totDedx,totDed);
                    this.totalProj.set(rompe,{cons:maxCantConsl,maxfase:maxfase,ded:totDedx,hrs:tothrsx,max:maxDed});
                }else
                    this.totalProj.set(rompe,{cons:maxCantConsl,maxfase:maxfase,ded:totDed,hrs:tothrs,max:maxDed});
                //console.log("proyecto",rompe)
                rompe=arr[i].proyecto;
                totDed=Array.from({length: 24}, function() { return 0.0; });
                tothrs=Array.from({length: 24}, function() { return 0.0; });
                maxDed=Array.from({length: 24}, function() { return 0.0; });
                cont=0;
                maxfase=0;
                maxCantConsl=0;
            }
            if(arr[i].pEne || arr[i].pfeb || arr[i].pmar || arr[i].pabr || arr[i].pmay || 
            arr[i].pjun || arr[i].pjul || arr[i].pago || arr[i].psep || arr[i].poct || 
            arr[i].pnov || arr[i].pdic || arr[i].pEne_ || arr[i].pfeb_ || arr[i].pmar_ || arr[i].pabr_ || arr[i].pmay_ || 
            arr[i].pjun_ || arr[i].pjul_ || arr[i].pago_ || arr[i].psep_ || arr[i].poct_ || 
            arr[i].pnov_ || arr[i].pdic_)
                cont++;
            this.countAvailValueByMonth(arr[i].proyecto,0,arr[i].pEne);
            this.countAvailValueByMonth(arr[i].proyecto,1,arr[i].pfeb);
            this.countAvailValueByMonth(arr[i].proyecto,2,arr[i].pmar);
            this.countAvailValueByMonth(arr[i].proyecto,3,arr[i].pabr);
            this.countAvailValueByMonth(arr[i].proyecto,4,arr[i].pmay);
            this.countAvailValueByMonth(arr[i].proyecto,5,arr[i].pjun);
            this.countAvailValueByMonth(arr[i].proyecto,6,arr[i].pjul);
            this.countAvailValueByMonth(arr[i].proyecto,7,arr[i].pago);
            this.countAvailValueByMonth(arr[i].proyecto,8,arr[i].psep);
            this.countAvailValueByMonth(arr[i].proyecto,9,arr[i].poct);
            this.countAvailValueByMonth(arr[i].proyecto,10,arr[i].pnov);
            this.countAvailValueByMonth(arr[i].proyecto,11,arr[i].pdic);
            this.countAvailValueByMonth(arr[i].proyecto,12,arr[i].pEne_);
            this.countAvailValueByMonth(arr[i].proyecto,13,arr[i].pfeb_);
            this.countAvailValueByMonth(arr[i].proyecto,14,arr[i].pmar_);
            this.countAvailValueByMonth(arr[i].proyecto,15,arr[i].pabr_);
            this.countAvailValueByMonth(arr[i].proyecto,16,arr[i].pmay_);
            this.countAvailValueByMonth(arr[i].proyecto,17,arr[i].pjun_);
            this.countAvailValueByMonth(arr[i].proyecto,18,arr[i].pjul_);
            this.countAvailValueByMonth(arr[i].proyecto,19,arr[i].pago_);
            this.countAvailValueByMonth(arr[i].proyecto,20,arr[i].psep_);
            this.countAvailValueByMonth(arr[i].proyecto,21,arr[i].poct_);
            this.countAvailValueByMonth(arr[i].proyecto,22,arr[i].pnov_);
            this.countAvailValueByMonth(arr[i].proyecto,23,arr[i].pdic_);
            
            maxfase=(maxfase< arr[i].fase?arr[i].fase:maxfase);
            maxCantConsl=(maxCantConsl<arr[i].consultores?arr[i].consultores:maxCantConsl);
            
            totDed[0]=totDed[0]+(arr[i].pEne?arr[i].pEne:0);tothrs[0]=tothrs[0]+(arr[i].hEne?arr[i].hEne:0);
            totDed[1]=totDed[1]+(arr[i].pfeb?arr[i].pfeb:0);tothrs[1]=tothrs[1]+(arr[i].hfeb?arr[i].hfeb:0);
            totDed[2]=totDed[2]+arr[i].pmar;tothrs[2]=tothrs[2]+arr[i].hmar;
            totDed[3]=totDed[3]+arr[i].pabr;tothrs[3]=tothrs[3]+arr[i].habr;
            totDed[4]=totDed[4]+arr[i].pmay;tothrs[4]=tothrs[4]+arr[i].hmay;
            totDed[5]=totDed[5]+arr[i].pjun;tothrs[5]=tothrs[5]+arr[i].hjun;
            totDed[6]=totDed[6]+arr[i].pjul;tothrs[6]=tothrs[6]+arr[i].hjul;
            totDed[7]=totDed[7]+arr[i].pago;tothrs[7]=tothrs[7]+arr[i].hago;
            totDed[8]=totDed[8]+arr[i].psep;tothrs[8]=tothrs[8]+arr[i].hsep;
            totDed[9]=totDed[9]+arr[i].poct;tothrs[9]=tothrs[9]+arr[i].hoct;
            totDed[10]=totDed[10]+arr[i].pnov;tothrs[10]=tothrs[10]+arr[i].hnov;
            totDed[11]=totDed[11]+arr[i].pdic;tothrs[11]=tothrs[11]+arr[i].hdic;
            
            //faltan los siguientes meses del año

            maxDed[0]=maxDed[0]<arr[i].mEne?arr[i].mEne:maxDed[0];maxDed[1]=maxDed[1]<arr[i].mfeb?arr[i].mfeb:maxDed[1];
            maxDed[2]=maxDed[2]<arr[i].mmar?arr[i].mmar:maxDed[2];maxDed[3]=maxDed[3]<arr[i].mabr?arr[i].mabr:maxDed[3];
            maxDed[4]=maxDed[4]<arr[i].mmay?arr[i].mmay:maxDed[4];maxDed[5]=maxDed[5]<arr[i].mjun?arr[i].mjun:maxDed[5];
            maxDed[6]=maxDed[6]<arr[i].mjul?arr[i].mjul:maxDed[6];maxDed[7]=maxDed[7]<arr[i].mago?arr[i].mago:maxDed[7];
            maxDed[8]=maxDed[8]<arr[i].msep?arr[i].msep:maxDed[8];maxDed[9]=maxDed[9]<arr[i].moct?arr[i].moct:maxDed[9];
            maxDed[10]=maxDed[10]<arr[i].mnov?arr[i].mnov:maxDed[10];maxDed[11]=maxDed[11]<arr[i].mdic?arr[i].mdic:maxDed[11];
            //if(arr[i].proyecto==171) //console.log("no rompe",cont,arr[i].proyecto,totDed,tothrs)
        }
        //console.log("this.totalProj",this.totalProj)
    }
    mostrar(x){
        var arr=document.getElementsByName(x);
        arr.forEach((el)=>{
            if(el.style.display=="none"){
                el.style.display="";
            }else el.style.display="none";
        });
    }
    mostrarProyMonthly(pproy){
        var contenedor = document.getElementById(this.tabContainer);
        var rowHead=``;
        var rowName=['<thead><tr><th width="140px" style="background-color:#6666ff; width:140px">ID</th><th style="background-color:#6666ff;width:420px">Nombre</th><th style="background-color:#6666ff;width:20px">Fase</th><th style="background-color:#6666ff;width:20px">Cons.</th><th style="background-color:#6666ff;width:80px">Inicio</th><th style="background-color:#6666ff;width:80px">Cierre</th>','<th style="background-color:#6666ff;width:600px">Ene</th>','<th style="background-color:#6666ff;width:600px">Feb</th>','<th style="background-color:#6666ff;width:600px">Mar</th>','<th style="background-color:#6666ff;width:600px">Abr</th>','<th style="background-color:#6666ff;width:600px">May</th>','<th style="background-color:#6666ff;width:600px">Jun</th>','<th style="background-color:#6666ff;width:600px">Jul</th>','<th style="background-color:#6666ff;width:600px">Ago</th>','<th style="background-color:#6666ff;width:600px">Sep</th>','<th style="background-color:#6666ff;width:600px">Oct</th>','<th style="background-color:#6666ff;width:600px">Nov</th>','<th style="background-color:#6666ff;width:600px">Dic</th>','<th style="background-color:#6666ff;width:600px">Ene_</th>','<th style="background-color:#6666ff;width:600px">Feb_</th>','<th style="background-color:#6666ff;width:600px">Mar_</th>','<th style="background-color:#6666ff;width:600px">Abr_</th>','<th style="background-color:#6666ff;width:600px">May_</th>','<th style="background-color:#6666ff;width:600px">Jun_</th>','<th style="background-color:#6666ff;width:600px">Jul_</th>','<th style="background-color:#6666ff;width:600px">Ago_</th>','<th style="background-color:#6666ff;width:600px">Sep_</th>','<th style="background-color:#6666ff;width:600px">Oct_</th>','<th style="background-color:#6666ff;width:400px">Nov_</th>','<th style="background-color:#6666ff;width:400px">Dic_</th>']
        contenedor.innerHTML=rowHead;
        var rows="";
        //console.log("factprojmonthy",factprojmonthy)
        var arr=this.factprojmonthy;
        //console.log("data arr",arr)
        
        let inHead=true;
        for(let i in arr){     
            if(arr[i].proyecto==pproy||pproy==0){
                if(inHead){
                    rowHead=rowName[0];
                    for(let m=INITIALMONTH;m<INITIALMONTH+MONTHTOSHOW;m++){
                        if(m!=0)
                            rowHead=rowHead+rowName[m];
                    }
                    rowHead=rowHead+"</tr></thead>"
                    inHead=false;
                }  
                var tds=[];
                var tdh="";
                
                let o=this.totalProj.get(arr[i].proyecto);
                //console.log("totalProj",arr[i].proyecto,o)
                if(typeof o !="undefined" ){
                    let d=o.ded;
                    let h=o.hrs;
                    let m=o.max;
                    //console.log("d",d)
                    if(arr[i].fase==1){
                        tdh=`<tr><td id="pl.${arr[i].proyecto}" class="head-cell-left"><button onclick="mostrarDet('p.${arr[i].proyecto}')">+</button>&nbsp;&nbsp;${arr[i].proyecto}</td><td class="head-cell">${arr[i].nb_proyecto}</td><td class="head-cell">${o.maxfase}</td><td class="head-cell">${o.cons}</td><td class="head-cell"></td><td class="head-cell"></td>`;
                        for(let j=INITIALMONTH-1;j<INITIALMONTH+MONTHTOSHOW-1;j++){
                            //if(i==0)console.log("into for",d[j],`<td >${(d[j]?'Avg: '+d[j].toFixed(1)+'%':'')}<br>${(h[j]?h[j].toFixed(1)+' Hrs':'')}</td>`)
                            tdh=tdh+`<td  width='170px;backgroun-color:white;'${d[j]?'class="cell"':''}>${(d[j]?'Avg: '+d[j].toFixed(1)+'% Max: '+m[j].toFixed(1)+'%':'')}<br>${(h[j]?h[j].toFixed(1)+' Hrs':'')}</td>`;
                        }
                        tdh=tdh+"</tr>";
                    }
                }
                
                tds.push(`<tr name="p.${arr[i].proyecto}" style="display:none"><td>${arr[i].proyecto}</td><td>${arr[i].nb_proyecto}</td><td>${arr[i].fase}</td><td>${arr[i].consultores}</td><td>${(arr[i].inicio?arr[i].inicio.substring(0,10):'')}</td><td>${(arr[i].cierre?arr[i].cierre.substring(0,10):'')}</td>`)
                tds.push(`<td width='170px' ${arr[i].pEne?'class="cell"':''}>${(arr[i].pEne?'Avg: '+arr[i].pEne.toFixed(1)+'%':'')}<br>${(arr[i].hEne?arr[i].hEne.toFixed(1)+' Hrs':'')}</td>`);
                tds.push(`<td width='170px'${arr[i].pfeb?'class="cell"':''}>${(arr[i].pfeb?'Avg: '+arr[i].pfeb.toFixed(1)+'% Max: '+arr[i].mfeb.toFixed(1)+'%':'')}<br>${(arr[i].hfeb?arr[i].hfeb.toFixed(1)+' Hrs':'')}</td>`);
                tds.push(`<td width='170px'${arr[i].pmar?'class="cell"':''}>${(arr[i].pmar?'Avg: '+arr[i].pmar.toFixed(1)+'% Max: '+arr[i].mmar.toFixed(1)+'%':'')}<br>${(arr[i].hmar?arr[i].hmar.toFixed(1)+' Hrs':'')}</td>`);
                tds.push(`<td width='170px'${arr[i].pabr?'class="cell"':''}>${(arr[i].pabr?'Avg: '+arr[i].pabr.toFixed(1)+'% Max: '+arr[i].mabr.toFixed(1)+'%':'')}<br>${(arr[i].habr?''+arr[i].habr.toFixed(1)+' Hrs':'')}</td>`);
                tds.push(`<td width='170px'${arr[i].pmay?'class="cell"':''}>${(arr[i].pmay?'Avg: '+arr[i].pmay.toFixed(1)+'% Max: '+arr[i].mmay.toFixed(1)+'%':'')}<br>${(arr[i].hmay?arr[i].hmay.toFixed(1)+' Hrs':'')}</td>`);
                tds.push(`<td width='170px'${arr[i].pjun?'class="cell"':''}>${(arr[i].pjun?'Avg: '+arr[i].pjun.toFixed(1)+'% Max: '+arr[i].mjun.toFixed(1)+'%':'')}<br>${(arr[i].hjun?arr[i].hjun.toFixed(1)+' Hrs':'')}</td>`);
                tds.push(`<td width='170px'${arr[i].pjul?'class="cell"':''}>${(arr[i].pjul?'Avg: '+arr[i].pjul.toFixed(1)+'% Max: '+arr[i].mjul.toFixed(1)+'%':'')}<br>${(arr[i].hjul?arr[i].hjul.toFixed(1)+' Hrs':'')}</td>`);
                tds.push(`<td width='170px'${arr[i].pago?'class="cell"':''}>${(arr[i].pago?'Avg: '+arr[i].pago.toFixed(1)+'% Max: '+arr[i].mago.toFixed(1)+'%':'')}<br>${(arr[i].hago?arr[i].hago.toFixed(1)+' Hrs':'')}</td>`);
                tds.push(`<td width='170px'${arr[i].psep?'class="cell"':''}>${(arr[i].psep?'Avg: '+arr[i].psep.toFixed(1)+'% Max: '+arr[i].msep.toFixed(1)+'%':'')}<br>${(arr[i].hsep?arr[i].hsep.toFixed(1)+' Hrs':'')}</td>`);
                tds.push(`<td width='170px'${arr[i].poct?'class="cell"':''}>${(arr[i].poct?'Avg: '+arr[i].poct.toFixed(1)+'% Max: '+arr[i].moct.toFixed(1)+'%':'')}<br>${(arr[i].hoct?arr[i].hoct.toFixed(1)+' Hrs':'')}</td>`);
                tds.push(`<td width='170px'${arr[i].pnov?'class="cell"':''}>${(arr[i].pnov?'Avg: '+arr[i].pnov.toFixed(1)+'% Max: '+arr[i].mnov.toFixed(1)+'%':'')}<br>${(arr[i].hnov?arr[i].hnov.toFixed(1)+' Hrs':'')}</td>`);
                tds.push(`<td width='170px'${arr[i].pdic?'class="cell"':''}>${(arr[i].pdic?'Avg: '+arr[i].pdic.toFixed(1)+'% Max: '+arr[i].mdic.toFixed(1)+'%':'')}<br>${(arr[i].hdic?arr[i].hdic.toFixed(1)+' Hrs':'')}</td>`);
                tds.push(`<td width='170px'${arr[i].pEne_?'class="cell"':''}>${(arr[i].pEne_?'Avg: '+arr[i].pEne_.toFixed(1)+'% Max: '+arr[i].mEne_.toFixed(1)+'%':'')}<br>${(arr[i].hEne_?arr[i].hEne_.toFixed(1)+' Hrs':'')}</td>`);
                tds.push(`<td width='170px'${arr[i].pfeb_?'class="cell"':''}>${(arr[i].pfeb_?'Avg: '+arr[i].pfeb_.toFixed(1)+'% Max: '+arr[i].mfeb_.toFixed(1)+'%':'')}<br>${(arr[i].hfeb_?arr[i].hfeb_.toFixed(1)+' Hrs':'')}</td>`);
                tds.push(`<td width='170px'${arr[i].pmar_?'class="cell"':''}>${(arr[i].pmar_?'Avg: '+arr[i].pmar_.toFixed(1)+'% Max: '+arr[i].mmar_.toFixed(1)+'%':'')}<br>${(arr[i].hmar_?arr[i].hmar_.toFixed(1)+' Hrs':'')}</td>`);
                tds.push(`<td width='170px'${arr[i].pabr_?'class="cell"':''}>${(arr[i].pabr_?'Avg: '+arr[i].pabr_.toFixed(1)+'% Max: '+arr[i].mabr_.toFixed(1)+'%':'')}<br>${(arr[i].habr_?arr[i].habr_.toFixed(1)+' Hrs':'')}</td>`);
                tds.push(`<td width='170px'${arr[i].pmay_?'class="cell"':''}>${(arr[i].pmay_?'Avg: '+arr[i].pmay_.toFixed(1)+'% Max: '+arr[i].mmay_.toFixed(1)+'%':'')}<br>${(arr[i].hmay_?arr[i].hmay_.toFixed(1)+' Hrs':'')}</td>`);
                tds.push(`<td width='170px'${arr[i].pjun_?'class="cell"':''}>${(arr[i].pjun_?'Avg: '+arr[i].pjun_.toFixed(1)+'% Max: '+arr[i].mjun_.toFixed(1)+'%':'')}<br>${(arr[i].hjun_?arr[i].hjun_.toFixed(1)+' Hrs':'')}</td>`);
                tds.push(`<td width='170px'${arr[i].pjul_?'class="cell"':''}>${(arr[i].pjul_?'Avg: '+arr[i].pjul_.toFixed(1)+'% Max: '+arr[i].mjul_.toFixed(1)+'%':'')}<br>${(arr[i].hjul_?arr[i].hjul_.toFixed(1)+' Hrs':'')}</td>`);
                tds.push(`<td width='170px'${arr[i].pago_?'class="cell"':''}>${(arr[i].pago_?'Avg: '+arr[i].pago_.toFixed(1)+'% Max: '+arr[i].mago_.toFixed(1)+'%':'')}<br>${(arr[i].hago_?arr[i].hago_.toFixed(1)+' Hrs':'')}</td>`);
                tds.push(`<td width='170px'${arr[i].psep_?'class="cell"':''}>${(arr[i].psep_?'Avg: '+arr[i].psep_.toFixed(1)+'% Max: '+arr[i].msep_.toFixed(1)+'%':'')}<br>${(arr[i].hsep_?arr[i].hsep_.toFixed(1)+' Hrs':'')}</td>`);
                tds.push(`<td width='170px'${arr[i].poct_?'class="cell"':''}>${(arr[i].poct_?'Avg: '+arr[i].poct_.toFixed(1)+'% Max: '+arr[i].moct_.toFixed(1)+'%':'')}<br>${(arr[i].hoct_?arr[i].hoct_.toFixed(1)+' Hrs':'')}</td>`);
                //if(pproy!=0) 
                //console.log("tds",tds);
                rows=rows+tdh+tds[0];
                for(let j=INITIALMONTH;j<INITIALMONTH+MONTHTOSHOW;j++){
                    if(typeof tds[j]!="undefined" )
                        rows=rows+tds[j];
                }
            }
        }
        contenedor.innerHTML=rowHead+rows;
        //console.log("contenedor height",contenedor.offsetHeight+" "+contenedor.style.height)
    }

}
class ProjectFilterView{
    constructor(data,container){
        this.data=data;
        this.container=container;
        this.gte=new Map();
        
        //xPB.innerHTML += render.sendTable(this.data,"lista_proyectos","","","","");
        
        //lista_gerentes
        this.setGerenteStruct();
    }
    setGerenteStruct(){
        this.data.forEach((el)=>{
        
            if(this.gte.has(el.gerente)){
                this.gte.get(el.gerente).push(el.proyecto)
            }else{
                let arr=[];
                arr.push(el.proyecto)
                this.gte.set(el.gerente,arr);
            }
        })
        
        const gerentes=this.gte.keys();
        //console.log("gte",this.gte,gerentes);
        let gteArr=[]
 
        for (const x of this.gte.keys()) {
            //console.log("x",x);
            gteArr.push(x);
        }
        //lista_gerentes
        var xPB = document.getElementById(this.container);
        xPB.innerHTML += render.sendTable(gteArr,"lista_gerentes","","","","");
    }
    desMarkar(){
        var projMarked = document.getElementsByClassName('proyecto-mark');
        var elemNoMark = Array.prototype.filter.call(projMarked, function(projMarked){
            return projMarked;
        });
        elemNoMark.forEach((el)=>{
            el.className="proyecto";
        })
    }
    
    filterByManager(){
        var manager = document.getElementById(this.container).value;
        var arr=this.gte.get(manager);
        //console.log("selected "+manager);
        this.desMarkar();
        var classProjArr = document.getElementsByClassName("proyecto");
        if(manager=="Seleccione..."){
            for(let ii in classProjArr){
                if(typeof classProjArr[ii].id!="undefined"){
                    classProjArr[ii].style.display="block";  // mostrar el proyecto buscado
                }
            }
            //projView.mostrarProyMonthly(0);
        }else{ 
            var encontrado=false;
            var idProj=0;
            for(let i in classProjArr){
                if(typeof classProjArr[i].id!="undefined"){
                    let id = classProjArr[i].id;
                    let pos = id.indexOf(".");
                    idProj=id.substring(0,pos);
                    //console.log("filtrarPorProyecto",idProj)
                    encontrado=false;
                    arr.forEach((el)=>{
                        if(el==idProj) encontrado=true;
                    })
                    if(encontrado){
                        classProjArr[i].style.display="block";  // mostrar los proyectos del gerente buscado
                    }else{
                        classProjArr[i].style.display="none";  // ocultar los que no son del gerente buscado
                    }
                }
            }   
        }
    }
    filtrarPorProyecto(){
        var proyId = document.getElementById(this.container).value;
        //console.log("selected "+proyId);
        projSummary.fillProjSumm(proyId);

        var classProjArr = document.getElementsByClassName("proyecto");
        if(proyId=="Seleccione..."){
            for(let ii in classProjArr){
                if(typeof classProjArr[ii].id!="undefined"){
                    classProjArr[ii].style.display="block";  // mostrar el proyecto buscado
                }
            }
            projView.mostrarProyMonthly(0);
        }else{ 
            var encontrado=false;
            var idProj=0;
            for(let i in classProjArr){
                if(typeof classProjArr[i].id!="undefined"){
                    let id = classProjArr[i].id;
                    let pos = id.indexOf(".");
                    idProj=id.substring(0,pos);
                    //console.log("filtrarPorProyecto",idProj)
                    if(idProj!=proyId){
                        classProjArr[i].style.display="none";  // ocultar los distintos al proyecto buscado
                    }else{
                        classProjArr[i].style.display="block";  // mostrar el proyecto buscado
                        encontrado=true;
                        
                    }
                }
            }
            if(encontrado){
                var contenedor = document.getElementById(projView.containerProject);
                contenedor.style.display=""
                projView.mostrarProyMonthly(proyId);
            }
                
        }
    }
}
    
class Calendario{
    createBaseTable() {
        //console.log("crear calendario base")
        var x = document.createElement("TABLE");
        x.setAttribute("id", "tmeses");

        document.getElementById("contenido").appendChild(x);
        let y=INITIALYEAR;
        var nombres = document.createElement("TR"); // el encabezado con los nombres de los meses
        nombres.setAttribute("id", "titulo");
        document.getElementById("tmeses").appendChild(nombres);
        let topm=12
        let yearadd=0;
        for(let i=INITIALMONTH;i<INITIALMONTH+MONTHTOSHOW;i++){
                var z = document.createElement("TD");
                
                var numes=i-1;
                topm=i>12&&i<25?12:(i>24?24:0);
                yearadd=i>12&&i<25?1:(i>24?2:0)
                if(i>topm){
                    numes=i-topm-1;
                    y=INITIALYEAR+yearadd;
                    //console.log(i,numes,titulo[numes],y,topm);
                }
                var t = document.createTextNode(titulo[numes] +"-" + y);
                z.appendChild(t);
                document.getElementById("titulo").appendChild(z);
        }
        var totales = document.createElement("TR"); // area de totales
        totales.setAttribute("id", "totales");
        document.getElementById("tmeses").appendChild(totales);
        for(let j=INITIALMONTH;j<INITIALMONTH+MONTHTOSHOW;j++){
                var td = document.createElement("TD");
                td.setAttribute("class", "totales");
                var numes=j;               
                let butt = document.createElement("BUTTON");
                butt.setAttribute("id","but-mes"+j);
                let tbutt=document.createTextNode("Mostrar Todos");
                butt.appendChild(tbutt);
                td.appendChild(butt);
                let div = document.createElement("DIV")
                let titulodiv="mes"+numes+"totales"
                div.setAttribute("id", titulodiv);
                td.appendChild(div);
                document.getElementById("totales").appendChild(td);
                document.getElementById("but-mes"+j).addEventListener("click", function() {
                    //console.log("el id",this.id)
                    let mes=this.id.split("-")[1];
                    if(document.getElementById(this.id).firstChild.textContent=="Mostrar Todos")
                        document.getElementById(this.id).firstChild.textContent="Mostrar 100%";
                    else
                        document.getElementById(this.id).firstChild.textContent="Mostrar Todos";
                    //var elements = [].slice.call(document.getElementById(mes+"totales").children);
                    //console.log("convert to array",elements);
                    let totCols=document.getElementById(mes+"totales").children;                    
                    for (let i = 0; i < totCols.length; i++) {
                        //console.log("cardmini",totCols[i].style,totCols[i].style.display)
                        if(totCols[i].style==""||totCols[i].style.display=="")
                            totCols[i].style.display="block";
                        else
                            totCols[i].style.display="";
                    }
                    /*totArr.forEach((el)=>{
                        if(el.style.display=="block")
                            el.style.display="";
                        else el.style.display="block";
                    })*/
                })
        }
        var vaca = document.createElement("TR"); // area de totales
        vaca.setAttribute("id", "vacaciones");
        document.getElementById("tmeses").appendChild(vaca);
        for(let j=INITIALMONTH;j<INITIALMONTH+MONTHTOSHOW;j++){
                var td = document.createElement("TD");
                td.setAttribute("class", "vacaciones");
                var numes=j;
                var div = document.createElement("DIV")
                let titulodiv="mes"+numes+"vacaciones"
                div.setAttribute("id", titulodiv);
                td.appendChild(div);
                document.getElementById("vacaciones").appendChild(td);
        }        
        var detalle = document.createElement("TR"); // area de detalle
        detalle.setAttribute("id", "detalle");
        document.getElementById("tmeses").appendChild(detalle);
        for(let k=INITIALMONTH;k<INITIALMONTH+MONTHTOSHOW;k++){
                var td = document.createElement("TD");
                td.setAttribute("style", "vertical-align: top;");
                var numes=k;
                //if(j>12) numes=j-12-1
                var div = document.createElement("DIV")
                let titulodiv="mes"+numes
                //console.log("tituloDiv",titulodiv);
                div.setAttribute("id", titulodiv);
                div.setAttribute("class", "mes");
                td.appendChild(div);
                document.getElementById("detalle").appendChild(td);
        }  
    }
}
class PropertyView{
    constructor(container){
        this.container=container;
        this.historicChng=new HistoricChanges();
    }
    refreshHist(){
        this.historicChng.updateData();
    }
    clear(){
        let bar=document.getElementById(this.container);
        bar.style.width="0";
        bar.style.height="0";
        bar.style.padding="0";
        bar.innerHTML="";
    }
    isPropertyBarVisible(){
        let bar=document.getElementById(this.container);
        //console.log("bar isPropertyBarVisible",bar.style.width);
        return !(bar.style.width=="0"||bar.style.width=="0px");
    }
    cleanChng(){

        var len=document.getElementById("chng-table").rows.length; 
        for(let i=len;i>1;i--){
            document.getElementById("chng-table").deleteRow(i-1); 
        }
        //console.log("cleanChng",len,document.getElementById("chng-table"));
    }
    showHistorial(){
        let hcArr= this.getHistoricData();
        //console.log("showHistorial",hcArr);
        let rows="";
        let enc="<table class='paleBlueRows'><thead><tr><th>Nombre<br><button id='b1' onClick='ordena(1)'>-</botton></th><th>IdP<br><button id='b2' onClick='ordena(2)'>-</botton></th><th>Proyecto</th><th>Nuevas Hrs.</th><th>Orig.</th><th>Dif.</th><th>Acción</th></tr></thead><tbody>"
        let endEnc="</tbody></table>";
        let encabChgh="<div class='hist'> <h4>Histórico de Cambios</h4><button onclick='procSort()'>Sort</button><button onclick='clearSort()'>Clean Sort</button> <div id='HistoricTable'>";
        let endEncabh="</div></div><br><hr>";
        rows="";
        rows=render.sendTableWB(hcArr,"gerente","historial_cambios",enc,endEnc,"","");
        bar.innerHTML+=encabChgh+rows+endEncabh;   
    }
    showProperties(idpParam,fasePara,mesParam){
        let bar=document.getElementById(this.container);
        /*var params=param.split(".");
        var firstParam=params[0].split("-");
        var idpParam=firstParam[1];
        var fasePara=params[1];
        var mesParam=params[2];*/
        //console.log("mesParam",mesParam)
        bar.style.width="480px";
        bar.style.padding="4px";
        bar.style.marginLeft=(window.innerWidth-500)+"px"
        bar.style.height=(window.window.innerHeight)+"px"
        var contentBar=document.createElement("DIV");
        contentBar.className="properties";
        var contentProperties=document.createElement("DIV");
        contentProperties.className="resumen";
        var textTitleBar;
        
       
        var existe=false;
        let dataArrT=projList.getData();
        //console.log("dataArr",dataArrT,dataArrT[mesParam]);
        let dataArr=dataArrT[mesParam];
        var tabProperties=`<h4><button onclick='toggleDisp("estatus-table")'>+</button>Asignación</h4> <table id='estatus-table' class='paleBlueRows' style='width:450px'><thead><tr><th>Nombre</th><th>Total Mens</th><th>Horas Mens</th><th>Horas Originales</th></tr></thead><tbody>`;
        for(let i in dataArr){
            
            if(dataArr[i].fase==fasePara && dataArr[i].IDp==idpParam){
                //console.log("en loop",dataArr[i].fase,fasePara,dataArr[i].IDp,idpParam,dataArr[i].mes,mesParam);
                if((dataArr[i].year>INITIALYEAR && dataArr[i].mes+12==mesParam)||(dataArr[i].year<=INITIALYEAR && dataArr[i].mesi==mesParam) ){
                    existe=true;
                    let mesProp=dataArr[i].mes>12?dataArr[i].mes+"("+(dataArr[i].mes-12)+")":dataArr[i].mes
                    textTitleBar=dataArr[i].IDp+" "+dataArr[i].proyecto+"<br> Fase:"+dataArr[i].fase+"<br> Mes :"+mesProp+"<br> Año :"+dataArr[i].year+"<br><hr><br>";
                    let teamProp=dataArr[i].equipo;
                    for(let j in teamProp){
                        let onsite=teamProp[j].inOnSite==1?"Si":"No"
                        //console.log("mes",dataArr[i].mes);
                        let tot=projList.getMonStruct(teamProp[j].nombre,mesParam);
                        tabProperties=tabProperties+`<tr><td>${teamProp[j].nombre}</td><td ${tot>160?"Style='color:red'":""}>${Math.round( tot )}</td><td>${Math.round( teamProp[j].horasPlan)}</td><td>${Math.round(teamProp[j].original)}</td></tr>`
                    }
                }
            }
        }
        if(existe){
            tabProperties=tabProperties+"</tbody></table><br><hr>";
            contentProperties.innerHTML=tabProperties;
            contentBar.innerHTML=bar.innerHTML.indexOf("PROPERTIES VIEW")>=0?textTitleBar:"<h3>PROPERTIES VIEW</h3>"+textTitleBar;
            bar.appendChild(contentBar);
            bar.appendChild(contentProperties);
            
        }
        let chgArr=projList.getChanged();
        //console.log("chgArr",chgArr);
        let encabChg=`<div class='resumen'><h4><button onclick='toggleDisp("chng-table")'>+</button>Cambios por Realizar</h4><table id='chng-table' class='paleBlueRows' style='width:450px'><thead><tr><th>Nombre</th><th>IdP</th><th>Mes</th><th>Cambio</th><th>accion</th></tr></thead><tbody>`
        let endEncab="</tbody></table><br><hr>";
        let rows="";
        /*chgArr.forEach(el=>{
            //console.log("chgArr el",el.equipo)
            let t=el.equipo;
            rows+=render.sendTableComp(el,t,"cambios_staff","","","","");
        });*/
        //console.log("chgArr",chgArr);
        if(chgArr.length>0){
            //console.log("chgArr",chgArr);
            rows+=render.sendTable(chgArr,"cambios_staff","","","","")+"</div>";
        }
        //console.log("rows",rows);
        //console.log("bar",bar.innerHTML);
        bar.innerHTML+=encabChg+rows+endEncab;
        
        this.showHistorial()
      
    }
    getHistoricData(){
        return this.historicChng.getData();
    }
}
class TeamView{
    constructor(data,container){
        this.data=data.data;
        this.container=container;
    }
    buscarPorNombre = (nombre) => {
        let consultor=this.data
        return consultor.find((consultor) => consultor.name === nombre);
    };
    faltan(arr){
        let consultor=this.data;
        let agregar=[];
        consultor.forEach((el)=>{
            if(arr.find((pers)=>pers.usr===el.name)===undefined)
                agregar.push(el.name)
        });
        return agregar;
    }
    show(){
        //teamStruct=fetchData.data
        var contenedor=document.getElementById(this.container);
        contenedor.innerHTML= render.sendTable(this.data,"miembros_equipo","","","","");
    }
    setVisibilityToProy(nb,filtrar){
        //console.log("filtrar",nb)
        var arr=document.getElementsByClassName("proyecto");
        var disp="block"
        if(filtrar){
            disp="none"
        }
        
        for(let i in arr){        
            if( typeof arr[i].id !="undefined") arr[i].style.display=disp;
        }
        if(filtrar){
            let mesArr=projList.getData();
            //console.log("setVisibilityToProy",arr,mesArr);
            for(let j in mesArr){
                //if( YEARTOSHOW>=dataArr[j].year && dataArr[j].mes>=INITIALMONTH && dataArr[j].mes<=INITIALMONTH+MONTHTOSHOW){
                let dataArr=mesArr[j]
                for(let m in dataArr){   
                    var idProj=dataArr[m].IDp+"."+dataArr[m].fase+"."+dataArr[m].mes;
                    var team=dataArr[m].equipo;
                    //console.log("buscando en",team,idProj)
                    for(let k in team){

                        if(team[k].nombre==nb){
                            //console.log("comprobado. nombre",nb)
                            var div=document.getElementById(idProj);
                            if(div!==undefined && div!==null)
                                div.style.display="block"
                        }
                    }
                }
            }
        }
    }    

}
class StaffingView2{
    constructor(container,monthContainer,projListp){
        this.contenedor=container;
        this.mc=monthContainer;
        this.projList=projListp
    }
    createStaffingView(){
        for(let i=1;i<25;i++){
            var cont=document.getElementById("mes"+i);
            //console.log("createStaffingView-meses",i,cont)
            if(cont){
                var totcont=document.getElementById("mes"+i+"totales");
                
                var aux="";
                let totDedic=0;
                cont.innerHTML="";
                if(i==CURRENTMONTH){
                        cont.className="curr-mes";
                }
                if(i>CURRENTMONTH){
                        cont.className="future-mes";
                }
                totcont.innerHTML="";
                //projList.getProjectByMonth(i).forEach(o=>{
                //if(proyectosArr[i]!==undefined)
                if(this.projList.getProjectByMonth(i)!==undefined)
                    //proyectosArr[i].forEach((o)=>{
                    this.projList.getProjectByMonth(i).forEach(o=>{
                        if(o.inStaffing==1||o.Fase=="En Proceso"){
                            //if(o.inStaffing==0 && o.Fase=="En Proceso") console.log("en proceso inStaffing 0",o.IDp)
                            aux=render.send(o,"proyecto_calendarior");
                            var tw=`<div class="teamWrapper" id="w-${o.IDp}.${o.fase}.${o.mesi}" style="display: none;">`;
                            aux+=render.sendTableComp(o,o.equipo,"team_staffingr",tw,"</div>","","");
                            aux+="</div>";
                            cont.innerHTML+=aux;
                        }
                        //else
                          //console.log("staffing 0",o);
                        //totDedic=projList.getTeamDedication(o.IDp,o.fase,o.mes);
                        //console.log("aqui da el error",`ref-${o.IDp}.${o.fase}.${o.mes}`);
                        //document.getElementById(`ref-${o.IDp}.${o.fase}.${o.mes}`).innerHTML=totDedic.toFixed(2);
                    })
            }
        }
    }
    isVisible(){
        return document.getElementById(this.contenedor).style.display==""
    }
    setContainerShow(){
        document.getElementById(this.contenedor).style.display="";
    }
    setContainerHide(){
        document.getElementById(this.contenedor).style.display="none";
    }
    updateStructByMonth(m){
        /*
           depende de projList.setMonStruct(...)
           este método se debe aplicar antes de updateStructByMonth(m)
        */
        //let mesStruct=projList.getStructByMonth(m);
        var id="mes"+parseInt(m)+"totales";
        //console.log("mon",id);
        var mon=document.getElementById(id);
        mon.innerHTML="";
        //var pers=mesStruct[m];
        let pers=this.projList.getStructByMonth(m);
        //console.log("updateStructByMonth pers",pers);
        pers.forEach(function(value,key){
            var div=document.createElement("div");
            var clase="good";                    
            if(value.horasPlan>GOODTHRESHOLD){
                clase="bad";
            }                         
            let obj={key:key,clase:"cardmini "+clase,mes:m,horasPlan:value.horasPlan,horasReal:value.horasReal}
            if(obj.horasPlan>0 || obj.horasReal>0){
                mon.innerHTML+=render.send(obj,"total_persona_mes");     
            }           
        })
    }
    createMonStruct(){      
        let mesStruct=this.projList.getAllMonStruct();
        //console.log("createMonStruct - mesStruct",mesStruct);
        for(let r in mesStruct){
            if(mesStruct[r]!= ""){
                //console.log("r",mesStruct[r].mes)
                var m=r; 
                var id="mes"+parseInt(r)+"totales";
                //console.log("mon",id);
                var mon=document.getElementById(id);
                if(mon!=null){ 
                    var pers=mesStruct[r];
                    pers.forEach(function(value,key){
                        var div=document.createElement("div");
                        var clase="good";                    
                        if(value.horasPlan>GOODTHRESHOLD||value.horasReal>GOODTHRESHOLD){
                            clase="bad";
                        }                         
                        let obj={key:key,clase:"cardmini "+clase,mes:m,horasPlan:value.horasPlan,horasReal:value.horasReal}      
                        if(obj.horasPlan>0 || obj.horasReal>0)
                            mon.innerHTML+=render.send(obj,"total_persona_mes");          
                    })
                }
            }
        }
    }
    drop(ev) {
        ev.preventDefault();
        let target_id=ev.target.id;
        let arrTarget=target_id.split(".");
        let idProj=arrTarget[0];
   
        //console.log("drop",ev.target.id,idProj,arrTarget,ev.target)
        let faseProj=arrTarget[1];
        let mesProj=arrTarget[2];
        if(mesProj>=CURRENTMONTH){
            //${o.nombre}-${o.IPp}.${o.fase}.${o.mes}-${o.inOnSite}
            var member_toAppend=ev.dataTransfer.getData("text");
            //console.log("en drop",ev.target.id);
            //console.log("getdata",member_toAppend);

            var nombre=member_toAppend.split("-")[1];
            var idABuscar="c-"+nombre+"-"+idProj+"."+faseProj+"-"+mesProj;
       // if(document.getElementById(idABuscar)==null){
            let obj={nombre:nombre,IDp:idProj,fase:faseProj,mes:mesProj,inOnSite:0,dedicacion:0}
            let newMember=render.send(obj,"drop_persona");
            ev.target.innerHTML += newMember;
            var h=ev.target.style.height;
            var hh=h.replace("px","");
            var hh=parseInt(hh)+50;
            ev.target.style.height=hh+"px";
        }else alert("Solo puede cambiar los datos actuales y futuros")
            
        //}else confirm("El consultor ya está asignado al proyecto. Intente con otro") 

    }    

}
class StaffingView{
    constructor(container,monthContainer){
        this.contenedor=container;
        this.mc=monthContainer;
    }
    createStaffingView(){
        for(let i=INITIALMONTH;i<INITIALMONTH+MONTHTOSHOW;i++){
            var cont=document.getElementById(this.mc+i);
            var totcont=document.getElementById(this.mc+i+"totales");
            var aux="";
            let totDedic=0;
            cont.innerHTML="";
            totcont.innerHTML="";
            projList.getProjectByMonth(i).forEach(o=>{
                //console.log(i,o);
                aux=render.send(o,"proyecto_calendario");
                var tw=`<div class="teamWrapper" id="w-${o.IDp}.${o.fase}.${o.mes}" style="display: none;">`;
                aux+=render.sendTableComp(o,o.equipo,"team_staffing",tw,"</div>","","");
                aux+="</div>";
                cont.innerHTML+=aux;
                totDedic=projList.getTeamDedication(o.IDp,o.fase,o.mes);
                //console.log("aqui da el error",`ref-${o.IDp}.${o.fase}.${o.mes}`);
                document.getElementById(`ref-${o.IDp}.${o.fase}.${o.mes}`).innerHTML=totDedic.toFixed(1);
            })  
        }
    }
    isVisible(){
        return document.getElementById(this.contenedor).style.display==""
    }
    setContainerShow(){
        document.getElementById(this.contenedor).style.display="";
    }
    setContainerHide(){
        document.getElementById(this.contenedor).style.display="none";
    }
    updateStructByMonth(m){
        /*
           depende de projList.setMonStruct(...)
           este método se debe aplicar antes de updateStructByMonth(m)
        */
        //let mesStruct=projList.getStructByMonth(m);
        var id="mes"+parseInt(m)+"totales";
        //console.log("mon",id);
        var mon=document.getElementById(id);
        mon.innerHTML="";
        //var pers=mesStruct[m];
        let pers=projList.getStructByMonth(m);
        //console.log("pers",pers);
        pers.forEach(function(value,key){
            var div=document.createElement("div");
            var clase="good";                    
            if(value.dedicacion>GOODTHRESHOLD){
                clase="bad";
            }                         
            let obj={key:key,clase:"cardmini "+clase,mes:m,dedi:value.dedicacion}      
            if(obj.horasPlan>0 || obj.horasReal>0)
                mon.innerHTML+=render.send(obj,"total_persona_mes");          
        })
    }
    createMonStruct(){      
        let mesStruct=projList.getAllMonStruct();
        for(let r in mesStruct){
            if(mesStruct[r]!= ""){
                //console.log("r",mesStruct[r].mes)
                var m=r; 
                var id="mes"+parseInt(r)+"totales";
                //console.log("mon",id);
                var mon=document.getElementById(id);
                if(mon!=null){ 
                    var pers=mesStruct[r];
                    pers.forEach(function(value,key){
                        var div=document.createElement("div");
                        var clase="good";                    
                        if(value.dedicacion>GOODTHRESHOLD){
                            clase="bad";
                        }                         
                        let obj={key:key,clase:"cardmini "+clase,mes:m,dedi:value.dedicacion}                              
                        mon.innerHTML+=render.send(obj,"total_persona_mes");          
                    })
                }
            }
        }
    }
    drop(ev) {
        ev.preventDefault();
        let target_id=ev.target.id;
        let arrTarget=target_id.split(".");
        let idProj=arrTarget[0];
   
        //console.log("drop",ev.target.id,idProj,arrTarget,ev.target)
        let faseProj=arrTarget[1];
        let mesProj=arrTarget[2];
        //${o.nombre}-${o.IPp}.${o.fase}.${o.mes}-${o.inOnSite}
        var member_toAppend=ev.dataTransfer.getData("text");
        //console.log("en drop",ev.target.id);
        //console.log("getdata",member_toAppend);

        var nombre=member_toAppend.split("-")[1];
        var idABuscar="c-"+nombre+"-"+idProj+"."+faseProj+"-"+mesProj;
       // if(document.getElementById(idABuscar)==null){
            let obj={nombre:nombre,IDp:idProj,fase:faseProj,mes:mesProj,inOnSite:0,dedicacion:0}
            let newMember=render.send(obj,"drop_persona");
            ev.target.innerHTML += newMember;
            var h=ev.target.style.height;
            var hh=h.replace("px","");
            var hh=parseInt(hh)+50;
            ev.target.style.height=hh+"px";
            
        //}else confirm("El consultor ya está asignado al proyecto. Intente con otro") 

    }    

}
class PeopleView{
    constructor(peopleObj,container,containerGlob){
      this.peopleArr=[];
      var projArr =[]
      peopleObj.data.forEach((d)=>{
          if(d.in_staffing==1)
            this.peopleArr.push(d);
      })
      this.peopleArr.sort(function(a, b) {
        if (a.usr < b.usr) {
          return -1;
        }
        if (a.usr > b.usr) {
          return 1;
        }
        return 0;
      });
      //console.log(" peopleArr",this.peopleArr);
      this.container=container;
      this.containerGlob=containerGlob
    }
    isVisible(){
        let content = document.getElementById(this.containerGlob);
        //console.log("content.style.display",content.style.display);
        return content.style.display=="";
    }
    setContainerHide(){
        let content = document.getElementById(this.containerGlob);
        content.style.display="none";
    }
    setContainerShow(){
        let content = document.getElementById(this.containerGlob);
        content.style.display="block";
    }
    mostrar(x){
        var arr=document.getElementsByName(x);
        arr.forEach((el)=>{
            if(el.style.display=="none"){
                el.style.display="";
            }else el.style.display="none";
        });
    }
    sumar(hcArr){
        const map1 = new Map();
        var rompe=hcArr[0].usr;
        let tene=0.0
        let tfeb=0.0
        let tmar=0.0
        let tabr=0.0
        let tmay=0.0
        let tjun=0.0
        let tjul=0.0
        let tago=0.0
        let tsep=0.0
        let toct=0.0
        let tnov=0.0
        let tdic=0.0
        let trene=0.0
        let trfeb=0.0
        let trmar=0.0
        let trabr=0.0
        let trmay=0.0
        let trjun=0.0
        let trjul=0.0
        let trago=0.0
        let trsep=0.0
        let troct=0.0
        let trnov=0.0
        let trdic=0.0
        for(let i in hcArr){
            if(rompe!=hcArr[i].usr){
                map1.set(rompe,{ene:tene,feb:tfeb,mar:tmar,abr:tabr,may:tmay,jun:tjun,
                        jul:tjul,ago:tago,sep:tsep,oct:toct,nov:tnov,dic:tdic,
                        rene:trene,rfeb:trfeb,rmar:trmar,rabr:trabr,rmay:trmay,rjun:trjun,
                        rjul:trjul,rago:trago,rsep:trsep,roct:troct,rnov:trnov,rdic:trdic});
                //console.log("total",rompe,tene,tfeb,tmar,map1);
                tene=parseFloat(hcArr[i].pEne==null?0.0:hcArr[i].pEne)
                tfeb=parseFloat(hcArr[i].pFeb==null?0.0:hcArr[i].pFeb)
                tmar=parseFloat(hcArr[i].pMar==null?0.0:hcArr[i].pMar)  

                tabr=parseFloat(hcArr[i].pAbr==null?0.0:hcArr[i].pAbr)
                tmay=parseFloat(hcArr[i].pMay==null?0.0:hcArr[i].pMay)
                tjun=parseFloat(hcArr[i].pJun==null?0.0:hcArr[i].pJun)

                tjul=parseFloat(hcArr[i].pJul==null?0.0:hcArr[i].pJul)
                tago=parseFloat(hcArr[i].pAgo==null?0.0:hcArr[i].pAgo)
                tsep=parseFloat(hcArr[i].pSep==null?0.0:hcArr[i].pSep)

                toct=parseFloat(hcArr[i].pOct==null?0.0:hcArr[i].pOct)
                tnov=parseFloat(hcArr[i].pNov==null?0.0:hcArr[i].pNov)
                tdic=parseFloat(hcArr[i].pDic==null?0.0:hcArr[i].pDic)

                trene=parseFloat(hcArr[i].rEne==null?0.0:hcArr[i].rEne)
                trfeb=parseFloat(hcArr[i].rFeb==null?0.0:hcArr[i].rFeb)
                trmar=parseFloat(hcArr[i].rMar==null?0.0:hcArr[i].rMar)  

                trabr=parseFloat(hcArr[i].rAbr==null?0.0:hcArr[i].rAbr)
                trmay=parseFloat(hcArr[i].rMay==null?0.0:hcArr[i].rMay)
                trjun=parseFloat(hcArr[i].rJun==null?0.0:hcArr[i].rJun)

                trjul=parseFloat(hcArr[i].rJul==null?0.0:hcArr[i].rJul)
                trago=parseFloat(hcArr[i].rAgo==null?0.0:hcArr[i].rAgo)
                trsep=parseFloat(hcArr[i].rSep==null?0.0:hcArr[i].rSep)

                troct=parseFloat(hcArr[i].rOct==null?0.0:hcArr[i].rOct)
                trnov=parseFloat(hcArr[i].rNov==null?0.0:hcArr[i].rNov)
                trdic=parseFloat(hcArr[i].rDic==null?0.0:hcArr[i].rDic)
                rompe=hcArr[i].usr
            }else{
                tene=tene+parseFloat(hcArr[i].pEne==null?0.0:hcArr[i].pEne)
                tfeb=tfeb+parseFloat(hcArr[i].pFeb==null?0.0:hcArr[i].pFeb)
                tmar=tmar+parseFloat(hcArr[i].pMar==null?0.0:hcArr[i].pMar)

                tabr= tabr+ parseFloat(hcArr[i].pAbr==null?0.0:hcArr[i].pAbr)
                tmay= tmay+ parseFloat(hcArr[i].pMay==null?0.0:hcArr[i].pMay)
                tjun= tjun+ parseFloat(hcArr[i].pJun==null?0.0:hcArr[i].pJun)

                tjul= tjul+ parseFloat(hcArr[i].pJul==null?0.0:hcArr[i].pJul)
                tago= tago+ parseFloat(hcArr[i].pAgo==null?0.0:hcArr[i].pAgo)
                tsep= tsep+ parseFloat(hcArr[i].pSep==null?0.0:hcArr[i].pSep)

                toct= toct+ parseFloat(hcArr[i].pOct==null?0.0:hcArr[i].pOct)
                tnov= tnov+ parseFloat(hcArr[i].pNov==null?0.0:hcArr[i].pNov)
                tdic= tdic+ parseFloat(hcArr[i].pDic==null?0.0:hcArr[i].pDic)

                trene=trene+parseFloat(hcArr[i].rEne==null?0.0:hcArr[i].rEne)
                trfeb=trfeb+parseFloat(hcArr[i].rFeb==null?0.0:hcArr[i].rFeb)
                trmar=trmar+parseFloat(hcArr[i].rMar==null?0.0:hcArr[i].rMar) 

                trabr=trabr+parseFloat(hcArr[i].rAbr==null?0.0:hcArr[i].rAbr)
                trmay=trmay+parseFloat(hcArr[i].rMay==null?0.0:hcArr[i].rMay)
                trjun=trjun+parseFloat(hcArr[i].rJun==null?0.0:hcArr[i].rJun)

                trjul=trjul+parseFloat(hcArr[i].rJul==null?0.0:hcArr[i].rJul)
                trago=trago+parseFloat(hcArr[i].rAgo==null?0.0:hcArr[i].rAgo)
                trsep=trsep+parseFloat(hcArr[i].rSep==null?0.0:hcArr[i].rSep)

                troct=troct+parseFloat(hcArr[i].rOct==null?0.0:hcArr[i].rOct)
                trnov=trnov+parseFloat(hcArr[i].rNov==null?0.0:hcArr[i].rNov)
                trdic=trdic+parseFloat(hcArr[i].rDic==null?0.0:hcArr[i].rDic)
            }
        }
        map1.set(rompe,{ene:tene,feb:tfeb,mar:tmar,abr:tabr,may:tmay,jun:tjun,
                    jul:tjul,ago:tago,sep:tsep,oct:toct,nov:tnov,dic:tdic,
                    rene:trene,rfeb:trfeb,rmar:trmar,rabr:trabr,rmay:trmay,rjun:trjun,
                    rjul:trjul,rago:trago,rsep:trsep,roct:troct,rnov:trnov,rdic:trdic});
        //console.log("total",rompe,tene,tfeb,tmar,map1);
        return map1;
    }
    renderView(){
        let hcArr= this.peopleArr;
        //console.log("en render",hcArr);
        let totales = new Map();
        totales=this.sumar(hcArr)
        var rowName=[]
        var rompe="";
        var ind=0;
        var dataArr=[];
        let inTeam=false
        for(let i in hcArr){
            if(rompe!=hcArr[i].usr){
            //close break for example totals
                inTeam=true;
                if(teamView.buscarPorNombre(hcArr[i].usr)===undefined){
                    console.log(" el usuario no existe",hcArr[i].usr);
                    inTeam=false;
                }
                    
                if(rompe==""){
                    ind=1;
                    rompe=hcArr[i].usr;
                }
                let obj=totales.get(hcArr[i].usr)

                //console.log(" obj",obj,hcArr[i].usr,totales)
                if(obj!==undefined)
                    dataArr.push({usr:hcArr[i].usr,ind:0,inTeam:inTeam,idProy:'',nb_proyecto:'',fase:'',pEne:obj.ene,pFeb:obj.feb,pMar:obj.mar,pAbr:obj.abr,pMay:obj.may,pJun:obj.jun,pJul:obj.jul,pAgo:obj.ago,pSep:obj.sep,pOct:obj.oct,pNov:obj.nov,pDic:obj.dic,rEne:obj.rene,rFeb:obj.rfeb,rMar:obj.rmar,rAbr:obj.rabr,rMay:obj.rmay,rJun:obj.rjun,rJul:obj.rjul,rAgo:obj.rago,rSep:obj.rsep,rOct:obj.roct,rNov:obj.rnov,rDic:obj.rdic})
                rompe=hcArr[i].usr;
                hcArr[i].ind=ind;
            //prepare next
            }
            hcArr[i].ind=ind;
            inTeam=true;
            if(teamView.buscarPorNombre(hcArr[i].usr)===undefined){
                console.log(" el usuario no existe",hcArr[i].usr);
                inTeam=false;
            }
            hcArr[i].inTeam=inTeam;
            //console.log(aux);
            dataArr.push(hcArr[i]);
            ind++;
        }
        //console.log("tiene ind",dataArr);
        var rowName=["<div id='people'><div id='table-scroll' class='table-scroll'><table class='paleBlueRows'><thead><tr><th>Nombre</th><th>proyecto</th><th>Fase</th>","<th>Ene</th>","<th>Feb</th>","<th>Mar</th>","<th>Abr</th>","<th>May</th>","<th>Jun</th>","<th>Jul</th>","<th>Ago</th>","<th>Sep</th>","<th>Oct</th>","<th>Nov</th>","<th>Dic</th></tr></thead><tbody>"]
        let rowHead=rowName[0];
        for(let m=INITIALMONTH;m<INITIALMONTH+MONTHTOSHOW;m++){
            if(m!=0)
                if(rowName[m])
                    rowHead=rowHead+rowName[m];
        }
        //console.log("rowHead",rowHead);
        let encabChgh="<div id='people'><div id='table-scroll' class='table-scroll'><table class='paleBlueRows'><thead><tr><th>Nombre</th><th>proyecto</th><th>Fase</th><th>Ene</th><th>Feb</th><th>Mar</th><th>Abr</th><th>May</th><th>Jun</th><th>Jul</th><th>Ago</th><th>Sep</th><th>Oct</th><th>Nov</th><th>Dic</th></tr></thead><tbody>"
        let endEncabh="</tbody></table></div></div>";
        let rows="";
        //rows=render.sendTable(hcArr,"fact_personas","","","","");
        //console.log("people",dataArr);
        rows=render.sendTable(dataArr,"fact_personas","","","","");
        let tab=document.getElementById(this.container)
        tab.innerHTML = rowHead+rows+endEncabh;
    } 
}
class Acumulador{
    constructor(whatcount,fases,include){
        this.fases=[];
        this.fases=fases;
        this.whatcount=whatcount;
        this.dataRow=new Map();
        this.include=include;  //boolean
    }
    get(row){
        return this.dataRow.get(row)===undefined?0:this.dataRow.get(row).valor;
    }
    isInclude(){
        return this.include;
    }
    del(){
        this.dataRow=new Map();
    }
    //row es cualquier fila, por ejemplo, consultores
    //val puede ser horas, o simplemente 1 para contar
    add(idp,fase,row,val){
        //if(row=="Keila Machado")console.log("add",idp,fase,row,val)
        if(this.fases.find((el) => el === fase)!==undefined)
            if(this.dataRow.has(row)){
                this.dataRow.set(row,{valor:this.dataRow.get(row).valor+val,
                                      cols:this.dataRow.get(row).cols+","+idp})
            }else{
                this.dataRow.set(row,{valor:val,cols:idp.toString()});
                //console.log("this.dataRow",this.dataRow);
            }
    }
    // si algún proyecto asociado a row, está entre los seleccionados los reduce del total
    recount(row,arrSelect){
        let current=this.dataRow.get(row);
        if(current===undefined) return current;
        let proyArr=current.cols.split(",");
        //console.log("current is defined",current,row,proyArr);
        let c=0;
        arrSelect.forEach((el)=>{
            if(proyArr.find((proy)=>parseInt(proy)==parseInt(el))!==undefined)
                c++;
            /*if(this.include){
                if(proyArr.find((proy)=>proy===el)===undefined)
                    c++;
            }else
                if(proyArr.find((proy)=>proy===el)!==undefined)
                    c++;*/
        })
        //if(row="Alexeis Perera") console.log("recount",row,c,proyArr,arrSelect)
        return (c).toFixed(0);//(current.valor-c).toFixed(2);
    }
    recountadd(row,arrSelect){
        let current=this.dataRow.get(row);
        if(current===undefined) return current;
        //console.log("current is not defined",current,row);
        let proyArr=current.cols.split(",");
        let c=0;
        arrSelect.forEach((el)=>{
            if(proyArr.find((proy)=>proy==el)!==undefined)
                c++;

        })
        //if(row="Alexeis Perera") console.log("recountadd",row,c,proyArr,arrSelect)
        return (c).toFixed(0);//(current.valor+c).toFixed(2);
    }
    recalc(row,crossObj,arrSelect){
        let current=this.dataRow.get(row);
        if(current===undefined) return current;
        //console.log("current is not defined",this.dataRow,current,row);
        let proyArr=current.cols.split(",");
        let hrs=0
        arrSelect.forEach((el)=>{
            if(proyArr.find((proy)=>parseInt(proy)==parseInt(el))!==undefined)
                hrs+=crossObj.getHoras(el,row);
        })
        return (hrs).toFixed(1);//(current.valor-hrs).toFixed(2);
    }
    recalcadd(row,crossObj,arrSelect){
        let current=this.dataRow.get(row);
        if(current===undefined) return current;
        //console.log("current is not defined",this.dataRow,current,row);
        let proyArr=current.cols.split(",");
        let hrs=0
        arrSelect.forEach((el)=>{
            if(proyArr.find((proy)=>proy==el)!==undefined)
                hrs+=crossObj.getHoras(el,row);
        })
        return (hrs).toFixed(1);//(current.valor+hrs).toFixed(2);
    }

}

class CrossRefView{
    constructor(crossObj,container,tablename,team){
        this.crossObj=crossObj;
        this.container=container;
        this.tablename=tablename;
        this.team=team;
        this.allProject=[];
        this.cantProyProp=new Acumulador("Cuenta proyectos + propuestas",["En Proceso","Cierre Interno","Propuesta Activa","Lead","Detendido","SOW/Contrato","Propuesta no Aceptada"],undefined);
        this.countProjActv=new Acumulador("Cuenta proyectos activos",["En Proceso","Cierre Interno"],false);
        this.countOther=new Acumulador("Cuenta proyectos no activos",["Propuesta Activa","Lead","Detendido","SOW/Contrato","Propuesta no Aceptada"],false);
        this.countProjNS=new Acumulador("Cuenta todos los proyectos - considerados",["En Proceso","Cierre Interno","Propuesta Activa","Lead","Detendido","SOW/Contrato","Propuesta no Aceptada"],false);
        this.countProjS=new Acumulador("Cuenta todos los proyectos - no considerados",["En Proceso","Cierre Interno","Propuesta Activa","Lead","Detendido","SOW/Contrato","Cerrado"],true);
        this.hoursProjPropS=new Acumulador("suma horas todos los proyectos-No considerados",["En Proceso","Cierre Interno","Propuesta Activa","Lead","Detendido","SOW/Contrato","Cerrado"],true);// se encuentra en la lista de selección para ocultar
        this.hoursProjPropNS=new Acumulador("suma horas todos los proyectos-Considerar",["En Proceso","Cierre Interno","Propuesta Activa","Lead","Detendido","SOW/Contrato","Cerrado"],false);  // NO se encuentra en la lista de selección para ocultar
    }

    setContainerHide(){
        let content = document.getElementById(this.container);
        content.style.display="none";
    }
    setContainerShow(){
        let content = document.getElementById(this.container);
        content.style.display="block";
    }
    buscarPosicion(projs,proyid){
        //let proyMap=this.crossObj.getProjMap();
        let esta=false;
        for(let j=0;j<projs.length;j++){
            if(projs[j]==proyid){
                esta=true;
                break;
            }
        }
        return esta;
    }
    toDelProject2hide(id){
        //this.crossObj.delProjectHide();
        //this.crossObj.delProjectList();
        let idFiltrados = this.allProject.filter((idp) => idp != id);
        this.allProject=idFiltrados;
        
    }
    hideShowConsiderar(){
        
    }
    toShowProject(){        
        const select = document.getElementById("hideProyectos");
        const selectedOptions = select.selectedOptions;
        for (let i = selectedOptions.length - 1; i >= 0; i--) {
            let proy2hide=document.getElementsByName(selectedOptions[i].value);
            proy2hide.forEach(node => {
                node.style.display="";
            });
            this.allProject.push(selectedOptions[i].value);
            this.crossObj.delProjectHideById(selectedOptions[i].value);
            const option = selectedOptions[i];
            select.remove(option.index);
          }
        this.backProj();
    }
    toHideProject(){
        let proyMap=this.crossObj.getProjMap();
        const select = document.getElementById("hideProyectos");
        let opt="";       
        let arr=this.crossObj.getProjectHide();
        arr.forEach(el=>{
            for (const [indice, valor] of proyMap.entries()) {
                if(indice==el){
                    opt+= `<option value="${indice}">${indice}-${valor.nb}</option>`;
                    break;
                }
            }
            let proy2hide=document.getElementsByName(el);
            proy2hide.forEach(node => {
                node.style.display="none"
              });
        });
        select.innerHTML=opt;
        this.excludProj();
    }
   encontrarDuplicados(arr) {
        const noDuplicados = arr.filter((elemento, index) => arr.indexOf(elemento) === index);
        const duplicados = arr.filter((elemento, index) => arr.indexOf(elemento) !== index);
      
        return duplicados;
      }
    excludProj(){
        //hrexcl-name y excluido -hrincl
        let consulArr=this.crossObj.getCrossArr();
        let arrSelect=this.crossObj.getProjectHide();
        let arrNoSelect=this.allProject    //this.crossObj.getProjectList();
        let dup1=this.encontrarDuplicados(arrSelect);
        let dup2=this.encontrarDuplicados(arrNoSelect);
        //console.log("arrSelect",arrSelect,arrNoSelect,dup1.length,dup2.length);
        consulArr.forEach(el=>{
            let newProjs=this.countProjActv.recount(el.usr,arrNoSelect);
            let newProjsNS=this.countOther.recount(el.usr,arrNoSelect);
            let newHoursS=this.hoursProjPropS.recalc(el.usr,this.crossObj,arrSelect);
            let newHoursNS=this.hoursProjPropNS.recalc(el.usr,this.crossObj,arrNoSelect);
            if(newProjs!==undefined)document.getElementById("totProyAct-"+el.usr).innerHTML=newProjs;
            if(newProjsNS!==undefined)document.getElementById("totProp-"+el.usr).innerHTML=newProjsNS;
            if(newHoursS!==undefined)document.getElementById("hrincl-"+el.usr).innerHTML=newHoursS;
            if(newHoursNS!==undefined)document.getElementById("hrexcl-"+el.usr).innerHTML=newHoursNS;
            
        })
    }
    backProj(){
        //hrexcl-name y excluido
        let consulArr=this.crossObj.getCrossArr();
        let arrSelect=this.crossObj.getProjectHide();
        let arrNoSelect=this.allProject;   //this.crossObj.getProjectList();
        consulArr.forEach(el=>{
            let newProjs=this.countProjActv.recountadd(el.usr,arrNoSelect);
            let newProjsNS=this.countOther.recountadd(el.usr,arrNoSelect);
            
            let newHoursS=this.hoursProjPropS.recalcadd(el.usr,this.crossObj,arrSelect);
            let newHoursNS=this.hoursProjPropNS.recalcadd(el.usr,this.crossObj,arrNoSelect);
            if(newProjs!==undefined)document.getElementById("totProyAct-"+el.usr).innerHTML=newProjs;
            if(newProjsNS!==undefined)document.getElementById("totProp-"+el.usr).innerHTML=newProjsNS;
            if(newHoursS!==undefined)document.getElementById("hrincl-"+el.usr).innerHTML=newHoursS;
            if(newHoursNS!==undefined)document.getElementById("hrexcl-"+el.usr).innerHTML=newHoursNS;
        })
    }
    
    colorear(v){
        let color=""
        if(v<=4) color="var(--color-sem-normal);"
        else if(v>4 && v<=8) color="var(--color-sem-yellow)";
        else if(v>8 && v<=16) color="var(--color-sem-green)";
        else if(v>16) color="var(--color-sem-red)";
        return "color:"+color;
    }
    semaforo(v){
        let vv=(v/160)*100
        let sem="";
        if(vv<=80) sem="sem-amarillo.svg";
        else if(vv>80 && vv<=100) sem="sem-verde.svg";
        else if(vv>100 ) sem="sem-rojo.svg";
        return `<img src="image/${sem}" width="12px"><img>`;
    }
    claseFase(f){
        let clasef="";
        if(f=="En Proceso") clasef = "enproceso";
        if(f=="Propuesta Activa") clasef = "prop-activa";
        if(f=="SOW/Contrato") clasef = "sow-contrato";
        if(f=="Detenido") clasef = "detenido";
        if(f=="Lead") clasef = "lead";
        if(f=="Propuesta no Aceptada")clasef="prop-no-acep";
        if(f=="Cerrado")clasef="proycerrado";
        if(f=="Cierre Interno")clasef="cierre-interno";
        if(f=="Lead sin Continuidad")clasef="lead-sin";
        return "class='"+clasef+"'";
    }
    colorFase(f){
        let color="";
        if(f=="En Proceso") color = "var(--color-fase-enproceso)";
        if(f=="Propuesta Activa") color = "var(--color-fase-propuesta)";
        if(f=="Propuesta Detenida") color = "var(--color-fase-prop-detenida)";
        if(f=="SOW/Contrato") color = "var(--color-fase-sow-contrato)";
        if(f=="Detenido") color = "var(--color-fase-detenido)";
        if(f=="Lead") color = "var(--color-fase-lead)";
        if(f=="Propuesta no Aceptada")color="var(--color-fase-propnoacep)";
        if(f=="Cerrado")color="var(--color-fase-cerrado)";
        if(f=="Cierre Interno")color="var(--color-fase-cierre-int)";
        if(f=="Lead sin Continuidad")color="var(--color-fase-leadsincont)";
        return "style='z-index:0;background-color:"+color+";'";
    }
    showProjectSelector(){
        let proyMap=this.crossObj.getProjMap();
        let lbel=`<label for="proyectos" style="display:table-cell;vertical-align:middle">Selecciona los proyectos a mostrar - </label>`
        let sel=`<select id="hideProyectos" multiple name="hideProyectos[]">`
        let opt="";
        for (const [indice, valor] of proyMap.entries()) {
            this.allProject.push(indice);
            //opt+= `<option value="${indice}">${indice}-${valor.nb}</option>`
        }
        return lbel+sel+opt+"</select><button onclick='showProjectsel()' style='padding:15px;'>Procesar selección</button>";
    }
    generateCSV(){
        // Obtener una referencia a la tabla
        const tabla = document.getElementById("tab-proj-01");

        // Crear un array para almacenar los datos
        const datos = [];
        const filaArr=[];

        // Recorrer las filas de la tabla
        for (let i = 0; i < tabla.rows.length; i++) {
            const fila = tabla.rows[i];

            // Crear un objeto para almacenar los datos de la fila
            const filaDatos = [];
            
            let filaContent="";

            // Recorrer las celdas de la fila
                for (let j = 0; j < fila.cells.length; j++) {
                    const celda = fila.cells[j];

                    // Verificar si la celda está visible
                    const estilos = window.getComputedStyle(celda);
                    if (estilos.getPropertyValue("display") !== "none") {
                    // Acceder al contenido de la celda y guardarlo en el objeto
                        filaDatos[celda.cellIndex] = celda.innerHTML;
                        let cel=celda.innerHTML=="&nbsp;"?"":celda.innerHTML;
                        let pos=cel.indexOf("g>");
                        if(pos>0)cel=cel.substring(pos+2);
                        let pos2=cel.indexOf("j(")
                        let pos3=cel.indexOf(')">O')
                        if(pos2>0){ pos2=pos2+1;
                            cel=cel.replace(cel.substring(pos2,pos3),"");
                        }
                        cel=cel.replace('<button onclick="hideProj',"")
                        cel=cel.replace(')">Ocultar</button>',"");
                        cel=cel.replace('&nbsp;',"");
                        cel=cel.replace('&nbsp;',"");
                        cel=cel.replace(","," ");
                        cel=cel.replace(";"," ")
                        filaContent+=j==0?cel:","+cel;
                    }
                }

            // Añadir los datos de la fila al array
            datos.push(filaDatos);
            filaArr.push(filaContent+"\n");
        }
        //console.log("archivo csv",datos,filaArr);
        return filaArr;
        // Generar el archivo CSV utilizando la librería Papaparse
        //const csv = Papa.unparse(datos);

    }
    showCrossRef(){
        let proyMap=this.crossObj.getProjMap();
        let consulArr=this.crossObj.getCrossArr();
        let faltantes=this.team.faltan(consulArr);
        this.cantProyProp.del();                  
        this.countProjActv.del();
        this.countOther.del();
        this.countProjS.del();
        this.countProjNS.del();
        this.hoursProjPropS.del();
        this.hoursProjPropNS.del();
        //console.log("faltantes",faltantes);
        let posicion = -1;
        let i=0;
        let th="<thead><tr ><th class='rotar' style='width:250px'>Consultor</th>";
        let tfase="<tr><th style='z-index:2;width:250px'>&nbsp;</th>";
        tfase+=`<th style='color:black;z-index:0'></th>
            <th style='color:black;z-index:0'></th>
            <th style='color:black;z-index:0'></th>
            <th style='color:black;z-index:0'></th>
            <th style='color:black;z-index:0'></th>
            <th style='color:black;z-index:0'></th>
            <th style='color:black;z-index:0'></th>
            <th style='color:black;z-index:0'></th>
            <th style='color:black;z-index:0'></th>`;
        th+=`<th  style='z-index:2'>% Utilización Proyectos</th>
            <th  style='z-index:2'>HORAS Categoría Proyectos</th>
            <th  style='z-index:2'>HORAS Categoría Propuesta</th>
            <th  style='z-index:2'>HORAS No Disponibles</th>
            <th  style='z-index:2'>HORAS Resto de Categorías</th>
            <th  style='z-index:2'>TOTAL DE HORAS </th>
            <th  style='z-index:2'>CANTIDAD Proyectos</th>
            <th  style='z-index:2'>CANTIDAD Propuestas</th>
            <th  style='z-index:2'>CANTIDAD TOTAL</th>`
        let considera;
        for (const [indice, valor] of proyMap.entries()) {
            considera=proyectos.getConsiderar(indice)
            th+=`<th class="considerar${considera}" name="${indice===null?0:indice}" >${indice===null?"":indice}-${valor.nb===null?"":valor.nb} &nbsp;&nbsp; Total:${this.crossObj.getHorasByProject(indice).toFixed(1)}<button onclick="hideProj(${indice})">Ocultar</button></th>`
            tfase+=`<th  name="${indice}" class="considerar${considera}" ${this.colorFase(proyectos.getFase(indice))}>${proyectos.getFase(indice)}</th>`;
            if(proyectos.getFase(indice)=="") console.log("proyectos sin fase",indice,proyectos.getProy(indice))
            //console.log("fase",indice,projList.getFaseProy(indice));
            i++;
        }
        

         th+=tfase+"</thead>";
        let tr="<tbody>";

        //console.log("consulArr buscando a zuleima",consulArr);
        for(let i=0;i<consulArr.length;i++){
            let no_esta=this.team.buscarPorNombre(consulArr[i].usr)===undefined?"color:red":"color:black"
            tr+="<tr>";
            tr+=`<th style="${no_esta};width:250px">${consulArr[i].usr}</th>`;
            let horaConsul=this.crossObj.getHorasByConsultor(consulArr[i].usr);
            let horaPropUsr=this.crossObj.getHorasPropuesta(consulArr[i].usr);
            let horaNoDisp=this.crossObj.getHorasNoDisponibles(consulArr[i].usr);
            let horasResto=this.crossObj.getHorasRestoByConsultor(consulArr[i].usr);
            let totalHoras=horaConsul+horasResto+horaPropUsr+horaNoDisp;
            let cantProy=this.crossObj.getCantProy(consulArr[i].usr)
            let cantProp=this.crossObj.getCantProp(consulArr[i].usr)
            tr+=`<td>${this.semaforo(horaConsul)}${((horaConsul/(160-horaNoDisp))*100).toFixed(1)}%</td>
                <td>${horaConsul.toFixed(1)}</td>
                <td>${horaPropUsr.toFixed(1)}</td>
                <td>${horaNoDisp.toFixed(1)}</td>
                <td>${horasResto.toFixed(1)}</td>
                <td>${totalHoras.toFixed(1)}</td>
                 <td>${cantProy}</td>
                 <td>${cantProp}</td>
                 <td>${cantProy+cantProp-this.crossObj.getDuplicados(consulArr[i].usr)}</td>`;
            //console.log("array",consulArr[i].projs,consulArr[i].projs.length)
            //getHorasByConsultor
            for (const [indice, valor] of proyMap.entries()){
                //let esta=this.buscarPosicion(consulArr[i].projs,indice);
                considera=proyectos.getConsiderar(indice)
                let hrs=this.crossObj.getHoras(indice,consulArr[i].usr)
                //console.log("pos",hrs,indice,consulArr[i].usr)
                if(hrs!=-1){
                    tr+=`<td name="${indice}" class="considerar${considera}" style="${this.colorear(hrs)};border-bottom:1px dotted #9966ff;font-weight: bold">${hrs!==null?hrs.toFixed(1):0}</td>`; 
                    this.cantProyProp.add(indice,proyectos.getFase(indice),consulArr[i].usr,1);                  
                    this.countProjActv.add(indice,proyectos.getFase(indice),consulArr[i].usr,1);
                    this.countOther.add(indice,proyectos.getFase(indice),consulArr[i].usr,1);
                    this.countProjS.add(indice,proyectos.getFase(indice),consulArr[i].usr,1);
                    this.countProjNS.add(indice,proyectos.getFase(indice),consulArr[i].usr,1);
                    this.hoursProjPropS.add(indice,proyectos.getFase(indice),consulArr[i].usr,hrs);
                    this.hoursProjPropNS.add(indice,proyectos.getFase(indice),consulArr[i].usr,hrs);
                }else{
                    tr+=`<td name="${indice}" class="considerar${considera}" style="border-bottom:1px dotted #9966ff">&nbsp;</td>`;
                }
            
            }
            tr+="</tr>"

            //}
        }
        //console.log("csv",csv);

        let trfaltan="<tr>"
        faltantes.forEach((el)=>{
            trfaltan+=`<tr><th style="width:250px">${el}</th></tr>`
        });
        //console.log("trfaltan",trfaltan);
        tr+=trfaltan+"</tbody>"
        let fecha=this.crossObj.getUltimaFechaRep();
        let primera=this.crossObj.getPrimeraFechaRep();
        let iniweek=this.crossObj.getSemanaDesde();
        let finweek=this.crossObj.getSemanaHasta();
        document.getElementById("periodCross").innerHTML=`(desde la semana: ${iniweek} hasta ${finweek}- Desde ${primera} hasta ${fecha} )`
        document.getElementById(this.tablename).innerHTML=th+tr;
    }
}