/*Use data base*/
USE gdosconstrucciones;

/* Create new user that uses old password method */
CREATE USER "foo"@"localhost" IDENTIFIED WITH mysql_native_password BY "password";

/* Grand priviledges only to the new table yu are going to use for the application */
GRANT ALL PRIVILEGES ON bd.* TO "foo"@"localhost";

/* Create new table */
create table usuario (id_user int auto_increment primary key, nombre_apellido varchar(60), correo varchar(100), contrasegna varchar(1000), id_rango int(1));

/* Insert new value so we can test the methods */
insert into usuario (nombre_apellido, correo, contrasegna, id_rango) value ("Ailin Carribero","ailin@carribero.com.ar","$2a$10$sL6ztMKeinZLP69DFz08Pu0XWR7/1dxF89zHjoskSkVKNj9vdw8Py","1");
insert into usuario (nombre_apellido, correo, contrasegna, id_rango) value ("Rodrigo User","prueba@user.com","$2a$10$sL6ztMKeinZLP69DFz08Pu0XWR7/1dxF89zHjoskSkVKNj9vdw8Py","2");
insert into usuario (nombre_apellido, correo, contrasegna, id_rango) value ("Rodrigo Admin","prueba@admin.com","$2a$10$sL6ztMKeinZLP69DFz08Pu0XWR7/1dxF89zHjoskSkVKNj9vdw8Py","1");

/*-------------------------------------------------------------------------------------------------------------------------*/
/* Create new table */
create table rango (id_rango int auto_increment primary key, rango varchar(60));

/* Insert new value so we can test the methods */
insert into rango (rango) value ("admin"); /*id = 1*/
insert into rango (rango) value ("comun"); /*id = 2*/

/*-------------------------------------------------------------------------------------------------------------------------*/
/* Create new table */
create table proyecto (id_proyecto varchar(100) primary key, id_unidad_negocio int, id_centro_costo int, cliente int, costo float, venta float, fecha_i_proyecto date, fecha_f_proyecto date, id_estado int);

/* Insert new value so we can test the methods */
insert into proyecto(id_proyecto,id_unidad_negocio,id_centro_costo,cliente,costo,venta,fecha_i_proyecto,fecha_f_proyecto,id_estado) value ("CCC-PP-GDosConstrucciones","1","1",NULL,"0","0",NULL,NULL,"1"); 
insert into proyecto(id_proyecto,id_unidad_negocio,id_centro_costo,cliente,costo,venta,fecha_i_proyecto,fecha_f_proyecto,id_estado) value ("CCC-PP-GDosConstrucciones","2","1",NULL,"0","0",NULL,NULL,"1"); 
insert into proyecto(id_proyecto,id_unidad_negocio,id_centro_costo,cliente,costo,venta,fecha_i_proyecto,fecha_f_proyecto,id_estado) value ("CCC-PP-GDosConstrucciones","3","1",NULL,"0","0",NULL,NULL,"1"); 
/*insert into proyecto(id_proyecto,id_unidad_negocio,id_centro_costo,cliente,costo,venta,fecha_i_proyecto,fecha_f_proyecto,id_estado) value ("CCP-PP-GDosConstrucciones","1","2","1","10000000","20000000","12-10-2021","12-10-2022","1"); 
insert into proyecto(id_proyecto,id_unidad_negocio,id_centro_costo,cliente,costo,venta,fecha_i_proyecto,fecha_f_proyecto,id_estado) value ("CCC-PP-GDosConstrucciones","1","1","1","10000000","20000000","12-10-2021","12-10-2022","1"); */

/*-------------------------------------------------------------------------------------------------------------------------*/
/* Create new table */
create table centro_costo (id_centro_costo int auto_increment primary key, tipo_centro_costo varchar(100), siglas_cc varchar(9));

/* Insert new value so we can test the methods */
insert into centro_costo (tipo_centro_costo,siglas_cc) value ("Centro de Costo Común", "CCC"); /*id = 1*/
insert into centro_costo (tipo_centro_costo,siglas_cc) value ("Centro de Costo de Proyecto", "CCP"); /*id = 2*/
insert into centro_costo (tipo_centro_costo,siglas_cc) value ("Centro de Costo de Empresa", "CCE"); /*id = 3*/

