class ProjList{
    
    constructor(datareal,data){
        this.mesProjStruct=Array.from({length: 24}, function() { return []; });
        this.mesStruct=Array.from({length: 24}, function() { return []; });
        this.data=data.data;   
        //forma actual basada en array
        this.createMesProjStruct();
        this.createMesStruct();
        this.chngStruct=[];
    }
    getChanged(){
        return this.chngStruct;
        
    } 
    cleanChanged(){
        this.chngStruct=[];
        // la nueva estructura no requiere manejo de dirty
        /*
        for(let i=INITIALMONTH;i<INITIALMONTH+MONTHTOSHOW;i++){
            if(this.mesProjStruct[i]!==undefined)
            this.mesProjStruct[i].forEach((el)=>{
                    el.equipo.forEach((mem)=>{
                        if(mem.dirty!==undefined)
                            if(mem.dirty==1){
                                mem.dirty=0;
                                //console.log("cleanChanged",mem);
                            }
                                
                    });
                
            })        
        }*/
    }   
    getData(){
        return this.data;
    }   
    getTeamDedication(IDp,fase,mes){
        //console.log("getTeamDedication",IDp,fase,mes);
        let sumDedication=0.0;
        var existe=false;
        for(let i in this.data){  
            if(this.data[i].IDp==IDp && this.data[i].fase==fase && this.data[i].mes==mes){
                for(let j in this.data[i].equipo){  
                    sumDedication += parseFloat(this.data[i].equipo[j].horasPlan);
                }
                return sumDedication;
            }
            
        }
        return -1;
    }
    setInStaffing(proj){
        for(let i=0;i<24;i++){
            this.mesProjStruct[i].forEach((el)=>{
                if(el.IDp!==undefined){
                    //console.log("improbable",el.IDp)
                    if(el.IDp==proj) el.improbable=0;
                }
            })
        }
       //console.log("setImprobable",proj,this.mesProjStruct);
    }
    setOutStaffing(proj){
        for(let i=0;i<24;i++){
            this.mesProjStruct[i].forEach((el)=>{
                if(el.IDp!==undefined){
                    //console.log("improbable",el.IDp)
                    if(el.IDp==proj) el.improbable=1;
                }
            })
        }
       //console.log("setImprobable",proj,this.mesProjStruct);
    }
    // este es el método que sustituye a setChngStruct. Maneja una estructura paralela mas simple
    setChangeStruct(IDp,year,mes,nb,horasPlan){
        
        let existe=false;
        let origin=0;
        if(mes>12)
            mes=mes-12;
        this.chngStruct.forEach((c)=>{
            //console.log("en el loop",c,c.IDp,IDp,c.IDp==IDp,c.nb,nb,c.nb==nb)
            if(c.IDp==IDp && c.nb==nb && c.mes==mes && c.year==year){
                c.horasPlan=horasPlan;
                origin=c.original;
                existe=true;
            }
        });
        if(!existe){
            let oChang={IDp:IDp,nb:nb,year:year,mes:mes,horasPlan:horasPlan,original:origin};
            this.chngStruct.push(oChang);
        }
        //console.log("setChangeStruct - nueva estructura",this.chngStruct)
    }
    setChngStruct(IDp,fase,mes,nb,horasPlan,inOnSite,obj){
        /*
        {IDp,nb,mes,horasPlan}
        */
        //console.log("setChngStruct obj",obj,this.chngStruct);
        let wasChanged=false;
        for(let i in this.chngStruct){
            if(this.chngStruct[i].IDp==IDp && this.chngStruct[i].fase==fase && this.chngStruct[i].mes==mes){
                for(let j in this.data[i].equipo){ 
                    if(this.chngStruct[i].equipo[j].nombre==nb && parseInt(this.chngStruct[i].equipo[j].horasPlan)==parseInt(horasPlan) ){
                        wasChanged=true;
                    }
                }
            }
        }
        let existe=false;
        this.chngStruct.forEach((el)=>{
            if(JSON.stringify(el)===JSON.stringify(obj)){
                //console.log("isEqual",el,obj)
                existe=true;
            }
        })
        if(!existe)    //si no existe se agregas
            this.chngStruct.push(obj) ; 
        //console.log("ChngStruct",this.chngStruct);
    }
    setTeamInData(IDp,fase,mes,nb,horasPlan,inOnSite){
        //console.log("setTeamInData caso existe",IDp,fase,mes,nb,this.mesProjStruct[mes]);
        var existe=false;
        let obj={}
        this.mesProjStruct[mes].forEach((el)=>{
            obj={nombre:nb,horasPlan:horasPlan,original:0,inOnSite:inOnSite,newDedi:'NaN',chg_dedi:'',dirty:1};
            if(el.IDp==IDp) {
                el.equipo.forEach((mem)=>{

                    if(mem.nombre==nb){
                        mem.horasPlan=horasPlan;
                        mem.inOnSite=inOnSite;
                        mem.dirty=1;
                        existe=true;
                        //console.log("setTeamInData->setChngStruct")
                        //this.setChngStruct(IDp,fase,mes,nb,horasPlan,inOnSite,el);
                        this.setChangeStruct(IDp,el.year,mes,nb,horasPlan);
                        return 0;
                    }
                });
            }
        })
        if(!existe){
            console.log("setTeamInData - error inesperado se debe invocar en todo caso a addTeamToData(IDp,fase,mes,nb,horasPlan,inOnSite)")
            return -1;
        }
       
    }
    addTeamToData(IDp,fase,mes,nb,horasPlan,inOnSite){
        //console.log("addTeamToData in",mes,IDp,nb,this.mesProjStruct[mes]);
        let obj={}
        this.mesProjStruct[mes].forEach((el)=>{
            obj={nombre:nb,horasPlan:horasPlan,original:0,inOnSite:inOnSite,newDedi:'NaN',chg_dedi:'',dirty:1};
            if(el.IDp==IDp) {
                el.equipo.push(obj);
                //console.log("addTeamToData->setChngStruct")
                //this.setChngStruct(IDp,fase,mes,nb,horasPlan,inOnSite,el);
                this.setChangeStruct(IDp,el.year,mes,nb,horasPlan);
            }
        })
        
        //console.log("addTeamToData out",mes,IDp,nb,this.mesProjStruct[mes]);

    }    

