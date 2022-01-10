var globId=1;
const GOODTHRESHOLD=100;
//var INITIALMONTH=new Date().getMonth()+1; <-- esta es la correcta
var INITIALMONTH=new Date().getMonth()+1;
//INITIALMONTH=INITIALMONTH==0?12:INITIALMONTH;
var MONTHTOSHOW=12;
var INITIALYEAR=new Date().getFullYear();
var YEARTOSHOW=new Date().getFullYear()+1;
console.log(INITIALYEAR,YEARTOSHOW);
cantidad=10
var staffing;
var projView;
var projSummary;
var render;
var projectFilterView;
var cal;
var util;
var projList;
var teamView;
var propertyBar;
titulo=["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]

// GUI FUNCTIONS
    function tx_dedichange(nb,IDp,fase,mes,inOnSite){
        //id-${o.nombre}-${o.IDp}.${o.fase}.${o.mes}-${o.inOnSite}        
        let id="id-"+nb+"-"+IDp+"."+fase+"."+mes+"-"+inOnSite;
        var wrappid="t-"+nb+"-"+IDp+"."+fase+"."+mes+"-"+inOnSite;
        var wrappid2="c-"+nb+"-"+IDp+"."+fase+"."+mes+"-"+inOnSite;
        let currentInOnsite=0;
        console.log("tx_dedichange",document.getElementById(wrappid2),wrappid2);
        if(typeof document.getElementById(wrappid2).style!=="undefined")
            currentInOnsite=document.getElementById(wrappid2).style.backgroundColor=="blue"?1:0;
        else
            if(typeof document.getElementById(wrappid).style!=="undefined")
            currentInOnsite=document.getElementById(wrappid).style.backgroundColor=="blue"?1:0;
        console.log("current onsite",currentInOnsite);
        //console.log("on Change",document.getElementById(id).value);
        projList.setAllStruct(IDp,fase,nb,document.getElementById(id).value,mes,currentInOnsite);
        console.log("dedichange",nb,IDp,mes,currentInOnsite,document.getElementById(id).value);
        let totDedic=projList.getTeamDedication(IDp,fase,mes);
        let origDedi=document.getElementById(`ref-${IDp}.${fase}.${mes}`).innerHTML;
        console.log("cambios",totDedic,origDedi);
        let xcolor=totDedic==origDedi ? "orange" : "red";
        let chgDedi=document.getElementById(`chng-${IDp}.${fase}.${mes}`);
        chgDedi.innerHTML=totDedic.toFixed(2);
        chgDedi.style.color=xcolor;
        // cambio en la estructura de mes, debe cambiar en la capa de presentación - totales
        // staffing ---depend-->projList, ya que en projList está la data
        // se la dedicacion cambia se actualizan los totales
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
    function showContainerProj(){
        let btn=document.getElementById("btn-hojas");
        let btnboth=document.getElementById("btn-both");
        if(staffing.isVisible()){
            staffing.setContainerHide();
            projView.setContainerShow();
            btn.textContent="Staffing View"
        }else{
            staffing.setContainerShow();
            projView.setContainerHide();
            btn.textContent="Project View"
            btnboth.textContent="Project View & Staffing View"
        }

    }
    function showContainerBoth(){
        let btn=document.getElementById("btn-both");
        if(btn.textContent=="Project View & Staffing View"){
            document.getElementById("contenido").style.display="";
            staffing.setContainerShow();
            projView.setContainerShow();
            btn.textContent="Hide Project View"
        }else{
            staffing.setContainerShow();
            projView.setContainerHide();
            btn.textContent="Project View & Staffing View"
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
        }
    }
    function bpv_show(IDp,fase,mes){
        let btn=document.getElementById("bpv-"+IDp+"."+fase+"."+mes)
        if(projView.isVisible()){
            projView.setContainerHide();
            btn.innerHTML="project &#62;";
            btn.style.backgroundColor="#e0e0fa";
        }else{
            projView.setContainerShow();
            projView.mostrarProyMonthly(IDp);       
            btn.innerHTML="project v";     
            btn.style.backgroundColor="orange";
        }
        
    }
    function bw_mostrar(IDp,fase,mes){        
        //var dat=par.split("-");
        let wrp=document.getElementById("w-"+IDp+"."+fase+"."+mes);
        let btn=document.getElementById("btn-both");
        //let prj=dat[1].split(".");
        //console.log("display",wrp.style.display.length);
        let bwrp=document.getElementById("bw-"+IDp+"."+fase+"."+mes);
        //let bar=document.getElementById("bar")
        if(wrp.style.display=="none"||wrp.style.display.length==0){
            wrp.style.display="block";
            bwrp.innerHTML="detail v";   
            bwrp.style.backgroundColor="orange";         
            projSummary.fillProjSumm(IDp);
            btn.textContent="Hide Project View";
        }else{
            wrp.style.display="none";
            bwrp.innerHTML="detail &#62;";
            bwrp.style.backgroundColor="#e0e0fa";
            projSummary.blankProjSummary();
        }
    }
    function btn_save(){
        console.log("save")
        util.sendToServer();                
    }
    function setProy(){    
        cal=new Calendario();
        propertyBar=new PropertyView("bar");
        util=new Util();
        cal.createBaseTable();
        render = new Render();
        util.asynGetFromDB(`https://getstaffinghttp.azurewebsites.net/api/getstaffinghttp`).then(function(fetchData){
            try{
                projList=new ProjList(fetchData);
                //projList.createMesStruct();
                staffing=new StaffingView("contenido","mes");
                staffing.createStaffingView();
                staffing.createMonStruct();
            }catch(e){
                console.log("asynGetFromDB",e);
                alert("Error en la carga, intente de nuevo");
            }
        }); 
        
        
        util.asynGetFromDB(`https://getconsultant.azurewebsites.net/api/getconsultant`).then(function(fetchData){
            teamStruct=fetchData.data
            teamView=new TeamView(fetchData,"team");
            teamView.show();
        });

        util.asynGetFromDB(`https://getallprojects.azurewebsites.net/api/getallprojects`).then(function(fetchData){
            //console.log("fetch data getAllProjects",fetchData);
            projectFilterView=new ProjectFilterView(fetchData.data,"projectsBox");
        });

        util.asynGetFromDB(`https://getfactprojmonthy.azurewebsites.net/api/getfactprojmonthy`).then(function(fetchData){
            //console.log("fetch data getAllProjects",fetchData);
            factprojmonthy=fetchData.data;
            projView = new ProjView(fetchData.data,"container-project","tab-proj-01");
            projView.mostrarProyMonthly(0);
        })

        util.asynGetFromDB(`https://getprojectsummary.azurewebsites.net/api/getprojectsummary`).then(function(fetchData){
        //console.log("fetch data getProjectSummary",fetchData);
            projSummary= new ProjSummaryView(fetchData,"projSumm","div-content-head");
        });

    }