/*-------------------------------------------------------------------------------------------------------------------------*/
/* Create new table */
create table unidad_negocio (id_unidad_negocio int auto_increment primary key, id_centro_costo int(6), unidad_negocio varchar(60), sigas_uc varchar(9));

/* Insert new value so we can test the methods */
insert into unidad_negocio (id_centro_costo,unidad_negocio,sigas_uc) value ("2","Público Privado","PP"); /*id = 1*/
insert into unidad_negocio (id_centro_costo,unidad_negocio,sigas_uc) value ("2","Desarrollos","D"); /*id = 2*/
insert into unidad_negocio (id_centro_costo,unidad_negocio,sigas_uc) value ("2","Módulos","M"); /*id = 3*/

/*-------------------------------------------------------------------------------------------------------------------------*/
/* Create new table */
create table estado (id_estado int auto_increment primary key, estado varchar(60));

/* Insert new value so we can test the methods */
insert into estado (estado) value ("Por empezar"); /*id = 1*/
insert into estado (estado) value ("En proceso"); /*id = 2*/
insert into estado (estado) value ("Finalizado"); /*id = 3*/

/*-------------------------------------------------------------------------------------------------------------------------*/
/* Create new table */
create table analisis_costo (id_analisis_costo int auto_increment primary key, analisis_costo varchar(60), requiere_detalle boolean, id_centro_costo int);

/* Insert new value so we can test the methods */
insert into analisis_costo (analisis_costo, requiere_detalle, id_centro_costo) value ("Material","0","2"); /*id = 1*/
insert into analisis_costo (analisis_costo, requiere_detalle, id_centro_costo) value ("Mano de obra","0","2"); /*id = 2*/
insert into analisis_costo (analisis_costo, requiere_detalle, id_centro_costo) value ("Otros-Inusual","1","2"); /*id = 3*/
insert into analisis_costo (analisis_costo, requiere_detalle, id_centro_costo) value ("Bienes de Uso","1","1"); /*id = 4*/
insert into analisis_costo (analisis_costo, requiere_detalle, id_centro_costo) value ("Gastos de Empresa","1","1"); /*id = 5*/
insert into analisis_costo (analisis_costo, requiere_detalle, id_centro_costo) value ("Acopio de Materiales","1","1"); /*id = 6*/
INSERT INTO analisis_costo (analisis_costo, requiere_detalle, id_centro_costo) VALUES ('Sueldo', '1', '3');
INSERT INTO analisis_costo (analisis_costo, requiere_detalle, id_centro_costo) VALUES ('Gasto Operativo', '1', '3');
INSERT INTO analisis_costo (analisis_costo, requiere_detalle, id_centro_costo) VALUES ('Alquiler', '1', '3');
INSERT INTO analisis_costo (analisis_costo, requiere_detalle, id_centro_costo) VALUES ('Otro', '1', '3');
INSERT INTO analisis_costo (analisis_costo, requiere_detalle, id_centro_costo) VALUES ('Desacopio de Materiales', '0', '2');
INSERT INTO analisis_costo (analisis_costo, requiere_detalle, id_centro_costo) VALUES ('Desacopio de Materiales', '1', '1');

/* Create new table */
create table detalle_analisis_costo (id_detalle_ac int auto_increment primary key, id_analisis_costo int, detalle_ac varchar(100));