    createMesProjStruct(){
        //console.log("createMesProjStruct-data",this.data)
        this.mesProjStruct=this.data;
    }
    updateMesProjStruct(m){
        //console.log("updateMesProjStruct")
        var arr=[];
        for(let i in this.data){
            if(this.data[i].mes==m){
                arr.push(this.data[i]);
            }
        }
        this.mesProjStruct[m]=arr;
        //console.log("this.updateMesProjStruct-"+m,this.mesProjStruct[m]);
    }    
    getProjectByMonth(mon){
        return this.mesProjStruct[mon];
    }
    getTeamByProjectMonthFase(idp,mon,fase){
        
        let monthTemp= this.mesProjStruct[mon];        
        for(let i in monthTemp){
            
            if(monthTemp[i].IDp==idp ){
                return monthTemp[i].equipo
            }
        }
    }    
    createMesStruct(){
        for(let i in this.mesProjStruct){
            var people = new Map();
            var dat=this.mesProjStruct[i];
            //console.log("createMesStruct var dat",dat)
            dat.forEach(element =>{
                if(element.equipo !== undefined)
                element.equipo.forEach(member=>{
                    if(people.has(member.nombre)){
                        var p=people.get(member.nombre);
                        let dedi=member.dedicacion==""?0.0:parseFloat(member.dedicacion)     
                        let hplan=member.horasPlan?parseFloat(member.horasPlan):0.0;    
                        let real=member.real?parseFloat(member.real):0.0;  
                        //horasReal                

                        let hreal=member.horasReal?parseFloat(member.horasReal):0.0;
                        p.horasPlan+=parseFloat(hplan);
                        p.horasPlan=p.horasPlan;
                        p.horasReal+=parseFloat(hreal);

                        people.set(member.nombre,p);
                    }else{
                        let hplan=member.horasPlan?parseFloat(member.horasPlan):0.0;
                        let hreal=member.horasReal?parseFloat(member.horasReal):0.0;  
                        people.set(member.nombre,{horasPlan:hplan,horasReal:hreal})
                    }
                })
            });
            this.mesStruct[i]=people;
        }
        console.log("mesStruct",this.mesStruct);
    }
    updateMesProjStructByImprob(IDp){
        let meses=[];
        for(let i=0;i<25;i++){
            let dat=this.mesProjStruct[i];
            let existe=false;

            dat.forEach((el)=>{
               if(el.IDp==IDp) existe=true;
            });
            //console.log("updateMesProjStructByImprob existe",i,IDp,existe);
            if(existe){
                meses.push(i);
                // el proyecto está en el mes
                var people = new Map();
                dat.forEach(element =>{
                    //console.log("updateMesProjStructByImprob update",element.IDp,element.improbable);

                    element.equipo.forEach(member=>{                
                        //console.log("updateMesStruct foreach equipo",member,people.has(member.nombre))
                        if(people.has(member.nombre)){
                            var p=people.get(member.nombre);
                            var hplan=member.horasPlan?parseFloat(member.horasPlan):0.0;      
                            var hreal=member.horasReal?parseFloat(member.horasReal):0.0;
                            if(element.improbable==1)     
                                console.log("es improbable- OutStaffing es 1 no sumar",element.improbable,element)
                            if(element.improbable==0){
                                p.horasPlan+=Math.round(parseFloat(hplan));
                                p.horasReal+=Math.round(parseFloat(hreal));
                            }
                            people.set(member.nombre,p);
                        }else{
                            if(element.improbable==0){
                                var planh=member.horasPlan?parseFloat(member.horasPlan):0.0;
                                var realh=member.horasReal?parseFloat(member.horasReal):0.0;
                            }else{
                                var planh=member.horasPlan=0
                                var realh=member.horasReal=0;
                            }
                            people.set(member.nombre,{horasPlan:Math.round(planh),horasReal:Math.round(realh)})
                        }
                    })
                });
                //console.log("updateMesProjStructByImprob in"+i,this.mesStruct[i],people);       
                this.mesStruct[i]=people; 
                //console.log("updateMesProjStructByImprob out"+i,this.mesStruct[i]);
            }
        }
        return meses;
    }
    updateMesStruct(m){
        var dat=this.mesProjStruct[m];
        //console.log("updateMesStruct dat",m,dat);
        var people = new Map();
        dat.forEach(element =>{
            //console.log("improbable update",element.IDp,element.improbable)
            element.equipo.forEach(member=>{                
                //console.log("updateMesStruct foreach equipo",member,people.has(member.nombre),member.horasPlan);
                if(people.has(member.nombre)){
                    var p=people.get(member.nombre);
                    var hplan=member.horasPlan?parseFloat(member.horasPlan):0.0;      
                    var hreal=member.horasReal?parseFloat(member.horasReal):0.0;
                    
                    p.horasPlan+=Math.round(parseFloat(hplan));
                    p.horasReal+=Math.round(parseFloat(hreal));
                    //console.log("updateMesStruct foreach equipo",member,people.has(member.nombre),member.horasPlan,hplan,p);
                    people.set(member.nombre,p);
                }else{
                    var hplan=member.horasPlan?parseFloat(member.horasPlan):0.0;
                    var hreal=member.horasReal?parseFloat(member.horasReal):0.0;
                    people.set(member.nombre,{horasPlan:Math.round(hplan),horasReal:Math.round(hreal)})
                }
            })
        });
        //console.log("updateMesStruct in"+m,this.mesStruct[m],people);       
        this.mesStruct[m]=people; 
        //console.log("updateMesStruct out"+m,this.mesStruct[m]);       
    }
    getAllMonStruct(){
        return this.mesStruct;
    }
    getMonStruct(nb,mes){
        //console.log("getMonStruct",mes,nb);
        return this.mesStruct[mes].get(nb).horasPlan;
    }
    setAllStruct(IDp,fase,nb,horasPlan,mes,inOnSite){
        //console.log("setAllStruct",IDp,fase,nb,horasPlan,mes,inOnSite);
        // se cambia la estructura mensual, luego el array de data y finalmente (y en ese orden) se cambia la estructura de proyecto
        //console.log("setAllStruct in",this.mesProjStruct);
        //console.log("setAllStruct in ",mes,this.mesStruct[mes])
        if(horasPlan && !isNaN(horasPlan)){
            if(this.mesStruct[mes].has(nb)){
                this.mesStruct[mes].get(nb).horasPlan = parseFloat(horasPlan);
                //console.log("se encontro y se cambio",nb,this.mesStruct[mes].get(nb));
                // se cambia en el arreglo data y la estructura 
                // de proyectos
                if(this.setTeamInData(IDp,fase,mes,nb,horasPlan,inOnSite)==-1){
                    //console.log("dio error porque no esta en el team y se pasa a agregar");
                    this.addTeamToData(IDp,fase,mes,nb,horasPlan,inOnSite);            // array data, almacena el cambio en chgStruct
                }
                this.updateMesStruct(mes);                     // actualiza la estructura de proyecto
            }else{
                //console.log("No existe. Hay que agregarlo",nb,this.mesStruct[mes]);
                this.addTeamToData(IDp,fase,mes,nb,horasPlan,inOnSite);         // agrega la persona en el equipo, en caso que no exista y almacena el cambio
                //this.updateMesProjStruct(mes);                      // actualiza la estructua de proyecto
                this.updateMesStruct(mes);                          //se actualiza solo el mes 
            }
        }else confirm("Revise los datos que desea cambiar");
        //console.log("setAllStruct out",this.mesStruct[mes])
    }
    getStructByMonth(mon){
        return this.mesStruct[mon];  //return a map of people
    }

}
/**
 * {
  "data": [
    {
      "usr": "JUAN PALENZUELA",
      "idProy": 233,
      "nb_proyecto": "UepaTickets/UepaPay - Assessment de Technical Readiness",
      "tot_new_horas": 155,
      "tot_orig_horas": 0,
      "diferencia": -155,
      "Agregado": 1,
      "Modificado": null,
      "Cambios": "Incorporado"
    },
    {
      "usr": "Arleen Aponte",
      "idProy": 233,
      "nb_proyecto": "UepaTickets/UepaPay - Assessment de Technical Readiness",
      "tot_new_horas": 45.3,
      "tot_orig_horas": 200,
      "diferencia": 154.7,
      "Agregado": null,
      "Modificado": 1,
      "Cambios": "Quitar horas"
    },
 * 
 */
