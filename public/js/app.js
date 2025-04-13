
// ##################### 

function borrar(e) {
   e.preventDefault();
   document.getElementById('dni').value = "";
   borrarIcono();
   // alert("xddddddd");
}
function borrarIcono() {
   const dni = document.getElementById('dni');
   const icono = document.getElementById('icono');

   if (dni.value.trim() !== "") {
      icono.style.display = "initial !important";

   } else {
      icono.style.display = "none";
   }
}

function addComponent(idComponent, data) {
   document.getElementById(idComponent).innerHTML = data;
}


// ############################## DNI #####################################
function addError(error) {
   let contenido = `
   <div class="alert alert-danger" role="alert">
       ${error}
    </div>
 `;
   return contenido;
}
function addTBLDNI(dni, nombres, apPaterno, apMaterno) {

   let contenido = `
    <table class="table table-hover table-bordered text-center table-sm">
                            <thead class="table-danger">
               <tr>
                  <th scope="col">DNI</th>
                  <th scope="col">Nombres</th>
                  <th scope="col">Apellido Paterno</th>
                  <th scope="col">Apellido Materno</th>
               </tr>
            </thead>
            <tbody id="tbodyDNI" >
               <tr>
                  <td>${dni}</td>
                  <td>${nombres}</td>
                  <td>${apPaterno}</td>
                  <td>${apMaterno}</td>
               </tr>
            </tbody>
      </table>`;

   return contenido;

}

// ############################# TELEFONO ###################################



// ############################# TELEFONO ###################################




async function consulta(e) {
   e.preventDefault();
   const dniInput = document.getElementById('dni').value;
   const dni = dniInput.trim();
   if (!/^\d{8}$/.test(dni)) {

      Swal.fire("Error", "DNI inválido. Debe contener exactamente 8 dígitos numéricos.", "error");

      return;
   }
   try {
      // https://consultas-dni.onrender.com

      const consultaDNI =await fetch("/buscar", {
         method: 'POST',
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ dni: dni })
      });
      
   
      
      
      // const [respuestaDNI, respuestaTel] = await Promise.all([consultaDNI, consultaTel]);
      
      const dataDNI = await consultaDNI.json();
      console.log(dataDNI);
      
      // const dataOsiptel = await respuestaTel.json();
      
      // // ========================== dni ============================
      // if (dataDNI.success) {
      //      addComponent("tbDNI", "");


      //      let tblDNI = addTBLDNI(dataDNI.data.dni, dataDNI.data.nombres, dataDNI.data.apellidoPaterno, dataDNI.data.apellidoMaterno);

      //    addComponent("tbDNI", tblDNI);
      // } else {

      //    let contentError = addError(dataDNI.data);

      //    addComponent("tbDNI", contentError);

      //    setTimeout(() => {
      //       addComponent("tbDNI", "");
            
      //    }, 3000);
       

      // }

      // ========================== tel ============================
            
            // console.log(dataOsiptel);
            
      // if (resDNI.telefono) {

      //    const telContent=document.getElementById("telContent");
      //    telContent.style.display="initial !important";
      //    addComponent("tbOSIPTEL", addNEWTBLTELEFONO());
      //    document.getElementById("titleTel").textContent=" Resultados de la búsqueda: "+resDNI.data.dni;
      //    let trTel = ` `;
      //    resDNI.dataTel.forEach(datTel => {
      //       trTel +=  addDataTel(datTel.modalidad, datTel.numeroTelefonico, datTel.empresaOperadora);

      //    });
      //    addComponent("contentTel", trTel);
      // }else{
      //    telContent.style.display="none !important";
      //    document.getElementById("titleTel").textContent=" Resultados de la búsqueda: ";
      //    addComponent("contentTel", "");
      // }

   } catch (error) {

      Swal.fire("Error de consulta", error, "error");

   }

}

function addNEWTBLTELEFONO() {
   let tblTEL = `
           
                        <table class="table table-hover table-bordered text-center table-sm">
                            <thead class="table-danger">
                              <tr>
                                <th scope="col">Modalidad</th>
                                <th scope="col">Número Telefónico	</th>
                                <th scope="col">Empresa Operadora  </th>
                              
                              </tr>
                            </thead>
                            <tbody id="contentTel">
                                
                            </tbody>
                          </table>
                          

   `;
   return tblTEL;
}
function addDataTel(modalidad, numeroTelefonico, empresaOperadora) {
   let rTel = `
      <tr>
       <td class="text-center">${modalidad}</td>
       <td class="text-center">${numeroTelefonico}</td>
       <td class="text-center">${empresaOperadora}</td>
       </tr>
   
   `;

   return rTel;
   
}