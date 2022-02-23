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
var myToken;
var myTime;
var peopleView;
titulo=["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
var oHistField=new Field();
oHistField.add(1,"b1","nombre_persona");
oHistField.add(2,"b2","proyecto");
oHistField.add(3,"","Fase");
oHistField.add(4,"","Cambio");
oHistField.add(5,"","Original");
oHistField.add(5,"","In Site");
var oSortHistList=new SortList(oHistField);
var oHistoricSorter=new SorterTable(oSortHistList,"HistoricTable",mostrar)
// GUI FUNCTIONS
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
    function mostrarDet(x){
        projView.mostrar(x);
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
    function tx_dedichange(nb,IDp,fase,mes,inOnSite){
        //id-${o.nombre}-${o.IDp}.${o.fase}.${o.mes}-${o.inOnSite}        
        let id="id-"+nb+"-"+IDp+"."+fase+"."+mes+"-"+inOnSite;
        var wrappid="t-"+nb+"-"+IDp+"."+fase+"."+mes+"-"+inOnSite;
        var wrappid2="c-"+nb+"-"+IDp+"."+fase+"."+mes+"-"+inOnSite;
        let currentInOnsite=0;
        //console.log("tx_dedichange",document.getElementById(wrappid2),wrappid2);  //c-Gustavo Fuentes-40.2.2-0
        if( document.getElementById(wrappid2))
            currentInOnsite=document.getElementById(wrappid2).style.backgroundColor=="blue"?1:0;
        else
            if( document.getElementById(wrappid))
                currentInOnsite=document.getElementById(wrappid).style.backgroundColor=="blue"?1:0;
        //console.log("current onsite",currentInOnsite);
        //console.log("on Change",document.getElementById(id).value);
        projList.setAllStruct(IDp,fase,nb,document.getElementById(id).value,mes,currentInOnsite);
        //console.log("dedichange",nb,IDp,mes,currentInOnsite,document.getElementById(id).value);
        let totDedic=projList.getTeamDedication(IDp,fase,mes);
        let origDedi=document.getElementById(`ref-${IDp}.${fase}.${mes}`).innerHTML;
        //console.log("cambios",totDedic,origDedi);
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
    function show_ProjContainer(){
        document.getElementById("loader").style.display = ""
        if(projView) {
            projView.mostrarProyMonthly(0); 
            projView.setContainerShow();
        }
        if(staffing) staffing.setContainerHide();
        if(peopleView) peopleView.setContainerHide();
        document.getElementById("loader").style.display = "none"
    }
    function show_StaffContainer(){
        //document.getElementById("loader").style.display = ""
        projView.setContainerHide();
        staffing.setContainerShow();
        peopleView.setContainerHide();
        //document.getElementById("loader").style.display = "none"
    }
    function show_PeopleContainer(){
        document.getElementById("loader").style.display = ""
        //console.log("peopleView",peopleView);
        util.asynGetFromDB(`https://getfactpeoplemonthly.azurewebsites.net/api/getfactpeoplemonthly`,myToken,myTime).then(function(fetchData){
        //console.log(fetchData);
            peopleView = new PeopleView(fetchData,"container-people");
            peopleView.renderView();
            peopleView.setContainerShow();
        })
        projView.setContainerHide();
        staffing.setContainerHide();
        document.getElementById("loader").style.display = "none"
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
    function btn_save(){
        //console.log("save")
        util.sendToServer();                
    }
    function btn_reload(){
        document.getElementById("loader").style.display = "";
        projList=[]
        loadStaff();
        loadProjectMonthly();
        loadProjectSummary();
        document.getElementById("loader").style.display = "none";
    }
    function loadStaff(){
        document.getElementById("loader").style.display = ""
        util.asynGetFromDB(`https://getstaffinghttp.azurewebsites.net/api/getstaffinghttp`,myToken,myTime).then(function(fetchData){
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
                    document.getElementById("loader").style.display = "none"
                }catch(e){
                    console.log("asynGetFromDB",e);
                    document.getElementById("loader").style.display = "none"
                    alert("Error en la carga, intente de nuevo");
                }
                
            });
    }
    function loadConsultant(){
        util.asynGetFromDB(`https://getconsultant.azurewebsites.net/api/getconsultant`,myToken,myTime).then(function(fetchData){
            if(typeof fetchData.msg=="undefined")
                    msg="ok"
                else
                    msg=fetchData.msg
            if(msg=="ok"){
                teamStruct=fetchData.data
                teamView=new TeamView(fetchData,"team");
                teamView.show();
            }
        });
    }
    function loadAllProjects(){
        util.asynGetFromDB(`https://getallprojects.azurewebsites.net/api/getallprojects`,myToken,myTime).then(function(fetchData){
            //console.log("fetch data getAllProjects",fetchData);
            if(typeof fetchData.msg=="undefined")
                    msg="ok"
                else
                    msg=fetchData.msg
            if(msg=="ok")
                projectFilterView=new ProjectFilterView(fetchData.data,"projectsBox");
        });
    }
    function loadProjectMonthly(){
        util.asynGetFromDB(`https://getfactprojmonthy.azurewebsites.net/api/getfactprojmonthy`,myToken,myTime).then(function(fetchData){
            console.log("fetch data getAllProjects",fetchData);
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
        })
    }
    function loadProjectSummary(){
        util.asynGetFromDB(`https://getprojectsummary.azurewebsites.net/api/getprojectsummary`,myToken,myTime).then(function(fetchData){
            //console.log("fetch data getProjectSummary",fetchData);
                if(typeof fetchData.msg=="undefined")
                    msg="ok"
                else
                    msg=fetchData.msg
                if(msg=="ok")
                    projSummary= new ProjSummaryView(fetchData,"projSumm","div-content-head");
            });
    }
    function setProy(){ 
        //console.log("setProy");
        //console.log("auth",myToken,myTime)
        let msg="";
        cal=new Calendario();
        propertyBar=new PropertyView("bar");
        util=new Util();
        cal.createBaseTable();
        render = new Render();
        document.getElementById("loader").style.display = "";
        if(myToken && myTime) {
            
            loadStaff() ;
                        
            loadConsultant();

            loadAllProjects()

            loadProjectMonthly();

            loadProjectSummary();
           
        }
        document.getElementById("loader").style.display = "none";
    }
    let asynGetToken = async (usr,pwd) => { 
        //console.log("en async get Token function",usr,pwd)
        let data={username:usr,password:pwd}
        //console.log("json",JSON.stringify(data));
        const fetchData= await fetch(`https://cybs-isauth.azurewebsites.net/api/cybs_login`, {
            method: 'POST',
            body:JSON.stringify(data),
            headers: {
                //'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Type': 'application/json',
            }
        }).then(r => r.json())
       
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
        let usr=document.getElementById("username")
        let pwd=document.getElementById("password")
        
        //console.log("usr",usr.value,pwd.value)
        asynGetToken(usr.value,pwd.value).then(function(fetchData){
            
            if(fetchData.cod==0){
                document.getElementById("container").style.display="";
                myToken=fetchData.data;
                myTime=fetchData.time;
                localStorage.setItem("username", usr.value);
                document.getElementById("signin").style.display="none";
                setProy();
                //console.log(myToken,myTime)
                document.getElementById("loader").style.display = "none";
                
            }else {
                document.getElementById("loader").style.visibility = "none";
                alert(fetchData.data);
            }
            
        }).catch(error=>{
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
