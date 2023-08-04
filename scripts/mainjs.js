var globId=1;
const GOODTHRESHOLD=160;
//var INITIALMONTH=new Date().getMonth()+1; <-- esta es la correcta
var INITIALMONTH=new Date().getMonth()-2;
//INITIALMONTH=INITIALMONTH==0?12:INITIALMONTH;

var MONTHTOSHOW=21;
var INITIALYEAR=new Date().getFullYear();
INITIALYEAR=INITIALMONTH<0?INITIALYEAR-1:INITIALYEAR;
INITIALMONTH=INITIALMONTH==-1?12:(INITIALMONTH==0?11:INITIALMONTH);
var CURRYEAR=new Date().getFullYear();
var YEARTOSHOW=new Date().getFullYear()+1;
var CURRENTMONTH=new Date().getMonth()+1;
console.log(INITIALYEAR,YEARTOSHOW);
let yearInitial= INITIALYEAR;      //2021; 
let proyectosArr=Array.from({length: 25}, function() { return []; });
cantidad=10
var staffing;
var projView;
var projViewReal;
var projSummary;
var render;
var projectFilterView;
var cal;
var util;
var projList;
var teamView;
var propertyBar;
var myToken;
var myTime;
var peopleView;
var vacationView;
var userSession;
var dateOfChanged;
var crossRef;
var proyectos;
var tasaConsumo;
var csv=[];
var crossRefView;
var intento=0;
var preserveBudget=[];
titulo=["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
var oHistField=new Field();
oHistField.add(1,"b1","usr");
oHistField.add(2,"b2","idProy");
oHistField.add(3,"","Fase");
oHistField.add(4,"","Cambio");
oHistField.add(5,"","Original");
oHistField.add(5,"","In Site");
var oSortHistList=new SortList(oHistField);
var oHistoricSorter=new SorterTable(oSortHistList,"HistoricTable",mostrar)
// GUI FUNCTIONS
    function getDataMesPlan(mo,year,el){            
        let mon=mo>12?mo-12:mo;
        //console.log("func getDataMesPlan",mo,mon,year,el);
        if(year==CURRYEAR-1){
            return mon==1?el.pEne_:(mon==2?el.pFeb_:(mon==3?el.pMar_:(mon==4?el.pAbr_:(mon==5?el.pMay_:(mon==6?el.pJun_:(mon==7?el.pJul_:(mon==8?el.pAgo_:(mon==9?el.pSep_:(mon==10?el.pOct_:(mon==11?el.pNov_:el.pDic_))))))))))
        }else{
            if(year==CURRYEAR)
                return mon==1?el.pEne:(mon==2?el.pFeb:(mon==3?el.pMar:(mon==4?el.pAbr:(mon==5?el.pMay:(mon==6?el.pJun:(mon==7?el.pJul:(mon==8?el.pAgo:(mon==9?el.pSep:(mon==10?el.pOct:(mon==11?el.pNov:el.pDic))))))))))
            else
                if(year==CURRYEAR+1)
                    return mon==1?el.p_Ene:(mon==2?el.p_Feb:(mon==3?el.p_Mar:(mon==4?el.p_Abr:(mon==5?el.p_May:(mon==6?el.p_Jun:(mon==7?el.p_Jul:(mon==8?el.p_Ago:(mon==9?el.p_Sep:(mon==10?el.p_Oct:(mon==11?el.p_Nov:el.p_Dic))))))))))    
        }
    }
    function getDataMesReal(mo,year,el){
        let mon=mo>12?mo-12:mo
        if(year==CURRYEAR-1){
            return mon==1?el.rEne_:(mon==2?el.rFeb_:(mon==3?el.rMar_:(mon==4?el.rAbr_:(mon==5?el.rMay_:(mon==6?el.rJun_:(mon==7?el.rJul_:(mon==8?el.rAgo_:(mon==9?el.rSep_:(mon==10?el.rOct_:(mon==11?el.rNov_:el.rDic_))))))))))
        }else{
            if(year==CURRYEAR)
                return mon==1?el.rEne:(mon==2?el.rFeb:(mon==3?el.rMar:(mon==4?el.rAbr:(mon==5?el.rMay:(mon==6?el.rJun:(mon==7?el.rJul:(mon==8?el.rAgo:(mon==9?el.rSep:(mon==10?el.rOct:(mon==11?el.rNov:el.rDic))))))))))
            else
                if(year==CURRYEAR+1)
                    return mon==1?el.r_Ene:(mon==2?el.r_Feb:(mon==3?el.r_Mar:(mon==4?el.r_Abr:(mon==5?el.r_May:(mon==6?el.r_Jun:(mon==7?el.r_Jul:(mon==8?el.r_Ago:(mon==9?el.r_Sep:(mon==10?el.r_Oct:(mon==11?el.r_Nov:el.r_Dic))))))))))
        }
    }
    function getAvgRealHrs(arr,nombre){
        let avg=0;
        let cant=0;
        //console.log("getAvg",arr)
        arr.forEach((el)=>{
            if(el.usr==nombre){
                avg+=(el.rEne?el.rEne:0)+(el.rFeb?el.rFeb:0)+(el.rMar?el.rMar:0)+(el.rAbr?el.rAbr:0)+(el.rMay?el.rMay:0)+(el.rJun?el.rJun:0)+(el.rJul?el.rJul:0)+(el.rAgo?el.rAgo:0)+(el.rSep?el.rSep:0)+(el.rOct?el.rOct:0)+(el.rNov?el.rNov:0)+(el.rDic?el.rDic:0);
                avg+=(el.r_Ene?el.r_Ene:0)+(el.r_Feb?el.r_Feb:0)+(el.r_Mar?el.r_Mar:0)+(el.r_Abr?el.r_Abr:0)+(el.r_May?el.r_May:0)+(el.r_Jun?el.r_Jun:0)+(el.r_Jul?el.r_Jul:0)+(el.r_Ago?el.r_Ago:0)+(el.r_Sep?el.r_Sep:0)+(el.r_Oct?el.r_Oct:0)+(el.r_Nov?el.r_Nov:0)+(el.r_Dic?el.r_Dic:0);
                //console.log("avg",avg);
                cant+=(el.rEne?1:0)+(el.rFeb?1:0)+(el.rMar?1:0)+(el.rAbr?1:0)+(el.rMay?1:0)+(el.rJun?1:0)+(el.rJul?1:0)+(el.rAgo?1:0)+(el.rSep?1:0)+(el.rOct?1:0)+(el.rNov?1:0)+(el.rDic?1:0);
                cant+=(el.r_Ene?1:0)+(el.r_Feb?1:0)+(el.r_Mar?1:0)+(el.r_Abr?1:0)+(el.r_May?1:0)+(el.r_Jun?1:0)+(el.r_Jul?1:0)+(el.r_Ago?1:0)+(el.r_Sep?1:0)+(el.r_Oct?1:0)+(el.r_Nov?1:0)+(el.r_Dic?1:0);
                //console.log("cant",cant);
            }
        })
        return cant>0?avg/cant:0;
    }
    function probable(event,m){
        alert("Si Staffing si está marcado se considerarán las horas en los totales");
        let id=event.target.name+"-"+m //probable-229-6 // probable-$proy-$mes
        let idArr=id.split("-");
        let check=document.getElementById(id).checked;
        //console.log("checked",check);
        let probables=document.getElementsByName(event.target.name);
        for (i = 0; i < probables.length; i++) {
            //console.log("probable loop",i,probables[i].id,document.getElementById(probables[i].id).checked);
            document.getElementById(probables[i].id).checked=check;            
        }
        if(check)
            projList.setInStaffing(idArr[1]);  //id[1] es proyecto
        else
            projList.setOutStaffing(idArr[1]); 
        let meses=projList.updateMesProjStructByImprob(idArr[1]);
        // recuperar los meses a actualizar
        //console.log("probable - meses",meses,id,idArr[1])
        meses.forEach((m)=>{
            if(m>=INITIALMONTH)
                staffing.updateStructByMonth(m);
        })
        
    }
    function markar(idp,mes){
        var projMarked = document.getElementsByClassName('proyecto-mark');
        var elemNoMark = Array.prototype.filter.call(projMarked, function(projMarked){
                    let idArr=projMarked.id.split(".");
                    //console.log("No markar",projMarked.id,idArr[0]);
                    if(parseInt(idArr[0])!=parseInt(idp))
                       return projMarked;
                });
        elemNoMark.forEach((el)=>{
            el.className="proyecto";
        })
        
        var projElements = document.getElementsByClassName('proyecto');
        var elem2Mark = Array.prototype.filter.call(projElements, function(projElement){
                    let idArr=projElement.id.split(".");
                    //console.log("markar",projElement.id,idArr[0]);
                    if(parseInt(idArr[0])==parseInt(idp))
                       return projElement;
                });
        //console.log(elem2Mark);
        elem2Mark.forEach((el)=>{
            el.className="proyecto-mark";
        })
        //editblock
        let bloq=document.getElementsByClassName('edit-block');
        for(let ii in bloq){
            //console.log("bloq",bloq[ii],bloq[ii].id, document.getElementById(bloq[ii].id));
            if(bloq[ii].id!==undefined)
                bloq[ii].style.display="none";
        }

        document.getElementById("edit-"+idp+"-"+mes).style.display="block";
        
    }
    function clearSort(){
        oSortHistList.clear();
    }
    function ordena(id){
        oSortHistList.addToList(id);
    }
    function procSort(){
        oHistoricSorter.exec();
    }
    function mostrarProy(x){
        peopleView.mostrar(x)
    }
    function mostrarProyReal(x){
        projViewReal.mostrar(x)
    }
    function mostrarDet(x){
        projView.mostrar(x);
    }
    function toggleDisp(ele){
        let e=document.getElementById(ele)
        //console.log("toggleDisp",ele,e,e.style);

        if(e.style.display=="block"||e.style.display=="")
            e.style.display="none"
        else
            e.style.display=""
    }
    function mostrarBloque(id){
        let x=document.getElementById(id)
        if(x.style.display=="block"){
            x.style.display="none";
        }else x.style.display="block";
    }
    function mostrar(){
        let hcArr= propertyBar.getHistoricData();
        oHistoricSorter.setData(hcArr);
        let encabChgh="<div id='HistoricTable'><table class='paleBlueRows'><thead><tr><th>Nombre<br><button id='b1' onClick='ordena(1)'>-</botton></th><th>IdP<br><button id='b2' onClick='ordena(2)'>-</botton></th><th>Fase</th><th>Cambio</th><th>Original</th><th>In Site</th></tr></thead><tbody>"
        let endEncabh="</tbody></table></div>";
        rows="";
        rows=render.sendTable(hcArr,"historial_cambios","","","","");
        return encabChgh+rows+endEncabh;
    } 
   function btn_noconsiderar(){
        let btn=document.getElementById("btconsiderar");
        let clase="considerarfalse"
        let display=""
        if(btn.textContent.indexOf("Ocultar")>=0){
            btn.textContent="Mostrar todos"
            display="none";
        }else{
            btn.textContent="Ocultar Proyectos marcados No Considerar"
            display="";   
        }
        let proyec=document.getElementsByClassName(clase);
        console.log("no considerar",proyec);
        for (let i = 0; i < proyec.length; i++) {
            proyec[i].style.display = display;
        }
  

    }
    function btn_saveCsv(){
        csv=crossRefView.generateCSV();
        
        const name=document.getElementById("nombre-csv").value;
        const blob = new Blob(csv, { type: 'text/plain' });

        const enlaceDescarga = document.createElement('a');
        enlaceDescarga.href = URL.createObjectURL(blob);
        enlaceDescarga.download = name+'.csv';
        var clicEvent = new MouseEvent('click', {
          'view': window,
          'bubbles': true,
          'cancelable': true
        });
        enlaceDescarga.dispatchEvent(clicEvent);
    }
    function btn_cerrarModal(){
        let genModal=document.getElementById("genericModal");
        genModal.style.display="none"
    }
    function btn_abrirModal(tit,cont){
        let genModal=document.getElementById("genericModal");
        genModal.style.display="block";
        let content=document.getElementById("modalContent");
        let titulo=document.getElementById("modalTittle");
        titulo.innerHTML=tit;
        content.innerHTML=cont;

    }   
    function bt_eliminaChng(obj){
        let mat=document.getElementById("delChngMat");
        //console.log("bt_eliminaChng",mat,obj);
        let param=obj.split(".");
        let len=mat.rows.length;
        let objdel=[]
        if(len>0){
            let cols=mat.rows[0].cells.length;
            for(let i=1;i<len;i++){
                //console.log("fila",i,mat.rows[i].cells[0].childNodes[0].checked,mat.rows[i].cells[1].innerHTML,mat.rows[i].cells[2].innerHTML)
                if(mat.rows[i].cells[0].childNodes[0].checked){
                    //console.log("parametros de eliminación",param[0],param[1],mat.rows[i].cells[1].innerHTML,mat.rows[i].cells[2].innerHTML)
                    objdel.push({"usr":param[0],"idp":param[1],"mes":mat.rows[i].cells[1].innerHTML}); //,monto:mat.rows[i].cells[2].innerHTML});
                }
            }
            let txParam="["
            objdel.forEach((o)=>{
                txParam+='{"usr":"'+o.usr+'","idp":'+o.idp+',"mes":"'+o.mes+'"}'
            })
            txParam+="]";
            let sendInfo={params:txParam,token:myToken,time:myTime}
            //console.log("a eliminar",sendInfo);
            util.asynGetFromDB_(`https://staffing-func.azurewebsites.net/api/delhistchanges`,sendInfo).then(function(fetchData){
                //console.log("delhistchanges",fetchData);
                if(fetchData.status=="ok"){
                    alert("Operación realizada exitosamente ");
                    //console.log("recarga la data del servidor")
                    btn_reload();
                    btn_cerrarModal();
                }
                //proyFases=fetchData;
                //propertyBar.showProperties(param[1],0,mes);
                
            })            
        }
    }  
    function btn_borrarHist(usr,id){
        let meses=["","pEne","pFeb","pMar","pAbr","pMay","pJun","pJul","pAgo","pSep","pOct","pNov","pDic","p_Ene","p_Feb","p_Mar","p_Abr","p_May","p_Jun","p_Jul","p_Ago","p_Sep","p_Oct","p_Nov","p_Dic"]
        let text = "Press a button to delete!\nEither OK or Cancel.";
        if (confirm(text) == true) {
            detailHistChange2Modal(usr,id).then(ret=>{
                //console.log("detail",ret);
                const d = new Date();
                let month = d.getMonth();
                let arrM=new Map();
                let encabezado="<h2>"+ret.usr+"</h2><h2>Proyecto "+ret.idProy+"</h2>"
                let fila=""
                for(let i=month;i<meses.length+1;i++){
                    //console.log("meses",i,meses[i],ret[meses[i]]);
                    if(ret[meses[i]]!==null&&ret[meses[i]]!==undefined){
                        arrM.set(meses[i],ret[meses[i]]);
                        fila+="<tr><td><input id='mes-"+i+"' type='checkbox'></input></td><td style='font-size:10pt'>"+meses[i]+"</td><td style='font-size:10pt'>"+ret[meses[i]]+"</td></tr>"
                    }
                }
                //console.log("data",month,arrM);
                fila="<tbody>"+fila+"</tbody>"
                let par='"'+usr+'.'+id+'"'
                btn_abrirModal("Detalle de Cambios Históricos",encabezado+"<table id='delChngMat' class='paleBlueRows'><thead><td>sel</td><td>Mes</td><td>Horas</td></thead>"+fila+"</table><button onclick='bt_eliminaChng("+par+")'>Eliminar</button>")
            })

        } 
    }
    function btn_reviewChanged(){
        //console.log("btn_reviewChanged");
        poollingForChanged();
    }
    function btn_updateMonday(){
        let proyRest=""
        let proyFases=""
        let text = "Press a button to Update Monday!\nEither OK or Cancel.";
        if (confirm(text) == true) {
            util.asynGetFromDB(`https://getmondayproject.azurewebsites.net/api/getmondayproject`,myToken,myTime).then(function(fetchData){
                //console.log("people view data",fetchData);
                proyRest=fetchData;
                console.log("proyRest",proyRest.data.code,proyRest.data.ETL);
                util.asynGetFromDB(`https://getmondayfases.azurewebsites.net/api/getmodayfases`,myToken,myTime).then(function(fetchData){
                    //console.log("people view data",fetchData);
                    proyFases=fetchData;
                    console.log("proyFases",fetchData);
                    if(proyFases.code==0 && proyFases.ETL==0 && proyRest.data.code==0 && proyRest.data.ETL==0){
                        alert("Se cargaron "+proyRest.data.rowAffected+" proyectos y "+proyFases.rowAffected+" Fases de proyectos");
                        loadAlarms();
                        btn_reload();
                    }else
                        alert("Se produjo un error intente de nuevo, si en el segundo intento recibe este mensaje contacte un soporte técnico")
                    

                    
                })
                
            })
            
        } else {
            alert("En desarrollo");
        }
    }
   
    function tx_dedichange(nb,IDp,fase,mes,inOnSite,valor){
        //id-${o.nombre}-${o.IDp}.${o.fase}.${o.mes}-${o.inOnSite}     

        let id="id-"+nb+"-"+IDp+"."+fase+"."+mes+"-"+inOnSite;
        var wrappid="t-"+nb+"-"+IDp+"."+fase+"."+mes+"-"+inOnSite;
        var wrappid2="c-"+nb+"-"+IDp+"."+fase+"."+mes+"-"+inOnSite;
        let idMes=IDp+"."+mes;
        let currentInOnsite=0;
        console.log("valor",document.getElementById(id).value);
        if(isNaN(document.getElementById(id).value)){

            alert("El valor introducido no es un número: "+parseFloat(document.getElementById(id).value));
            return false;
        }  
        //console.log("tx_dedichange",document.getElementById(wrappid),wrappid,document.getElementById(wrappid2),wrappid2);  //c-Gustavo Fuentes-40.2.2-0
        if( document.getElementById(wrappid2))
            currentInOnsite=document.getElementById(wrappid2).style.backgroundColor=="blue"?1:0;
        else
            if( document.getElementById(wrappid))
                currentInOnsite=document.getElementById(wrappid).style.backgroundColor=="blue"?1:0;
        console.log("current onsite",IDp,fase,mes,id,currentInOnsite);
        console.log("on Change",document.getElementById(id).value);
        projList.setAllStruct(IDp,fase,nb,document.getElementById(id).value,mes,currentInOnsite);
        //console.log("dedichange",nb,IDp,mes,currentInOnsite,document.getElementById(id).value);
        let totDedic=projList.getTeamDedication(IDp,fase,mes);
        //let origDedi=document.getElementById(`ref-${IDp}.${fase}.${mes}`).innerHTML;
        let origDedi=document.getElementById(`ref-${IDp}.0.${mes}`).innerHTML;
        origDedi=parseFloat(origDedi).toFixed(1)
        console.log("cambios",totDedic,origDedi, (totDedic-origDedi).toFixed(1));
        let xcolor=totDedic.toFixed(1)==origDedi ? "green" : "red";
        if(totDedic.toFixed(1)==origDedi){
            
            const index = preserveBudget.indexOf(idMes);
            if (index > -1) {
                preserveBudget.splice(index, 1);
            }
            if(preserveBudget.length===0){
                document.getElementById("btSave").disabled=false;
                alert("Ya es posible Guardar - Botón Save");
            }else{
                let msg="Están pendientes:\n"
                preserveBudget.forEach((e)=>{
                    let temp=e.split(".")
                    msg+=`proyecto ${temp[0]} en el mes ${temp[1]}\n`
                })
                alert(msg)
            }
               
        }else{
            if(preserveBudget.length===0)
                alert("Dedido a que los cambios afectan el presupuesto, se desabilita temporalmente la capacidad de Guardar - botón Save");
            document.getElementById("btSave").disabled=true;
            if(preserveBudget.find((el) => el === idMes)===undefined)
                preserveBudget.push(idMes);
        }
        let chgDedi=document.getElementById(`chng-${IDp}.${fase}.${mes}`);
        chgDedi.innerHTML=totDedic.toFixed(1);
        chgDedi.style.color=xcolor;
        // cambio en la estructura de mes, debe cambiar en la capa de presentación - totales
        // staffing ---depend-->projList, ya que en projList está la data
        // de la dedicacion cambia se actualizan los totales
        staffing.updateStructByMonth(mes);
        if(propertyBar.isPropertyBarVisible()){                // se refrescan los datos con los cambios si las propiedades están visibles
            propertyBar.clear();
            propertyBar.showProperties(IDp,fase,mes);
        }
    }
    function click_checkbox(nb, idp, fase, mes, inOnSite) {
        var checkid="cb-"+nb+"-"+idp+"."+fase+"."+mes+"-"+inOnSite;
        var wrappid="t-"+nb+"-"+idp+"."+fase+"."+mes+"-"+inOnSite;
        var checkBox = document.getElementById(checkid);
        if (checkBox.checked == true){
            document.getElementById(wrappid).style.backgroundColor="blue";
        } else {
            document.getElementById(wrappid).style="";
        }
    } 
    function show_ProjContainer(){
        document.getElementById("loader").style.display = ""
        /*if(projView) {
            projView.mostrarProyMonthly(0); 
            projView.setContainerShow();
        }*/
        if(crossRefView){
            crossRefView.showCrossRef();
            crossRefView.setContainerShow();
        }
        if(staffing) staffing.setContainerHide();
        if(peopleView) peopleView.setContainerHide();
        document.getElementById("loader").style.display = "none"
    }
    function show_StaffContainer(){
        //document.getElementById("loader").style.display = ""
        if(projView) projView.setContainerHide();
        if(crossRefView) crossRefView.setContainerHide();
        if(staffing) staffing.setContainerShow();
        if(peopleView) peopleView.setContainerHide();
        //document.getElementById("loader").style.display = "none"
    }
    function show_PeopleContainer(){
        
        //console.log("peopleView",peopleView);
        if(peopleView===undefined){
            document.getElementById("loader").style.display = ""
            //`https://staffing-func.azurewebsites.net/api/getfactpeoplemonthly`
            util.asynGetFromDB(`https://staffing-func.azurewebsites.net/api/gethorasplanreal`,myToken,myTime).then(function(fetchData){
                console.log("people view data",fetchData);
                peopleView = new PeopleView(fetchData,"container-people","container-p");
                peopleView.renderView();
                peopleView.setContainerShow();
            })
            if(projView) projView.setContainerHide();
            if(crossRefView) crossRefView.setContainerHide();
            if(staffing) staffing.setContainerHide();
            document.getElementById("loader").style.display = "none"
        }else{
            peopleView.setContainerShow();
            if(projView) projView.setContainerHide();
            if(crossRefView) crossRefView.setContainerHide();
            if(staffing) staffing.setContainerHide();
        }
    }
    
    function bt_filterProj(dat){
        let btn=document.getElementById(dat);
        //console.log("btn",dat);
        //console.log("btn",btn);
        var dat=btn.name.split("-");
        var tit=btn.innerHTML;
        document.getElementById("projectsBox").value="Seleccione...";
        if(tit=="f"){
            teamView.setVisibilityToProy(dat[1],true);
            btn.innerHTML="b";
            btn.style.backgroundColor="orange";
        }else{
            teamView.setVisibilityToProy("",false);
            btn.innerHTML="f";
            btn.style.backgroundColor="#9999ff";
        }
    }
    function bwi_info(IDp,fase,mes){
        //console.log("bwi_info",propertyBar.isPropertyBarVisible())
        let btnInfo=document.getElementById("bwi-"+IDp+"."+fase+"."+mes);
        if(propertyBar.isPropertyBarVisible()){
            propertyBar.clear();       
            btnInfo.innerHTML="info &#62;";   
            btnInfo.style.backgroundColor="#e0e0fa";  
        }else{
            propertyBar.clear();
            propertyBar.showProperties(IDp,fase,mes);
            btnInfo.innerHTML="info  v" 
            btnInfo.style.backgroundColor="orange";  
            oHistoricSorter.setData(propertyBar.getHistoricData());
        }
    }
    function bpv_show(IDp,fase,mes){
        let btn=document.getElementById("bpv-"+IDp+"."+fase+"."+mes)
        if(btn.style.backgroundColor=="orange"){
            btn.style.backgroundColor="#e0e0fa";
            projViewReal.setPreviousCalledNoZero();
        }else
            if(projView.isVisible()){
                projView.setContainerHide();
                btn.innerHTML="project &#62;";
                btn.style.backgroundColor="#e0e0fa";
                projViewReal.setContainerHide();
                
            }else{
                projView.setContainerShow();
                projView.mostrarProyMonthly(IDp);       
                btn.innerHTML="project v";     
                btn.style.backgroundColor="orange";
                projViewReal.setContainerShow();
                projViewReal.mostrarProyReal(IDp);
                document.getElementById("btnDetailV").click();
            }        
    }
    function bw_mostrar(IDp,fase,mes){        
        //var dat=par.split("-");
        let wrp=document.getElementById("w-"+IDp+"."+fase+"."+mes);
        //let prj=dat[1].split(".");
        //console.log("display",wrp.style.display.length);
        let bwrp=document.getElementById("bw-"+IDp+"."+fase+"."+mes);
        //let bar=document.getElementById("bar")
        if(wrp.style.display=="none"||wrp.style.display.length==0){
            wrp.style.display="block";
            bwrp.innerHTML="detail v";   
            bwrp.style.backgroundColor="orange";         
            projSummary.fillProjSumm(IDp);
        }else{
            wrp.style.display="none";
            bwrp.innerHTML="detail &#62;";
            bwrp.style.backgroundColor="#e0e0fa";
            projSummary.blankProjSummary();
        }
    }
    async function btn_save(){
        //console.log("save")
        let r=await util.sendToServer();  
        if(r==0){
            //console.log("recarga la data del servidor-save")
            propertyBar.cleanChng();         
            btn_reload();   
        }

    }
    function showProjectsel(){
        //console.log("show ",crossRef.getProjectHide())
        crossRefView.toShowProject();
    }
    function hideProj(id){
        //alert(id);
        crossRefView.toDelProject2hide(id);
        crossRef.setProjectHide(id);
        //console.log("hide ",crossRef.getProjectHide())
        crossRefView.toHideProject();
    }
    /*function hideProject(){

        const select = document.getElementById("hideProyectos");
        crossRefView.toDelProject2hide();
        crossRefView.toShowProject();
    
        for (let i = 0; i < select.options.length; i++) {
            if (select.options[i].selected) {
                crossRef.setProjectHide(select.options[i].value);
            }else{
                crossRef.setProjectList(select.options[i].value);
            }
          }
        crossRefView.toHideProject();
    }*/
    function btn_reload(){
        //if(confirm("Desea re-cargar los proyectos")==true){ 
            document.getElementById("loader").style.display = "";
            document.getElementById("loader").style.visibility = "visible";

            setProy();
            document.getElementById("loader").style.display = "none";
            document.getElementById("loader").style.visibility = "none";
        //}
    }
    async function loadStaff(){
        console.log("inicio loadstaff");
        //document.getElementById("loader").style.display = ""
        util.asynGetFromDB(`https://staffing-func.azurewebsites.net/api/getstaffinghttp`,myToken,myTime).then(function(fetchData){
                //console.log("fetchdata",fetchData);
                try{                    
                    if(typeof fetchData.msg=="undefined")
                        msg="ok"
                    else
                        msg=fetchData.msg
                    //console.log("msg staffing",msg);
                    //projList.createMesStruct();
                    if(msg=="ok"){
                        projList=new ProjList(fetchData);
                        staffing=new StaffingView("contenido","mes");
                        staffing.createStaffingView();
                        staffing.createMonStruct();
                    }
                    console.log("fin loadstaff");
                    //document.getElementById("loader").style.display = "none"
                }catch(e){
                    //console.log("asynGetFromDB",e);
                    //document.getElementById("loader").style.display = "none"
                    alert("Error en la carga, intente de nuevo");
                    //console.log("loadStaff",e);
                }
                
            })
            .catch(error=>{
                //document.getElementById("loader").style.visibility = "none";
                console.log(error)
            })
    }
    function convertAlternativeStaffData(datareal){
        let projAvailable=[];
        let proyectosArr=Array.from({length: 25}, function() { return []; });
       //console.log("data",datareal,datareal.data)
        datareal.data.forEach((el)=>{
            //let val=projAvailable.find(obj=>obj.idProy==el.idProy);
            
            let esta=false;
            projAvailable.forEach((d)=>{
                if(d==el.idProy){
                    esta=true;
                }
            })
            if(!esta)
                projAvailable.push(el.idProy);
            //console.log("array",el,projAvailable);
        })
        //console.log("projAvailable",projAvailable);
        for(let currYear=yearInitial;currYear<yearInitial+2;currYear++){
            for(let currMon=1;currMon<13;currMon++){
                var mesArr=[]
                let yearIni=0;
                let yearFin=0;
                let ini=0;
                let fin=0;
                let mesi=currYear==yearInitial?currMon:currMon+12;

                projAvailable.forEach((pd)=>{
                    if( true || pd==173){

                        let arrPru=[];
                        datareal.data.forEach((el)=>{
                            if(el.idProy==pd){
                                arrPru.push(el);
                            }
                        })
                        //console.log("arrPru===",currMon,pd,arrPru);                        
                        let team=[];
                        let hay=false;
                        let totHPlan=0;
                        let totHReal=0;
                        if(arrPru.length>0){
                            yearIni=parseInt(arrPru[0].inicio_mon.substring(0,4))
                            ini=parseInt( arrPru[0].inicio_mon.substring(5,7));
                            //if(yearIni==INITIALYEAR) ini+=12;
                            if(yearIni==CURRYEAR-1) ini=ini*(-1);
                            fin=Math.abs(ini)+parseInt(arrPru[0].dura_plan_meses)-1;                        
                            yearFin=fin>12?yearIni+1:yearIni;                        
                            
                            //console.log("plazo plan proy",arrPru[0].inicio_mon,arrPru[0].idProy,ini,fin,yearIni,yearFin,currYear,currMon);
                            arrPru.forEach((el)=>{
                                if(getDataMesPlan(currMon,currYear,el) || getDataMesReal(currMon,currYear,el))
                                    hay=true;
                                //console.log("hay data",hay,getDataMesPlan(currMon,currYear,el),getDataMesReal(currMon,currYear,el));                                
                                if(el.usr /* && el.in_staffing==1*/){
                                    
                                    totHReal+=getDataMesReal(currMon,currYear,el)?getDataMesReal(currMon,currYear,el):0;
                                    let planh=0;
                                    //console.log("antes rango",currYear,yearIni,yearFin,currMon,mesi,ini,fin,el.usr);
                                    
                                    
                                    //if(currYear>=yearIni && currYear <= yearFin && mesi>=ini && mesi<=fin){
                                    //if(currYear>=yearIni && currYear <= yearFin && mesi>=ini && mesi<=fin){
                                    planh=getDataMesPlan(currMon,currYear,el);
                                    //console.log("getDataMesPlan",planh);
                                    totHPlan+=getDataMesPlan(currMon,currYear,el)?getDataMesPlan(currMon,currYear,el):0;
                                    //}
                                                                    
                                    let prom=getAvgRealHrs(arrPru,el.usr);
                                    //console.log("avg",el.usr,prom,currMon,currMon>=CURRENTMONTH);
                                    let real=getDataMesReal(currMon,currYear,el);         
                                    //console.log("plan h",arrPru[0].idProy,planh,mesi,ini,fin)
                                    team.push({"nombre": el.usr,
                                        "horasPlan": planh,
                                        "horasReal": real,
                                        "avgReal":prom,
                                        "dedicacion":(planh/160)*100,
                                        "real":(real/160)*100,
                                        "original": planh,
                                        "newDedi": "NaN",
                                        "dirty":0}
                                    )
                                }
                            })
                            //if(arrPru[0].in_staffing==1){
                                let template={
                                        "IDp": arrPru[0].idProy,
                                        "proyecto": arrPru[0].nb_proyecto,
                                        "pais":arrPru[0].pais,
                                        "inStaffing":arrPru[0].in_staffing,
                                        "fase": "0",
                                        "improbable":0,
                                        "year": currYear,
                                        "mes": currMon,
                                        "mesi":mesi,
                                        "horas": 0,
                                        "duraPlanMeses":arrPru[0].dura_plan_meses,
                                        "totHorasPlan":totHPlan,
                                        "totHorasReal":totHReal,
                                        "meses":arrPru[0].dura_plan_meses,
                                        "Fase": arrPru[0].fase}
                                
                                template.equipo=team;
                                //proyectosArr.push(template);
                                if(hay) mesArr.push(template);
                                let incluido=false;
                                //console.log("mesi",mesi);
                                proyectosArr[mesi].forEach((el)=>{
                                    //console.log("elemento",el)
                                    if(el.IDp==arrPru[0].idProy) incluido=true;
                                })
                                if(hay && !incluido && template.mes==currMon) proyectosArr[mesi].push(template) 
                                //console.log("mes",template,mesi,arrPru[0].idProy,proyectosArr)
                            //}
                    }
                    }
                })
                //console.log("mes",mesArr,currMon)
                //for(let i in mesArr){        
                //    proyectosArr[currMon].push(mesArr[i]) 
                //}
                //console.log("final ciclo",currMon,mesArr,proyectosArr)
            }
        }
        //console.log("proyectos",proyectosArr);
        let fetchData={data:proyectosArr,msg:"ok"};
        //console.log("fetchdata",fetchData);
        try{                    
            if(typeof fetchData.msg=="undefined")
                msg="ok"
            else
                msg=fetchData.msg
            //console.log("msg staffing",msg);
            //projList.createMesStruct();
            if(msg=="ok"){
                projList=new ProjList(datareal,fetchData);
                staffing=new StaffingView2("contenido","mes",projList);
                staffing.createStaffingView();
                staffing.createMonStruct();
            }
            //document.getElementById("loader").style.display = "none";
            //document.getElementById("maintab").style.display="";
        }catch(e){
            //console.log("asynGetFromDB",e);
            //document.getElementById("loader").style.display = "none"
            alert("Error en la carga, intente de nuevo");
            console.log("convertAlternativeStaffData",e)
        }
    }
    async function loadStaff1(){
        console.log("inicio loadstaff1");
        //document.getElementById("loader").style.display = "";
        //document.getElementById("loader").style.visibility = "visible";
        
        util.asynGetFromDB(`https://staffing-func.azurewebsites.net/api/gethorasplanreal`,myToken,myTime).then(function(fetchData){
                //console.log("fetchdata",fetchData);
                try{                    
                    if(typeof fetchData.msg=="undefined")
                        msg="ok"
                    else
                        msg=fetchData.msg
                    //console.log("msg staffing",msg);
                    //projList.createMesStruct();
                    if(msg=="ok"){

                        convertAlternativeStaffData(fetchData);
                        //console.log("se cargo la data")
                    }
                    intento=0;
                    console.log("fin loadstaff1");
                    //document.getElementById("loader").style.display = "none";
                    document.getElementById("loader").style.visibility = "none";
                }catch(e){
                    //console.log("asynGetFromDB",e);
                    //document.getElementById("loader").style.display = "none";
                    //document.getElementById("loader").style.visibility = "none";
                    if(intento==0){
                        btn_reload();
                        intento++;
                    }
                    alert("Error en la carga, intente de nuevo");
                    console.log("loadStaff1",e)
                }
                
            })
            .catch(error=>{
                //document.getElementById("loader").style.visibility = "none";
                console.log(error);                
            })
    
    }
    async function loadConsultant(){
        console.log("inicio loadconsultant");
        let fetchData=await util.asynGetFromDB(`https://staffing-func.azurewebsites.net/api/getconsultant`,myToken,myTime);
        if(typeof fetchData.msg=="undefined")
                msg="ok"
            else
                msg=fetchData.msg
        if(msg=="ok"){
            teamStruct=fetchData.data
            teamView=new TeamView(fetchData,"team");
            teamView.show();
        }
        console.log("fin loadconsultant");

    }
    async function loadAllProjects(){
        console.log("inicio loadallprojects");
        util.asynGetFromDB(`https://staffing-func.azurewebsites.net/api/getallprojects`,myToken,myTime).then(function(fetchData){
            //console.log("fetch data getAllProjects",fetchData);
            if(typeof fetchData.msg=="undefined")
                    msg="ok"
                else
                    msg=fetchData.msg
            if(msg=="ok")
                projectFilterView=new ProjectFilterView(fetchData.data,"projectsBox");
            console.log("fin loadallprojects");
        })
        .catch(error=>{
            //document.getElementById("loader").style.visibility = "none";
            console.log(error)
        })
    }
    async function loadProjectMonthly(){
        console.log("inicio loadProjectMonthly");
        util.asynGetFromDB(`https://staffing-func.azurewebsites.net/api/getfactprojmonthy`,myToken,myTime).then(function(fetchData){
            //console.log("fetch data getAllProjects",fetchData);
            if(typeof fetchData.msg=="undefined")
                    msg="ok"
                else
                    msg=fetchData.msg
            if(msg=="ok")
            {
                factprojmonthy=fetchData.data;
                //console.log("en el load",fetchData.data)
                projView = new ProjView(fetchData.data,"container-project","tab-proj-01");
                projView.mostrarProyMonthly(0);
            }
            console.log("fin loadProjectMonthly");
        })
        .catch(error=>{
            //document.getElementById("loader").style.visibility = "none";
            console.log(error)
        })
    }
    async function loadProjectPlanReal(){
        console.log("inicio loadProjectPlanReal");
        util.asynGetFromDB(`https://staffing-func.azurewebsites.net/api/gethorasplanreal`,myToken,myTime).then(function(fetchData){
            //console.log("fetch data loadProjectPlanReal",fetchData);
            if(typeof fetchData.msg=="undefined")
                    msg="ok"
                else
                    msg=fetchData.msg
            if(msg=="ok")
            {
                factprojmonthy=fetchData.data;
                //console.log("en el load de loadProjectPlanReal",fetchData.data)
                projViewReal = new ProjViewReal(fetchData.data,"container-project-real","tab-proj-02",proyectos);
                //projView.mostrarProyMonthly(0);
                let arrPru=[];
                fetchData.data.forEach((el)=>{
                    if(el.idProy==101){
                        arrPru.push(el);
                    }
                })
                //console.log("arrPru===",arrPru);
                document.getElementById("btnStaffingV").disabled=false;
                document.getElementById("btnProjectV").disabled=false;
                document.getElementById("btnPeopleV").disabled=false;
                document.getElementById("btnDetailV").disabled=false;
                console.log("fin loadProjectPlanReal");
                //document.getElementById("loader").style.display = "none"                
            }
        })
        .catch(error=>{
            //document.getElementById("loader").style.visibility = "none";
            console.log(error)
        })
    }
    async function loadProjectSummary(){
        console.log("inicio loadProjectSummary");
        util.asynGetFromDB(`https://staffing-func.azurewebsites.net/api/getprojectsummary`,myToken,myTime).then(function(fetchData){
            //console.log("fetch data getProjectSummary",fetchData);
                if(typeof fetchData.msg=="undefined")
                    msg="ok"
                else
                    msg=fetchData.msg
                if(msg=="ok")
                    projSummary= new ProjSummaryView(fetchData,"projSumm","div-content-head");
                    console.log("fin loadProjectSummary");
            })
            .catch(error=>{
                //document.getElementById("loader").style.visibility = "none";
                console.log(error)
            })
    }
    async function loadVacation(){
        console.log("inicio loadVacation");
        util.asynGetFromDB(`https://staffing-func.azurewebsites.net/api/getvacation`,myToken,myTime).then(function(fetchData){
            //console.log("fetch data getProjectSummary",fetchData);
                if(typeof fetchData.msg=="undefined")
                    msg="ok"
                else
                    msg=fetchData.msg
                if(msg=="ok"){
                    vacationView=new VacationView(fetchData.data);
                    vacationView.createVacationMonth();
                    vacationView.createView();
                }
                console.log("fin loadVacation");
            })
            .catch(error=>{
                //document.getElementById("loader").style.visibility = "none";
                console.log(error)
            })        
            

    }
    async function getTasaConsumo(){
        //console.log("inicio getTasaConsumo");
        let fetchData=await util.asynGetFromDB(`https://staffing-func.azurewebsites.net/api/gettasaconsumoproy`,myToken,myTime)

        //console.log("fetch data getProjectSummary",fetchData);
        if(typeof fetchData.msg=="undefined")
            msg="ok"
        else
            msg=fetchData.msg
        if(msg=="ok"){
            
            tasaConsumo=new TasaConsumo(fetchData.data);

        }
        //console.log("fin getTasaConsumo");    
    }
    async function loadVacation1(){
        console.log("inicio loadVacation");
        let fetchData=await util.asynGetFromDB(`https://staffing-func.azurewebsites.net/api/getvacation`,myToken,myTime)

        //console.log("fetch data getProjectSummary",fetchData);
        if(typeof fetchData.msg=="undefined")
            msg="ok"
        else
            msg=fetchData.msg
        if(msg=="ok"){
            vacationView=new VacationView(fetchData.data);
            vacationView.createVacationMonth();
            vacationView.createView();
        }
        console.log("fin loadVacation");    
    }
    async function loadAlarms(){
        console.log("inicio loadAlarms");
        var alarmView
        util.asynGetFromDB(`https://staffing-func.azurewebsites.net/api/getalarms`,myToken,myTime).then(function(fetchData){
            //console.log("fetch data getProjectSummary",fetchData);
                if(typeof fetchData.msg=="undefined")
                    msg="ok"
                else
                    msg=fetchData.msg
                if(msg=="ok"){
                    alarmView=new AlarmView(fetchData.data);
                    alarmView.createView();
                }
                console.log("fin loadAlarms");
            })
            .catch(error=>{
                //document.getElementById("loader").style.visibility = "none";
                console.log(error)
            })        
            

    }  
    async function loadProyectos(){
        console.log("inicio loadProyectos");
        util.asynGetFromDB(`https://staffing-func.azurewebsites.net/api/getproyectos`,myToken,myTime).then(function(fetchData){
            //console.log("fetch data getProjectSummary",fetchData);
                if(typeof fetchData.msg=="undefined")
                    msg="ok"
                else
                    msg=fetchData.msg
                if(msg=="ok"){
                    proyectos=new Proyectos(fetchData.data);
                    //console.log("proyectos",proyectos);
                }
                console.log("fin loadProyectos");
            })
            .catch(error=>{
                //document.getElementById("loader").style.visibility = "none";
                console.log(error)
            })        
            

    } 
    async function loadProyectos1(){
        console.log("inicio loadProyectos1");
        let fetchData=await util.asynGetFromDB(`https://staffing-func.azurewebsites.net/api/getproyectos`,myToken,myTime);
            //console.log("fetch data getProjectSummary",fetchData);
        if(typeof fetchData.msg=="undefined")
            msg="ok"
        else
            msg=fetchData.msg
        if(msg=="ok"){
            proyectos=new Proyectos(fetchData.data);
            //console.log("proyectos",proyectos);
        }
        console.log("fin loadProyectos1");   

    }    

    async function loadCrossRefData(){
        console.log("inicio loadCrossRefData");
        var alarmView
        util.asynGetFromDB(`https://staffing-func.azurewebsites.net/api/getclocki4weeks`,myToken,myTime).then(function(fetchData){
            //console.log("fetch data getProjectSummary",fetchData);
                if(typeof fetchData.msg=="undefined")
                    msg="ok"
                else
                    msg=fetchData.msg
                if(msg=="ok"){
                    //console.log("crossreference data",fetchData)
                    crossRef=new CrossReference(fetchData,proyectos);
                    crossRefView=new CrossRefView(crossRef,"container-project","tab-proj-01",teamView);
                    let ps=crossRefView.showProjectSelector();
                    document.getElementById("projSel").innerHTML=ps;
                }
                console.log("fin loadCrossRefData");
            })
            .catch(error=>{
                //document.getElementById("loader").style.visibility = "none";
                console.log(error)
            })  
    } 
    async function  detailHistChange2Modal  (usr,id){
        //console.log("fetch data detailHistChange2Modal");
        let obj={idp:id,usr:usr,token:myToken,time:myTime}
        let retorno;
        retorno= await util.asynGetFromDB_(`https://staffing-func.azurewebsites.net/api/getDetailHistChanges`,obj).then(function(fetchData){
            
                if(typeof fetchData.msg=="undefined")
                    msg="ok"
                else
                    msg=fetchData.msg
                if(msg=="ok"){
                    //console.log("detailHistChange2Modal",fetchData.data,fetchData.data[0]);
                    return fetchData.data[0];
                }
                
            })
            .catch(error=>{
                //document.getElementById("loader").style.visibility = "none";
                console.log(error);
                return {};
            })        
            return retorno;

    }
    function poollingForChanged(){
        //console.log("fetch data pollingForChanged");
        // Only for test purpose, set this static date in other to get data 
                dateOfChanged="2022-10-14 00:25:55.847";
        let obj={usr:userSession,fechahora:dateOfChanged,token:myToken,time:myTime}
        util.asynGetFromDB_(`https://poolingnewchanges.azurewebsites.net/api/poollingnewchanges`,obj).then(function(fetchData){
            
                if(typeof fetchData.msg=="undefined")
                    msg="ok"
                else
                    msg=fetchData.msg
                if(msg=="ok"){
                    //console.log("poolingChanges",fetchData);
                    sesion=new SessionView(fetchData.data,"session-container");
                    //alarmView=new AlarmView(fetchData.data);
                    //alarmView.createView();
                }
                
            })
            .catch(error=>{
                //document.getElementById("loader").style.visibility = "none";
                console.log(error)
            })        
            

    }     
   function openTab(evt, viewToOpen){
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        
        evt.currentTarget.className += " active";
        //console.log(viewToOpen);
        if(viewToOpen=="Staffing") {  
            document.getElementById("sidebar").style.display="block"; 
            document.getElementById("container-project").style.marginLeft="206px";
            document.getElementById("team").style.display="block";         
            show_StaffContainer();
            document.getElementById('contenido').style.display = "block";
        }
        if(viewToOpen=="Project") {   //cross view     
            //alert("En desarrollo"); 
            if(proyectos===undefined) alert("La data no ha terminado de cargar. Espere unos segundos e intente de nuevo");
            else{  
                document.getElementById("sidebar").style.display="none";
                document.getElementById("container-project").style.marginLeft="2px";
                document.getElementById("team").style.display="none";  
                show_ProjContainer();
            }
            //document.getElementById('container-project').style.display = "block";
        }
        if(viewToOpen=="People") {   
            //alert("En desarrollo");    
            document.getElementById("sidebar").style.display="block"; 
            document.getElementById("container-project").style.marginLeft="206px";      
            show_PeopleContainer();
            document.getElementById("team").style.display="none";
        }
        if(viewToOpen=="Real") {            
            //alert("En desarrollo"); 
            if(projViewReal===undefined) alert("La data no ha terminado de cargar. Espere un momento")
            else{
                document.getElementById("team").style.display="none";
                document.getElementById("sidebar").style.display="block"; 
                document.getElementById("container-project").style.marginLeft="206px";
                projViewReal.setContainerShow();
                if(!projViewReal.previousCalledNoZero())
                    projViewReal.mostrarProyReal(0);
            }
            //console.log("People",document.getElementById('container-project-real').style.display)
        }
    }

    async function setProy(){ 
        //console.log("setProy");
        //console.log("auth",myToken,myTime)
        let msg="";
        cal=new Calendario();
        propertyBar=new PropertyView("bar");
        util=new Util();
        cal.createBaseTable();
    
        document.getElementById("btnStaffingV").disabled=true;
        document.getElementById("btnProjectV").disabled=true;
        document.getElementById("btnPeopleV").disabled=true;
        document.getElementById("btnDetailV").disabled=true;
        render = new Render();
        document.getElementById("loader").style.display = "";
        document.getElementById("loader").style.visibility = "visible";

        if(myToken && myTime) {
            
            await getTasaConsumo();
            //loadStaff() ;
            await loadVacation1();

            await loadAlarms();
            
            await loadProyectos1();
            
            await loadStaff1();
                        
            await loadConsultant();

            await loadAllProjects();
            
            //loadProjectMonthly();

            await loadProjectPlanReal();

            await loadCrossRefData();

            await loadProjectSummary();
            
           
        }
        document.getElementById("loader").style.display = "none";
        document.getElementById("loader").style.visibility = "none"
        document.getElementById("btnStaffingV").click();
    }
    let asynGetToken = async (usr,pwd) => { 
        //console.log("en async get Token function",usr,pwd)
        let data={username:usr,password:pwd}
        document.getElementById("loader").style.visibility = "visible";
        //console.log("json",JSON.stringify(data));
        const fetchData= await fetch(`https://cybs-isauth.azurewebsites.net/api/cybs_login`, {
            method: 'POST',
            body:JSON.stringify(data),
            headers: {
                //'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Type': 'application/json',
            }
        }).then(r => r.json())
        .catch(error=>{
            document.getElementById("loader").style.visibility = "none";
            console.log(error)
        })
       
        //console.log("fetchData",fetchData.data)
        return fetchData;
    }
        //&#9744;
        //cafe
        //&#9749;
    function open_close(){
        let signin=document.getElementById("signin");
        if(signin.style.display=="none") signin.style.display=""
        else signin.style.display="none";
    }
    function auth(){    
        document.getElementById("loader").style.display = "";
        document.getElementById("loader").style.visibility = "visible";
        let usr=document.getElementById("username")
        let pwd=document.getElementById("password")
        
        //console.log("usr",usr.value,pwd.value)
        asynGetToken(usr.value,pwd.value).then(function(fetchData){

            if(fetchData===undefined){
                document.getElementById("loader").style.display = "none";
                document.getElementById("loader").style.visibility = "none";
                alert("Intente mas tarde");
            } 
            else
            if(fetchData.cod==0){
                document.getElementById("container").style.display="";
                document.getElementById("loader").style.visibility = "visible"
                myToken=fetchData.data;
                myTime=fetchData.time;
                dateOfChanged=fetchData.dateOfChanged;
                localStorage.setItem("username", usr.value);
                let l=usr.value.split("@");
                let n=l[0].split(".");
                let inicial=n[0][0]
                userSession=inicial+"."+n[1];     
                //console.log("usersession",userSession,dateOfChanged);
                document.getElementById("signin").style.display="none";
                document.getElementById("loader").style.visibility = "none";
                setProy();
                //console.log("myToken,myTime loaded")
                document.getElementById("loader").style.display = "none";
                document.getElementById("loader").style.visibility = "none";
                
            }else {
                document.getElementById("loader").style.diplay = "none";
                çdocument.getElementById("loader").style.visibility = "none";
                alert(fetchData.data);
            }
            
        }).catch(error=>{
            document.getElementById("loader").style.display = "none";
            document.getElementById("loader").style.visibility = "none";
            console.log(error)
        })
    }
    function toggleDropDown() {
        document.getElementById("dropdownView").classList.toggle("show");
      }
    window.onclick = function(event) {
        if (!event.target.matches('.dropbtn')) {
          var dropdowns = document.getElementsByClassName("dropdown-content");
          var i;
          for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
              openDropdown.classList.remove('show');
            }
          }
        }
      }