/* Insert new value so we can test the methods */
insert into detalle_analisis_costo (id_analisis_costo,detalle_ac) value ("4","Vehículos"); /*id = 1*/
insert into detalle_analisis_costo (id_analisis_costo,detalle_ac) value ("4","Maquinas-Equipos-Combustibles"); /*id = 2*/
insert into detalle_analisis_costo (id_analisis_costo,detalle_ac) value ("4","Tecnologia"); /*id = 3*/
insert into detalle_analisis_costo (id_analisis_costo,detalle_ac) value ("5","Sueldos"); /*id = 4*/
insert into detalle_analisis_costo (id_analisis_costo,detalle_ac) value ("5","Alquileres"); /*id = 5*/
insert into detalle_analisis_costo (id_analisis_costo,detalle_ac) value ("5","Impuestos"); /*id = 6*/
insert into detalle_analisis_costo (id_analisis_costo,detalle_ac) value ("5","Mantenimieto de Cuentas"); /*id = 7*/
insert into detalle_analisis_costo (id_analisis_costo,detalle_ac) value ("5","Presentaciones - Licitaciones"); /*id = 8*/
insert into detalle_analisis_costo (id_analisis_costo,detalle_ac) value ("5","Insumos - Libreria - Otros"); /*id = 9*/
insert into detalle_analisis_costo (id_analisis_costo,detalle_ac) value ("6","PP"); /*id = 10*/
insert into detalle_analisis_costo (id_analisis_costo,detalle_ac) value ("6","D"); /*id = 11*/
insert into detalle_analisis_costo (id_analisis_costo,detalle_ac) value ("6","M"); /*id = 12*/

/*-------------------------------------------------------------------------------------------------------------------------*/
/* Create new table */
create table forma_pago (id_forma_pago int auto_increment primary key, forma_pago varchar(60), requiere_f_pago boolean, requiere_d_pago boolean);

/* Insert new value so we can test the methods */
insert into forma_pago (forma_pago,requiere_f_pago,requiere_d_pago) value ("Efectivo","0","0"); /*id = 1*/
insert into forma_pago (forma_pago,requiere_f_pago,requiere_d_pago) value ("Transferencia - Debito","0","0"); /*id = 2*/
insert into forma_pago (forma_pago,requiere_f_pago,requiere_d_pago) value ("Diferido","1","0"); /*id = 3*/
insert into forma_pago (forma_pago,requiere_f_pago,requiere_d_pago) value ("Tarjeta de Credito","1","1"); /*id = 4*/
insert into forma_pago (forma_pago,requiere_f_pago,requiere_d_pago) value ("Cuenta Corriente","1","0"); /*id = 5*/
insert into forma_pago (forma_pago,requiere_f_pago,requiere_d_pago) value ("Pendiente - Compromiso","1","0"); /*id = 6*/
insert into forma_pago (forma_pago,requiere_f_pago,requiere_d_pago) value ("Otro - Inusual","1","1"); /*id = 7*/

/*-------------------------------------------------------------------------------------------------------------------------*/
/* Create new table */
create table comprobante_pago (id_comprobante_pago int auto_increment primary key, tipo_comprobante varchar(60), nombre_comprobante varchar(60));

/* Insert new value so we can test the methods */
insert into comprobante_pago (tipo_comprobante,nombre_comprobante) value ("A","Factura"); /*id = 1*/
insert into comprobante_pago (tipo_comprobante,nombre_comprobante) value ("B","Factura"); /*id = 2*/
insert into comprobante_pago (tipo_comprobante,nombre_comprobante) value ("C","Factura"); /*id = 3*/
insert into comprobante_pago (tipo_comprobante,nombre_comprobante) value ("Z","Factura"); /*id = 4*/
insert into comprobante_pago (tipo_comprobante,nombre_comprobante) value ("Z","Comprobante de Pago"); /*id = 5*/

/*-------------------------------------------------------------------------------------------------------------------------*/
/* Create new table */
create table egreso (id_egreso int auto_increment primary key, id_proyecto varchar(60), fecha_pago date, fecha_diferido_pago date, id_forma_pago int, id_user int, id_analisis_costo int, valor_pago float, valor_usd float, cuota int, cuotas int, id_comprobante_pago int, numero_comprobante varchar(20), observaciones varchar(10000));

/* Insert new value so we can test the methods */
/*insert into egreso (id_proyecto,fecha_pago,fecha_diferido_pago,id_forma_pago,id_user,id_analisis_costo,valor_pago,observaciones) value (""); /*id = 1*/

/*-------------------------------------------------------------------------------------------------------------------------*/
/* Create new table */
create table forma_cobro (id_forma_cobro int auto_increment primary key, forma_cobro varchar(100), requiere_f_cobro int, requiere_d_cobro int, id_centro_costo int);

