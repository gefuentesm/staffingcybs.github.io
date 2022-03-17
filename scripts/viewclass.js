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
        var projArr = fetchData.data;
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
        var totDed=Array.from({length: 12}, function() { return 0.0; });
        var tothrs=Array.from({length: 12}, function() { return 0.0; });
        var maxDed=Array.from({length: 12}, function() { return 0.0; });
        var rompe=arr[0].proyecto;
        //console.log("rompe",rompe);
        var cont=0;
        var maxfase=0;
        var maxCantConsl=0;
        for(let i in arr){ 
            //if(arr[i].proyecto==171) console.log("check break",cont,arr[i])
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
                totDed=Array.from({length: 12}, function() { return 0.0; });
                tothrs=Array.from({length: 12}, function() { return 0.0; });
                maxDed=Array.from({length: 12}, function() { return 0.0; });
                cont=0;
                maxfase=0;
                maxCantConsl=0;
            }
            if(arr[i].pEne || arr[i].pfeb || arr[i].pmar || arr[i].pabr || arr[i].pmay || 
            arr[i].pjun || arr[i].pjul || arr[i].pago || arr[i].psep || arr[i].poct || 
            arr[i].pnov || arr[i].pdic)
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
            
            maxfase=(maxfase< arr[i].fase?arr[i].fase:maxfase);
            maxCantConsl=(maxCantConsl<arr[i].consultores?arr[i].consultores:maxCantConsl);
            
            totDed[0]=totDed[0]+(arr[i].pEne?arr[i].pEne:0);tothrs[0]=tothrs[0]+(arr[i].hEne?arr[i].hEne:0);
            totDed[1]=totDed[1]+(arr[i].pfeb?arr[i].pfeb:0);tothrs[1]=tothrs[1]+(arr[i].hfeb?arr[i].hfeb:0);
            //if(arr[i].proyecto==171) console.log("feb",arr[i].proyecto,totDed[1],arr[i].pfeb)
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
            maxDed[0]=maxDed[0]<arr[i].mEne?arr[i].mEne:maxDed[0];maxDed[1]=maxDed[1]<arr[i].mfeb?arr[i].mfeb:maxDed[1];
            maxDed[2]=maxDed[2]<arr[i].mmar?arr[i].mmar:maxDed[2];maxDed[3]=maxDed[3]<arr[i].mabr?arr[i].mabr:maxDed[3];
            maxDed[4]=maxDed[4]<arr[i].mmay?arr[i].mmay:maxDed[4];maxDed[5]=maxDed[5]<arr[i].mjun?arr[i].mjun:maxDed[5];
            maxDed[6]=maxDed[6]<arr[i].mjul?arr[i].mjul:maxDed[6];maxDed[7]=maxDed[7]<arr[i].mago?arr[i].mago:maxDed[7];
            maxDed[8]=maxDed[8]<arr[i].msep?arr[i].msep:maxDed[8];maxDed[9]=maxDed[9]<arr[i].moct?arr[i].moct:maxDed[9];
            maxDed[10]=maxDed[10]<arr[i].mnov?arr[i].mnov:maxDed[10];maxDed[11]=maxDed[11]<arr[i].mdic?arr[i].mdic:maxDed[11];
            //if(arr[i].proyecto==171) console.log("no rompe",cont,arr[i].proyecto,totDed,tothrs)
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
        var rowName=['<thead><tr><th width="140px" style="background-color:#6666ff; width:140px">ID</th><th style="background-color:#6666ff;width:420px">Nombre</th><th style="background-color:#6666ff;width:20px">Fase</th><th style="background-color:#6666ff;width:20px">Cons.</th><th style="background-color:#6666ff;width:80px">Inicio</th><th style="background-color:#6666ff;width:80px">Cierre</th>','<th style="background-color:#6666ff;width:400px">Ene</th>','<th style="background-color:#6666ff;width:400px">Feb</th>','<th style="background-color:#6666ff;width:400px">Mar</th>','<th style="background-color:#6666ff;width:400px">Abr</th>','<th style="background-color:#6666ff;width:400px">May</th>','<th style="background-color:#6666ff;width:400px">Jun</th>','<th style="background-color:#6666ff;width:400px">Jul</th>','<th style="background-color:#6666ff;width:400px">Ago</th>','<th style="background-color:#6666ff;width:400px">Sep</th>','<th style="background-color:#6666ff;width:400px">Oct</th>','<th style="background-color:#6666ff;width:400px">Nov</th>','<th style="background-color:#6666ff;width:400px">Dic</th>','<th style="background-color:#6666ff;width:400px">Ene_</th>','<th style="background-color:#6666ff;width:400px">Feb_</th>','<th style="background-color:#6666ff;width:400px">Mar_</th>','<th style="background-color:#6666ff;width:400px">Abr_</th>','<th style="background-color:#6666ff;width:400px">May_</th>','<th style="background-color:#6666ff;width:400px">Jun_</th>','<th style="background-color:#6666ff;width:400px">Jul_</th>','<th style="background-color:#6666ff;width:400px">Ago_</th>','<th style="background-color:#6666ff;width:400px">Sep_</th>','<th style="background-color:#6666ff;width:400px">Oct_</th>','<th style="background-color:#6666ff;width:400px">Nov_</th>','<th style="background-color:#6666ff;width:400px">Dic_</th>']
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
        var xPB = document.getElementById(this.container);
        xPB.innerHTML += render.sendTable(this.data,"lista_proyectos","","","","");
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
        var x = document.createElement("TABLE");
        x.setAttribute("id", "tmeses");

        document.getElementById("contenido").appendChild(x);

        var nombres = document.createElement("TR"); // el encabezado con los nombres de los meses
        nombres.setAttribute("id", "titulo");
        document.getElementById("tmeses").appendChild(nombres);
        for(let i=INITIALMONTH;i<INITIALMONTH+MONTHTOSHOW;i++){
                var z = document.createElement("TD");
                var numes=i-1;
                if(i>12){
                    numes=i-12-1;
                    //console.log(numes,titulo[numes]);
                }
                var t = document.createTextNode(titulo[numes]);
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
                //if(j>12) numes=j-12-1
                var div = document.createElement("DIV")
                let titulodiv="mes"+numes+"totales"
                div.setAttribute("id", titulodiv);
                td.appendChild(div);
                document.getElementById("totales").appendChild(td);
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
    showProperties(idpParam,fasePara,mesParam){
        let bar=document.getElementById(this.container);
        /*var params=param.split(".");
        var firstParam=params[0].split("-");
        var idpParam=firstParam[1];
        var fasePara=params[1];
        var mesParam=params[2];
        //console.log("params",param)*/
        bar.style.width="400px";
        bar.style.padding="4px";
        bar.style.marginLeft=(window.innerWidth-400)+"px"
        bar.style.height=(window.window.innerHeight)+"px"
        var contentBar=document.createElement("DIV");
        contentBar.className="properties";
        var contentProperties=document.createElement("DIV");
        var textTitleBar;
        
        var existe=false;
        let dataArr=projList.getData();
        console.log("dataArr",dataArr);
        var tabProperties="<table class='paleBlueRows'><thead><tr><th>Nombre</th><th>On Site<th>Dedicación</th><th>Original</th></tr></thead><tbody>";
        for(let i in dataArr){
            if(dataArr[i].fase==fasePara && dataArr[i].IDp==idpParam){
                if((dataArr[i].year>INITIALYEAR && dataArr[i].mes+12==mesParam)||(dataArr[i].year<=INITIALYEAR && dataArr[i].mes==mesParam) ){
                    existe=true;
                    let mesProp=dataArr[i].mes>12?dataArr[i].mes+"("+(dataArr[i].mes-12)+")":dataArr[i].mes
                    textTitleBar=dataArr[i].IDp+" "+dataArr[i].proyecto+"<br> Fase:"+dataArr[i].fase+"<br> Mes :"+mesProp+"<br> Año :"+dataArr[i].year+"<br><hr><br>";
                    let teamProp=dataArr[i].equipo;
                    for(let j in teamProp){
                        let onsite=teamProp[j].inOnSite==1?"Si":"No"
                        tabProperties=tabProperties+`<tr><td>${teamProp[j].nombre}</td><td>${onsite}</td><td>${teamProp[j].dedicacion}</td><td>${teamProp[j].original}</td></tr>`
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
        let encabChg="<h4>Cambios por Realizar</h4><table class='paleBlueRows'><thead><tr><th>Nombre>-</buttom></th><th>IdP</th><th>Fase</th><th>Cambio</th><th>Original</th><th>On Site</th></tr></thead><tbody>"
        let endEncab="</tbody></table><br><hr>";
        let rows="";
        chgArr.forEach(el=>{
            //console.log("chgArr",el)
            let t=el.equipo;
            rows+=render.sendTableComp(el,t,"cambios_staff","","","","");
        });
        //console.log("rows",rows);
        //console.log("bar",bar.innerHTML);
        bar.innerHTML+=encabChg+rows+endEncab;

        let hcArr= this.getHistoricData();
        let encabChgh="<div class='hist'> <h4>Histórico de Cambios</h4><button onclick='procSort()'>Sort</button><button onclick='clearSort()'>Clean Sort</button> <div id='HistoricTable'><table class='paleBlueRows'><thead><tr><th>Nombre<br><button id='b1' onClick='ordena(1)'>-</botton></th><th>IdP<br><button id='b2' onClick='ordena(2)'>-</botton></th><th>Fase</th><th>Cambio</th><th>Original</th><th>In Site</th></tr></thead><tbody>"
        let endEncabh="</tbody></table></div></div><br><hr>";
        rows="";
        rows=render.sendTable(hcArr,"historial_cambios","","","","");
        //console.log("rows",rows);
        //console.log("bar",bar.innerHTML);
        bar.innerHTML+=encabChgh+rows+endEncabh;        
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
            let dataArr=projList.getData();
            for(let j in dataArr){
                if( YEARTOSHOW>=dataArr[j].year && dataArr[j].mes>=INITIALMONTH && dataArr[j].mes<=INITIALMONTH+MONTHTOSHOW){
                    var idProj=dataArr[j].IDp+"."+dataArr[j].fase+"."+dataArr[j].mes;
                    var team=dataArr[j].equipo;
                    //console.log("buscando en",team)
                    for(let k in team){

                        if(team[k].nombre==nb){
                            //console.log("comprobado. nombre",nb)
                            var div=document.getElementById(idProj);
                            div.style.display="block"
                        }
                    }
                }
            }
        }
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
                console.log("aqui da el error",`ref-${o.IDp}.${o.fase}.${o.mes}`);
                document.getElementById(`ref-${o.IDp}.${o.fase}.${o.mes}`).innerHTML=totDedic.toFixed(2);
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
      this.peopleArr=peopleObj.data;
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
        content.style.display="";
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
        var rompe=hcArr[0].nombre_persona;
        var tene=0.0
        var tfeb=0.0
        var tmar=0.0
        var tabr=0.0
        var tmay=0.0
        var tjun=0.0
        var tjul=0.0
        var tago=0.0
        var tsep=0.0
        var toct=0.0
        var tnov=0.0
        var tdic=0.0
        for(let i in hcArr){
            if(rompe!=hcArr[i].nombre_persona){
                map1.set(rompe,{ene:tene,feb:tfeb,mar:tmar,abr:tabr,may:tmay,jun:tjun,
                        jul:tjul,ago:tago,sep:tsep,oct:toct,nov:tnov,dic:tdic});
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
                rompe=hcArr[i].nombre_persona
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
            }
        }
        map1.set(rompe,{ene:tene,feb:tfeb,mar:tmar,abr:tabr,may:tmay,jun:tjun,
                    jul:tjul,ago:tago,sep:tsep,oct:toct,nov:tnov,dic:tdic});
        //console.log("total",rompe,tene,tfeb,tmar,map1);
        return map1;
    }
    renderView(){
        let hcArr= this.peopleArr;
        let totales = new Map();
        totales=this.sumar(hcArr)
        var rowName=[]
        var rompe="";
        var ind=0;
        var dataArr=[];
        for(let i in hcArr){
            if(rompe!=hcArr[i].nombre_persona){
            //close break for example totals
            if(rompe==""){
                ind=1;
                rompe=hcArr[i].nombre_persona;
            }
            let obj=totales.get(hcArr[i].nombre_persona)
            dataArr.push({nombre_persona:hcArr[i].nombre_persona,ind:0,proyecto:'',fase:'',pEne:obj.ene,pFeb:obj.feb,pMar:obj.mar,pAbr:obj.abr,pMay:obj.may,pJun:obj.jun,pJul:obj.jul,pAgo:obj.ago,pSep:obj.sep,pOct:obj.oct,pNov:obj.nov,pDic:obj.dic})
            rompe=hcArr[i].nombre_persona;
            hcArr[i].ind=ind;
            //prepare next
            }
            hcArr[i].ind=ind;
            //console.log(aux);
            dataArr.push(hcArr[i]);
            ind++;
        }
        //console.log("tiene ind",dataArr);
        var rowName=["<div id='people'><table class='paleBlueRows'><thead><tr><th>Nombre</th><th>proyecto</th><th>Fase</th>","<th>Ene</th>","<th>Feb</th>","<th>Mar</th>","<th>Abr</th>","<th>May</th>","<th>Jun</th>","<th>Jul</th>","<th>Ago</th>","<th>Sep</th>","<th>Oct</th>","<th>Nov</th>","<th>Dic</th></tr></thead><tbody>"]
        let rowHead=rowName[0];
        for(let m=INITIALMONTH;m<INITIALMONTH+MONTHTOSHOW;m++){
            if(m!=0)
                if(rowName[m])
                    rowHead=rowHead+rowName[m];
        }
        //console.log("rowHead",rowHead);
        let encabChgh="<div id='people'><table class='paleBlueRows'><thead><tr><th>Nombre</th><th>proyecto</th><th>Fase</th><th>Ene</th><th>Feb</th><th>Mar</th><th>Abr</th><th>May</th><th>Jun</th><th>Jul</th><th>Ago</th><th>Sep</th><th>Oct</th><th>Nov</th><th>Dic</th></tr></thead><tbody>"
        let endEncabh="</tbody></table></div>";
        let rows="";
        //rows=render.sendTable(hcArr,"fact_personas","","","","");
        rows=render.sendTable(dataArr,"fact_personas","","","","");
        let tab=document.getElementById(this.container)
        tab.innerHTML = rowHead+rows+endEncabh;
    } 
}
