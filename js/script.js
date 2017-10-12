//Inicializar modales Materialize
$(document).ready(function(){
  $('.modal').modal();
  tableReset();
});

//funcion ordenar lista de estudiantes
function sortStudentObject(so){
  var sl = [];
  var sorted = {};
  for(s in so){
    sl.push(so[s]);
  }
  sl.sort(function(a,b) {
    if(a.name < b.name) return -1;
    if(a.name > b.name) return 1;
    return 0;
  });
  for(s in sl){
    sorted[sl[s].code] = sl[s];
  }
  return sorted;
}

//Lista de estudiantes JSON de ejemplo
var sampleStudentList = [
  {"name":"Andrés Armijos","code":"AA122430","score":85},
  {"name":"Bruno Bastidas","code":"BB120934", "score":48},
  {"name":"Carolina Cifuentes","code":"CC121323","score":85},
  {"name":"Daniela Dávalos","code":"DD982317","score":66},
  {"name":"Eduardo Esteves","code":"EE120892","score":85},
  {"name":"Fernanda Flores","code":"FF548922","score":93},
  {"name":"Gabriela Gonzalez","code":"GG123456","score":43},
  {"name":"Humberto Hernande","code":"HH347109","score":68},
  {"name":"Ivanova Intriago","code":"II023788","score":79},
  {"name":"Johanna Jaramillo","code":"JJ110357","score":56}
];

if($.isEmptyObject(localStorage.students)){
  var studentsObj = {};
  for(s in sampleStudentList){
    studentsObj[sampleStudentList[s].code] = sampleStudentList[s];
  }
  localStorage.setItem('students', JSON.stringify(studentsObj));
}
var studentList = $.parseJSON(localStorage.getItem('students'));


function tableReset(){
  $('tbody tr').each(function(){
    $(this).remove();
  });
  studentList = sortStudentObject(studentList);
  for (var s in studentList) {
    var str = '<tr id="'+studentList[s].code+'"><td>'+studentList[s].name+'</td><td>'+studentList[s].code+'</td><td>'+studentList[s].score+'</td>'+
    '<td><a class="edit"><i class="material-icons">edit</i></a> <a class="delete"><i class="material-icons" style="color: #d50000">delete</i></a></td></tr>';
    $('#studentTable tbody').append(str);
  };
}

var savedCode = '';
//funcion editar
$(document).on('click', '.edit', function(e){
  e.preventDefault();
  var code = $(this).closest('tr').attr('id');
  var student = studentList[code];
  savedCode = code;
  $('#name').val(student.name);
  $('#code').val(code);
  $('#score').val(student.score);
  $('#error').hide();
  $('#regModal').modal('open');
  Materialize.updateTextFields();
});

//funcion preguntar si se desea eliminar datos
$(document).on('click', '.delete', function(e){
  e.preventDefault();
  var code = $(this).closest('tr').attr('id');
  var student = studentList[code];
  $('#deleteOk').attr('data-delete', code);
  $('#deleteName').html(' <b>'+student.name+'?</b>')
  $('#deleteModal').modal('open');
});

//funcion eliminar datos
$('#deleteOk').click(function(){
  var code = $(this).attr('data-delete');
  delete studentList[code];
  localStorage.setItem('students', JSON.stringify(studentList));
  tableReset();
  $('#deleteModal').modal('close');
})

//funcion abrir modal
$('#modalTrigger').click(function(){
  $('#code').prop('disabled', false);
  $('#registerForm')[0].reset();
  $('#error').hide();
  $('#regModal').modal('open');
});

//funcion detectar cambios en codigo, avisar cuando se vaya a sobreescribir los datos
$('#code').change(function(){
  $('#error').html('').hide();
  var code = $(this).val();
  $.each(studentList, function(c,s){
    if(code === c){
      $('#error').html('<b>Precaución</b> Se sobreescribirán los datos del estudiante con ese código').show();
      return;
    }
  })
})

//funcion cerrar modal y guardar datos
$('#modalClose').click(function closeModal(){
  var studentData = {};
  var name = $('#name').val();
  var code = $('#code').val();
  var score = $('#score').val();
  var toast = '';

  if(name && code && score){
    if(savedCode){
      if(savedCode != code) delete studentList[savedCode];
      toast = 'Datos del estudiante '+name+' actualizados';
    } else {
      toast = 'Se ha agregado los datos de un nuevo estudiante';
    }

    studentData.name = name;
    studentData.code = code;
    studentData.score = parseInt(score);
    $('#registerForm')[0].reset();
    studentList[code] = studentData;
    //Almacenar datos en localStorage
    localStorage.setItem('students', JSON.stringify(studentList));
    tableReset();
    savedCode = '';
    $('#regModal').modal('close');
    //Uso de TOAST en lugar de alerts
    Materialize.toast(toast, 4000);
  } else {
    $('#error').html('<b>Error</b> Se deben llenar todos los campos').show();
    return;
  }
});

//funcion calcular Promedio
$('#average').click(function(){
  $('.collapsible').collapsible('close', 0);
  var sum = 0;
  for (var s in studentList) { sum = sum + studentList[s].score; };
  var average = sum/Object.keys(studentList).length;
  $('#title').html('Promedio');
  $('#content').html('<b>Promedio de Notas: </b>' + average.toFixed(2));
  $('.collapsible').collapsible('open', 0);
  Materialize.toast('Cálculo del promedio', 4000);
});

//funcion calcular nota mayor
$('#highest').click(function(){
  $('.collapsible').collapsible('close', 0);
  var first = Object.keys(studentList)[0];
  var max = studentList[first].score;
  var student = studentList[first].name;
  for(e in studentList){
    if(studentList[e].score > max){
      max = studentList[e].score;
      student = studentList[e].name;
    }
  }
  $('#title').html('Nota Mayor');
  $('#content').html('<b>Nota mayor: </b>' + max + '<br><b>Estudiante: </b>' + student);
  $('.collapsible').collapsible('open', 0);
  Materialize.toast('Cálculo de la nota mayor', 4000);
});

//funcion calcular nota menor
$('#lowest').click(function(){
  $('.collapsible').collapsible('close', 0);
  var first = Object.keys(studentList)[0];
  var min = studentList[first].score;
  var student = studentList[first].name;
  for(e in studentList){
    if(studentList[e].score < min){
      min = studentList[e].score;
      student = studentList[e].name;
    }
  }
  $('#title').html('Nota Menor');
  $('#content').html('<b>Nota menor: </b>' + min + '<br><b>Estudiante: </b>' + student);
  $('.collapsible').collapsible('open', 0);
  Materialize.toast('Cálculo de la nota menor', 4000);
});