/* Insert new value so we can test the methods */
insert into forma_cobro (forma_cobro,requiere_f_cobro,requiere_d_cobro,id_centro_costo) value ("Efectivo","0","0","2"); /*id = 1*/
insert into forma_cobro (forma_cobro,requiere_f_cobro,requiere_d_cobro,id_centro_costo) value ("Transferecia - Debito","0","0","2"); /*id = 2*/
insert into forma_cobro (forma_cobro,requiere_f_cobro,requiere_d_cobro,id_centro_costo) value ("Diferido","1","0","2"); /*id = 3*/
insert into forma_cobro (forma_cobro,requiere_f_cobro,requiere_d_cobro,id_centro_costo) value ("Tarjeta de Credito","1","1","2"); /*id = 4*/
insert into forma_cobro (forma_cobro,requiere_f_cobro,requiere_d_cobro,id_centro_costo) value ("Pendiente - Compromiso","1","0","2"); /*id = 5*/
insert into forma_cobro (forma_cobro,requiere_f_cobro,requiere_d_cobro,id_centro_costo) value ("Otro - Inusual","1","1","2"); /*id = 6*/
insert into forma_cobro (forma_cobro,requiere_f_cobro,requiere_d_cobro,id_centro_costo) value ("Inversiones Financieras","1","1","1"); /*id = 7*/
insert into forma_cobro (forma_cobro,requiere_f_cobro,requiere_d_cobro,id_centro_costo) value ("Apalancamiento","1","1","1"); /*id = 8*/
insert into forma_cobro (forma_cobro,requiere_f_cobro,requiere_d_cobro,id_centro_costo) value ("Credito Bancario","1","1","1"); /*id = 9*/
insert into forma_cobro (forma_cobro,requiere_f_cobro,requiere_d_cobro,id_centro_costo) value ("E-Cheq","1","1","2");
insert into forma_cobro (forma_cobro,requiere_f_cobro,requiere_d_cobro,id_centro_costo) value ("C.P.D.","1","1","2");
insert into forma_cobro (forma_cobro,requiere_f_cobro,requiere_d_cobro,id_centro_costo) value ("Otro - Inusual","1","1","1"); /*id = 10*/

/*-------------------------------------------------------------------------------------------------------------------------*/
/* Create new table */
create table ingreso (id_ingreso int auto_increment primary key, id_proyecto varchar(60), fecha_cobro date, fecha_diferido_cobro date, id_forma_cobro int, id_user int, valor_cobro float, valor_usd float, cuotas int, cuota int, observaciones varchar(10000));

/* Insert new value so we can test the methods */
/*insert into ingreso () value (""); /*id = 1*/

/*-------------------------------------------------------------------------------------------------------------------------*/
/* Create new table */
create table modulo (id_modulo int auto_increment primary key, nombre_modulo varchar(100), costo double, venta double, fecha_venta date, fecha_creacion date, estado varchar(20));

/* Insert new value so we can test the methods */
/*insert into modulo () value (""); /*id = 1*/

/*-------------------------------------------------------------------------------------------------------------------------*/
/* Create new table */
create table alquiler (id_alquiler int auto_increment primary key, id_modulo int, id_proyecto int, valor double, fecha_d_alquiler date, fecha_h_alquiler date);

/* Insert new value so we can test the methods */
/*insert into alquiler () value (""); /*id = 1*/

/*-------------------------------------------------------------------------------------------------------------------------*/
/* Create new table */
create table indice (id_indice int auto_increment primary key, nombre_indice varchar(100), valor double, tipo_valor varchar(3), fecha_mod date);

/* Insert new value so we can test the methods */
/*insert into indice () value (""); /*id = 1*/

/*-------------------------------------------------------------------------------------------------------------------------*/
/* Create new table */
create table stock (id_stock int auto_increment primary key, nombre_stock varchar(100), tipo varchar(60), valor double, restante_valor double);

/* Insert new value so we can test the methods */
/*insert into stock () value (""); /*id = 1*/