class HistoricChanges{
    constructor(){
        this.util=new Util();
        this.Hdata=[];
        this.updateData();
        
    }
    getData(){
        return this.Hdata;
    }
    async updateData(){
        let data= await this.util.asynGetFromDB(`https://staffing-func.azurewebsites.net/api/gethistchanges`,myToken,myTime);
        this.Hdata=data.data;
        //console.log("update data",this.Hdata);
    }
}
class Proyectos{
    constructor(data){
        console.log("data",data)
        this.proyectos=data;
        this.proyMap=this.createProyectosMap(data);
        this.activeProj=this.createActiveProj();
        //console.log("Active",this.activeProj);
    }
    createProyectosMap(data){
        let proyectMap=new Map();
        let dataArr=data;
        dataArr.forEach(({idProy,nb_proyecto,gerente,pais,Fase})=>{

            if(!proyectMap.has(idProy)){
                proyectMap.set(idProy,{nb_proyecto,gerente,pais,Fase});
            }
            
        });
        return proyectMap;
    }
    createActiveProj(){
        //,'SOW/Contrato','Detenido'
        let arrayProy=[]
        arrayProy= this.proyectos;
        let proy = arrayProy.filter(function(arrayProy) {
            return arrayProy.Fase== "En Proceso" ||
                   arrayProy.Fase== "Cierre Interno" ||
                   arrayProy.Fase== "Lead" ||
                   arrayProy.Fase== "Propuesta Activa"||
                   arrayProy.Fase== "SOW/Contrato" ||
                   arrayProy.Fase== "Detenido";
            
          });
          return proy;
    }
    getActiveProj(){
        return this.activeProj;
    }
    getFase(pid){
        return this.proyMap.has(pid)?this.proyMap.get(pid).Fase:"";
    }
}
class CrossReference{
    constructor(data,proyectos){
        this.resto=this.filtrarResto(data);
        this.data=this.filterSoloProy(data); 
        this.proyectos=proyectos;
        //console.log("proyectos obj",proyectos);
        this.fechaObj=data.fecha[0];
        //console.log("objeto fecha",this.fechaObj);
        this.currentMonth=new Date().getMonth();
        this.previousMonth=this.currentMonth-1;
        this.cross={};
        this.crossArr=[];
        this.projs=new Map();
        this.createCrossRef();
        this.projex=this.addProjNonExisten();
        this.horasTxConsultor= this.createDedicacionTotal();
        this.horasTxProject=this.createCargaTotal();
        this.proyectHide=[];
    }
    createDedicacionTotal(){
        const personHours = new Map();
        let projects=this.data;

        projects.forEach(({ usr, horas }) => {
        if (personHours.has(usr)) {
            personHours.set(usr, personHours.get(usr) + horas);
        } else {
            personHours.set(usr, horas);
        }
        });
        //console.log("persona horas",personHours);
        return personHours;
    }
    createCargaTotal(){
        const projHours = new Map();
        let projects=this.data;

        projects.forEach(({ idProy, horas }) => {
        if (projHours.has(idProy)) {
            projHours.set(idProy, projHours.get(idProy) + horas);
        } else {
            projHours.set(idProy, horas);
        }
        });
        //console.log("proyecto horas",projHours);
        return projHours;
    }
    getHorasRestoByConsultor(usr){
        return this.resto.has(usr)?this.resto.get(usr):0;
    }
    getHorasByConsultor(usr){
        return this.horasTxConsultor.has(usr)?this.horasTxConsultor.get(usr):0;
    }
    getHorasByProject(prodid){
        return this.horasTxProject.has(prodid)?this.horasTxProject.get(prodid):0;
    }
    getUltimaFechaRep(){
        return this.fechaObj.ultima_fecha.substring(0,10);
    }
    getSemanaDesde(){
        return this.fechaObj.semana_desde;
    }
    getSemanaHasta(){
        return this.fechaObj.semana_hasta;
    }
    isProjectHide(idProy){
        let hide=false;
        this.proyectHide.forEach((el)=>{
            if(el==idProy){
                hide=true;
            }
        })
        return hide;
    }
    delProjectHide(){
        this.proyectHide=[];
    }
    getProjectHide(){
        return this.proyectHide;
    }
    setProjectHide(idProy){
        this.proyectHide.push(idProy);
    }
    filtrarResto(data){
        let arrayProy=data.data;
        let persSinA=new Map();
        let Proy = arrayProy.filter(function(arrayProy) {
            return arrayProy.Project!== "Categoría - Proyecto";
          });
        Proy.forEach(({ usr, project,horas }) => {
            if(project!=="Categoría - Proyecto"){
                if (persSinA.has(usr)) {
                    persSinA.set(usr, persSinA.get(usr) + horas);
                } else {
                    persSinA.set(usr, horas);
                }
            }
          });
          console.log("resto",persSinA);
        return persSinA;
    }
    filterSoloProy(data){
        let arrayProy=data.data;
        let soloProy = arrayProy.filter(function(arrayProy) {
            return arrayProy.Project== "Categoría - Proyecto";
          });
        //console.log("solo proyectos",soloProy);
        return soloProy;
    }
    addProjNonExisten(){
        let ap=this.proyectos.getActiveProj();
        let p=this.projs;
        let i=0;
        ap.forEach((el)=>{
            if(!p.has(el.idProy)){
                let o=this.ordenProyByFase(el.Fase);
                p.set(el.idProy,{nb:el.nb_proyecto,fase:el.Fase,orden:o});
                i++;
            }
        })
        console.log("no estaban",i,p);
        return p;
    }
    getProjMap(){
        let p=this.projex;
        
        const sortedMap = new Map(
            Array.from(p).sort((a, b) => parseInt(a[1].orden) > parseInt(b[1].orden) ? 1 : -1)
          );

        console.log("projMap sorted",sortedMap);
        return sortedMap;//this.projs;  
    }
    getCrossArr(){
        return this.crossArr;
    }
    getHoras(proy,usr){
        let horas=-1
        for(let i=0;i<this.data.length;i++){
            if(this.data[i].idProy==proy && this.data[i].usr==usr){
                horas=this.data[i].horas;
                break;
            }
        }
        return horas;
    }
    ordenProyByFase(proyFase){
        let orden=7;
        if(proyFase=="Cierre Interno") orden=1;
        if(proyFase=="En Proceso") orden=2;
        if(proyFase=="SOW/Contrato") orden=3;
        if(proyFase=="Propuesta Activa") orden=4;
        if(proyFase=="Propuesta Detenida") orden=5;
        if(proyFase=="Lead") orden=6;
        return orden;
    }
    createCrossRef(){
        this.data.sort(function(a, b) {
            if (a.usr < b.usr) {
              return -1;
            }
            if (a.usr > b.usr) {
              return 1;
            }
            return 0;
        });
        //console.log("ordenar por usuario",this.data)
        /*  matriz["persona 1"]={}
            matriz['persona 1']["65"]=20
            matriz['persona 1']["101"]=0*/
        let usrBreak=""
        let proj=[];

        for(let i=0;i<this.data.length;i++){
            if(usrBreak=="") {
                usrBreak=this.data[i].usr;
                this.cross[this.data[i].usr]={}
            }
            
            //if(usrBreak=="Zuleima Silva"||i>155) console.log("entro",i,this.data[i].usr,this.data[i].idProy,this.projs.get(this.data[i].idProy))
            if(this.projs.get(this.data[i].idProy)===undefined){
                let proyFase=this.proyectos.getFase(this.data[i].idProy);
                let orden=this.ordenProyByFase(proyFase);
                //console.log("orden",proyFase,orden);
                this.projs.set(this.data[i].idProy,{nb:this.data[i].nb_proyecto,fase:this.data[i].fase,orden:orden});
            }
            if(this.data[i].usr!=usrBreak){
                //console.log("rompe",this.data[i].usr,usrBreak,proj)
                this.crossArr.push({usr:usrBreak,projs:proj})
                proj=[];
                proj.push(this.data[i].idProy);
                this.cross[this.data[i].usr]={}
                this.cross[this.data[i].usr][this.data[i].idProy]=0;
                usrBreak=this.data[i].usr;
                //if(i===157) console.log("rompe zuleima",i,this.data[i].usr,this.crossArr)
            }else{
                proj.push(this.data[i].idProy);
                //this.cross[this.data[i].usr]={}
                this.cross[this.data[i].usr][this.data[i].idProy]=0;
            }
        }
        this.crossArr.push({usr:usrBreak,projs:proj})
        //console.log("estructura cruzada",this.crossArr,usrBreak);
    }

}